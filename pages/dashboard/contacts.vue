<script setup>
definePageMeta({
  layout: "dashboard",
});

// Contact data
const contacts = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = [5, 10, 25, 50];

// Search and filter states
const search = ref("");
const debouncedSearch = ref("");
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

// Enhanced filtered contacts computation
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    // Search match with debouncing
    const searchMatch =
      !debouncedSearch.value ||
      (contact.name?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (contact.email?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (contact.phone || "").includes(debouncedSearch.value);

    return searchMatch;
  });
});

// Pagination computed properties
const totalPages = computed(() =>
  Math.ceil(filteredContacts.value.length / itemsPerPage.value)
);

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredContacts.value.slice(start, end);
});

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

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Loading states
const isLoading = ref(false);

const getContacts = async () => {
  isLoading.value = true;
  try {
    const resp = await $fetch("/api/contact/get-contacts");

    console.log(resp);
    contacts.value = resp;
  } catch (error) {
    console.error("Error fetching contacts:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getContacts();
});

// Add these refs at the top of the script setup
const showDetailsModal = ref(false);
const selectedContact = ref(null);

const openDetailsModal = (contact) => {
  selectedContact.value = contact;
  showDetailsModal.value = true;
};
</script>

<template>
  <div class="">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Contact Management</h1>
        <p class="mt-1 text-sm text-gray-600">
          View and manage all contact form submissions
        </p>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-white shadow-sm rounded-lg">
      <!-- Search -->
      <div class="bg-white rounded-lg shadow-sm">
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
          </div>
        </div>
      </div>

      <!-- Loading State -->
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
        v-else-if="!isLoading && filteredContacts.length === 0"
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
          No contacts found
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            search
              ? "Try adjusting your search terms"
              : "No contact submissions yet"
          }}
        </p>
      </div>

      <!-- Contacts Table -->
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
                Math.min(currentPage * itemsPerPage, filteredContacts.length)
              }}
              of {{ filteredContacts.length }} entries
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
                  Contact Info
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-[#3C2A21] uppercase tracking-wider whitespace-nowrap"
                >
                  Bookings
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
                v-for="(contact, index) in paginatedContacts"
                :key="contact.id"
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
                        {{ contact.name.charAt(0) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-[#3C2A21]">
                        {{ contact.name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ contact.email }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ contact.phone }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-md">
                    Total Bookings: {{ contact.total_bookings }}
                    <br />
                    Paid: {{ contact.paid_bookings }}
                    <br />
                    Pending: {{ contact.pending_bookings }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-4">
                    <!-- Detail Icon -->
                    <button
                      class="text-[#3C2A21] hover:text-[#5C4033] transition-colors group relative"
                      title="View Details"
                      @click="openDetailsModal(contact)"
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
                      <span
                        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        View Details
                      </span>
                    </button>

                    <!-- Email Icon -->
                    <a
                      :href="'mailto:' + contact.email"
                      class="text-[#3C2A21] hover:text-[#5C4033] transition-colors group relative"
                      title="Send Email"
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Send Email
                      </span>
                    </a>

                    <!-- WhatsApp Icon -->
                    <a
                      :href="'https://wa.me/' + contact.phone?.replace(/\D/g, '')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-[#3C2A21] hover:text-[#5C4033] transition-colors group relative"
                      title="Send WhatsApp Message"
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
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                        />
                      </svg>
                      <span
                        class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        Send WhatsApp Message
                      </span>
                    </a>
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

    <!-- Contact Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDetailsModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-[#F5E6E0] flex items-center justify-between">
          <h3 class="text-lg font-medium text-[#3C2A21]">Contact Details</h3>
          <button
            @click="showDetailsModal = false"
            class="text-[#3C2A21] hover:text-[#5C4033] transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="px-6 py-4">
          <div class="space-y-6">
            <!-- Contact Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 uppercase mb-3">Contact Information</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500">Full Name</label>
                  <p class="text-sm font-medium text-[#3C2A21]">{{ selectedContact?.name }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-500">Email</label>
                  <p class="text-sm font-medium text-[#3C2A21]">{{ selectedContact?.email }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-500">Phone</label>
                  <p class="text-sm font-medium text-[#3C2A21]">{{ selectedContact?.phone }}</p>
                </div>
                <div>
                  <label class="block text-xs text-gray-500">First Booking</label>
                  <p class="text-sm font-medium text-[#3C2A21]">{{ formatDate(selectedContact?.first_booking) }}</p>
                </div>
              </div>
            </div>

            <!-- Booking Statistics -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 uppercase mb-3">Booking Statistics</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-[#F5E6E0]/30 rounded-lg p-4">
                  <p class="text-xs text-gray-500">Total Bookings</p>
                  <p class="text-2xl font-semibold text-[#3C2A21]">{{ selectedContact?.total_bookings }}</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500">Paid Bookings</p>
                  <p class="text-2xl font-semibold text-green-600">{{ selectedContact?.paid_bookings }}</p>
                </div>
                <div class="bg-yellow-50 rounded-lg p-4">
                  <p class="text-xs text-gray-500">Pending Bookings</p>
                  <p class="text-2xl font-semibold text-yellow-600">{{ selectedContact?.pending_bookings }}</p>
                </div>
              </div>
            </div>

            <!-- Themes Booked -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 uppercase mb-3">Themes Booked</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="theme in selectedContact?.themes?.split(',')"
                  :key="theme"
                  class="px-3 py-1 rounded-full text-xs font-medium bg-[#F5E6E0] text-[#3C2A21]"
                >
                  {{ theme }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <a
            :href="'mailto:' + selectedContact?.email"
            class="inline-flex items-center px-4 py-2 border border-[#785340] text-sm font-medium rounded-md text-[#785340] bg-white hover:bg-[#785340] hover:text-white transition-colors"
          >
            Send Email
          </a>
          <a
            :href="'https://wa.me/' + selectedContact?.phone?.replace(/\D/g, '')"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#785340] hover:bg-[#5C4033] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
