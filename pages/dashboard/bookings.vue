<template>
  <div class="space-y-6">
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold">Bookings</h1>
      <span class="text-md"> View all your bookings here </span>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Confirmed Bookings Card -->
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-blue-600"
                >Total Confirmed</span
              >
              <span class="mt-2 text-3xl font-bold text-blue-900">{{
                stats.confirmed
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

      <!-- Partially Paid Card -->
      <div
        class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-amber-600"
                >Partially Paid</span
              >
              <span class="mt-2 text-3xl font-bold text-amber-900">{{
                stats.partiallyPaid
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
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path
                  d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Frames Card -->
      <div
        class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-emerald-600"
                >Total Frames</span
              >
              <span class="mt-2 text-3xl font-bold text-emerald-900">{{
                stats.totalFrames
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Sales Card -->
      <div
        class="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-violet-600"
                >Total Sales</span
              >
              <span class="mt-2 text-3xl font-bold text-violet-900"
                >RM {{ formatNumber(stats.totalSales) }}</span
              >
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
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
    >
      <!-- Table Header Actions -->
      <div class="p-6 space-y-4 border-b border-gray-100">
        <!-- Top Row: Search and Export -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Search Input -->
          <div class="relative w-full md:w-96">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
              @input="handleSearch"
            />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <!-- Export Button -->
          <button
            class="inline-flex items-center px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            @click="exportToCSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export to CSV
          </button>
        </div>

        <!-- Bottom Row: Filters -->
        <div
          class="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100"
        >
          <span class="text-sm font-medium text-gray-500">Filters:</span>

          <!-- Date Range -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="filters.startDate"
                type="date"
                class="w-40 pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                :max="filters.endDate || undefined"
                @change="handleFiltersChange"
              />
              <div
                class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <span class="text-sm text-gray-400">to</span>
            <div class="relative">
              <input
                v-model="filters.endDate"
                type="date"
                class="w-40 pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                :min="filters.startDate || undefined"
                @change="handleFiltersChange"
              />
              <div
                class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          <div class="h-5 w-px bg-gray-200"></div>

          <!-- Status Filters -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                v-model="filters.paymentStatus"
                class="w-40 appearance-none pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                @change="handleFiltersChange"
              >
                <option :value="null">All Payments</option>
                <option
                  v-for="status in paymentStatusOptions"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <div
                class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
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

            <div class="relative">
              <select
                v-model="filters.sessionStatus"
                class="w-40 appearance-none pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                @change="handleFiltersChange"
              >
                <option :value="null">All Sessions</option>
                <option
                  v-for="status in sessionStatusOptions"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <div
                class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
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
          </div>

          <div class="h-5 w-px bg-gray-200"></div>

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

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="flex justify-center items-center p-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="(column, index) in [
                  'No',
                  'Customer',
                  'Session Slot',
                  'Theme',
                  'Payment Status',
                  'Session Status',
                  'Frame Status',
                  'Action',
                ]"
                :key="index"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors duration-200"
                @click="
                  handleSortChange({
                    prop:
                      index === 0
                        ? 'id'
                        : index === 1
                        ? 'user_fullname'
                        : index === 2
                        ? 'session_date'
                        : index === 3
                        ? 'theme'
                        : index === 4
                        ? 'status'
                        : index === 5
                        ? 'session_status'
                        : index === 6
                        ? 'frame_status'
                        : '',
                    order:
                      sortBy.prop ===
                        (index === 0
                          ? 'id'
                          : index === 1
                          ? 'user_fullname'
                          : index === 2
                          ? 'session_date'
                          : index === 3
                          ? 'theme'
                          : index === 4
                          ? 'status'
                          : index === 5
                          ? 'session_status'
                          : index === 6
                          ? 'frame_status'
                          : '') && sortBy.order === 'ascending'
                        ? 'descending'
                        : 'ascending',
                  })
                "
              >
                <div class="flex items-center gap-2">
                  {{ column }}
                  <span
                    v-if="
                      sortBy.prop ===
                      (index === 0
                        ? 'id'
                        : index === 1
                        ? 'user_fullname'
                        : index === 2
                        ? 'session_date'
                        : index === 3
                        ? 'theme'
                        : index === 4
                        ? 'status'
                        : index === 5
                        ? 'session_status'
                        : index === 6
                        ? 'frame_status'
                        : '')
                    "
                    class="text-blue-500"
                  >
                    {{ sortBy.order === "ascending" ? "↑" : "↓" }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(booking, index) in paginatedBookings"
              :key="booking.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">{{
                    booking.user_fullname
                  }}</span>
                  <span class="text-sm text-gray-500">{{
                    booking.user_email
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">{{
                    formatDate(booking.session_date)
                  }}</span>
                  <span class="text-sm text-gray-500">{{
                    formatTime(booking.session_time)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{
                  booking.theme_title || "Not specified"
                }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative group">
                  <span
                    :class="{
                      'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                      'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 hover:bg-yellow-100':
                        booking.status === 1,
                      'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100':
                        booking.status === 2,
                      'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                        booking.status === 3,
                      'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100':
                        booking.status === 4,
                    }"
                    @click="(e: MouseEvent) => {
                      const target = e.currentTarget as HTMLElement;
                      target.nextElementSibling?.classList.toggle('hidden');
                      e.stopPropagation();
                    }"
                  >
                    {{ getPaymentStatusLabel(booking.status) }}
                  </span>
                  <div
                    class="hidden absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="py-1" role="menu">
                      <button
                        v-for="option in paymentStatusOptions"
                        :key="option.value"
                        class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                        @click="
                          updatePaymentStatus($event, booking.id, option.value)
                        "
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative group">
                  <span
                    :class="{
                      'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                      'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 hover:bg-yellow-100':
                        booking.session_status === 1,
                      'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                        booking.session_status === 2,
                      'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100':
                        booking.session_status === 3,
                    }"
                    @click="(e: MouseEvent) => {
                      const target = e.currentTarget as HTMLElement;
                      target.nextElementSibling?.classList.toggle('hidden');
                      e.stopPropagation();
                    }"
                  >
                    {{ getSessionStatusLabel(booking.session_status) }}
                  </span>
                  <div
                    class="hidden absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="py-1" role="menu">
                      <button
                        v-for="option in sessionStatusOptions"
                        :key="option.value"
                        class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                        @click="
                          updateSessionStatus($event, booking.id, option.value)
                        "
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative group">
                  <span
                    :class="{
                      'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                      'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 hover:bg-gray-100':
                        booking.frame_status === 1,
                      'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100':
                        booking.frame_status === 2,
                      'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                        booking.frame_status === 3,
                    }"
                    @click="(e: MouseEvent) => {
                      const target = e.currentTarget as HTMLElement;
                      target.nextElementSibling?.classList.toggle('hidden');
                      e.stopPropagation();
                    }"
                  >
                    {{ getFrameStatusLabel(booking.frame_status) }}
                  </span>
                  <div
                    class="hidden absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div class="py-1" role="menu">
                      <button
                        v-for="option in frameStatusOptions"
                        :key="option.value"
                        class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                        @click="
                          updateFrameStatus($event, booking.id, option.value)
                        "
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                    class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    @click="handleMoreAction(booking)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                  <button
                    class="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    @click="handleReceiptAction(booking)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <line x1="18" y1="9" x2="18" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="px-6 py-4 border-t border-gray-100 bg-white">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="flex items-center gap-4 text-sm text-gray-700">
            <span>
              Showing {{ (currentPage - 1) * pageSize + 1 }} to
              {{ Math.min(currentPage * pageSize, filteredBookings.length) }} of
              {{ filteredBookings.length }} entries
            </span>
            <select
              v-model="pageSize"
              class="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="handleSizeChange"
            >
              <option :value="10">10 / page</option>
              <option :value="20">20 / page</option>
              <option :value="50">50 / page</option>
              <option :value="100">100 / page</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="currentPage === 1"
              @click="handleCurrentChange(currentPage - 1)"
            >
              Previous
            </button>
            <div class="flex gap-1">
              <button
                v-for="page in Math.ceil(filteredBookings.length / pageSize)"
                :key="page"
                class="px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                :class="
                  currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                    : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                "
                @click="handleCurrentChange(page)"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="
                currentPage >= Math.ceil(filteredBookings.length / pageSize)
              "
              @click="handleCurrentChange(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- More Actions Modal -->
    <Teleport to="body">
      <div v-if="moreActionsVisible" class="fixed inset-0 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="moreActionsVisible = false"
        ></div>

        <!-- Modal Container -->
        <div
          class="fixed inset-0 min-h-screen flex items-center justify-center p-4 z-50"
        >
          <!-- Modal -->
          <div class="w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-gray-100"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                    ></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Booking Details
                </h3>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
                @click="moreActionsVisible = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div
              v-if="selectedBooking"
              class="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto"
            >
              <!-- Customer Information -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">
                  Customer Information
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Name</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.user_fullname }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Contact</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.user_phoneno }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Email</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.user_email }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Theme</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.theme_title || "Not specified" }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Session Details -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">
                  Session Details
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Date</div>
                    <div class="font-medium text-gray-900">
                      {{ formatDate(selectedBooking.session_date) }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Time</div>
                    <div class="font-medium text-gray-900">
                      {{ formatTime(selectedBooking.session_time) }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Frame Quantity</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.frame_quantity }} frames
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Theme</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.theme_title || "Not specified" }}
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">No. of Pax</div>
                    <div class="font-medium text-gray-900">
                      {{ selectedBooking.number_of_pax || 0 }} Pax
                    </div>
                  </div>
                </div>
              </div>

              <!-- Frame Details -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">Frame Details</h4>
                <div class="space-y-3">
                  <!-- Addons List -->
                  <template
                    v-if="
                      selectedBooking.addons &&
                      selectedBooking.addons.length > 0
                    "
                  >
                    <div
                      v-for="(addon, index) in selectedBooking.addons"
                      :key="index"
                      class="flex justify-between items-center py-2 border-b border-gray-200"
                    >
                      <div>
                        <span class="text-sm font-medium text-gray-900">{{
                          addon.title
                        }}</span>
                        <p class="text-sm text-gray-500">
                          Quantity: {{ addon.qty }}
                        </p>
                      </div>
                      <span class="text-sm font-medium text-gray-900">
                        RM {{ formatNumber(addon.price * addon.qty) }}
                      </span>
                    </div>
                  </template>
                  <div v-else class="text-sm text-gray-500 italic">
                    No addons selected
                  </div>
                </div>
              </div>

              <!-- Payment Summary -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">
                  Payment Summary
                </h4>
                <div class="space-y-3">
                  <!-- Base Price -->
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600">Session Total</span>
                    <span class="text-sm font-medium text-gray-900">
                      RM {{ formatNumber(selectedBooking.theme_price) }}
                    </span>
                  </div>

                  <!-- Extra Pax Total -->
                  <div
                    class="flex justify-between items-center py-2"
                    v-if="selectedBooking.number_of_extra_pax"
                  >
                    <span class="text-sm text-gray-600"
                      >Extra Pax Total ( + {{
                        selectedBooking.number_of_extra_pax
                      }} Pax)</span
                    >
                    <span class="text-sm font-medium text-gray-900">
                      RM {{ formatNumber(selectedBooking.payment_extra_pax) }}
                    </span>
                  </div>
                  <!-- Addons Total -->
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600">Addons Total</span>
                    <span class="text-sm font-medium text-gray-900">
                      RM
                      {{
                        formatNumber(
                          calculateAddonsTotal(selectedBooking.addons)
                        )
                      }}
                    </span>
                  </div>

                  <!-- Total -->
                  <div
                    class="flex justify-between items-center py-2 border-t border-gray-200"
                  >
                    <span class="text-sm font-medium text-gray-900"
                      >Total Amount</span
                    >
                    <span class="text-base font-bold text-gray-900">
                      RM {{ formatNumber(selectedBooking.payment_total) }}
                    </span>
                  </div>

                  <!-- Payment Type -->
                  <div
                    class="flex justify-between items-center py-2 bg-gray-100 rounded-lg px-3"
                  >
                    <span class="text-sm font-medium text-gray-900"
                      >Payment Type</span
                    >
                    <span
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full': true,
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                          selectedBooking.payment_type === 2,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                          selectedBooking.payment_type === 1,
                      }"
                    >
                      {{
                        selectedBooking.payment_type === 2
                          ? "Deposit"
                          : "Full Payment"
                      }}
                    </span>
                  </div>

                  <!-- Payment Status -->
                  <div
                    class="flex justify-between items-center py-2 bg-gray-100 rounded-lg px-3"
                  >
                    <span class="text-sm font-medium text-gray-900"
                      >Payment Status</span
                    >
                    <span
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full': true,
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                          selectedBooking.status === 1,
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                          selectedBooking.status === 2,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                          selectedBooking.status === 3,
                        'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                          selectedBooking.status === 4,
                      }"
                    >
                      {{ getPaymentStatusLabel(selectedBooking.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Payment Details -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">
                  Payment Details
                </h4>
                <div class="space-y-3">
                  <!-- Amount Paid -->
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600">Amount Paid</span>
                    <span class="text-sm font-medium text-green-600">
                      RM {{ formatNumber(selectedBooking.payment_amount || 0) }}
                    </span>
                  </div>

                  <!-- Balance (Only show for deposit payments) -->
                  <template v-if="selectedBooking.payment_type === 2">
                    <div class="flex justify-between items-center py-2">
                      <span class="text-sm text-gray-600"
                        >Remaining Balance</span
                      >
                      <span class="text-sm font-medium text-amber-600">
                        RM
                        {{
                          formatNumber(
                            selectedBooking.payment_total -
                              (selectedBooking.payment_amount || 0)
                          )
                        }}
                      </span>
                    </div>
                  </template>

                  <!-- Notify Customer Button (Only show for pending balance) -->
                  <div
                    v-if="
                      selectedBooking.status !== 3 &&
                      selectedBooking.status !== 4
                    "
                    class="mt-4"
                  >
                    <button
                      class="w-full px-4 py-2 text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                      @click="handleNotifyCustomer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        ></path>
                      </svg>
                      {{
                        selectedBooking.status === 1
                          ? "Notify Customer for Payment"
                          : "Notify for Remaining Balance"
                      }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Status Summary -->
              <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                <h4 class="text-sm font-medium text-gray-500">
                  Status Summary
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Session Status -->
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Session Status</div>
                    <span
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full': true,
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                          selectedBooking.session_status === 1,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                          selectedBooking.session_status === 2,
                        'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                          selectedBooking.session_status === 3,
                      }"
                    >
                      {{
                        getSessionStatusLabel(selectedBooking.session_status)
                      }}
                    </span>
                  </div>
                  <!-- Frame Status -->
                  <div class="space-y-1">
                    <div class="text-sm text-gray-500">Frame Status</div>
                    <span
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full': true,
                        'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20':
                          selectedBooking.frame_status === 1,
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100':
                          selectedBooking.frame_status === 2,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                          selectedBooking.frame_status === 3,
                      }"
                    >
                      {{ getFrameStatusLabel(selectedBooking.frame_status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Reschedule Form - Only shown when isRescheduling is true -->
              <div
                v-if="isRescheduling"
                class="bg-gray-50/50 rounded-lg p-4 space-y-4"
              >
                <h4 class="text-sm font-medium text-gray-500">
                  Reschedule Session
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm text-gray-700">New Date</label>
                    <input
                      v-model="rescheduleDate"
                      type="date"
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                      :min="new Date().toISOString().split('T')[0]"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-gray-700">New Time</label>
                    <input
                      v-model="rescheduleTime"
                      type="time"
                      class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                      min="10:00"
                      max="20:00"
                      step="1800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer with Action Buttons -->
            <div
              class="px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl space-x-4 flex justify-end"
            >
              <button
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                @click="moreActionsVisible = false"
              >
                Close
              </button>
              <button
                v-if="selectedBooking?.session_status === 1"
                class="px-4 py-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                @click="handleRescheduleClick"
              >
                Reschedule Session
              </button>
              <button
                v-if="selectedBooking?.session_status === 1"
                class="px-4 py-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                @click="handleCancelBooking"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reschedule Modal -->
    <Teleport to="body">
      <div v-if="rescheduleModalVisible" class="fixed inset-0 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="rescheduleModalVisible = false"
        ></div>

        <!-- Modal Container -->
        <div
          class="fixed inset-0 min-h-screen flex items-center justify-center p-4 z-50"
        >
          <!-- Modal -->
          <div class="w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-gray-100"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                    ></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Reschedule Session
                </h3>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
                @click="rescheduleModalVisible = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6">
              <!-- Date Selection -->
              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700">
                  Select New Date
                </label>
                <input
                  v-model="rescheduleDate"
                  type="date"
                  class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                  :min="new Date().toISOString().split('T')[0]"
                  @change="handleDateChange"
                />
              </div>

              <!-- Loading State -->
              <div v-if="loadingSlots" class="flex justify-center py-8">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                ></div>
              </div>

              <!-- Available Time Slots -->
              <div v-else-if="availableTimeSlots.length > 0" class="space-y-4">
                <h4 class="text-sm font-medium text-gray-700">
                  Available Time Slots
                </h4>
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <button
                    v-for="slot in availableTimeSlots"
                    :key="slot.value"
                    class="p-4 border rounded-lg text-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    :class="{
                      'border-blue-500 bg-blue-50':
                        selectedTimeSlot?.value === slot.value,
                      'border-gray-200': selectedTimeSlot?.value !== slot.value,
                    }"
                    @click="selectedTimeSlot = slot"
                  >
                    <span
                      class="block text-sm font-medium"
                      :class="{
                        'text-blue-700': selectedTimeSlot?.value === slot.value,
                        'text-gray-900': selectedTimeSlot?.value !== slot.value,
                      }"
                    >
                      {{ slot.slot }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- No Time Slots Available -->
              <div v-else-if="rescheduleDate" class="text-center py-8">
                <div
                  class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-gray-900">
                  No Available Time Slots
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Please select a different date to view available time slots.
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end gap-4"
            >
              <button
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                @click="rescheduleModalVisible = false"
              >
                Close
              </button>
              <button
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                @click="rescheduleModalVisible = false"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                :disabled="!selectedTimeSlot"
                @click="confirmReschedule"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Receipt Modal -->
    <Teleport to="body">
      <div v-if="receiptModalVisible" class="fixed inset-0 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="receiptModalVisible = false"
        ></div>

        <!-- Modal Container -->
        <div
          class="fixed inset-0 min-h-screen flex items-center justify-center p-4 z-50"
        >
          <!-- Modal -->
          <div
            class="w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <line x1="18" y1="9" x2="18" y2="15"></line>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Receipt Details
                </h3>
              </div>
              <button
                class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50"
                @click="receiptModalVisible = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="selectedBooking" class="space-y-6 receipt-content">
                <!-- Receipt Header -->
                <div class="text-center space-y-2">
                  <h2 class="text-xl font-bold text-gray-900">
                    Stitch & Shutter
                  </h2>
                  <p class="text-sm text-gray-500">Official Receipt</p>
                  <p class="text-sm text-gray-500">
                    Receipt #{{
                      selectedBooking.id.toString().padStart(6, "0")
                    }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Issue Date:
                    {{ formatDate(selectedBooking.created_date) }}
                  </p>
                </div>

                <!-- Customer Details -->
                <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                  <h4 class="text-sm font-medium text-gray-500">
                    Customer Information
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Full Name</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.user_fullname }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Phone Number</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.user_phoneno }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Email Address</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.user_email }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Booking Status</div>
                      <div>
                        <span
                          :class="{
                            'px-2 py-1 text-xs font-medium rounded-full': true,
                            'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                              selectedBooking.session_status === 1,
                            'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                              selectedBooking.session_status === 2,
                            'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                              selectedBooking.session_status === 3,
                          }"
                        >
                          {{
                            getSessionStatusLabel(
                              selectedBooking.session_status
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Session Details -->
                <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                  <h4 class="text-sm font-medium text-gray-500">
                    Session Information
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Session Date</div>
                      <div class="font-medium text-gray-900">
                        {{ formatDate(selectedBooking.session_date) }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Session Time</div>
                      <div class="font-medium text-gray-900">
                        {{ formatTime(selectedBooking.session_time) }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Theme Package</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.theme_title || "Standard Session" }}
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Duration</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.theme_duration || "30" }} minutes
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Frame Details -->
                <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                  <h4 class="text-sm font-medium text-gray-500">
                    Frame Information
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Frame Quantity</div>
                      <div class="font-medium text-gray-900">
                        {{ selectedBooking.frame_quantity }} frames
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-sm text-gray-500">Frame Status</div>
                      <div>
                        <span
                          :class="{
                            'px-2 py-1 text-xs font-medium rounded-full': true,
                            'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20':
                              selectedBooking.frame_status === 1,
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                              selectedBooking.frame_status === 2,
                            'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                              selectedBooking.frame_status === 3,
                          }"
                        >
                          {{
                            getFrameStatusLabel(selectedBooking.frame_status)
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Details -->
                <div class="bg-gray-50/50 rounded-lg p-4 space-y-4">
                  <h4 class="text-sm font-medium text-gray-500">
                    Payment Information
                  </h4>
                  <div class="space-y-3">
                    <!-- Base Price -->
                    <div class="flex justify-between items-center py-2">
                      <div>
                        <span class="text-sm text-gray-600">Theme Package</span>
                        <p class="text-xs text-gray-500">
                          {{
                            selectedBooking.theme_title || "Standard Session"
                          }}
                        </p>
                      </div>
                      <span class="text-sm font-medium text-gray-900">
                        RM {{ formatNumber(selectedBooking.theme_price) }}
                      </span>
                    </div>

                    <!-- Addons -->
                    <template
                      v-if="
                        selectedBooking.addons &&
                        selectedBooking.addons.length > 0
                      "
                    >
                      <div
                        v-for="(addon, index) in selectedBooking.addons"
                        :key="index"
                        class="flex justify-between items-center py-2"
                      >
                        <div>
                          <span class="text-sm text-gray-600">{{
                            addon.title
                          }}</span>
                          <p class="text-xs text-gray-500">
                            {{ addon.qty }} x RM {{ formatNumber(addon.price) }}
                          </p>
                        </div>
                        <span class="text-sm font-medium text-gray-900">
                          RM {{ formatNumber(addon.price * addon.qty) }}
                        </span>
                      </div>
                    </template>

                    <!-- Subtotal -->
                    <div
                      class="flex justify-between items-center py-2 border-t border-gray-200"
                    >
                      <span class="text-sm text-gray-600">Subtotal</span>
                      <span class="text-sm font-medium text-gray-900">
                        RM {{ formatNumber(selectedBooking.payment_total) }}
                      </span>
                    </div>

                    <!-- Payment Type -->
                    <div class="flex justify-between items-center py-2">
                      <span class="text-sm text-gray-600">Payment Type</span>
                      <span
                        :class="{
                          'px-2 py-1 text-xs font-medium rounded-full': true,
                          'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                            selectedBooking.payment_type === 1,
                          'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                            selectedBooking.payment_type === 2,
                        }"
                      >
                        {{
                          selectedBooking.payment_type === 1
                            ? "Full Payment"
                            : "Deposit"
                        }}
                      </span>
                    </div>

                    <!-- Payment Status -->
                    <div class="flex justify-between items-center py-2">
                      <span class="text-sm text-gray-600">Payment Status</span>
                      <span
                        :class="{
                          'px-2 py-1 text-xs font-medium rounded-full': true,
                          'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                            selectedBooking.status === 1,
                          'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                            selectedBooking.status === 2,
                          'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                            selectedBooking.status === 3,
                          'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                            selectedBooking.status === 4,
                        }"
                      >
                        {{ getPaymentStatusLabel(selectedBooking.status) }}
                      </span>
                    </div>

                    <!-- Payment Amount -->
                    <div class="flex justify-between items-center py-2">
                      <span class="text-sm text-gray-600">Payment Amount</span>
                      <span class="text-sm font-medium text-gray-900">
                        RM {{ formatNumber(selectedBooking.payment_amount) }}
                      </span>
                    </div>

                    <!-- Total -->
                    <div
                      class="flex justify-between items-center py-2 border-t border-gray-200"
                    >
                      <span class="text-sm font-medium text-gray-900"
                        >Total Amount</span
                      >
                      <span class="text-base font-bold text-gray-900">
                        RM {{ formatNumber(selectedBooking.payment_total) }}
                      </span>
                    </div>

                    <!-- Payment History -->
                    <div class="mt-4 space-y-3">
                      <h5 class="text-sm font-medium text-gray-700">
                        Payment History
                      </h5>
                      <div
                        v-for="(
                          payment, index
                        ) in selectedBooking.payment_history"
                        :key="index"
                        class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div class="space-y-1">
                          <div class="text-sm text-gray-900">
                            {{ formatDate(payment.date) }}
                            {{ formatTime(payment.time) }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{
                              payment.type === 1
                                ? "Full Payment"
                                : payment.type === 2
                                ? "Deposit"
                                : "Balance"
                            }}
                          </div>
                        </div>
                        <span class="text-sm font-medium text-green-600">
                          RM {{ formatNumber(payment.amount) }}
                        </span>
                      </div>
                    </div>

                    <!-- Balance -->
                    <div
                      v-if="selectedBooking.payment_type === 2"
                      class="flex justify-between items-center py-2 bg-amber-50/50 rounded-lg px-3"
                    >
                      <span class="text-sm font-medium text-amber-900"
                        >Remaining Balance</span
                      >
                      <span class="text-sm font-medium text-amber-900">
                        RM
                        {{
                          formatNumber(
                            selectedBooking.payment_total -
                              (selectedBooking.payment_amount || 0)
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="text-xs text-gray-500 space-y-2">
                  <p>Terms and Conditions:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>
                      This receipt is computer generated and no signature is
                      required.
                    </li>
                    <li>All payments are non-refundable.</li>
                    <li>
                      Rescheduling must be done at least 24 hours before the
                      session.
                    </li>
                    <li>
                      Frame delivery will be processed after full payment is
                      received.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end gap-4 flex-shrink-0"
            >
              <button
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                @click="receiptModalVisible = false"
              >
                Close
              </button>
              <button
                class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                @click="downloadReceipt"
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Page Meta
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

// Types
interface AddonDetail {
  id?: number;
  title?: string;
  qty: number;
  price: number;
}

interface Addon {
  id: number;
  qty?: number;
  price?: number;
}

interface BookingResponse {
  addons: AddonDetail[];
  frame_quantity: number;
  addon: Addon[] | null;
  id: number;
  user_fullname: string;
  user_email: string;
  user_phoneno: string;
  session_date: string;
  session_time: string;
  status: number;
  session_status: number;
  frame_status: number;
  payment_total: number;
  payment_type: number;
  amount_paid: number;
  payment_history: Array<{
    amount: number;
    date: string;
    time: string;
    type: number;
  }>;
}

interface Booking extends Omit<BookingResponse, "addon"> {
  [key: string]: any;
}

interface TimeSlot {
  slot: string;
  value: string;
}

interface SlotsResponse {
  data: TimeSlot[];
  status: string;
}

const { $apiFetch } = useNuxtApp();

// State
const loading = ref(false);
const bookings = ref<Booking[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const moreActionsVisible = ref(false);
const selectedBooking = ref<Booking | null>(null);
const rescheduleDate = ref("");
const rescheduleTime = ref("");
const isRescheduling = ref(false);
const rescheduleModalVisible = ref(false);
const loadingSlots = ref(false);
const availableTimeSlots = ref<TimeSlot[]>([]);
const selectedTimeSlot = ref<TimeSlot | null>(null);
const receiptModalVisible = ref(false);

const filters = ref({
  paymentStatus: null as number | null,
  sessionStatus: null as number | null,
  startDate: "",
  endDate: "",
});

const sortBy = ref({
  prop: "id",
  order: "descending",
});

// Options
const paymentStatusOptions = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Partial" },
  { value: 3, label: "Paid" },
] as const;

const sessionStatusOptions = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Cancelled" },
] as const;

const frameStatusOptions = [
  { value: 1, label: "Unprinted" },
  { value: 2, label: "Printed" },
  { value: 3, label: "Delivered" },
] as const;

// Computed
const stats = computed(() => {
  return {
    confirmed: bookings.value.filter((b) => b.status === 3).length,
    partiallyPaid: bookings.value.filter((b) => b.status === 2).length,
    totalFrames: bookings.value.reduce(
      (acc: number, b) => acc + (b.frame_quantity || 0),
      0
    ),
    totalSales: bookings.value.reduce(
      (acc: number, b) => acc + (b.payment_total || 0),
      0
    ),
  };
});

const filteredBookings = computed(() => {
  let result = [...bookings.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (booking) =>
        booking.user_fullname.toLowerCase().includes(query) ||
        booking.user_email.toLowerCase().includes(query) ||
        booking.user_phoneno.includes(query)
    );
  }

  // Date range filter
  if (filters.value.startDate) {
    result = result.filter(
      (booking) => booking.session_date >= filters.value.startDate
    );
  }
  if (filters.value.endDate) {
    result = result.filter(
      (booking) => booking.session_date <= filters.value.endDate
    );
  }

  // Status filters
  if (filters.value.paymentStatus !== null) {
    result = result.filter(
      (booking) => booking.status === filters.value.paymentStatus
    );
  }
  if (filters.value.sessionStatus !== null) {
    result = result.filter(
      (booking) => booking.session_status === filters.value.sessionStatus
    );
  }

  // Sorting
  if (sortBy.value.prop) {
    result.sort((a, b) => {
      const aVal = a[sortBy.value.prop];
      const bVal = b[sortBy.value.prop];
      if (sortBy.value.order === "ascending") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  return result;
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBookings.value.slice(start, end);
});

// Methods
function formatNumber(value: number) {
  return value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: string) {
  return dayjs(date).format("DD MMM YYYY");
}

function formatTime(time: string) {
  return dayjs(`2000-01-01 ${time}`).format("hh:mm A");
}

function getPaymentStatusType(status: number) {
  const types: Record<number, string> = {
    1: "warning",
    2: "info",
    3: "success",
    4: "danger",
  };
  return types[status] || "info";
}

function getPaymentStatusLabel(status: number) {
  return (
    paymentStatusOptions.find((opt) => opt.value === status)?.label || "Unknown"
  );
}

function getSessionStatusType(status: number) {
  const types: Record<number, string> = {
    1: "warning",
    2: "success",
    3: "danger",
  };
  return types[status] || "info";
}

function getSessionStatusLabel(status: number) {
  return (
    sessionStatusOptions.find((opt) => opt.value === status)?.label || "Unknown"
  );
}

function getFrameStatusType(status: number) {
  return (
    frameStatusOptions.find((opt) => opt.value === status)?.label || "info"
  );
}

function getFrameStatusLabel(status: number) {
  return frameStatusOptions.find((opt) => opt.value === status)?.label || "-";
}

function handleSearch() {
  currentPage.value = 1;
}

function handleFiltersChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  currentPage.value = 1;
}

function handleSortChange({ prop, order }: { prop: string; order: string }) {
  sortBy.value = { prop, order };
}

function handleSizeChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value);
  pageSize.value = value;
  currentPage.value = 1;
}

function handleCurrentChange(val: number) {
  currentPage.value = val;
}

function handleMoreAction(booking: Booking) {
  selectedBooking.value = { ...booking };
  isRescheduling.value = false;
  moreActionsVisible.value = true;
  rescheduleDate.value = dayjs(booking.session_date).format("YYYY-MM-DD");
  rescheduleTime.value = "";
}

function showAlert(
  message: string,
  type: "success" | "error" | "info" = "info"
) {
  alert(message);
}

function handleReceiptAction(booking: Booking) {
  selectedBooking.value = { ...booking };
  receiptModalVisible.value = true;
}

async function updatePaymentStatus(
  event: Event,
  bookingId: number,
  status: number
) {
  try {
    await $fetch("/api/booking/update-payment-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });

    // showAlert("Payment status updated successfully", "success");
    await fetchBookings();
  } catch (error) {
    console.error("Error updating payment status:", error);
    showAlert("Failed to update payment status", "error");
  }

  // Hide dropdown
  const target = event.target as HTMLElement;
  target
    .closest(".relative")
    ?.querySelector(".hidden")
    ?.classList.add("hidden");
}

async function updateSessionStatus(
  event: Event,
  bookingId: number,
  status: number
) {
  try {
    await $fetch("/api/booking/update-session-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });

    // showAlert("Session status updated successfully", "success");
    await fetchBookings();
  } catch (error) {
    console.error("Error updating session status:", error);
    showAlert("Failed to update session status", "error");
  }

  // Hide dropdown
  const target = event.target as HTMLElement;
  target
    .closest(".relative")
    ?.querySelector(".hidden")
    ?.classList.add("hidden");
}

function disablePastDates(date: Date) {
  return date < dayjs().startOf("day").toDate();
}

function exportToCSV() {
  const headers = [
    "No",
    "Customer Name",
    "Email",
    "Phone",
    "Session Date",
    "Session Time",
    "Payment Status",
    "Session Status",
    "Frame Status",
    "Total Payment",
  ];

  const csvContent = [
    headers.join(","),
    ...filteredBookings.value.map((booking) =>
      [
        booking.id,
        `"${booking.user_fullname}"`,
        `"${booking.user_email}"`,
        `"${booking.user_phoneno}"`,
        booking.session_date,
        booking.session_time,
        getPaymentStatusLabel(booking.status),
        getSessionStatusLabel(booking.session_status),
        getFrameStatusLabel(booking.frame_status),
        booking.payment_total,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `bookings_${dayjs().format("YYYY-MM-DD")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Data fetching
async function fetchBookings() {
  loading.value = true;
  try {
    // const { data } = await useFetch<BookingResponse[]>(
    //   "/api/booking/get-bookings"
    // );

    const response = (await $apiFetch(
      "/api/booking/get-bookings"
    )) as BookingResponse[];

    console.log("Response Bookings", response);
    if (response) {
      bookings.value = response.map((booking) => ({
        ...booking,
        frame_quantity: booking.frame_quantity || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    showAlert("Failed to fetch bookings", "error");
  } finally {
    loading.value = false;
  }
}

// Initial fetch
onMounted(() => {
  fetchBookings();

  document.addEventListener("click", (event) => {
    const dropdowns = document.querySelectorAll(".relative > div:not(.hidden)");
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target as Node)) {
        dropdown.classList.add("hidden");
      }
    });
  });
});

async function updateFrameStatus(
  event: Event,
  bookingId: number,
  status: number
) {
  try {
    await $fetch("/api/booking/update-frame-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });

    // showAlert("Frame status updated successfully", "success");
    await fetchBookings();
  } catch (error) {
    console.error("Error updating frame status:", error);
    showAlert("Failed to update frame status", "error");
  }

  // Hide dropdown
  const target = event.target as HTMLElement;
  target
    .closest(".relative")
    ?.querySelector(".hidden")
    ?.classList.add("hidden");
}

function resetFilters() {
  searchQuery.value = "";
  filters.value.paymentStatus = null;
  filters.value.sessionStatus = null;
  filters.value.startDate = "";
  filters.value.endDate = "";
  currentPage.value = 1;
}

async function handleCancelBooking() {
  if (!selectedBooking.value) return;

  try {
    // Update session status to cancelled (3)
    await $fetch("/api/booking/update-session-status", {
      method: "POST",
      body: {
        bookingId: selectedBooking.value.id,
        status: 3, // Cancelled status
      },
    });

    showAlert("Booking cancelled successfully", "success");
    moreActionsVisible.value = false;
    await fetchBookings();
  } catch (error) {
    console.error("Error cancelling booking:", error);
    showAlert("Failed to cancel booking", "error");
  }
}

function calculateAddonsTotal(addons: AddonDetail[]): number {
  if (!addons || addons.length === 0) return 0;
  return addons.reduce((total, addon) => total + addon.price * addon.qty, 0);
}

async function handleNotifyCustomer() {
  if (!selectedBooking.value) return;

  try {
    // Implement your notify customer logic here
    showAlert("Notify customer functionality coming soon");
  } catch (error) {
    console.error("Error notifying customer:", error);
    showAlert("Failed to notify customer", "error");
  }
}

function openRescheduleModal() {
  rescheduleModalVisible.value = true;
  if (selectedBooking.value?.session_date) {
    rescheduleDate.value = dayjs(selectedBooking.value.session_date).format(
      "YYYY-MM-DD"
    );
  }
  selectedTimeSlot.value = null;
  availableTimeSlots.value = [];
  if (rescheduleDate.value) {
    handleDateChange();
  }
}

async function handleDateChange() {
  if (!rescheduleDate.value || !selectedBooking.value) return;

  loadingSlots.value = true;
  selectedTimeSlot.value = null;

  try {
    const response = await $fetch<SlotsResponse>(
      "/api/booking/get-available-slots",
      {
        method: "GET",
        params: {
          theme_id: selectedBooking.value.theme,
          date: rescheduleDate.value,
        },
      }
    );

    availableTimeSlots.value = response.data;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    showAlert("Failed to fetch available time slots", "error");
  } finally {
    loadingSlots.value = false;
  }
}

async function confirmReschedule() {
  if (
    !selectedBooking.value ||
    !rescheduleDate.value ||
    !selectedTimeSlot.value
  )
    return;

  try {
    await $fetch("/api/booking/reschedule", {
      method: "POST",
      body: {
        bookingId: selectedBooking.value.id,
        session_date: rescheduleDate.value,
        session_time: selectedTimeSlot.value.value,
      },
    });

    showAlert("Session rescheduled successfully", "success");
    rescheduleModalVisible.value = false;
    moreActionsVisible.value = false;
    await fetchBookings();
  } catch (error) {
    console.error("Error rescheduling session:", error);
    showAlert("Failed to reschedule session", "error");
  }
}

function handleRescheduleClick() {
  openRescheduleModal();
}

async function downloadReceipt() {
  if (!selectedBooking.value) return;

  try {
    // Get the receipt content element
    const receiptElement = document.querySelector(
      ".receipt-content"
    ) as HTMLElement;
    if (!receiptElement) {
      throw new Error("Receipt content element not found");
    }

    // Create a clone of the element to modify for PDF
    const clonedElement = receiptElement.cloneNode(true) as HTMLElement;

    // Temporarily append to document with fixed width for better rendering
    clonedElement.style.width = "800px";
    clonedElement.style.padding = "40px";
    clonedElement.style.background = "white";
    document.body.appendChild(clonedElement);

    // Generate canvas from the element
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Remove the cloned element
    document.body.removeChild(clonedElement);

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    // Add the canvas as image
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    // Generate filename
    const filename = `receipt_${selectedBooking.value.id
      .toString()
      .padStart(6, "0")}_${dayjs().format("YYYYMMDD")}.pdf`;

    // Download the PDF
    pdf.save(filename);

    showAlert("Receipt downloaded successfully");
  } catch (error) {
    console.error("Error generating receipt:", error);
    showAlert("Failed to download receipt");
  }
}
</script>

<style lang="scss" scoped></style>
