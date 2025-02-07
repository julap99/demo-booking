<template>
  <div
    class="min-h-screen font-sans flex items-center justify-center"
    :style="{
      background: `linear-gradient(to bottom right, var(--color-bg-primary), var(--color-bg-secondary), var(--color-bg-tertiary))`,
    }"
  >
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-[20px] p-8 text-center">
        <svg
          class="w-16 h-16 mx-auto mb-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          Error Loading Receipt
        </h2>
        <p class="text-[var(--color-text-primary)]/70 mb-6">{{ error }}</p>
        <NuxtLink to="/book-a-session" class="btn btn-primary">
          Return to Booking
        </NuxtLink>
      </div>

      <!-- Receipt Card -->
      <div
        v-else-if="bookingData"
        class="bg-white rounded-[20px] sm:rounded-[32px] shadow-xl shadow-[var(--color-border-primary)] overflow-hidden relative"
      >
        <!-- Decorative Elements -->
        <div
          class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
        ></div>
        <!-- <div class="absolute top-2 right-4 text-xs text-[var(--color-text-primary)]/50">
          {{ new Date().toLocaleDateString() }}
        </div> -->

        <!-- Receipt Content -->
        <div class="p-4 sm:p-8" ref="receiptContent">
          <!-- Header -->
          <div class="text-center mb-8 sm:mb-12">
            <div class="mb-6">
              <svg
                class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1
                class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-playfair mb-2"
              >
                Booking Confirmation
              </h1>
              <p
                class="text-[var(--color-text-primary)]/70 text-base sm:text-lg font-medium"
              >
                Receipt #{{ bookingData?.payment_ref_number || "N/A" }}
              </p>
              <p
                class="text-[var(--color-text-primary)]/70 text-base sm:text-lg font-medium"
              >
                Payment Date: {{ formatDatetime(bookingData?.created_date) }}
              </p>
            </div>
            <div class="flex justify-center">
              <div
                class="px-4 sm:px-6 py-2 sm:py-3 bg-[var(--color-bg-light)] text-[var(--color-text-primary)] rounded-lg text-sm sm:text-base font-medium inline-flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Payment Successful
              </div>
            </div>
          </div>

          <!-- Customer Details -->
          <div class="mb-8 sm:mb-12">
            <div class="grid grid-cols-1 gap-6 sm:gap-8">
              <div class="bg-[var(--color-bg-light)] p-4 rounded-xl">
                <h3
                  class="text-sm sm:text-base font-medium text-[var(--color-text-primary)]/70 mb-3 font-playfair flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Details
                </h3>
                <p
                  class="text-base sm:text-lg text-[var(--color-text-primary)] mb-2 font-medium capitalize"
                >
                  {{ bookingData?.user_fullname || "N/A" }}
                </p>
                <p
                  class="text-sm sm:text-base text-[var(--color-text-primary)] mb-1 flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-[var(--color-text-primary)]/70"
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
                  {{ bookingData?.user_email || "N/A" }}
                </p>
                <p
                  class="text-sm sm:text-base text-[var(--color-text-primary)] flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-[var(--color-text-primary)]/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {{ bookingData?.user_phoneno || "N/A" }}
                </p>
              </div>
              <div class="bg-[var(--color-bg-light)] p-4 rounded-xl">
                <h3
                  class="text-sm sm:text-base font-medium text-[var(--color-text-primary)]/70 mb-3 font-playfair flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Booking Date
                </h3>
                <p
                  class="text-base sm:text-lg text-[var(--color-text-primary)] mb-2 font-medium"
                >
                  {{ formatDate(bookingData?.session_date) }}
                </p>
                <p
                  class="text-sm sm:text-base text-[var(--color-text-primary)] flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-2 text-[var(--color-text-primary)]/70"
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
                  {{ bookingData?.session_time || "N/A" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Session Details -->
          <div
            class="border-t border-[var(--color-border-primary)] pt-6 sm:pt-8 mb-8 sm:mb-12"
          >
            <h3
              class="text-sm sm:text-base font-medium text-[var(--color-text-primary)]/70 mb-4 sm:mb-6 font-playfair flex items-center"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Session Details
            </h3>
            <div class="space-y-4 bg-[var(--color-bg-light)] p-4 rounded-xl">
              <div class="flex justify-between items-center">
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ bookingData.theme }}</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ formatPrice(bookingData?.theme_price || 0) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Addon Details -->
          <div
            v-if="bookingData?.addons.length > 0"
            class="border-t border-[var(--color-border-primary)] pt-6 sm:pt-8"
          >
            <div class="space-y-4 bg-[var(--color-bg-light)] p-4 rounded-xl">
              <div class="flex justify-between items-center">
                <span class="text-[var(--color-text-primary)]/70"
                  >Addon Details</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ bookingData?.addons.length }} Addons</span
                >
              </div>

              <div
                v-for="(addon, index) in bookingData?.addons"
                :key="index"
                class="flex justify-between items-center"
              >
                <span>{{ addon.name }}</span>
                <span>{{ formatPrice(addon.price) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div
            class="border-t border-[var(--color-border-primary)] pt-6 sm:pt-8"
          >
            <div class="space-y-4 bg-[var(--color-bg-light)] p-4 rounded-xl">
              <div
                class="flex justify-between items-center text-sm sm:text-base"
              >
                <span class="text-[var(--color-text-primary)]/70"
                  >Package Price</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ formatPrice(bookingData?.theme_price || 0) }}</span
                >
              </div>
              <div
                v-if="bookingData?.number_of_extra_pax"
                class="flex justify-between items-center text-sm sm:text-base"
              >
                <span class="text-[var(--color-text-primary)]/70"
                  >Extra Person Charges ({{
                    bookingData?.number_of_extra_pax
                  }}
                  pax)</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ formatPrice(bookingData?.payment_extra_pax || 0) }}</span
                >
              </div>
              <div
                v-if="bookingData?.addons.length > 0"
                class="flex justify-between items-center text-sm sm:text-base"
              >
                <span class="text-[var(--color-text-primary)]/70"
                  >Addon Charges</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{
                    formatPrice(bookingData?.payment_addon_total || 0)
                  }}</span
                >
              </div>
              <div
                class="flex justify-between items-center pt-4 border-t border-dashed border-[var(--color-border-primary)]"
              >
                <span class="text-[var(--color-text-primary)]/70"
                  >Total Amount</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ formatPrice(calculateTotal) }}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span
                  class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >Deposit Paid</span
                >
                <span
                  class="text-lg sm:text-xl font-semibold text-[var(--color-primary)]"
                  >{{ formatPrice(bookingData?.theme_deposit || 0) }}</span
                >
              </div>
              <div
                class="flex justify-between items-center pt-4 border-t border-dashed border-[var(--color-border-primary)]"
              >
                <span
                  class="text-[var(--color-text-primary)]/70 text-sm sm:text-base"
                  >Balance Due</span
                >
                <span
                  class="text-base sm:text-lg text-[var(--color-text-primary)] font-medium"
                  >{{ formatPrice(calculateBalanceDue) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div
            class="mt-8 sm:mt-12 space-y-2 text-xs sm:text-sm text-[var(--color-text-primary)]/70 bg-[var(--color-bg-light)] p-4 rounded-xl"
          >
            <div class="flex items-start space-x-2">
              <svg
                class="w-4 h-4 text-[var(--color-text-primary)]/50 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Balance payment is due on the day of the session</p>
            </div>
            <div class="flex items-start space-x-2">
              <svg
                class="w-4 h-4 text-[var(--color-text-primary)]/50 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Please keep this receipt for your records</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[var(--color-border-primary)] p-4 sm:px-8 sm:py-6 bg-[var(--color-bg-light)] flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
        >
          <NuxtLink
            to="/"
            class="w-full sm:w-auto btn btn-secondary flex justify-center items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </NuxtLink>

          <button
            @click="downloadReceipt"
            class="w-full sm:w-auto flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-light)] transition-all duration-200 transform hover:scale-[1.02]"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "empty",
});

const route = useRoute();
const router = useRouter();

// Add loading and error states
const isLoading = ref(true);
const error = ref(null);

// Add ref for html2pdf instance
const html2pdf = ref(null);
const receiptContent = ref(null);

// Load html2pdf only on client side
onMounted(async () => {
  try {
    html2pdf.value = (await import("html2pdf.js")).default;

    // If no booking data is available, redirect to booking page
    if (!route.query.booking) {
      error.value = "No booking reference found";
      isLoading.value = false;
      return;
    }

    await getReceiptDetail();
  } catch (err) {
    console.error("Failed to load html2pdf:", err);
    error.value = "Failed to initialize receipt generation";
  } finally {
    isLoading.value = false;
  }
});

// Get booking data from route query
const bookingData = ref(null);

const receiptNumber = computed(() => route.query.receipt || "");

// Session types configuration (same as in booking page)
const sessionTypes = [
  {
    value: "wedding",
    label: "Wedding Photography",
    price: 1500,
    deposit: 500,
  },
  {
    value: "event",
    label: "Event Photography",
    price: 800,
    deposit: 300,
  },
];

// Computed values with null checks
const sessionType = computed(() =>
  bookingData.value?.sessionType
    ? sessionTypes.find((type) => type.value === bookingData.value.sessionType)
    : null
);

const sessionPrice = computed(() =>
  sessionType.value ? formatPrice(sessionType.value.price) : "N/A"
);

const depositAmount = computed(() =>
  sessionType.value ? formatPrice(sessionType.value.deposit) : "N/A"
);

const balanceAmount = computed(() =>
  sessionType.value ? sessionType.value.price - sessionType.value.deposit : 0
);

// Helper functions
const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-MY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDatetime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const downloadReceipt = async () => {
  if (!html2pdf.value) {
    console.error("html2pdf not loaded");
    return;
  }

  const element = receiptContent.value;
  const opt = {
    margin: 1,
    filename: `booking-receipt-${receiptNumber.value}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf.value().set(opt).from(element).save();
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    error.value = "Failed to generate PDF receipt";
  }
};

const getReceiptDetail = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await $fetch("/api/booking/receipt-detail", {
      query: { receiptNumber: route.query.booking },
    });

    console.log("Response:", response);
    if (!response?.data) {
      throw new Error("Invalid response from server");
    }

    bookingData.value = response.data;
  } catch (err) {
    console.error("Failed to fetch receipt detail:", err);
    error.value = "Failed to load receipt details. Please try again later.";
    bookingData.value = null;
  } finally {
    isLoading.value = false;
  }
};

const calculateTotal = computed(() => {
  if (!bookingData.value) return 0;
  return (
    (bookingData.value.theme_price || 0) +
    (bookingData.value.extra_person_amount || 0) +
    (bookingData.value.addon_charges || 0)
  );
});

const calculateBalanceDue = computed(() => {
  if (!bookingData.value) return 0;
  return calculateTotal.value - (bookingData.value.theme_deposit || 0);
});
</script>

<style>
/* Component specific styles */
.btn {
  @apply inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-[var(--color-text-light)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)];
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply text-[var(--color-primary)] bg-[var(--color-bg-light)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-primary)] focus:ring-[var(--color-primary)];
}

@media print {
  .btn {
    display: none;
  }
}
</style>
