<script setup>
definePageMeta({
  layout: "dashboard",
});

// Sample booking data (replace with actual API call)
const bookings = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = [5, 10, 25, 50];

// Loading states
const isLoading = ref(false);
const isLoadingReceipt = ref(false);
const isLoadingEmail = ref(false);
const isMarkingAsPaid = ref(false);
const isLoadingDetails = ref(false);
const isRescheduling = ref(false);
const isCancelling = ref(false);

// Stats computed properties
const stats = computed(() => ({
  confirmed: bookings.value.filter((b) => b.status === 2 || b.status === 3)
    .length,
  partial: bookings.value.filter((b) => b.status === 2).length,
  frames: bookings.value.reduce((sum, b) => sum + b.frame_quantity, 0),
  sales: bookings.value.reduce((sum, b) => sum + b.payment_amount, 0),
}));

// Search and filter states
const search = ref("");
const debouncedSearch = ref("");
const statusFilter = ref("all");
const serviceFilter = ref("all");
const dateRange = ref({
  start: "",
  end: "",
});
const showFilters = ref(false);
const isSearching = ref(false);
let searchDebounceTimeout = null;

// Add these constants after the existing statuses constant
const sessionStatuses = [
  { value: "all", label: "All Session Statuses" },
  { value: 1, label: "Session Pending" },
  { value: 2, label: "Session Completed" },
  { value: 3, label: "Session Cancelled" },
];

const frameStatuses = [
  { value: "all", label: "All Frame Statuses" },
  { value: 1, label: "Unprinted" },
  { value: 2, label: "Printed" },
  { value: 3, label: "Delivered" },
];

// Add these refs after the existing filter refs
const sessionStatusFilter = ref("all");
const frameStatusFilter = ref("all");

// Debounce search input
watch(search, async (newValue) => {
  isSearching.value = true;
  if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
    isSearching.value = false;
  }, 300);
});

// Status mapping for better filtering
const statusMap = {
  payment: {
    1: "Pending",
    2: "Partial",
    3: "Paid",
  },
  session: {
    1: "Pending",
    2: "Completed",
    3: "Cancelled",
  },
  frame: {
    1: "Unprinted",
    2: "Printed",
    3: "Delivered",
  },
};

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: 1, label: "Payment Pending" },
  { value: 2, label: "Partial Payment" },
  { value: 3, label: "Paid" },
];

// Replace the services constant with a ref
const services = ref([{ value: "all", label: "All Themes" }]);

// Add sorting state
const sortBy = ref("created_date");
const sortOrder = ref("desc");

// Enhanced filtered bookings computation with sorting
const filteredBookings = computed(() => {
  let filtered = bookings.value.filter((booking) => {
    // Search match with debouncing
    const searchMatch =
      !debouncedSearch.value ||
      (booking.user_fullname?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (booking.user_email?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (booking.user_phone || booking.user_phoneno || "").includes(
        debouncedSearch.value
      );

    // Status match with mapping
    const statusMatch =
      statusFilter.value === "all" ||
      booking.status === parseInt(statusFilter.value);

    // Service match using theme_title
    const serviceMatch =
      serviceFilter.value === "all" ||
      booking.theme_title === serviceFilter.value;

    // Session status match
    const sessionStatusMatch =
      sessionStatusFilter.value === "all" ||
      booking.session_status === parseInt(sessionStatusFilter.value);

    // Frame status match
    const frameStatusMatch =
      frameStatusFilter.value === "all" ||
      booking.frame_status === parseInt(frameStatusFilter.value);

    // Date match using session_date
    const sessionDate = booking.session_date
      ? new Date(booking.session_date)
      : null;
    const startDate = dateRange.value.start
      ? new Date(dateRange.value.start)
      : null;
    const endDate = dateRange.value.end ? new Date(dateRange.value.end) : null;

    const dateMatch =
      !sessionDate || // If no session date, include it
      ((!startDate || sessionDate >= startDate) &&
        (!endDate || sessionDate <= endDate));

    return (
      searchMatch &&
      statusMatch &&
      serviceMatch &&
      sessionStatusMatch &&
      frameStatusMatch &&
      dateMatch
    );
  });

  // Apply sorting
  return filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy.value) {
      case "payment_status":
        comparison = (statusMap.payment[a.status] || "").localeCompare(
          statusMap.payment[b.status] || ""
        );
        break;
      case "session_status":
        comparison = (statusMap.session[a.session_status] || "").localeCompare(
          statusMap.session[b.session_status] || ""
        );
        break;
      case "frame_status":
        comparison = (statusMap.frame[a.frame_status] || "").localeCompare(
          statusMap.frame[b.frame_status] || ""
        );
        break;
      case "created_date":
        comparison = new Date(a.created_date) - new Date(b.created_date);
        break;
      case "session":
        const aDate = new Date(a.session_date);
        const bDate = new Date(b.session_date);
        if (aDate.getTime() === bDate.getTime()) {
          const [aHours, aMinutes] = a.session_time.split(":").map(Number);
          const [bHours, bMinutes] = b.session_time.split(":").map(Number);
          comparison = aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
        } else {
          comparison = aDate - bDate;
        }
        break;
      default:
        comparison = 0;
    }

    return sortOrder.value === "desc" ? -comparison : comparison;
  });
});

// Add sorting function
const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = column;
    sortOrder.value = "desc";
  }
};

// Add active filters count
const activeFiltersCount = computed(() => {
  let count = 0;
  if (debouncedSearch.value) count++;
  if (statusFilter.value !== "all") count++;
  if (serviceFilter.value !== "all") count++;
  if (sessionStatusFilter.value !== "all") count++;
  if (frameStatusFilter.value !== "all") count++;
  if (dateRange.value.start || dateRange.value.end) count++;
  return count;
});

// Enhanced clear filters
const clearFilters = () => {
  search.value = "";
  debouncedSearch.value = "";
  statusFilter.value = "all";
  serviceFilter.value = "all";
  sessionStatusFilter.value = "all";
  frameStatusFilter.value = "all";
  dateRange.value.start = "";
  dateRange.value.end = "";
  currentPage.value = 1;
};

// Add pagination functions
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getPageNumbers = () => {
  const pages = [];
  const maxVisiblePages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

// Pagination computed properties
const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / itemsPerPage.value)
);
const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBookings.value.slice(start, end);
});

const handleStatusChange = async (bookingId, newStatus) => {
  // TODO: Implement status update logic
  const booking = bookings.value.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = newStatus;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time) => {
  // IN 12 HOUR FORMAT
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const formatDateMY = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kuala_Lumpur",
  });
};

// Modal state
const selectedBooking = ref(null);
const showModal = ref(false);

const openBookingDetails = async (booking) => {
  isLoadingDetails.value = true;
  try {
    selectedBooking.value = booking;
    showModal.value = true;
  } finally {
    isLoadingDetails.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedBooking.value = null;
};

// Add new refs for receipt modal
const showReceiptModal = ref(false);
const selectedReceiptBooking = ref(null);

// Add new function to generate receipt HTML
const generateReceiptHtml = (booking) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .receipt-box { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 10px; color: #3C2A21; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { color: #666; }
          .value { font-weight: 500; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Booking Receipt</h2>
            <p>Thank you for choosing our services!</p>
          </div>

          <div class="receipt-box">
            <div class="section">
              <div class="section-title">Booking Information</div>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">#${booking.id
                  .toString()
                  .padStart(6, "0")}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value">${
                  booking.status === 1
                    ? "Paid"
                    : booking.status === 2
                    ? "Pending"
                    : booking.status === 3
                    ? "Cancelled"
                    : booking.status === 4
                    ? "Completed"
                    : "Unknown"
                }</span>
              </div>
              <div class="detail-row">
                <span class="label">Created Date:</span>
                <span class="value">${formatDate(booking.created_date)}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Customer Details</div>
              <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">${booking.user_fullname}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${booking.user_email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${booking.user_phoneno}</span>
              </div>
              <div class="detail-row">
                <span class="label">Address:</span>
                <span class="value">${booking.user_address}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Session Details</div>
              <div class="detail-row">
                <span class="label">Theme:</span>
                <span class="value">${booking.theme}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(booking.session_date)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${formatTime(booking.session_time)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is an automatically generated receipt. Please keep it for your records.</p>
            <p>If you have any questions, please contact us.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Modify the generateAndSendReceipt function
const generateAndSendReceipt = async (booking) => {
  isLoadingReceipt.value = true;
  try {
    selectedReceiptBooking.value = booking;
    showReceiptModal.value = true;
  } finally {
    isLoadingReceipt.value = false;
  }
};

// Add function to download receipt
const downloadReceipt = async () => {
  isLoadingReceipt.value = true;
  try {
    const receiptHtml = generateReceiptHtml(selectedReceiptBooking.value);
    const blob = new Blob([receiptHtml], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${selectedReceiptBooking.value.id
      .toString()
      .padStart(6, "0")}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } finally {
    isLoadingReceipt.value = false;
  }
};

// Add function to send receipt via email
const sendReceiptEmail = async () => {
  isLoadingEmail.value = true;
  try {
    const receiptData = {
      id: selectedReceiptBooking.value.id.toString().padStart(6, "0"),
      customerName: selectedReceiptBooking.value.user_fullname,
      email: selectedReceiptBooking.value.user_email,
      phone: selectedReceiptBooking.value.user_phoneno,
      address: selectedReceiptBooking.value.user_address,
      theme: selectedReceiptBooking.value.theme,
      sessionDate: formatDate(selectedReceiptBooking.value.session_date),
      sessionTime: formatTime(selectedReceiptBooking.value.session_time),
      status: selectedReceiptBooking.value.status,
      createdDate: formatDate(selectedReceiptBooking.value.created_date),
    };

    const response = await $fetch("/api/booking/send-receipt", {
      method: "POST",
      body: receiptData,
    });

    if (response.success) {
      alert("Receipt has been sent to the customer's email.");
      showReceiptModal.value = false;
    } else {
      throw new Error("Failed to send receipt");
    }
  } catch (error) {
    console.error("Error sending receipt:", error);
    alert("Failed to send receipt. Please try again.");
  } finally {
    isLoadingEmail.value = false;
  }
};

// Add new refs for session rescheduling
const showRescheduleModal = ref(false);
const selectedDate = ref("");
const selectedTime = ref("");

// Add confirmation modal state
const showConfirmationModal = ref(false);
const confirmationMessage = ref("");
const confirmationAction = ref(() => {});
const confirmationTitle = ref("");

// Function to show confirmation modal
const showConfirmation = (title, message, action) => {
  confirmationTitle.value = title;
  confirmationMessage.value = message;
  confirmationAction.value = action;
  showConfirmationModal.value = true;
};

// Add these refs for available slots and loading state
const isLoadingSlots = ref(false);
const availableSlots = ref([]);
const selectedSlot = ref("");

// Add watch for selectedDate to fetch available slots
watch(selectedDate, async (newDate) => {
  if (!newDate || !selectedBooking.value) return;

  selectedSlot.value = "";
  isLoadingSlots.value = true;
  try {
    const response = await $fetch("/api/booking/get-available-slots", {
      params: {
        date: newDate,
        theme_id: selectedBooking.value.theme,
      },
    });
    if (response.status === "success") {
      availableSlots.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching available slots:", error);
  } finally {
    isLoadingSlots.value = false;
  }
});

// Update rescheduleSession function
const rescheduleSession = async () => {
  if (!selectedDate.value || !selectedSlot.value) {
    showStatusModal("error", "Error", "Please select both date and time slot");
    return;
  }

  showConfirmation(
    "Confirm Reschedule",
    "Are you sure you want to reschedule this session?",
    async () => {
      isRescheduling.value = true;
      try {
        const response = await $fetch(`/api/booking/reschedule`, {
          method: "PUT",
          body: {
            bookingId: selectedBooking.value.id,
            session_date: selectedDate.value,
            session_time: selectedSlot.value,
          },
        });

        if (response.success) {
          selectedBooking.value.session_date = selectedDate.value;
          selectedBooking.value.session_time = selectedSlot.value;
          showRescheduleModal.value = false;

          showModal.value = false;

          alert("Session has been rescheduled successfully");

          getBookings(); // Refresh the bookings list
        } else {
          alert("Failed to reschedule session");
        }
      } catch (error) {
        console.error("Error rescheduling session:", error);
        alert("Error rescheduling session");
      } finally {
        isRescheduling.value = false;
        showConfirmationModal.value = false;
      }
    }
  );
};

// Update markAsPaid function
const markAsPaid = async (bookingId) => {
  showConfirmation(
    "Confirm Payment",
    "Are you sure you want to mark this booking as paid?",
    async () => {
      isMarkingAsPaid.value = true;
      try {
        const response = await $fetch(`/api/booking/update-payment-status`, {
          method: "PUT",
          body: {
            bookingId: bookingId,
            status: 3,
          },
        });

        if (response.success) {
          selectedBooking.value.status = 3; // Set status to paid

          showModal.value = false;

          alert("Booking has been marked as paid successfully");

          getBookings(); // Refresh the bookings list
        } else {
          alert("Failed to mark booking as paid");
        }
      } catch (error) {
        console.error("Error marking booking as paid:", error);
        alert("Error marking booking as paid");
      } finally {
        isMarkingAsPaid.value = false;
        showConfirmationModal.value = false;
      }
    }
  );
};

// Update cancelBooking function
const cancelBooking = async (bookingId) => {
  showConfirmation(
    "Confirm Cancellation",
    "Are you sure you want to cancel this booking? This action cannot be undone.",
    async () => {
      isCancelling.value = true;
      try {
        const response = await $fetch(`/api/booking/update-session-status`, {
          method: "PUT",
          body: {
            bookingId: bookingId,
            status: 3,
          },
        });

        if (response.success) {
          selectedBooking.value.status = 3; // Set status to cancelled
          showModal.value = false;
          alert("Booking has been cancelled successfully");
          getBookings(); // Refresh the bookings list
        } else {
          alert("Failed to cancel booking");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Error cancelling booking");
      } finally {
        isCancelling.value = false;
        showConfirmationModal.value = false;
      }
    }
  );
};

const getBookings = async () => {
  isLoading.value = true;
  try {
    const resp = await $fetch("/api/booking/get-bookings");

    // console.log(resp);

    bookings.value = resp;

    // Extract unique themes from bookings and update services
    const uniqueThemes = [
      ...new Set(bookings.value.map((booking) => booking.theme_title)),
    ];
    services.value = [
      { value: "all", label: "All Themes" },
      ...uniqueThemes.map((theme) => ({
        value: theme,
        label: theme,
      })),
    ];
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    isLoading.value = false;
  }
};

// Remove the duplicate exportToCSV function and template code
const exportToCSV = () => {
  const headers = [
    "Booking ID",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "Theme",
    "Theme Price",
    "Session Date",
    "Session Time",
    "Number of Pax",
    "Extra Pax",
    "Extra Pax Charges",
    "Payment Status",
    "Payment Type",
    "Payment Method",
    "Payment Amount",
    "Session Status",
    "Frame Status",
    "Frame Quantity",
    "Frame Total Price",
    "Addon Details",
    "Total Amount",
    "Balance",
    "Source",
    "Created Date",
  ];

  const csvData = filteredBookings.value.map((booking) => {
    // Format addon details as a string
    const addonDetails =
      booking.addons
        ?.map(
          (addon) =>
            `${addon.title} (${addon.qty}x - ${formatCurrency(addon.price)})`
        )
        .join("; ") || "-";

    const frameTotals = calculateFrameTotals(booking.addons);

    return [
      booking.id,
      booking.user_fullname,
      booking.user_email,
      booking.user_phoneno,
      booking.user_address || "-",
      booking.theme_title,
      formatCurrency(booking.theme_price || 0),
      formatDateMY(booking.session_date),
      booking.session_time,
      booking.number_of_pax || 0,
      booking.number_of_extra_pax || 0,
      formatCurrency(booking.payment_extra_pax || 0),
      statusMap.payment[booking.status] || "Unknown",
      getPaymentType(booking.payment_type),
      getPaymentMethod(booking.payment_method),
      formatCurrency(booking.payment_amount || 0),
      statusMap.session[booking.session_status] || "Unknown",
      statusMap.frame[booking.frame_status] || "N/A",
      frameTotals.quantity,
      formatCurrency(frameTotals.price),
      addonDetails,
      formatCurrency(calculateTotalAmount(booking)),
      formatCurrency(calculateBalance(booking)),
      formatSource(booking.user_source),
      formatDateMY(booking.created_date),
    ];
  });

  const csvContent = [headers, ...csvData]
    .map((row) => row.join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `bookings-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  getBookings();
});

// Add helper function for formatting source
const formatSource = (source) => {
  if (!source) return "-";
  return source
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Add helper function for payment method
const getPaymentMethod = (method) => {
  switch (method) {
    case 1:
      return "FPX / Online Banking";
    case 2:
      return "Credit / Debit Card";
    default:
      return "-";
  }
};

// Add helper function to calculate total frame quantity and price
const calculateFrameTotals = (addons) => {
  if (!addons?.length) return { quantity: 0, price: 0 };
  return addons.reduce(
    (acc, addon) => ({
      quantity: acc.quantity + (addon.qty || 0),
      price: acc.price + (addon.price || 0),
    }),
    { quantity: 0, price: 0 }
  );
};

// Add helper function for payment type
const getPaymentType = (type) => {
  switch (type) {
    case 1:
      return "Full Payment";
    case 2:
      return "Deposit Payment";
    default:
      return "-";
  }
};

// Add helper function to calculate balance
const calculateBalance = (booking) => {
  if (!booking) return 0;
  const totalPrice =
    (booking.payment_amount || 0) + (booking.payment_extra_pax || 0);
  const depositAmount = booking.payment_deposit || 0;
  return booking.payment_type === 2 ? totalPrice - depositAmount : 0;
};

// Add helper function to calculate total amount
const calculateTotalAmount = (booking) => {
  if (!booking) return 0;
  const themePrice = booking.theme_price || 0;
  const addonTotal = calculateFrameTotals(booking.addons).price;
  const extraPaxCharges = booking.payment_extra_pax || 0;
  return themePrice + addonTotal + extraPaxCharges;
};

const handleSessionStatusChange = async (bookingId, newStatus) => {
  try {
    const response = await $fetch(`/api/booking/update-session-status`, {
      method: "PUT",
      body: {
        bookingId: bookingId,
        status: parseInt(newStatus),
      },
    });

    if (response.success) {
      const booking = bookings.value.find((b) => b.id === bookingId);
      if (booking) {
        booking.session_status = parseInt(newStatus);
      }
      // alert("Session status updated successfully");
      // getBookings(); // Refresh the bookings list
    } else {
      alert("Failed to update session status");
    }
  } catch (error) {
    console.error("Error updating session status:", error);
    alert("Error updating session status");
  }
};

// Add these new functions for handling status changes
const handlePaymentStatusChange = async (bookingId, newStatus) => {
  try {
    const response = await $fetch(`/api/booking/update-payment-status`, {
      method: "PUT",
      body: {
        bookingId: bookingId,
        status: newStatus,
      },
    });

    if (response.success) {
      const booking = bookings.value.find((b) => b.id === bookingId);
      if (booking) {
        booking.status = parseInt(newStatus);
      }
      // alert("Payment status updated successfully");
      // getBookings(); // Refresh the bookings list
    } else {
      alert("Failed to update payment status");
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    alert("Error updating payment status");
  }
};

const handleFrameStatusChange = async (bookingId, newStatus) => {
  try {
    const response = await $fetch(`/api/booking/update-frame-status`, {
      method: "PUT",
      body: {
        bookingId: bookingId,
        status: newStatus,
      },
    });

    if (response.success) {
      const booking = bookings.value.find((b) => b.id === bookingId);
      if (booking) {
        booking.frame_status = parseInt(newStatus);
      }
      // alert("Frame status updated successfully");
      // getBookings(); // Refresh the bookings list
    } else {
      alert("Failed to update frame status");
    }
  } catch (error) {
    console.error("Error updating frame status:", error);
    alert("Error updating frame status");
  }
};

// Add helper function to check if date is weekend
function isWeekend(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Add helper function to format time for display
function formatTimeDisplay(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
</script>

<template>
  <div class="">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">
          Booking Management
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-primary)]">
          View and manage all photography session bookings
        </p>
      </div>
    </div>

    <!-- Loading State for Stats -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-[var(--color-bg-secondary)] overflow-hidden shadow-sm rounded-lg animate-pulse"
      >
        <div class="p-5">
          <div class="flex items-center space-x-4">
            <div
              class="w-8 h-8 bg-[var(--color-bg-primary)] rounded-full"
            ></div>
            <div class="flex-1">
              <div
                class="h-4 bg-[var(--color-bg-primary)] rounded w-1/2 mb-2"
              ></div>
              <div class="h-6 bg-[var(--color-bg-primary)] rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div
      v-else
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 my-5"
    >
      <div
        class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] opacity-0 group-hover:opacity-5 transition-opacity duration-200"
        ></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Confirmed
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ stats.confirmed }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"
        ></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Partially Paid
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ stats.partial }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"
        ></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Frame Quantity
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ stats.frames }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"
        ></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Sales
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ formatCurrency(stats.sales) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-[var(--color-bg-secondary)] shadow-sm rounded-lg">
      <!-- Search and Filters -->
      <div class="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm">
        <!-- Quick Search and Filter Toggle -->
        <div class="p-4 border-b border-[var(--color-border-secondary)]">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-[var(--color-text-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="search"
                  placeholder="Search by name, email, or phone..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] sm:text-sm"
                />
                <div
                  v-if="isSearching"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    class="animate-spin h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="showFilters = !showFilters"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-[var(--color-text-primary)] bg-white hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
              >
                <svg
                  class="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {{ showFilters ? "Hide Filters" : "Show Filters" }}
                <span
                  v-if="activeFiltersCount > 0"
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                >
                  {{ activeFiltersCount }}
                </span>
              </button>
              <button
                v-if="activeFiltersCount > 0"
                @click="clearFilters"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-[var(--color-text-primary)] bg-white hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
              >
                Clear Filters
              </button>
              <button
                @click="exportToCSV"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-[var(--color-text-primary)] bg-white hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
              >
                <svg
                  class="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Data
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div
          v-show="showFilters"
          class="p-4 border-b border-[var(--color-border-secondary)] bg-[var(--color-bg-secondary)]"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Status Filter -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
                >Status</label
              >
              <div class="relative">
                <select
                  v-model="statusFilter"
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] transition-colors hover:border-[var(--color-bg-primary)]"
                >
                  <option
                    v-for="status in statuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Theme Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Theme</label
              >
              <div class="relative">
                <select
                  v-model="serviceFilter"
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] transition-colors hover:border-[var(--color-bg-primary)]"
                >
                  <option
                    v-for="service in services"
                    :key="service.value"
                    :value="service.value"
                  >
                    {{ service.label }}
                  </option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Session Status Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Session Status</label
              >
              <div class="relative">
                <select
                  v-model="sessionStatusFilter"
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] transition-colors hover:border-[var(--color-bg-primary)]"
                >
                  <option
                    v-for="status in sessionStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Frame Status Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Frame Status</label
              >
              <div class="relative">
                <select
                  v-model="frameStatusFilter"
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] transition-colors hover:border-[var(--color-bg-primary)]"
                >
                  <option
                    v-for="status in frameStatuses"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Session Date Range</label
              >
              <div class="grid grid-cols-2 gap-3">
                <div class="relative">
                  <input
                    type="date"
                    v-model="dateRange.start"
                    :max="dateRange.end || undefined"
                    class="block w-full rounded-lg border-gray-300 pl-3 pr-3 py-2 text-sm bg-white focus:ring-[#785340] focus:border-[#785340] transition-colors hover:border-[#785340]"
                    placeholder="Start date"
                  />
                  <div
                    v-if="dateRange.start"
                    @click="dateRange.start = ''"
                    class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400 hover:text-[#785340]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <div class="relative">
                  <input
                    type="date"
                    v-model="dateRange.end"
                    :min="dateRange.start || undefined"
                    class="block w-full rounded-lg border-gray-300 pl-3 pr-3 py-2 text-sm bg-white focus:ring-[#785340] focus:border-[#785340] transition-colors hover:border-[#785340]"
                    placeholder="End date"
                  />
                  <div
                    v-if="dateRange.end"
                    @click="dateRange.end = ''"
                    class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                  >
                    <svg
                      class="h-4 w-4 text-gray-400 hover:text-[#785340]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div
            v-if="activeFiltersCount > 0"
            class="mt-4 flex items-center space-x-2 text-sm text-gray-600"
          >
            <span class="font-medium">Active Filters:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-if="statusFilter !== 'all'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                Status:
                {{
                  statuses.find((s) => s.value === statusFilter)?.label ||
                  statusFilter
                }}
                <button
                  @click="statusFilter = 'all'"
                  class="ml-1 hover:text-gray-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                v-if="serviceFilter !== 'all'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                Theme: {{ serviceFilter }}
                <button
                  @click="serviceFilter = 'all'"
                  class="ml-1 hover:text-gray-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                v-if="sessionStatusFilter !== 'all'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                Session Status:
                {{
                  sessionStatuses.find((s) => s.value === sessionStatusFilter)
                    ?.label || sessionStatusFilter
                }}
                <button
                  @click="sessionStatusFilter = 'all'"
                  class="ml-1 hover:text-gray-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                v-if="frameStatusFilter !== 'all'"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                Frame Status:
                {{
                  frameStatuses.find((s) => s.value === frameStatusFilter)
                    ?.label || frameStatusFilter
                }}
                <button
                  @click="frameStatusFilter = 'all'"
                  class="ml-1 hover:text-gray-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span
                v-if="dateRange.start || dateRange.end"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                Date: {{ dateRange.start || "Any" }} -
                {{ dateRange.end || "Any" }}
                <button
                  @click="
                    dateRange.start = '';
                    dateRange.end = '';
                  "
                  class="ml-1 hover:text-gray-200"
                >
                  <svg
                    class="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="bg-white rounded-lg shadow-sm overflow-hidden space-y-4"
      >
        <!-- Skeleton Header -->
        <div class="p-4 md:p-6 bg-white border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div class="flex items-center space-x-2">
              <div class="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div class="h-9 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div class="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <!-- Skeleton Table -->
        <div class="hidden md:block mt-4">
          <div class="min-w-full divide-y divide-gray-200">
            <!-- Skeleton Header -->
            <div class="bg-gray-50">
              <div class="grid grid-cols-5 px-6 py-4">
                <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <!-- Skeleton Rows -->
            <div class="bg-white divide-y divide-gray-200">
              <div v-for="i in itemsPerPage" :key="i" class="group">
                <div class="grid grid-cols-5 px-6 py-4">
                  <!-- Customer Column -->
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"
                    ></div>
                    <div class="space-y-2">
                      <div
                        class="h-4 w-32 bg-gray-200 rounded animate-pulse"
                      ></div>
                      <div
                        class="h-3 w-48 bg-gray-200 rounded animate-pulse"
                      ></div>
                    </div>
                  </div>
                  <!-- Theme Column -->
                  <div class="flex items-center">
                    <div
                      class="h-6 w-24 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  </div>
                  <!-- Status Column -->
                  <div class="flex items-center">
                    <div
                      class="h-6 w-20 bg-gray-200 rounded-full animate-pulse"
                    ></div>
                  </div>
                  <!-- Session Column -->
                  <div class="space-y-2">
                    <div
                      class="h-4 w-32 bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-3 w-24 bg-gray-200 rounded animate-pulse"
                    ></div>
                  </div>
                  <!-- Actions Column -->
                  <div class="flex items-center gap-3">
                    <div
                      class="h-8 w-8 bg-gray-200 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-8 w-8 bg-gray-200 rounded animate-pulse"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeleton Mobile View -->
        <div class="md:hidden divide-y divide-gray-200 mt-4">
          <div v-for="i in itemsPerPage" :key="i" class="p-4 space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-gray-200 animate-pulse"
                ></div>
                <div class="space-y-2">
                  <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div
                class="h-6 w-20 bg-gray-200 rounded-full animate-pulse"
              ></div>
            </div>

            <!-- Details -->
            <div
              class="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100"
            >
              <div class="space-y-2">
                <div class="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div
                  class="h-6 w-24 bg-gray-200 rounded-full animate-pulse"
                ></div>
              </div>
              <div class="space-y-2">
                <div class="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div class="space-y-2">
                <div class="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3">
              <div class="h-9 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
              <div class="h-9 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Skeleton Pagination -->
        <div class="px-4 py-3 md:px-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div class="hidden md:flex items-center gap-2">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-9 w-9 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              </div>
              <div class="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div
              class="md:hidden h-5 w-32 bg-gray-200 rounded animate-pulse"
            ></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!isLoading && filteredBookings.length === 0"
        class="px-4 py-12 sm:px-6 text-center bg-white rounded-lg shadow-sm"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No bookings found
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            search ||
            statusFilter !== "all" ||
            serviceFilter !== "all" ||
            sessionStatusFilter !== "all" ||
            frameStatusFilter !== "all" ||
            dateRange.start ||
            dateRange.end
              ? "Try adjusting your filters or search terms"
              : "Get started by creating your first booking"
          }}
        </p>
        <div class="mt-6">
          <button
            type="button"
            @click="clearFilters"
            v-if="
              search ||
              statusFilter !== 'all' ||
              serviceFilter !== 'all' ||
              sessionStatusFilter !== 'all' ||
              frameStatusFilter !== 'all' ||
              dateRange.start ||
              dateRange.end
            "
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Bookings Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Table Header -->
        <div class="p-4 md:p-6 bg-white border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <!-- Left side -->
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>Show</span>
              <select
                v-model="itemsPerPage"
                class="form-select rounded-lg border-gray-200 text-gray-700 sm:text-sm focus:border-[var(--color-bg-primary)] focus:ring focus:ring-[var(--color-bg-primary)] focus:ring-opacity-50"
              >
                <option
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
              <span>entries</span>
            </div>

            <!-- Right side -->
            <div class="text-sm text-gray-500">
              Showing
              <span class="font-medium text-gray-700">{{
                (currentPage - 1) * itemsPerPage + 1
              }}</span>
              to
              <span class="font-medium text-gray-700">{{
                Math.min(currentPage * itemsPerPage, filteredBookings.length)
              }}</span>
              of
              <span class="font-medium text-gray-700">{{
                filteredBookings.length
              }}</span>
              entries
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Customer</span
                    >
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Theme</span
                    >
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div
                    class="flex items-center gap-2 cursor-pointer group"
                    @click="toggleSort('payment_status')"
                  >
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Payment</span
                    >
                    <svg
                      :class="{
                        'h-4 w-4 transition-transform': true,
                        'rotate-180':
                          sortBy === 'payment_status' && sortOrder === 'desc',
                        'text-[var(--color-bg-primary)]':
                          sortBy === 'payment_status',
                        'text-gray-400 group-hover:text-[var(--color-bg-primary)]':
                          sortBy !== 'payment_status',
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div
                    class="flex items-center gap-2 cursor-pointer group"
                    @click="toggleSort('session_status')"
                  >
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Session</span
                    >
                    <svg
                      :class="{
                        'h-4 w-4 transition-transform': true,
                        'rotate-180':
                          sortBy === 'session_status' && sortOrder === 'desc',
                        'text-[var(--color-bg-primary)]':
                          sortBy === 'session_status',
                        'text-gray-400 group-hover:text-[var(--color-bg-primary)]':
                          sortBy !== 'session_status',
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div
                    class="flex items-center gap-2 cursor-pointer group"
                    @click="toggleSort('frame')"
                  >
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Frame</span
                    >
                    <svg
                      :class="{
                        'h-4 w-4 transition-transform': true,
                        'rotate-180':
                          sortBy === 'session' && sortOrder === 'desc',
                        'text-[var(--color-bg-primary)]': sortBy === 'session',
                        'text-gray-400 group-hover:text-[var(--color-bg-primary)]':
                          sortBy !== 'session',
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div
                    class="flex items-center gap-2 cursor-pointer group"
                    @click="toggleSort('session')"
                  >
                    <span
                      class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Date & Slot</span
                    >
                    <svg
                      :class="{
                        'h-4 w-4 transition-transform': true,
                        'rotate-180':
                          sortBy === 'session' && sortOrder === 'desc',
                        'text-[var(--color-bg-primary)]': sortBy === 'session',
                        'text-gray-400 group-hover:text-[var(--color-bg-primary)]':
                          sortBy !== 'session',
                      }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </th>

                <th scope="col" class="px-6 py-4 text-left">
                  <span
                    class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Actions</span
                  >
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="booking in paginatedBookings"
                :key="booking.id"
                class="group hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--color-bg-primary)] bg-opacity-10 flex items-center justify-center"
                    >
                      <span
                        class="text-sm font-medium text-[var(--color-secondary)]"
                      >
                        {{ booking.user_fullname.charAt(0) }}
                      </span>
                    </div>
                    <div>
                      <div
                        class="text-sm font-medium text-[var(--color-text-primary)] capitalize"
                      >
                        {{ booking.user_fullname }}
                      </div>
                      <div class="text-sm text-[var(--color-text-secondary)]">
                        {{ booking.user_email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] bg-opacity-10 text-[var(--color-primary)]"
                  >
                    {{ booking.theme_title }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative group">
                    <select
                      :value="booking.status"
                      @change="
                        handlePaymentStatusChange(
                          booking.id,
                          $event.target.value
                        )
                      "
                      class="appearance-none w-full cursor-pointer"
                      :class="{
                        'pl-2.5 pr-8 py-1 rounded-full text-xs font-medium': true,
                        'bg-yellow-100 text-yellow-800': booking.status === 1,
                        'bg-blue-100 text-blue-800': booking.status === 2,
                        'bg-green-100 text-green-800': booking.status === 3,
                      }"
                    >
                      <option value="1">Pending</option>
                      <option value="2">Partial</option>
                      <option value="3">Paid</option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                    >
                      <svg
                        class="h-4 w-4"
                        :class="{
                          'text-yellow-800': booking.status === 1,
                          'text-blue-800': booking.status === 2,
                          'text-green-800': booking.status === 3,
                        }"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative group">
                    <select
                      :value="booking.session_status"
                      @change="
                        handleSessionStatusChange(
                          booking.id,
                          parseInt($event.target.value)
                        )
                      "
                      class="appearance-none w-full cursor-pointer"
                      :class="{
                        'pl-2.5 pr-8 py-1 rounded-full text-xs font-medium': true,
                        'bg-yellow-100 text-yellow-800':
                          parseInt(booking.session_status) === 1,
                        'bg-green-100 text-green-800':
                          parseInt(booking.session_status) === 2,
                        'bg-red-100 text-red-800':
                          parseInt(booking.session_status) === 3,
                      }"
                    >
                      <option value="1">Pending</option>
                      <option value="2">Completed</option>
                      <option value="3">Cancelled</option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                    >
                      <svg
                        class="h-4 w-4"
                        :class="{
                          'text-yellow-800':
                            parseInt(booking.session_status) === 1,
                          'text-green-800':
                            parseInt(booking.session_status) === 2,
                        }"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="booking.frame_status" class="relative group">
                    <select
                      :value="booking.frame_status"
                      @change="
                        handleFrameStatusChange(booking.id, $event.target.value)
                      "
                      class="appearance-none w-full cursor-pointer"
                      :class="{
                        'pl-2.5 pr-8 py-1 rounded-full text-xs font-medium': true,
                        'bg-yellow-100 text-yellow-800':
                          booking.frame_status === 1,
                        'bg-blue-100 text-blue-800': booking.frame_status === 2,
                        'bg-green-100 text-green-800':
                          booking.frame_status === 3,
                      }"
                    >
                      <option value="1">Unprinted</option>
                      <option value="2">Printed</option>
                      <option value="3">Delivered</option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                    >
                      <svg
                        class="h-4 w-4"
                        :class="{
                          'text-yellow-800': booking.frame_status === 1,
                          'text-blue-800': booking.frame_status === 2,
                          'text-green-800': booking.frame_status === 3,
                        }"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div v-else>
                    <span
                      class="flex justify-center text-xs font-medium text-gray-500"
                    >
                      -
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(booking.session_date) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(booking.session_time) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <button
                      @click="openBookingDetails(booking)"
                      class="text-gray-400 hover:text-[var(--color-bg-primary)] transition-colors"
                      :disabled="isLoadingDetails"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="generateAndSendReceipt(booking)"
                      class="text-gray-400 hover:text-[var(--color-bg-primary)] transition-colors"
                      :disabled="isLoadingReceipt"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden divide-y divide-gray-200">
          <div
            v-for="booking in paginatedBookings"
            :key="booking.id"
            class="p-4 space-y-4"
          >
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-full bg-[var(--color-bg-primary)] bg-opacity-10 flex items-center justify-center"
                >
                  <span
                    class="text-base font-medium text-[var(--color-bg-primary)]"
                  >
                    {{ booking.user_fullname.charAt(0) }}
                  </span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ booking.user_fullname }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ booking.user_email }}
                  </div>
                </div>
              </div>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': booking.status === 1,
                  'bg-blue-100 text-blue-800': booking.status === 2,
                  'bg-green-100 text-green-800': booking.status === 3,
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="{
                    'bg-yellow-400': booking.status === 1,
                    'bg-blue-400': booking.status === 2,
                    'bg-green-400': booking.status === 3,
                  }"
                ></span>
                {{ statusMap.payment[booking.status] || "Unknown" }}
              </span>
            </div>

            <!-- Details -->
            <div
              class="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100"
            >
              <div>
                <div class="text-xs text-gray-500 mb-1">Theme</div>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] bg-opacity-10 text-[var(--color-primary)]"
                >
                  {{ booking.theme_title }}
                </span>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Session Date</div>
                <div class="text-sm text-gray-900">
                  {{ formatDate(booking.session_date) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Session Time</div>
                <div class="text-sm text-gray-900">
                  {{ formatTime(booking.session_time) }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3">
              <button
                @click="openBookingDetails(booking)"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
                :disabled="isLoadingDetails"
              >
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </button>
              <button
                @click="generateAndSendReceipt(booking)"
                class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
                :disabled="isLoadingReceipt"
              >
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Receipt
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 md:px-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  class="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
              <div class="hidden md:flex items-center gap-2">
                <template v-for="page in getPageNumbers()" :key="page">
                  <button
                    @click="handlePageChange(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg',
                      currentPage === page
                        ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]'
                        : 'text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg
                  class="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div class="text-sm text-gray-500 md:hidden">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Area -->
    <div>
      <!-- Booking Details Modal -->
      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </Transition>

      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl"
            >
              <!-- Modal Header -->
              <div
                class="bg-[var(--color-bg-secondary)] px-6 py-4 border-b border-[var(--color-bg-light)]"
              >
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-[#3C2A21]">
                    Booking Details
                  </h3>
                  <button
                    @click="closeModal"
                    class="text-[#3C2A21]/60 hover:text-[#3C2A21] transition-colors"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="selectedBooking" class="px-6 py-4">
                <div class="space-y-6">
                  <!-- Customer Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-[#3C2A21] mb-3">
                      Customer Information
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Full Name</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedBooking.user_fullname }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Phone Number</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedBooking.user_phoneno }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Email Address</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedBooking.user_email }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Source</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ formatSource(selectedBooking.user_source) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Session Details -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-[#3C2A21] mb-3">
                      Session Details
                    </h4>
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Theme</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedBooking.theme_title }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Session Date</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ formatDate(selectedBooking.session_date) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Session Time</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ formatTime(selectedBooking.session_time) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Number of Pax</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ selectedBooking.number_of_pax || 0 }}
                          <span
                            v-if="selectedBooking.number_of_extra_pax > 0"
                            class="text-amber-600"
                          >
                            (+ {{ selectedBooking.number_of_extra_pax }} extra
                            pax)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Extra Pax Charges</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{
                            selectedBooking.number_of_extra_pax > 0
                              ? formatCurrency(
                                  selectedBooking.payment_extra_pax
                                )
                              : "-"
                          }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Created Date</p>
                        <p class="text-sm font-medium text-[#3C2A21]">
                          {{ formatDate(selectedBooking.created_date) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Session Status</p>
                        <span
                          class="mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-yellow-100 text-yellow-800':
                              selectedBooking.session_status === 1,
                            'bg-green-100 text-green-800':
                              selectedBooking.session_status === 2,
                          }"
                        >
                          {{
                            statusMap.session[selectedBooking.session_status] ||
                            "Unknown"
                          }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Frame Status</p>
                        <span
                          class="mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-yellow-100 text-yellow-800':
                              selectedBooking.frame_status === 1,
                            'bg-blue-100 text-blue-800':
                              selectedBooking.frame_status === 2,
                            'bg-green-100 text-green-800':
                              selectedBooking.frame_status === 3,
                          }"
                        >
                          {{
                            statusMap.frame[selectedBooking.frame_status] ||
                            "Unknown"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Addons -->
                  <div
                    v-if="selectedBooking.addons?.length"
                    class="bg-gray-50 rounded-lg p-4"
                  >
                    <h4 class="text-sm font-medium text-[#3C2A21] mb-3">
                      Add-ons
                    </h4>
                    <div class="divide-y divide-gray-200">
                      <div
                        v-for="(addon, index) in selectedBooking.addons"
                        :key="index"
                        class="py-3 first:pt-0 last:pb-0"
                      >
                        <div class="flex justify-between items-center">
                          <div>
                            <p class="text-sm font-medium text-[#3C2A21]">
                              {{ addon.title }}
                            </p>
                            <p class="text-sm text-gray-500">
                              Quantity: {{ addon.qty }}
                            </p>
                          </div>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ formatCurrency(addon.price || 0) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Details -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-[#3C2A21] mb-3">
                      Payment Details
                    </h4>
                    <div class="space-y-6">
                      <!-- Payment Information -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm text-gray-500">Payment Type</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ getPaymentType(selectedBooking.payment_type) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Payment Method</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              getPaymentMethod(selectedBooking.payment_method)
                            }}
                          </p>
                        </div>
                        <div v-if="selectedBooking.payment_type === 2">
                          <p class="text-sm text-gray-500">Deposit Paid</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              formatCurrency(
                                selectedBooking.payment_amount || 0
                              )
                            }}
                          </p>
                        </div>
                      </div>

                      <!-- Amount Breakdown -->
                      <div
                        class="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <h5 class="text-sm font-medium text-[#3C2A21] mb-3">
                          Amount Breakdown
                        </h5>
                        <div class="space-y-2">
                          <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Theme Price</span>
                            <span class="font-medium text-[#3C2A21]">
                              {{
                                formatCurrency(selectedBooking.theme_price || 0)
                              }}
                            </span>
                          </div>
                          <div
                            v-if="selectedBooking.addons?.length"
                            class="flex justify-between text-sm"
                          >
                            <span class="text-gray-500">Add-ons Total</span>
                            <span class="font-medium text-[#3C2A21]">
                              {{
                                formatCurrency(
                                  calculateFrameTotals(selectedBooking.addons)
                                    .price
                                )
                              }}
                            </span>
                          </div>
                          <div
                            v-if="selectedBooking.number_of_extra_pax > 0"
                            class="flex justify-between text-sm"
                          >
                            <span class="text-gray-500">Extra Pax Charges</span>
                            <span class="font-medium text-[#3C2A21]">
                              {{
                                formatCurrency(
                                  selectedBooking.payment_extra_pax || 0
                                )
                              }}
                            </span>
                          </div>
                          <div
                            class="pt-2 mt-2 border-t border-gray-200 flex justify-between text-sm"
                          >
                            <span class="font-medium text-gray-500"
                              >Total Amount</span
                            >
                            <span class="font-semibold text-[#3C2A21]">
                              {{
                                formatCurrency(
                                  calculateTotalAmount(selectedBooking)
                                )
                              }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Balance Information for Deposit Payment -->
                      <div
                        v-if="selectedBooking.payment_type === 2"
                        class="bg-amber-50 rounded-lg p-4 border border-amber-200"
                      >
                        <div class="space-y-3">
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-amber-800"
                              >Total Amount</span
                            >
                            <span class="text-sm font-medium text-amber-800">
                              {{
                                formatCurrency(
                                  calculateTotalAmount(selectedBooking)
                                )
                              }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-amber-800"
                              >Deposit Paid</span
                            >
                            <span class="text-sm font-medium text-amber-800">
                              -
                              {{
                                formatCurrency(
                                  selectedBooking.payment_amount || 0
                                )
                              }}
                            </span>
                          </div>
                          <div
                            class="pt-2 border-t border-amber-200 flex justify-between items-center"
                          >
                            <div>
                              <p class="text-sm font-medium text-amber-800">
                                Balance to Collect
                              </p>
                              <p class="text-xs text-amber-600 mt-0.5">
                                Please collect the remaining balance before the
                                session
                              </p>
                            </div>
                            <p class="text-lg font-semibold text-amber-800">
                              {{
                                formatCurrency(
                                  calculateTotalAmount(selectedBooking) -
                                    (selectedBooking.payment_amount || 0)
                                )
                              }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Frame Information -->
                      <!-- <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm text-gray-500">Frame Quantity</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              calculateFrameTotals(selectedBooking.addons)
                                .quantity
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Frame Price</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              formatCurrency(
                                calculateFrameTotals(selectedBooking.addons)
                                  .price
                              )
                            }}
                          </p>
                        </div>
                      </div> -->
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21]"
                    >
                      Close
                    </button>
                    <button
                      v-if="selectedBooking?.session_status === 1"
                      @click="showRescheduleModal = true"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors"
                    >
                      Reschedule Session
                    </button>
                    <button
                      v-if="
                        selectedBooking?.status === 1 ||
                        selectedBooking?.status === 2
                      "
                      @click="markAsPaid(selectedBooking?.id)"
                      :disabled="isMarkingAsPaid"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors disabled:opacity-50"
                    >
                      <span v-if="isMarkingAsPaid" class="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                      <span v-else>Mark as Paid</span>
                    </button>
                    <button
                      v-if="
                        selectedBooking?.session_status == 1 ||
                        selectedBooking?.session_status == 2
                      "
                      @click="cancelBooking(selectedBooking?.id)"
                      :disabled="isCancelling"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                    >
                      <span v-if="isCancelling" class="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cancelling...
                      </span>
                      <span v-else>Cancel Booking</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Receipt Preview Modal -->
      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showReceiptModal"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </Transition>

      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div v-if="showReceiptModal" class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
            >
              <!-- Modal Header -->
              <div
                class="bg-[var(--color-bg-secondary)] px-6 py-4 border-b border-[var(--color-bg-light)]"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="text-xl font-semibold text-[var(--color-text-primary)]"
                  >
                    Receipt Preview
                  </h3>
                  <button
                    @click="showReceiptModal = false"
                    class="text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="selectedReceiptBooking" class="px-6 py-4">
                <div class="space-y-6">
                  <!-- Receipt Preview -->
                  <div class="bg-white rounded-lg border border-gray-200">
                    <div class="text-center py-6 border-b border-gray-200">
                      <h2
                        class="text-2xl font-semibold text-[var(--color-text-primary)]"
                      >
                        Booking Receipt
                      </h2>
                      <p class="text-[var(--color-text-primary)] mt-1">
                        Thank you for choosing our services!
                      </p>
                    </div>

                    <div class="p-6 space-y-6">
                      <!-- Booking Information -->
                      <div>
                        <h3
                          class="text-lg font-medium text-[var(--color-text-primary)] mb-3"
                        >
                          Booking Information
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-sm text-gray-500">Booking ID</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              #{{
                                selectedReceiptBooking.id
                                  .toString()
                                  .padStart(6, "0")
                              }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Status</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{
                                selectedReceiptBooking.status === 1
                                  ? "Pending"
                                  : selectedReceiptBooking.status === 2
                                  ? "Partial"
                                  : selectedReceiptBooking.status === 3
                                  ? "Cancelled"
                                  : "Unknown"
                              }}
                            </p>
                          </div>
                          <div class="col-span-2">
                            <p class="text-sm text-gray-500">Created Date</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{
                                formatDate(selectedReceiptBooking.created_date)
                              }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Customer Details -->
                      <div>
                        <h3
                          class="text-lg font-medium text-[var(--color-text-primary)] mb-3"
                        >
                          Customer Details
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                          <div class="col-span-2">
                            <p class="text-sm text-gray-500">Full Name</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ selectedReceiptBooking.user_fullname }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ selectedReceiptBooking.user_email }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Phone</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ selectedReceiptBooking.user_phoneno }}
                            </p>
                          </div>
                          <div class="col-span-2">
                            <p class="text-sm text-gray-500">Address</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ selectedReceiptBooking.user_address }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Session Details -->
                      <div>
                        <h3
                          class="text-lg font-medium text-[var(--color-text-primary)] mb-3"
                        >
                          Session Details
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                          <div class="col-span-2">
                            <p class="text-sm text-gray-500">Theme</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ selectedReceiptBooking.theme }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Session Date</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{
                                formatDate(selectedReceiptBooking.session_date)
                              }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Session Time</p>
                            <p
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{
                                formatTime(selectedReceiptBooking.session_time)
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="text-center py-4 border-t border-gray-200 text-sm text-gray-600"
                    >
                      <p>
                        This is an automatically generated receipt. Please keep
                        it for your records.
                      </p>
                      <p class="mt-1">
                        If you have any questions, please contact us.
                      </p>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="downloadReceipt"
                      :disabled="isLoadingReceipt"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors disabled:opacity-50"
                    >
                      <span v-if="isLoadingReceipt" class="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--color-text-primary)]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Downloading...
                      </span>
                      <span v-else>Download Receipt</span>
                    </button>
                    <button
                      @click="sendReceiptEmail"
                      :disabled="isLoadingEmail"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors disabled:opacity-50"
                    >
                      <span v-if="isLoadingEmail" class="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--color-text-primary)]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                      <span v-else>Send via Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Reschedule Modal -->
      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showRescheduleModal"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-20"
        />
      </Transition>

      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="showRescheduleModal"
          class="fixed inset-0 z-30 overflow-y-auto"
        >
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <!-- Modal Header -->
              <div
                class="bg-[var(--color-bg-secondary)] px-6 py-4 border-b border-[var(--color-bg-light)]"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="text-xl font-semibold text-[var(--color-text-primary)]"
                  >
                    Reschedule Session
                  </h3>
                  <button
                    @click="showRescheduleModal = false"
                    class="text-[#3C2A21]/60 hover:text-[#3C2A21] transition-colors"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Content -->
              <div class="px-6 py-4">
                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
                    >
                      New Session Date
                    </label>
                    <input
                      type="date"
                      v-model="selectedDate"
                      :min="new Date().toISOString().split('T')[0]"
                      class="block w-full rounded-lg border-gray-300 focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] sm:text-sm"
                      :class="{ 'cursor-not-allowed': isWeekend(selectedDate) }"
                      @change="
                        (e) => {
                          if (isWeekend(e.target.value)) {
                            alert(
                              'Weekend dates are not available for booking'
                            );
                            selectedDate = '';
                          }
                        }
                      "
                    />
                    <p
                      v-if="selectedDate && isWeekend(selectedDate)"
                      class="mt-1 text-sm text-red-600"
                    >
                      Weekend dates are not available for booking
                    </p>
                  </div>

                  <div v-if="!isWeekend(selectedDate)">
                    <label
                      class="block text-sm font-medium text-[var(--color-text-primary)] mb-1"
                    >
                      New Session Time
                    </label>
                    <div class="relative">
                      <div
                        v-if="isLoadingSlots"
                        class="flex items-center justify-center py-8"
                      >
                        <svg
                          class="animate-spin h-8 w-8 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>

                      <div
                        v-else-if="!selectedDate"
                        class="text-center py-8 text-gray-500"
                      >
                        Please select a date first
                      </div>

                      <div
                        v-else-if="availableSlots.length === 0"
                        class="text-center py-8 text-red-600"
                      >
                        No available slots for this date
                      </div>

                      <div
                        v-else
                        class="grid grid-cols-3 gap-3 overflow-y-auto p-2"
                      >
                        <button
                          v-for="slot in availableSlots"
                          :key="slot.value"
                          @click="selectedSlot = slot.value"
                          class="p-3 rounded-lg border text-sm font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                          :class="[
                            selectedSlot === slot.value
                              ? 'border-[var(--color-bg-primary)] bg-[var(--color-bg-primary)] bg-opacity-10 text-[var(--color-text-primary)]'
                              : 'border-gray-200 hover:border-[var(--color-bg-primary)] text-gray-700',
                          ]"
                        >
                          {{ formatTimeDisplay(slot.value) }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  @click="showRescheduleModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]"
                >
                  Cancel
                </button>
                <button
                  @click="rescheduleSession"
                  :disabled="
                    isRescheduling ||
                    !selectedDate ||
                    !selectedSlot ||
                    isLoadingSlots
                  "
                  class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors disabled:opacity-50"
                >
                  <span v-if="isRescheduling" class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--color-text-primary)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Rescheduling...
                  </span>
                  <span v-else>Confirm Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Add Confirmation Modal -->
      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showConfirmationModal"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
        />
      </Transition>

      <Transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="showConfirmationModal"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <div
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <!-- Modal Header -->
              <div
                class="bg-[var(--color-bg-secondary)] px-6 py-4 border-b border-[var(--color-bg-light)]"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="text-xl font-semibold text-[var(--color-text-primary)]"
                  >
                    {{ confirmationTitle }}
                  </h3>
                  <button
                    @click="showConfirmationModal = false"
                    class="text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Content -->
              <div class="px-6 py-4">
                <p class="text-sm text-gray-600">
                  {{ confirmationMessage }}
                </p>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  @click="showConfirmationModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21]"
                >
                  Cancel
                </button>
                <button
                  @click="confirmationAction"
                  class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
