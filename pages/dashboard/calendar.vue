<script setup>
import {
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from "vue";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

definePageMeta({
  layout: "dashboard",
});

const isLoading = ref(true);
const calendarEl = ref(null);
const bookings = ref([]);
const showModal = ref(false);
const selectedBooking = ref(null);
const calendar = ref(null);

// New refs for filters
const themeFilter = ref("all");
const paymentStatusFilter = ref("all");
const sessionStatusFilter = ref("all");

// Stats computed properties
const monthlyBookings = computed(() => {
  const now = new Date();
  const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const firstDayOfMonth = new Date(
    malaysiaTime.getFullYear(),
    malaysiaTime.getMonth(),
    1
  );
  return bookings.value.filter((booking) => {
    const bookingDate = new Date(booking.start);
    // Convert booking date to Malaysia timezone
    const malaysiaBookingDate = new Date(
      bookingDate.getTime() + 8 * 60 * 60 * 1000
    );
    return (
      malaysiaBookingDate >= firstDayOfMonth &&
      malaysiaBookingDate <= malaysiaTime
    );
  }).length;
});

const upcomingBookings = computed(() => {
  const now = new Date();
  const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const nextWeek = new Date(malaysiaTime);
  nextWeek.setDate(malaysiaTime.getDate() + 7);
  return bookings.value.filter((booking) => {
    const bookingDate = new Date(booking.start);
    // Convert booking date to Malaysia timezone
    const malaysiaBookingDate = new Date(
      bookingDate.getTime() + 8 * 60 * 60 * 1000
    );
    return (
      malaysiaBookingDate >= malaysiaTime && malaysiaBookingDate <= nextWeek
    );
  }).length;
});

const todayBookings = computed(() => {
  const now = new Date();
  const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const today = new Date(
    malaysiaTime.getFullYear(),
    malaysiaTime.getMonth(),
    malaysiaTime.getDate()
  );

  return bookings.value.filter((booking) => {
    const bookingDate = new Date(booking.start);
    // Convert booking date to Malaysia timezone
    const malaysiaBookingDate = new Date(
      bookingDate.getTime() + 8 * 60 * 60 * 1000
    );
    const bookingDay = new Date(
      malaysiaBookingDate.getFullYear(),
      malaysiaBookingDate.getMonth(),
      malaysiaBookingDate.getDate()
    );
    return bookingDay.getTime() === today.getTime();
  }).length;
});

const popularTheme = computed(() => {
  const themeCounts = bookings.value.reduce((acc, booking) => {
    const theme = booking.extendedProps.theme;
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});

  return (
    Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  );
});

// In the script section, add this computed property after other computed properties
const themeOptions = computed(() => {
  const themes = new Set(
    bookings.value.map((booking) => booking.extendedProps.theme)
  );
  return Array.from(themes).filter((theme) => theme); // Filter out any undefined/null values
});

// Update the filteredBookings computed property
const filteredBookings = computed(() => {
  return bookings.value.filter((booking) => {
    return (
      themeFilter.value === "all" ||
      booking.extendedProps.theme === themeFilter.value
    );
  });
});

// Modify the calendar event rendering to include status-based colors
const getEventColor = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "#EF4444"; // Cancelled - Red
    case 2:
      return "#F59E0B"; // Pending - Yellow
    case 3:
      return "#10B981"; // Paid - Green
    default:
      return "#785340"; // Default brown
  }
};

// Fetch bookings from our API
const fetchBookings = async () => {
  try {
    const response = await $fetch("/api/booking/get-bookings");
    console.log("Fetched bookings:", response);

    bookings.value = response.map((booking) => {
      // Create Date object for the session time
      const sessionDate = new Date(booking.session_date);
      const [hours, minutes] = booking.session_time.split(":");

      // Set the correct hours and minutes for the time
      const startTime = new Date(sessionDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);

      return {
        id: booking.id,
        title: `${booking.user_fullname} - ${booking.theme_title}`,
        start: startTime.toISOString(),
        allDay: false,
        backgroundColor: getEventColor(booking.status),
        borderColor: getEventColor(booking.status),
        extendedProps: {
          email: booking.user_email,
          phone: booking.user_phoneno,
          theme: booking.theme_title,
          session_date: booking.session_date,
          session_time: booking.session_time,
          status: booking.status,
          fullname: booking.user_fullname,
          created_date: booking.created_date,
        },
      };
    });
    console.log("Mapped bookings:", bookings.value);

    // Update calendar events if calendar is already initialized
    if (calendar.value) {
      calendar.value.removeAllEvents();
      calendar.value.addEventSource(filteredBookings.value);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    isLoading.value = false;
  }
};

// Update the resetFilters function
const resetFilters = () => {
  themeFilter.value = "all";
};

// Update the watch section
watch([themeFilter], () => {
  if (calendar.value) {
    calendar.value.removeAllEvents();
    calendar.value.addEventSource(filteredBookings.value);
  }
});

// Export calendar function
const exportCalendar = () => {
  const events = bookings.value.map((booking) => ({
    Subject: `${booking.extendedProps.fullname} - ${booking.extendedProps.theme}`,
    Start: new Date(booking.start).toISOString(),
    Description: `Status: ${getStatusText(
      booking.extendedProps.status
    )}\nEmail: ${booking.extendedProps.email}\nPhone: ${
      booking.extendedProps.phone
    }`,
  }));

  // Create CSV content
  const csvContent =
    "Subject,Start Date,End Date,Description\n" +
    events
      .map(
        (event) =>
          `"${event.Subject}","${event.Start}","${event.Description}"`
      )
      .join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `bookings-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Initialize calendar
const initCalendar = () => {
  if (!calendarEl.value) return;

  calendar.value = new Calendar(calendarEl.value, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: window.innerWidth < 768 ? "listWeek" : "dayGridMonth",
    headerToolbar: {
      left: window.innerWidth < 768 ? "prev,next" : "prev,next today",
      center: "title",
      right:
        window.innerWidth < 768
          ? "dayGridMonth,listWeek"
          : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    events: bookings.value,
    eventClick: function (info) {
      const booking = {
        ...info.event.extendedProps,
        title: info.event.title,
        date: info.event.start,
      };

      selectedBooking.value = booking;
      console.log("Selected booking after set:", selectedBooking.value);
      showModal.value = true;
    },
    themeSystem: "standard",
    height: "auto",
    expandRows: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    allDaySlot: false,
    slotDuration: "01:00:00",
    dayMaxEvents: true,
    eventColor: "var(--color-bg-tertiary)",
    eventTextColor: "var(--color-text-light)",
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
    },
    views: {
      timeGrid: {
        dayMaxEvents: 3,
      },
      dayGrid: {
        dayMaxEvents: window.innerWidth < 768 ? 2 : 3,
      },
    },
  });

  calendar.value.render();
};

// Add window resize handler
const handleResize = () => {
  if (calendar.value) {
    calendar.value.destroy();
    initCalendar();
  }
};

// Add resize event listener
onMounted(async () => {
  await fetchBookings();
  nextTick(() => {
    initCalendar();
    window.addEventListener("resize", handleResize);
  });
});

// Clean up resize event listener
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (calendar.value) {
    calendar.value.destroy();
  }
});

// Watch for changes in bookings
watch(
  bookings,
  (newBookings) => {
    if (calendar.value && newBookings.length > 0) {
      calendar.value.removeAllEvents();
      calendar.value.addEventSource(newBookings);
    }
  },
  { deep: true }
);

const getStatusBadgeClass = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "bg-red-100 text-red-800"; // Cancelled
    case 2:
      return "bg-yellow-100 text-yellow-800"; // Pending
    case 3:
      return "bg-green-100 text-green-800"; // Paid
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "Cancelled";
    case 2:
      return "Pending";
    case 3:
      return "Paid";
    default:
      return "Unknown";
  }
};

// Add new refs and methods for modal handling
const closeModal = () => {
  showModal.value = false;
  selectedBooking.value = null;
};

// Add keyboard event handler
const handleKeydown = (e) => {
  if (e.key === "Escape" && showModal.value) {
    closeModal();
  }
};

// Add event listener on mount and remove on unmount
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  if (calendar.value) {
    calendar.value.destroy();
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "medium",
  });
}

function formatTime(timeString) {
  // Handle time string in format "HH:mm:ss"
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    timeStyle: "short",
    hour12: true, // This will show time in 12-hour format with AM/PM
  });
}
</script>

<template>
  <div class="">
    <!-- Header -->
    <div class="px-4 sm:px-0">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Calendar</h1>
            <p class="mt-1 text-sm text-gray-500">
              View and manage your booking schedule
            </p>
          </div>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#785340]"
            @click="$emit('toggle-mobile-menu')"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="flex gap-3">
          <button
            @click="exportCalendar"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export Calendar
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Monthly Bookings -->
        <div
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-blue-600"
                  >Monthly Bookings</span
                >
                <span class="mt-2 text-3xl font-bold text-blue-900">{{
                  monthlyBookings
                }}</span>
              </div>
              <div class="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Bookings -->
        <div
          class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-amber-600"
                  >Upcoming (7 Days)</span
                >
                <span class="mt-2 text-3xl font-bold text-amber-900">{{
                  upcomingBookings
                }}</span>
              </div>
              <div class="p-3 bg-amber-500 bg-opacity-10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div
          class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-emerald-600"
                  >Today's Bookings</span
                >
                <span class="mt-2 text-3xl font-bold text-emerald-900">{{
                  todayBookings
                }}</span>
              </div>
              <div class="p-3 bg-emerald-500 bg-opacity-10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Theme -->
        <div
          class="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-violet-600"
                  >Popular Theme</span
                >
                <span class="mt-2 text-3xl font-bold text-violet-900">{{
                  popularTheme
                }}</span>
              </div>
              <div class="p-3 bg-violet-500 bg-opacity-10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-violet-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div
        class="mt-4 flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100"
      >
        <span class="text-sm font-medium text-gray-500">Filter by Theme:</span>

        <!-- Theme Filter -->
        <div class="relative flex-1 sm:flex-none">
          <select
            v-model="themeFilter"
            class="w-full sm:w-40 appearance-none pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="all">All Themes</option>
            <option v-for="theme in themeOptions" :key="theme" :value="theme">
              {{ theme }}
            </option>
          </select>
          <div class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
              ></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
          </div>
          <div
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <div class="h-5 w-px bg-gray-200 hidden sm:block"></div>

        <!-- Reset Button -->
        <button
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
          @click="resetFilters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 mr-1.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
            ></path>
          </svg>
          Reset
        </button>
      </div>
    </div>

    <!-- Calendar Container -->
    <div class="mt-6 bg-white rounded-lg shadow overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 sm:p-6">
        <div class="animate-pulse flex space-x-4">
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <div v-else ref="calendarEl" class="p-2 sm:p-6"></div>
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
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[60]"
        @click="closeModal"
      ></div>
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
        v-if="showModal"
        class="fixed inset-0 z-[70] overflow-y-auto"
        @click.self="closeModal"
      >
        <div
          class="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center"
        >
          <div
            class="relative w-full transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:rounded-lg"
          >
            <!-- Close button -->
            <div class="absolute right-0 top-0 hidden sm:block pr-4 pt-4">
              <button
                type="button"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:ring-offset-2"
                @click="closeModal"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Mobile Header with close button -->
            <div
              class="sm:hidden flex items-center justify-between p-4 border-b border-gray-200"
            >
              <h3 class="text-lg font-semibold text-gray-900">
                Booking Details
              </h3>
              <button
                type="button"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="closeModal"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="px-4 pb-4 pt-5 sm:p-6">
              <div class="hidden sm:block">
                <h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {{ selectedBooking?.title || "Booking Details" }}
                </h3>
              </div>

              <div v-if="selectedBooking" class="space-y-4">
                <!-- Debug info -->
                <!-- <div class="bg-gray-50 p-2 rounded text-xs">
                  <pre>{{ JSON.stringify(selectedBooking, null, 2) }}</pre>
                </div> -->

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Customer Name</label
                    >
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking.fullname }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Email</label
                    >
                    <div class="mt-1 text-sm text-gray-900 break-all">
                      {{ selectedBooking.email }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Phone</label
                    >
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking.phone }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Theme</label
                    >
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking.theme }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Status</label
                    >
                    <div class="mt-1">
                      <span
                        :class="[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getStatusBadgeClass(selectedBooking.status),
                        ]"
                      >
                        {{ getStatusText(selectedBooking.status) }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Session Date</label
                    >
                    <div class="mt-1 text-sm text-gray-900">
                      {{ formatDate(selectedBooking.session_date) }} -
                      {{ formatTime(selectedBooking.session_time) }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500"
                      >Booking Created</label
                    >
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking.formattedCreatedDate }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-gray-500">No booking details available</p>
              </div>
            </div>

            <div
              class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <button
                type="button"
                class="w-full sm:w-auto inline-flex justify-center rounded-md bg-[var(--color-bg-secondary)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-tertiary)] sm:ml-3"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* Calendar Theme Customization */
.fc-theme-standard .fc-toolbar {
  @apply px-4 py-3 border-b border-[var(--color-border-primary)];
}

.fc-theme-standard .fc-toolbar-title {
  @apply text-lg font-medium text-[var(--color-text-primary)];
}

.fc-theme-standard .fc-button {
  @apply inline-flex items-center px-3 py-2 border border-[var(--color-border-primary)] shadow-sm text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-[var(--color-bg-white)] hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-tertiary)];
}

.fc-theme-standard .fc-button-primary {
  @apply bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)] text-white hover:bg-[var(--color-bg-tertiary)] focus:ring-[var(--color-bg-tertiary)];
}

.fc-theme-standard .fc-button-active {
  @apply bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)];
}

.fc-theme-standard td,
.fc-theme-standard th {
  @apply border border-gray-200;
}

.fc-theme-standard .fc-day-today {
  @apply bg-[var(--color-bg-primary)];
}

.fc-theme-standard .fc-event {
  @apply border-[var(--color-bg-tertiary)] rounded-md shadow-sm;
}

.fc-theme-standard .fc-event-main {
  @apply px-2 py-1;
}

.fc-theme-standard .fc-event-time {
  @apply font-medium;
}

/* Add these styles for better modal overlay */
.fc {
  @apply relative z-10;
}

.modal-open {
  @apply overflow-hidden;
}

/* Mobile List View Styles */
@media (max-width: 767px) {
  .fc-list-event {
    @apply px-4 py-3;
  }

  .fc-list-event-title {
    @apply text-sm font-medium;
  }

  .fc-list-event-time {
    @apply text-xs text-gray-500;
  }

  .fc-list-day-cushion {
    @apply bg-[#F5E6E0]/30 px-4 py-2;
  }

  .fc-toolbar-title {
    @apply text-base;
  }

  .fc-button {
    @apply px-2 py-1 text-xs;
  }
}
</style>
