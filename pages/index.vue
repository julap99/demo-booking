<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

const currentImageIndex = ref(0);
const router = useRouter();

const images = [
  "https://www.whiteroomstudio.com.sg/wordpress/wp-content/uploads/2023/03/Family-Portrait-Hari-Raya-Photoshoot-Singapore-4-scaled.jpg",
  "https://images.unsplash.com/photo-1620795541878-62d9eaf5b56c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual Hari Raya themed images
  "https://adstudioshahalam.com/wp-content/uploads/2023/02/studio-children-baby-photo-shah-alam-26-scaled.jpg",
];

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
}

function prevImage() {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? images.length - 1
      : currentImageIndex.value - 1;
}

function navigateToBooking() {
  navigateTo("/book-a-session/test2");
}

function navigateToAdminLogin() {
  navigateTo("/login");
}

onMounted(() => {
  // Auto-advance slideshow
  setInterval(nextImage, 5000);
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8F7F2]">
    <!-- Decorative Pattern -->
    <div
      class="absolute inset-0 pattern-islamic opacity-[0.02] pointer-events-none"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 relative">
      <!-- Hero Section -->
      <div class="relative h-screen flex items-center">
        <!-- Image Slider -->
        <div class="absolute inset-0 overflow-hidden">
          <transition-group name="fade">
            <div
              v-for="(image, index) in images"
              :key="image"
              v-show="currentImageIndex === index"
              class="absolute inset-0"
            >
              <img
                :src="image"
                :alt="'Studio Photo ' + (index + 1)"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 to-transparent"
              ></div>
            </div>
          </transition-group>

          <!-- Navigation Arrows -->
          <button
            @click="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <!-- Content -->
        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-2xl">
            <!-- Decorative Element -->
            <div class="flex items-center gap-4 mb-8">
              <div class="h-[2px] w-12 bg-[#C3A455]"></div>
              <span class="text-[#C3A455] tracking-wider text-sm font-medium"
                >HARI RAYA 2024</span
              >
            </div>

            <h1
              class="font-serif text-6xl sm:text-7xl font-bold text-white leading-none mb-6"
            >
              <span class="block mb-2">Capture Your</span>
              <span class="block text-[#C3A455]">Raya Moments</span>
            </h1>

            <p class="text-xl text-gray-300 mb-12 max-w-xl">
              Create timeless memories with our professional Hari Raya studio
              photography. Elegant setups, traditional touches, and modern
              aesthetics for your perfect family portraits.
            </p>

            <div class="flex flex-col sm:flex-row gap-6 items-start">
              <button
                @click="navigateToBooking"
                class="group relative px-8 py-4 bg-[#C3A455] text-white rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <span
                  class="relative z-10 flex items-center gap-2 text-lg font-medium"
                >
                  Book Your Session
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div
                  class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"
                ></div>
              </button>

              <!-- Package Preview -->
              <div
                class="flex gap-4 items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
              >
                <div class="text-white">
                  <p class="text-sm font-medium text-[#C3A455]">
                    Special Raya Package
                  </p>
                  <p class="text-2xl font-bold">RM 299</p>
                </div>
                <div class="h-12 w-[1px] bg-white/20"></div>
                <div class="text-white text-sm">
                  <p>✓ 1 Hour Session</p>
                  <p>✓ 10 Digital Photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <!-- <div class="relative bg-white py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F8F7F2] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#C3A455]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Professional Setup</h3>
              <p class="text-gray-600">State-of-the-art studio with traditional and modern backdrops</p>
            </div>


            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F8F7F2] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#C3A455]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Quick Turnaround</h3>
              <p class="text-gray-600">Get your edited photos within 48 hours</p>
            </div>


            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F8F7F2] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#C3A455]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Satisfaction Guaranteed</h3>
              <p class="text-gray-600">Love your photos or get a free reshoot</p>
            </div>
          </div>
        </div>
      </div> -->
    </main>

    <!-- Admin Login Link -->
    <div class="fixed bottom-8 right-8">
      <button
        @click="navigateToAdminLogin"
        class="group px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 text-sm flex items-center gap-2 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 group-hover:rotate-12 transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        Admin Login
      </button>
    </div>
  </div>
</template>

<style scoped>
.pattern-islamic {
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C3A455' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@font-face {
  font-family: "Raya";
  src: url("/fonts/your-special-font.woff2") format("woff2");
}
</style>
