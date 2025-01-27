<script setup>
import { ref, computed } from "vue";
import { navigateTo } from "nuxt/app";

const testimonials = [
  {
    content:
      "The photos captured our wedding day perfectly. Every moment was beautifully documented, and the results exceeded our expectations.",
    author: "Sarah & James",
    role: "Wedding Clients",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content:
      "Professional, creative, and incredibly talented. The family portraits are absolutely stunning and will be cherished for generations.",
    author: "Michael Thompson",
    role: "Family Portrait Client",
    image:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    content:
      "The corporate event photography was exceptional. They captured the essence of our company culture perfectly.",
    author: "Emily Chen",
    role: "Corporate Client",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const features = [
  {
    name: "Professional Equipment",
    description:
      "Using top-of-the-line cameras and lenses to capture every detail with stunning clarity.",
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
  },
  {
    name: "Expert Editing",
    description:
      "Professional post-processing to enhance your photos while maintaining natural beauty.",
    icon: "M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z",
  },
  {
    name: "Quick Delivery",
    description: "Fast turnaround times without compromising on quality.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Online Gallery",
    description:
      "Secure online gallery to view, download, and share your photos.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

const services = [
  {
    name: "Wedding Photography",
    description: "Capturing your special day with elegance and style.",
    price: "Starting at $1,200",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Portrait Sessions",
    description: "Professional portraits that capture your personality.",
    price: "Starting at $250",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Family Photos",
    description: "Beautiful family moments frozen in time.",
    price: "Starting at $350",
    image:
      "https://images.unsplash.com/photo-1542037104857-68e6fbdc8923?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const partners = [
  {
    id: 1,
    name: "Luxe Studios",
    description:
      "Premium wedding and event photography studio specializing in luxury events.",
    logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
  {
    id: 2,
    name: "Capture Moments",
    description:
      "Leading family portrait studio with multiple locations nationwide.",
    logo: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
  {
    id: 3,
    name: "Elite Photography",
    description: "Corporate event and professional headshot specialists.",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
  {
    id: 4,
    name: "Creative Lens",
    description:
      "Award-winning creative photography for advertising and editorial.",
    logo: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
  {
    id: 5,
    name: "Nature's Best",
    description: "Specializing in outdoor and nature photography sessions.",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
  {
    id: 6,
    name: "Modern Visuals",
    description: "Contemporary photography for modern brands and individuals.",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=100&q=80",
  },
];

const currentPartnerIndex = ref(0);

const nextPartner = () => {
  const maxIndex = Math.ceil(partners.length / 3) - 1;
  currentPartnerIndex.value =
    currentPartnerIndex.value >= maxIndex ? 0 : currentPartnerIndex.value + 1;
};

const previousPartner = () => {
  const maxIndex = Math.ceil(partners.length / 3) - 1;
  currentPartnerIndex.value =
    currentPartnerIndex.value <= 0 ? maxIndex : currentPartnerIndex.value - 1;
};

// Auto-advance carousel every 5 seconds
onMounted(() => {
  setInterval(() => {
    nextPartner();
  }, 5000);
});

const navigateToBooking = () => {
  console.log('Attempting navigation to book-a-session');
  navigateTo('/book-a-session');
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div
          class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
        >
          <svg
            class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main
            class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28"
          >
            <div class="sm:text-center lg:text-left">
              <h1
                class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              >
                <span class="block">Capture Your</span>
                <span class="block text-[#C4A484]">Perfect Moments</span>
              </h1>
              <p
                class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                Professional photography services for all your special moments.
                From weddings to family portraits, we capture memories that last
                a lifetime.
              </p>
              <div
                class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <div class="rounded-md shadow">
                  <button
                    @click="navigateToBooking"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#C4A484] hover:bg-[#F5F5DC] md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Book a Session
                  </button>
                </div>
                <!-- <div class="rounded-md shadow">
                  <NuxtLink
                    to="/register"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#C4A484] hover:bg-[#F5F5DC] md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Get Started
                  </NuxtLink>
                </div> -->
                <!-- <div class="mt-3 sm:mt-0 sm:ml-3">
                  <NuxtLink
                    to="/login"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#C4A484] bg-[#F5F5DC] hover:bg-[#F5F5DC] md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Sign In
                  </NuxtLink>
                </div> -->
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=80"
          alt="Photography"
        />
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Features
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Everything you need for perfect photos
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Professional photography services with state-of-the-art equipment
            and expert photographers.
          </p>
        </div>

        <div class="mt-10">
          <div
            class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10"
          >
            <div
              v-for="feature in features"
              :key="feature.name"
              class="relative"
            >
              <dt>
                <div
                  class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#C4A484] text-white"
                >
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="feature.icon"
                    />
                  </svg>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900">
                  {{ feature.name }}
                </p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500">
                {{ feature.description }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Services
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Our Photography Packages
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose from our range of professional photography services.
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="service in services"
              :key="service.name"
              class="relative group"
            >
              <div
                class="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 transition-opacity duration-200"
              >
                <img
                  :src="service.image"
                  alt=""
                  class="w-full h-full object-center object-cover"
                />
              </div>
              <h3 class="mt-6 text-sm text-gray-500">
                <span class="absolute inset-0"></span>
                {{ service.price }}
              </h3>
              <p class="text-base font-semibold text-gray-900">
                {{ service.name }}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Testimonials
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            What Our Clients Say
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="testimonial in testimonials"
              :key="testimonial.author"
              class="bg-white overflow-hidden shadow rounded-lg"
            >
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <img
                      class="h-12 w-12 rounded-full"
                      :src="testimonial.image"
                      :alt="testimonial.author"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ testimonial.author }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ testimonial.role }}
                    </div>
                  </div>
                </div>
                <div class="mt-4 text-gray-500 text-sm italic">
                  "{{ testimonial.content }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners Section -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Our Partners
          </h2>
          <p
            class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Trusted by Leading Brands
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Join our growing network of professional photographers and studios.
          </p>
        </div>

        <div class="mt-12 relative">
          <!-- Previous Button -->
          <button
            @click="previousPartner"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <svg
              class="h-6 w-6 text-gray-600"
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
          </button>

          <!-- Partners Carousel -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{
                transform: `translateX(-${currentPartnerIndex * 100}%)`,
              }"
            >
              <div
                v-for="partner in partners"
                :key="partner.id"
                class="flex-none w-full md:w-1/3 px-4"
              >
                <div
                  class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <img
                    :src="partner.logo"
                    :alt="partner.name"
                    class="h-12 mx-auto mb-4 object-contain"
                  />
                  <h3 class="text-lg font-medium text-gray-900 text-center">
                    {{ partner.name }}
                  </h3>
                  <p class="mt-2 text-sm text-gray-500 text-center">
                    {{ partner.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button
            @click="nextPartner"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
          >
            <svg
              class="h-6 w-6 text-gray-600"
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

          <!-- Dots Navigation -->
          <div class="flex justify-center mt-8 space-x-2">
            <button
              v-for="(_, index) in Math.ceil(partners.length / 3)"
              :key="index"
              @click="currentPartnerIndex = index"
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="
                currentPartnerIndex === index ? 'bg-[#C4A484]' : 'bg-gray-300'
              "
            ></button>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-[#C4A484]">
      <div
        class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8"
      >
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block">Book your session today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-[#F5F5DC]">
          Create an account and start booking your photography sessions in
          minutes.
        </p>
        <NuxtLink
          to="/register"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#C4A484] bg-white hover:bg-[#F5F5DC] sm:w-auto transition-colors duration-200"
        >
          Get Started
        </NuxtLink>
      </div>
    </div>

    <!-- Footer -->
  </div>
</template>

<style scoped>
.bg-gradient-overlay {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
</style>
