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

// Stats computed properties
const stats = computed(() => ({
  total: bookings.value.length,
  pending: bookings.value.filter((b) => b.status === "Pending").length,
  confirmed: bookings.value.filter((b) => b.status === "Confirmed").length,
  revenue: bookings.value.reduce((sum, b) => sum + b.price, 0),
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
  1: "Paid",
  2: "Pending",
  3: "Cancelled",
  4: "Completed",
};

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
];

const services = [
  { value: "all", label: "All Themes" },
  { value: "Theme A", label: "Theme A" },
  { value: "Theme B", label: "Theme B" },
];

// Enhanced filtered bookings computation
const filteredBookings = computed(() => {
  return bookings.value.filter((booking) => {
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
    const bookingStatus = statusMap[booking.status] || "Unknown";
    const statusMatch =
      statusFilter.value === "all" || bookingStatus === statusFilter.value;

    // Service match
    const serviceMatch =
      serviceFilter.value === "all" || booking.theme === serviceFilter.value;

    // Enhanced date match with proper date comparison
    const bookingDate = booking.created_date
      ? new Date(booking.created_date)
      : null;
    const startDate = dateRange.value.start
      ? new Date(dateRange.value.start)
      : null;
    const endDate = dateRange.value.end ? new Date(dateRange.value.end) : null;

    const dateMatch =
      !bookingDate || // If no booking date, include it
      ((!startDate || bookingDate >= startDate) &&
        (!endDate || bookingDate <= endDate));

    return searchMatch && statusMatch && serviceMatch && dateMatch;
  });
});

// Add active filters count
const activeFiltersCount = computed(() => {
  let count = 0;
  if (debouncedSearch.value) count++;
  if (statusFilter.value !== "all") count++;
  if (serviceFilter.value !== "all") count++;
  if (dateRange.value.start || dateRange.value.end) count++;
  return count;
});

// Enhanced clear filters
const clearFilters = () => {
  search.value = "";
  debouncedSearch.value = "";
  statusFilter.value = "all";
  serviceFilter.value = "all";
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
  return time.split(":").slice(0, 2).join(":");
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

// Add loading states
const isLoading = ref(false);
const isLoadingReceipt = ref(false);
const isLoadingEmail = ref(false);
const isMarkingAsPaid = ref(false);
const isLoadingDetails = ref(false);

const getBookings = async () => {
  isLoading.value = true;
  try {
    const resp = await $fetch("/api/booking/get-bookings");
    bookings.value = resp;
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    isLoading.value = false;
  }
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

onMounted(() => {
  getBookings();
});
</script>

<template>
  <div class="">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p class="mt-1 text-sm text-gray-600">
          View and manage all photography session bookings
        </p>
      </div>
    </div>

    <!-- Loading State for Stats -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white overflow-hidden shadow-sm rounded-lg animate-pulse"
      >
        <div class="p-5">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Bookings -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Bookings
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.total }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Bookings -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Pending Bookings
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.pending }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmed Bookings -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-400"
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
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Confirmed Bookings
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stats.confirmed }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white overflow-hidden shadow-sm rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-400"
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
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ formatCurrency(stats.revenue) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-white shadow-sm rounded-lg">
      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- Quick Search and Filter Toggle -->
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
          >
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
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
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#785340] focus:border-[#785340] sm:text-sm"
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
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-[#F5E6E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340]"
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
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#785340] text-white"
                >
                  {{ activeFiltersCount }}
                </span>
              </button>
              <button
                v-if="activeFiltersCount > 0"
                @click="clearFilters"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-[#F5E6E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div
          v-show="showFilters"
          class="p-4 border-b border-gray-200 bg-[#F5E6E0]"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Status Filter -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Status</label
              >
              <div class="relative">
                <select
                  v-model="statusFilter"
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[#785340] focus:border-[#785340] transition-colors hover:border-[#785340]"
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
                  class="appearance-none block w-full rounded-lg border-gray-300 pl-3 pr-10 py-2.5 text-sm bg-white focus:ring-[#785340] focus:border-[#785340] transition-colors hover:border-[#785340]"
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

            <!-- Date Range -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#3C2A21] mb-1"
                >Date Range</label
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
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#785340] text-white"
              >
                Status: {{ statusFilter }}
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
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#785340] text-white"
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
                v-if="dateRange.start || dateRange.end"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#785340] text-white"
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

      <!-- Loading State for Table -->
      <div v-if="isLoading" class="px-4 py-5 sm:p-6">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div class="w-24">
                <div class="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!isLoading && filteredBookings.length === 0"
        class="px-4 py-12 sm:px-6 text-center"
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
              dateRange.start ||
              dateRange.end
            "
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#785340] hover:bg-[#5C4132] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340]"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Bookings Table -->
      <div v-else>
        <!-- Table Header with Page Size Selector -->
        <div class="px-6 py-4 border-b border-gray-200 bg-[#F5E6E0]">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Show</span>
              <select
                v-model="itemsPerPage"
                class="rounded-lg border-gray-300 focus:ring-[#785340] focus:border-[#785340] sm:text-sm"
              >
                <option
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
              <span class="text-sm text-gray-500">entries</span>
            </div>
            <div class="text-sm text-gray-500">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredBookings.length)
              }}
              of {{ filteredBookings.length }} entries
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-[#F5E6E0]">
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  No
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Theme
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Created
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="(booking, index) in paginatedBookings"
                :key="booking.id"
                class="hover:bg-[#F5E6E0]/30 transition-colors duration-150"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3C2A21]"
                >
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 flex-shrink-0 rounded-full bg-[#785340] flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-white">
                        {{ booking.user_fullname.charAt(0) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-[#3C2A21]">
                        {{ booking.user_fullname }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ booking.user_email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F5E6E0] text-[#3C2A21]"
                  >
                    {{ booking.theme }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': booking.status === 2,
                      'bg-green-100 text-green-800': booking.status === 1,
                      'bg-red-100 text-red-800': booking.status === 3,
                      'bg-blue-100 text-blue-800': booking.status === 4,
                    }"
                  >
                    <span class="flex items-center">
                      <span
                        class="h-1.5 w-1.5 rounded-full mr-1.5"
                        :class="{
                          'bg-yellow-500': booking.status === 2,
                          'bg-green-500': booking.status === 1,
                          'bg-red-500': booking.status === 3,
                          'bg-blue-500': booking.status === 4,
                        }"
                      ></span>
                      {{
                        booking.status === 1
                          ? "Paid"
                          : booking.status === 2
                          ? "Pending"
                          : booking.status === 3
                          ? "Cancelled"
                          : booking.status === 4
                          ? "Completed"
                          : "Unknown"
                      }}
                    </span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-[#3C2A21]">
                    {{ formatDate(booking.created_date) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(booking.session_time) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-4">
                    <button
                      @click="openBookingDetails(booking)"
                      :disabled="isLoadingDetails"
                      class="text-[#3C2A21] hover:text-[#5C4033] transition-colors disabled:opacity-50 group relative"
                      title="View Details"
                    >
                      <template v-if="isLoadingDetails">
                        <svg
                          class="animate-spin h-5 w-5"
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
                      </template>
                      <template v-else>
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
                        <span
                          class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          View Details
                        </span>
                      </template>
                    </button>
                    <button
                      @click="generateAndSendReceipt(booking)"
                      :disabled="isLoadingReceipt"
                      class="text-[#3C2A21] hover:text-[#5C4033] transition-colors disabled:opacity-50 group relative"
                      title="Generate & Send Receipt"
                    >
                      <template v-if="isLoadingReceipt">
                        <svg
                          class="animate-spin h-5 w-5"
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
                      </template>
                      <template v-else>
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
                        <span
                          class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                          Generate Receipt
                        </span>
                      </template>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="px-6 py-4 border-t border-gray-200 bg-[#F5E6E0]">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-[#F5E6E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div class="flex items-center space-x-2">
                <template v-for="page in getPageNumbers()" :key="page">
                  <button
                    @click="handlePageChange(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg',
                      currentPage === page
                        ? 'bg-[#785340] text-white'
                        : 'text-gray-700 hover:bg-[#F5E6E0]',
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-[#F5E6E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
          >
            <!-- Modal Header -->
            <div class="bg-[#F5E6E0] px-6 py-4 border-b border-[#3C2A21]/10">
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
                <!-- Booking ID and Status -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500">Booking ID</p>
                    <p class="text-base font-medium text-[#3C2A21]">
                      #{{ selectedBooking.id.toString().padStart(6, "0") }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Status</p>
                    <span
                      class="mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800':
                          selectedBooking.status === 2,
                        'bg-green-100 text-green-800':
                          selectedBooking.status === 1,
                        'bg-red-100 text-red-800': selectedBooking.status === 3,
                        'bg-blue-100 text-blue-800':
                          selectedBooking.status === 4,
                      }"
                    >
                      {{
                        selectedBooking.status === 1
                          ? "Paid"
                          : selectedBooking.status === 2
                          ? "Pending"
                          : selectedBooking.status === 3
                          ? "Cancelled"
                          : selectedBooking.status === 4
                          ? "Completed"
                          : "Unknown"
                      }}
                    </span>
                  </div>
                </div>

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
                    <div class="col-span-2">
                      <p class="text-sm text-gray-500">Email Address</p>
                      <p class="text-sm font-medium text-[#3C2A21]">
                        {{ selectedBooking.user_email }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-sm text-gray-500">Address</p>
                      <p class="text-sm font-medium text-[#3C2A21]">
                        {{ selectedBooking.user_address }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Session Details -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-[#3C2A21] mb-3">
                    Session Details
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Theme</p>
                      <p class="text-sm font-medium text-[#3C2A21]">
                        {{ selectedBooking.theme }}
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
                      <p class="text-sm text-gray-500">Created Date</p>
                      <p class="text-sm font-medium text-[#3C2A21]">
                        {{ formatDate(selectedBooking.created_date) }}
                      </p>
                    </div>
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
                    v-if="selectedBooking.status === 2"
                    @click="markAsPaid(selectedBooking?.id)"
                    :disabled="isMarkingAsPaid"
                    class="px-4 py-2 text-sm font-medium text-white bg-[#3C2A21] rounded-lg hover:bg-[#5C4033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21] transition-colors disabled:opacity-50"
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
            <div class="bg-[#F5E6E0] px-6 py-4 border-b border-[#3C2A21]/10">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-[#3C2A21]">
                  Receipt Preview
                </h3>
                <button
                  @click="showReceiptModal = false"
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

            <div v-if="selectedReceiptBooking" class="px-6 py-4">
              <div class="space-y-6">
                <!-- Receipt Preview -->
                <div class="bg-white rounded-lg border border-gray-200">
                  <div class="text-center py-6 border-b border-gray-200">
                    <h2 class="text-2xl font-semibold text-[#3C2A21]">
                      Booking Receipt
                    </h2>
                    <p class="text-gray-600 mt-1">
                      Thank you for choosing our services!
                    </p>
                  </div>

                  <div class="p-6 space-y-6">
                    <!-- Booking Information -->
                    <div>
                      <h3 class="text-lg font-medium text-[#3C2A21] mb-3">
                        Booking Information
                      </h3>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm text-gray-500">Booking ID</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            #{{
                              selectedReceiptBooking.id
                                .toString()
                                .padStart(6, "0")
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Status</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              selectedReceiptBooking.status === 1
                                ? "Paid"
                                : selectedReceiptBooking.status === 2
                                ? "Pending"
                                : selectedReceiptBooking.status === 3
                                ? "Cancelled"
                                : selectedReceiptBooking.status === 4
                                ? "Completed"
                                : "Unknown"
                            }}
                          </p>
                        </div>
                        <div class="col-span-2">
                          <p class="text-sm text-gray-500">Created Date</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              formatDate(selectedReceiptBooking.created_date)
                            }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Customer Details -->
                    <div>
                      <h3 class="text-lg font-medium text-[#3C2A21] mb-3">
                        Customer Details
                      </h3>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                          <p class="text-sm text-gray-500">Full Name</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ selectedReceiptBooking.user_fullname }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Email</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ selectedReceiptBooking.user_email }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Phone</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ selectedReceiptBooking.user_phoneno }}
                          </p>
                        </div>
                        <div class="col-span-2">
                          <p class="text-sm text-gray-500">Address</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ selectedReceiptBooking.user_address }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Session Details -->
                    <div>
                      <h3 class="text-lg font-medium text-[#3C2A21] mb-3">
                        Session Details
                      </h3>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                          <p class="text-sm text-gray-500">Theme</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{ selectedReceiptBooking.theme }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Session Date</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
                            {{
                              formatDate(selectedReceiptBooking.session_date)
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Session Time</p>
                          <p class="text-sm font-medium text-[#3C2A21]">
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
                      This is an automatically generated receipt. Please keep it
                      for your records.
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
                    class="px-4 py-2 text-sm font-medium text-white bg-[#3C2A21] rounded-lg hover:bg-[#5C4033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21] transition-colors disabled:opacity-50"
                  >
                    <span v-if="isLoadingReceipt" class="flex items-center">
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
                      Downloading...
                    </span>
                    <span v-else>Download Receipt</span>
                  </button>
                  <button
                    @click="sendReceiptEmail"
                    :disabled="isLoadingEmail"
                    class="px-4 py-2 text-sm font-medium text-white bg-[#3C2A21] rounded-lg hover:bg-[#5C4033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21] transition-colors disabled:opacity-50"
                  >
                    <span v-if="isLoadingEmail" class="flex items-center">
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
  </div>
</template>
