<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#F5E6E0] via-[#E6CCB2] to-[#DDB892] py-12"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Receipt Card -->
      <div
        class="bg-white rounded-[32px] shadow-xl shadow-[#3C2A21]/10 overflow-hidden"
      >
        <!-- Receipt Content -->
        <div class="p-8" ref="receiptContent">
          <!-- Header -->
          <div class="text-center mb-12">
            <h1 class="text-3xl font-bold text-[#3C2A21] font-playfair mb-2">
              Booking Confirmation
            </h1>
            <p class="text-[#3C2A21]/70 text-lg">
              Receipt #{{ receiptNumber }}
            </p>
            <div class="flex justify-center mt-6">
              <div
                class="px-6 py-3 bg-green-50 text-green-600 rounded-lg text-base font-medium"
              >
                Payment Successful
              </div>
            </div>
          </div>

          <!-- Customer Details -->
          <div class="mb-12">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h3
                  class="text-base font-medium text-[#3C2A21]/70 mb-4 font-playfair"
                >
                  Customer Details
                </h3>
                <p class="text-lg text-[#3C2A21] mb-2">
                  {{ bookingData.name }}
                </p>
                <p class="text-[#3C2A21]">{{ bookingData.email }}</p>
                <p class="text-[#3C2A21]">{{ bookingData.phone }}</p>
              </div>
              <div class="text-right">
                <h3
                  class="text-base font-medium text-[#3C2A21]/70 mb-4 font-playfair"
                >
                  Booking Date
                </h3>
                <p class="text-lg text-[#3C2A21] mb-2">
                  {{ formatDate(bookingData.date) }}
                </p>
                <p class="text-[#3C2A21]">{{ bookingData.timeSlot }}</p>
              </div>
            </div>
          </div>

          <!-- Session Details -->
          <div class="border-t border-[#3C2A21]/10 pt-8 mb-12">
            <h3
              class="text-base font-medium text-[#3C2A21]/70 mb-6 font-playfair"
            >
              Session Details
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-lg text-[#3C2A21]">{{
                  bookingData.sessionType === "wedding"
                    ? "Wedding Photography"
                    : "Event Photography"
                }}</span>
                <span class="text-lg text-[#3C2A21]">{{ sessionPrice }}</span>
              </div>
              <div class="flex justify-between items-center text-[#3C2A21]">
                <span>Location</span>
                <span>{{ bookingData.location }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="border-t border-[#3C2A21]/10 pt-8">
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-[#3C2A21]/70">Total Package Price</span>
                <span class="text-lg text-[#3C2A21]">{{ sessionPrice }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-[#3C2A21]"
                  >Deposit Paid</span
                >
                <span class="text-xl font-semibold text-[#3C2A21]">{{
                  depositAmount
                }}</span>
              </div>
              <div
                class="flex justify-between items-center pt-4 border-t border-dashed border-[#3C2A21]/10"
              >
                <span class="text-[#3C2A21]/70">Balance Due</span>
                <span class="text-lg text-[#3C2A21]">{{
                  formatPrice(balanceAmount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-12 space-y-2 text-sm text-[#3C2A21]/70">
            <p>* Balance payment is due on the day of the session</p>
            <p>* Please keep this receipt for your records</p>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[#3C2A21]/10 px-8 py-6 bg-[#F5E6E0] flex justify-between items-center"
        >
          <NuxtLink to="/" class="btn btn-secondary">
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
            class="flex items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#3C2A21] to-[#5C4033] hover:from-[#5C4033] hover:to-[#7B5544] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3C2A21] transition-all duration-200 transform hover:scale-[1.02]"
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

// Add ref for html2pdf instance
const html2pdf = ref(null);
const receiptContent = ref(null);

// Load html2pdf only on client side
onMounted(async () => {
  try {
    html2pdf.value = (await import("html2pdf.js")).default;

    // If no booking data is available, redirect to booking page
    if (!route.query.booking) {
      router.push("/book-a-session");
    }
  } catch (error) {
    console.error("Failed to load html2pdf:", error);
  }
});

// Get booking data from route query
const bookingData = computed(() => {
  try {
    return JSON.parse(decodeURIComponent(route.query.booking || "{}"));
  } catch (error) {
    console.error("Failed to parse booking data:", error);
    return {};
  }
});

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

// Computed values
const sessionType = computed(() =>
  sessionTypes.find((type) => type.value === bookingData.value.sessionType)
);

const sessionPrice = computed(() => formatPrice(sessionType.value?.price || 0));

const depositAmount = computed(() =>
  formatPrice(sessionType.value?.deposit || 0)
);

const balanceAmount = computed(
  () => (sessionType.value?.price || 0) - (sessionType.value?.deposit || 0)
);

// Helper functions
const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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

  html2pdf.value().set(opt).from(element).save();
};
</script>

<style scoped>
.btn {
  @apply inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply text-white bg-[#3C2A21] hover:bg-[#5C4033] focus:ring-[#3C2A21];
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply text-[#3C2A21] bg-white border border-[#3C2A21]/20 hover:bg-[#F5E6E0] focus:ring-[#3C2A21];
}
</style>
