<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from "vue";
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
const themeFilter = ref('all');
const statusFilter = ref('all');

// Stats computed properties
const monthlyBookings = computed(() => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.session_date);
    return bookingDate >= firstDayOfMonth && bookingDate <= now;
  }).length;
});

const upcomingBookings = computed(() => {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.session_date);
    return bookingDate >= now && bookingDate <= nextWeek;
  }).length;
});

const todayBookings = computed(() => {
  const now = new Date();
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.session_date);
    return bookingDate.toDateString() === now.toDateString();
  }).length;
});

const popularTheme = computed(() => {
  const themeCounts = bookings.value.reduce((acc, booking) => {
    const theme = booking.extendedProps.theme;
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
});

// Filter bookings based on theme and status
const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    const themeMatch = themeFilter.value === 'all' || booking.theme === themeFilter.value;
    const statusMatch = statusFilter.value === 'all' || booking.status.toString() === statusFilter.value;
    return themeMatch && statusMatch;
  });
});

// Modify the calendar event rendering to include status-based colors
const getEventColor = (status) => {
  switch (status) {
    case 1: return '#10B981'; // Paid - Green
    case 2: return '#F59E0B'; // Pending - Yellow
    case 3: return '#EF4444'; // Cancelled - Red
    default: return '#785340'; // Default brown
  }
};

// Fetch bookings from our API
const fetchBookings = async () => {
  try {
    const response = await $fetch("/api/booking/get-bookings");
    console.log(response);

    bookings.value = response.map((booking) => ({
      id: booking.id,
      title: `${booking.user_fullname} - ${booking.theme}`,
      start: booking.session_date,
      end: booking.session_date,
      backgroundColor: getEventColor(booking.status),
      borderColor: getEventColor(booking.status),
      extendedProps: {
        email: booking.user_email,
        phone: booking.user_phoneno,
        theme: booking.theme,
        status: booking.status,
        fullname: booking.user_fullname,
        created_date: booking.created_date,
      },
    }));

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

// Watch for filter changes
watch([themeFilter, statusFilter], () => {
  if (calendar.value) {
    calendar.value.removeAllEvents();
    calendar.value.addEventSource(filteredBookings.value);
  }
});

// Export calendar function
const exportCalendar = () => {
  const events = bookings.value.map(booking => ({
    Subject: `${booking.extendedProps.fullname} - ${booking.extendedProps.theme}`,
    Start: new Date(booking.start).toISOString(),
    End: new Date(booking.end).toISOString(),
    Description: `Status: ${getStatusText(booking.extendedProps.status)}\nEmail: ${booking.extendedProps.email}\nPhone: ${booking.extendedProps.phone}`,
  }));

  // Create CSV content
  const csvContent = "Subject,Start Date,End Date,Description\n" + 
    events.map(event => 
      `"${event.Subject}","${event.Start}","${event.End}","${event.Description}"`
    ).join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `bookings-${new Date().toISOString().split('T')[0]}.csv`);
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
      right: window.innerWidth < 768 
        ? "dayGridMonth,listWeek" 
        : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    events: bookings.value,
    eventClick: function (info) {
      selectedBooking.value = info.event.extendedProps;
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
    eventColor: "#785340",
    eventTextColor: "#ffffff",
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
    window.addEventListener('resize', handleResize);
  });
});

// Clean up resize event listener
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
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
  switch (status) {
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "Paid";
    case 2:
      return "Pending";
    default:
      return "Cancelled";
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
</script>

<template>
  <div class="">
    <!-- Header -->
    <div class="px-4 sm:px-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-[#785340] rounded-lg shadow-sm text-sm font-medium text-[#785340] bg-white hover:bg-[#F5E6E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340]"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export Calendar
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Monthly Bookings -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-4 sm:p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-[#785340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Monthly Bookings</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ monthlyBookings }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Bookings -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-4 sm:p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-[#785340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Upcoming (7 Days)</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ upcomingBookings }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-4 sm:p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-[#785340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Today's Bookings</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ todayBookings }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Theme -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-4 sm:p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-[#785340]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div class="ml-4 flex-1 min-w-0">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Popular Theme</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ popularTheme }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="mt-4 flex flex-col sm:flex-row gap-3">
        <select 
          v-model="themeFilter" 
          class="w-full sm:w-auto rounded-lg border-gray-300 text-sm focus:ring-[#785340] focus:border-[#785340]"
        >
          <option value="all">All Themes</option>
          <option value="Theme A">Theme A</option>
          <option value="Theme B">Theme B</option>
        </select>

        <select 
          v-model="statusFilter" 
          class="w-full sm:w-auto rounded-lg border-gray-300 text-sm focus:ring-[#785340] focus:border-[#785340]"
        >
          <option value="all">All Status</option>
          <option value="1">Paid</option>
          <option value="2">Pending</option>
          <option value="3">Cancelled</option>
        </select>
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
        <div class="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
          <div class="relative w-full transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:rounded-lg">
            <!-- Close button -->
            <div class="absolute right-0 top-0 hidden sm:block pr-4 pt-4">
              <button
                type="button"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#785340] focus:ring-offset-2"
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
            <div class="sm:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Booking Details</h3>
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
                  Booking Details
                </h3>
              </div>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Customer Name</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking?.fullname }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Email</label>
                    <div class="mt-1 text-sm text-gray-900 break-all">
                      {{ selectedBooking?.email }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Phone</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking?.phone }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Theme</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ selectedBooking?.theme }}
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Status</label>
                    <div class="mt-1">
                      <span
                        :class="[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          getStatusBadgeClass(selectedBooking?.status),
                        ]"
                      >
                        {{ getStatusText(selectedBooking?.status) }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Booking Created</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ new Date(selectedBooking?.created_date).toLocaleDateString() }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                class="w-full sm:w-auto inline-flex justify-center rounded-md bg-[#785340] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5C4033] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340] sm:ml-3"
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
  @apply px-4 py-3 border-b border-gray-200;
}

.fc-theme-standard .fc-toolbar-title {
  @apply text-lg font-medium text-gray-900;
}

.fc-theme-standard .fc-button {
  @apply inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#785340];
}

.fc-theme-standard .fc-button-primary {
  @apply bg-[#785340] border-[#785340] text-white hover:bg-[#5C4033] focus:ring-[#785340];
}

.fc-theme-standard .fc-button-active {
  @apply bg-[#5C4033] border-[#5C4033];
}

.fc-theme-standard td,
.fc-theme-standard th {
  @apply border border-gray-200;
}

.fc-theme-standard .fc-day-today {
  @apply bg-[#F5E6E0]/30;
}

.fc-theme-standard .fc-event {
  @apply border-[#785340] rounded-md shadow-sm;
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
