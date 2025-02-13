<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1
          class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] font-playfair"
        >
          Photography Themes
        </h1>
        <p class="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Manage your photography themes and packages
        </p>
      </div>
      <button
        @click="showAddThemeModal = true"
        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Theme
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Themes Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="bg-white rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <!-- Theme Image -->
        <div
          class="aspect-video w-full bg-[var(--color-bg-secondary)] relative overflow-hidden"
        >
          <img
            v-if="theme.image"
            :src="theme.image"
            :alt="theme.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>

        <!-- Theme Content -->
        <div class="p-3 sm:p-4">
          <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-0 mb-2">
            <h3 class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]">
              {{ theme.title }}
            </h3>
            <span class="text-sm font-medium text-[var(--color-primary)]">
              {{ formatPrice(theme.price) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
            {{ theme.description }}
          </p>

          <!-- Theme Status -->
          <div class="flex items-center justify-between">
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full',
                theme.status === 1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ theme.status === 1 ? "Active" : "Inactive" }}
            </span>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2">
              <button
                @click="editTheme(theme)"
                class="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                title="Edit Theme"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  ></path>
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  ></path>
                </svg>
              </button>
              <button
                @click="toggleThemeStatus(theme)"
                class="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
                :title="theme.status === 1 ? 'Deactivate Theme' : 'Activate Theme'"
              >
                <svg
                  v-if="theme.status === 1"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                <span class="sr-only">{{ theme.status === 1 ? 'Deactivate Theme' : 'Activate Theme' }}</span>
              </button>
              <button
                @click="confirmDelete(theme)"
                class="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 transition-colors duration-200"
                title="Delete Theme"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Theme Modal -->
    <TransitionRoot appear :show="showAddThemeModal" as="template">
      <Dialog as="div" @close="closeAddThemeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-[90%] sm:max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                >
                  {{ editingTheme ? "Edit Theme" : "Add New Theme" }}
                </DialogTitle>

                <form @submit.prevent="saveTheme" class="mt-4 space-y-4">
                  <!-- Theme Title -->
                  <div>
                    <label
                      class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Title
                    </label>
                    <input
                      v-model="themeForm.title"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Enter theme title"
                    />
                  </div>

                  <!-- Theme Description -->
                  <div>
                    <label
                      class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Description
                    </label>
                    <textarea
                      v-model="themeForm.description"
                      rows="3"
                      required
                      class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Enter theme description"
                    ></textarea>
                  </div>

                  <!-- Theme Price -->
                  <div>
                    <label
                      class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Price (MYR)
                    </label>
                    <input
                      v-model.number="themeForm.price"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Enter price"
                    />
                  </div>

                  <!-- Theme Deposit -->
                  <div>
                    <label
                      class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Deposit Amount (MYR)
                    </label>
                    <input
                      v-model.number="themeForm.deposit"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Enter deposit amount"
                    />
                  </div>

                  <!-- Theme Image URL -->
                  <div>
                    <label
                      class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Image URL
                    </label>
                    <input
                      v-model="themeForm.image"
                      type="url"
                      class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeAddThemeModal"
                      class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="isSaving"
                      class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                      :class="{ 'opacity-75 cursor-not-allowed': isSaving }"
                    >
                      {{
                        isSaving
                          ? "Saving..."
                          : editingTheme
                          ? "Update Theme"
                          : "Add Theme"
                      }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="showDeleteModal" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-[90%] sm:max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                >
                  Delete Theme
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-xs sm:text-sm text-[var(--color-text-muted)]">
                    Are you sure you want to delete this theme? This action
                    cannot be undone.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeDeleteModal"
                    class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="deleteTheme"
                    :disabled="isDeleting"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    :class="{ 'opacity-75 cursor-not-allowed': isDeleting }"
                  >
                    {{ isDeleting ? "Deleting..." : "Delete Theme" }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import StatusModal from "~/components/common/StatusModal.vue";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

interface Theme {
  id: number;
  title: string;
  description: string;
  price: number;
  deposit: number;
  image?: string;
  status: number;
}

type ModalStatus = "success" | "error";

// Add modal state
const modalState = ref({
  isOpen: false,
  status: "success" as ModalStatus,
  title: "",
  message: "",
});

function showModal(status: ModalStatus, title: string, message: string) {
  modalState.value = {
    isOpen: true,
    status,
    title,
    message,
  };
}

function closeModal() {
  modalState.value.isOpen = false;
}

// State
const themes = ref<Theme[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showAddThemeModal = ref(false);
const isSaving = ref(false);
const editingTheme = ref<Theme | null>(null);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const themeToDelete = ref<Theme | null>(null);

const themeForm = ref({
  title: "",
  description: "",
  price: 0,
  deposit: 0,
  image: "",
});

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price);
}

async function fetchThemes() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await $apiFetch("/api/booking/get-all-themes");
    themes.value = response as Theme[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    isLoading.value = false;
  }
}

function editTheme(theme: Theme) {
  editingTheme.value = theme;
  themeForm.value = {
    title: theme.title,
    description: theme.description,
    price: theme.price,
    deposit: theme.deposit,
    image: theme.image || "",
  };
  showAddThemeModal.value = true;
}

async function toggleThemeStatus(theme: Theme) {
  try {
    const response = await $apiFetch(
      `/api/booking/update-theme-status/${theme.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          status: theme.status === 1 ? 0 : 1,
        }),
      }
    );

    // Refresh themes list
    showModal("success", "Success", "Theme status updated successfully");
    await fetchThemes();
  } catch (err) {
    console.error("Error updating theme status:", err);
    // TODO: Show error notification
    showModal("error", "Failed", "Failed to update theme status");
  }
}

async function saveTheme() {
  isSaving.value = true;
  try {
    const endpoint = editingTheme.value
      ? `/api/booking/update-theme/${editingTheme.value.id}`
      : "/api/booking/create-theme";

    const response = await $apiFetch(endpoint, {
      method: editingTheme.value ? "PUT" : "POST",
      body: JSON.stringify(themeForm.value),
    });

    console.log("Response:", response);

    closeAddThemeModal();
    // Refresh themes list and close modal
    await fetchThemes();
    showModal(
      "success",
      "Success",
      `${editingTheme.value ? "Updated" : "Added"} theme successfully`
    );
  } catch (err) {
    console.error("Error saving theme:", err);
    // TODO: Show error notification
    showModal(
      "error",
      "Failed",
      `${editingTheme.value ? "Update" : "Add"} theme failed`
    );
  } finally {
    isSaving.value = false;
  }
}

function closeAddThemeModal() {
  showAddThemeModal.value = false;
  editingTheme.value = null;
  themeForm.value = {
    title: "",
    description: "",
    price: 0,
    deposit: 0,
    image: "",
  };
}

function confirmDelete(theme: Theme) {
  themeToDelete.value = theme;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  themeToDelete.value = null;
}

async function deleteTheme() {
  if (!themeToDelete.value) return;

  isDeleting.value = true;
  try {
    const response = await $apiFetch(
      `/api/booking/delete-theme/${themeToDelete.value.id}`,
      {
        method: "DELETE",
      }
    );

    // Refresh themes list and close modal
    await fetchThemes();
    closeDeleteModal();
    showModal("success", "Success", "Theme deleted successfully");
  } catch (err) {
    console.error("Error deleting theme:", err);
    showModal("error", "Failed", "Failed to delete theme");
  } finally {
    isDeleting.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchThemes();
});
</script>

<style lang="scss" scoped></style>
