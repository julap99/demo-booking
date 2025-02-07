<template>
  <div
    class="min-h-screen font-sans flex items-center justify-center bg-gradient-radial from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] py-6"
  >
    <div class="w-full max-w-2xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-pulse space-y-3">
          <div class="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div class="space-y-2 mt-4">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div class="">
          <div class="flex justify-center items-center">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-red-500"
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
            </div>
          </div>
          <h2
            class="text-lg font-bold text-[var(--color-text-primary)] mt-6 mb-2"
          >
            Error Loading Receipt
          </h2>
          <p class="text-[var(--color-text-primary)]/70 mb-4">{{ error }}</p>
          <NuxtLink
            to="/book-a-session/test2"
            class="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-medium hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary)] transition-all duration-300"
          >
            Return to Booking
          </NuxtLink>
        </div>
      </div>

      <!-- Receipt Card -->
      <div
        v-else-if="bookingData"
        class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
      >
        <!-- Decorative Elements -->
        <div
          class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary-dark)]"
        ></div>
        <div
          class="absolute top-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary-light)]/20 to-[var(--color-primary-dark)]/20 blur-sm"
        ></div>

        <!-- Receipt Content -->
        <div class="p-5 sm:p-8" ref="receiptContent">
          <!-- Header with Animated Success Icon -->
          <div class="text-center mb-8">
            <div class="mb-6 relative">
              <div
                class="w-20 h-20 mx-auto bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]"
              >
                <svg
                  class="w-10 h-10 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    class="animate-[dash_1.5s_ease-in-out_forwards]"
                    style="stroke-dasharray: 100; stroke-dashoffset: 100"
                  />
                </svg>
              </div>
              <div
                class="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
              >
                <div
                  class="px-3 py-0.5 bg-[var(--color-primary)]/10 rounded-full"
                >
                  <span class="text-xs font-medium text-[var(--color-primary)]">
                    Payment Successful
                  </span>
                </div>
              </div>
            </div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-playfair mb-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent"
            >
              Booking Confirmation
            </h1>
            <div class="space-y-0.5">
              <p class="text-[var(--color-text-primary)]/70 text-base">
                Receipt #{{ bookingData?.payment_ref_number || "N/A" }}
              </p>
              <p class="text-[var(--color-text-primary)]/70 text-sm">
                {{ formatDatetime(bookingData?.created_date) }}
              </p>
            </div>
          </div>

          <!-- Customer & Session Details in Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <h3
                class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2 text-[var(--color-primary)]"
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
              <div class="space-y-2">
                <p
                  class="text-base font-medium text-[var(--color-text-primary)] capitalize"
                >
                  {{ bookingData?.user_fullname || "N/A" }}
                </p>
                <div
                  class="flex items-center text-[var(--color-text-primary)]/70 text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
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
                </div>
                <div
                  class="flex items-center text-[var(--color-text-primary)]/70 text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
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
                </div>
              </div>
            </div>

            <div
              class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <h3
                class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2 text-[var(--color-primary)]"
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
                Session Details
              </h3>
              <div class="space-y-2">
                <p
                  class="text-base font-medium text-[var(--color-text-primary)]"
                >
                  {{ formatDate(bookingData?.session_date) }}
                </p>
                <p
                  class="text-[var(--color-text-primary)]/70 flex items-center text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
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
                  {{ formatTime(bookingData?.session_time) || "N/A" }}
                </p>
                <p class="text-[var(--color-text-primary)]/70 text-sm">
                  {{ bookingData?.title }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div
            class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl mb-6"
          >
            <h3
              class="text-sm font-medium text-[var(--color-text-primary)] mb-4 font-playfair"
            >
              Payment Summary
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-1">
                <span class="text-[var(--color-text-primary)]/70 text-sm"
                  >Package Price</span
                >
                <span
                  class="text-base font-medium text-[var(--color-text-primary)]"
                >
                  {{ formatPrice(bookingData?.price || 0) }}
                </span>
              </div>

              <div
                v-if="bookingData?.payment_extra_pax"
                class="flex justify-between items-center py-1"
              >
                <span class="text-[var(--color-text-primary)]/70 text-sm">
                  Extra Person ({{ bookingData?.number_of_extra_pax }} pax)
                </span>
                <span
                  class="text-base font-medium text-[var(--color-text-primary)]"
                >
                  {{ formatPrice(bookingData?.payment_extra_pax || 0) }}
                </span>
              </div>

              <div
                v-if="bookingData?.addons?.length"
                class="flex flex-col space-y-2 py-1"
              >
                <div class="flex justify-between items-center">
                  <span class="text-[var(--color-text-primary)]/70 text-sm"
                    >Addon Charges</span
                  >
                  <span
                    class="text-base font-medium text-[var(--color-text-primary)]"
                  >
                    {{ formatPrice(bookingData?.payment_addon_total || 0) }}
                  </span>
                </div>
                <!-- Addon Details -->
                <div class="pl-2 border-l-2 border-[var(--color-primary)]/20">
                  <div
                    v-for="(addon, index) in bookingData.addons"
                    :key="index"
                    class="text-sm space-y-0.5"
                  >
                    <div class="flex justify-between items-center">
                      <span class="text-[var(--color-text-primary)]/90 font-medium">{{ addon.name }}</span>
                      <span class="text-[var(--color-text-primary)]/70">{{ formatPrice(addon.price || 0) }}</span>
                    </div>
                    <p class="text-[var(--color-text-primary)]/60 text-xs">
                      {{ addon.desc }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="border-t border-dashed border-[var(--color-border-primary)] pt-3 mt-2"
              >
                <div class="flex justify-between items-center">
                  <span
                    class="text-base font-medium text-[var(--color-text-primary)]"
                    >Total Amount</span
                  >
                  <span
                    class="text-lg font-semibold text-[var(--color-primary)]"
                  >
                    {{ formatPrice(bookingData?.payment_amount) }}
                  </span>
                </div>
              </div>

              <div
                v-if="bookingData?.payment_type == 2"
                class="bg-[var(--color-primary)]/5 p-3 rounded-lg mt-3"
              >
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[var(--color-text-primary)] text-sm"
                    >Deposit Paid</span
                  >
                  <span
                    class="text-base font-medium text-[var(--color-primary)]"
                  >
                    {{ formatPrice(bookingData?.payment_amount || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[var(--color-text-primary)] text-sm"
                    >Balance Due</span
                  >
                  <span
                    class="text-base font-medium text-[var(--color-text-primary)]"
                  >
                    {{
                      formatPrice(
                        bookingData?.payment_total - bookingData?.payment_amount
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div
            class="space-y-3 text-xs text-[var(--color-text-primary)]/70 bg-[var(--color-bg-light)]/30 p-4 rounded-xl"
          >
            <div
              v-if="bookingData?.payment_type == 2"
              class="flex justify-center items-start space-x-2"
            >
              <svg
                class="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
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
              <p>Balance payment is due on the day of the session.</p>
            </div>
            <div class="flex justify-center items-start space-x-2">
              <svg
                class="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
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
              <p class="text-center">
                Please keep this receipt for your records.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[var(--color-border-primary)] p-4 sm:p-6 bg-[var(--color-bg-light)]/50 backdrop-blur flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <NuxtLink
            to="/"
            class="w-full sm:w-auto px-5 py-2 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-center"
          >
            <span class="flex items-center justify-center">
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
            </span>
          </NuxtLink>

          <button
            @click="downloadReceipt"
            class="w-full sm:w-auto px-5 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-medium hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          >
            <span class="flex items-center justify-center">
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
            </span>
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
  middleware: "auth",
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

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  
  // Split the time string into hours and minutes
  const [hours, minutes] = timeString.split(':');
  
  // Convert hours to number for 12-hour format calculation
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // If hour is 0, make it 12
  
  // Return formatted time
  return `${hour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
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
    (bookingData.value.price || 0) +
    (bookingData.value.payment_extra_pax || 0) +
    (bookingData.value.payment_addon_total || 0)
  );
});

const calculateBalanceDue = computed(() => {
  if (!bookingData.value) return 0;
  return calculateTotal.value - (bookingData.value.theme_deposit || 0);
});
</script>

<style>
/* Component specific styles */
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

.bg-gradient-radial {
  background: radial-gradient(
    circle at center,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-via) 50%,
    var(--tw-gradient-to) 100%
  );
}

@media print {
  .btn,
  button {
    display: none !important;
  }

  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
