<script setup>
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventType: '',
  date: '',
  message: ''
})

const eventTypes = [
  { id: 'wedding', name: 'Wedding Photography' },
  { id: 'portrait', name: 'Portrait Session' },
  { id: 'family', name: 'Family Photography' },
  { id: 'event', name: 'Event Photography' },
  { id: 'other', name: 'Other' }
]

const loading = ref(false)
const success = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success.value = true
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
    form.eventType = ''
    form.date = ''
    form.message = ''
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative bg-[#C4A484]">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Contact" />
        <div class="absolute inset-0 bg-[#C4A484] mix-blend-multiply"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Contact Us</h1>
        <p class="mt-6 text-xl text-[#F5F5DC] max-w-3xl">
          Get in touch with us to discuss your photography needs. We're here to help capture your special moments.
        </p>
      </div>
    </div>

    <div class="relative bg-white">
      <div class="absolute inset-0">
        <div class="absolute inset-y-0 left-0 w-1/2 bg-gray-50"></div>
      </div>
      <div class="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
        <div class="bg-gray-50 py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
          <div class="max-w-lg mx-auto">
            <h2 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Get in touch</h2>
            <p class="mt-3 text-lg leading-6 text-gray-500">
              Have questions about our services? Want to book a session? We'd love to hear from you.
            </p>
            <dl class="mt-8 text-base text-gray-500">
              <div class="mt-6">
                <dt class="sr-only">Phone number</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="ml-3">(555) 123-4567</span>
                </dd>
              </div>
              <div class="mt-3">
                <dt class="sr-only">Email</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="ml-3">info@stitchandshutter.com</span>
                </dd>
              </div>
              <div class="mt-3">
                <dt class="sr-only">Address</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="ml-3">
                    123 Photography Lane<br />
                    Capture City, PC 12345
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
          <div class="max-w-lg mx-auto lg:max-w-none">
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-y-6">
              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      v-model="form.firstName"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      v-model="form.lastName"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <div class="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      v-model="form.email"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                  <div class="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      v-model="form.phone"
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="event-type" class="block text-sm font-medium text-gray-700">Event Type</label>
                  <div class="mt-1">
                    <select
                      id="event-type"
                      name="event-type"
                      v-model="form.eventType"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    >
                      <option value="">Select type</option>
                      <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700">Preferred Date</label>
                  <div class="mt-1">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      v-model="form.date"
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                <div class="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    v-model="form.message"
                    required
                    class="py-3 px-4 block w-full shadow-sm focus:ring-[#C4A484] focus:border-[#C4A484] border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>

              <div>
                <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
                  <div class="text-sm text-red-700">{{ error }}</div>
                </div>

                <div v-if="success" class="rounded-md bg-green-50 p-4 mb-4">
                  <div class="text-sm text-green-700">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#C4A484] hover:bg-[#B4917C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4A484]"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 