<script setup lang="ts">
import Chart from "chart.js/auto";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

interface DashboardData {
  stats: {
    totalBookings: number;
    uniqueCustomers: number;
    totalPending: number;
    themeDistribution: Record<string, number>;
  };
  chartData?: {
    thirtyDays: Array<{
      date: string;
      bookings: number;
      unique_customers: number;
    }>;
    ninetyDays: Array<{
      date: string;
      bookings: number;
      unique_customers: number;
    }>;
    yearly: Array<{
      month: string;
      bookings: number;
      unique_customers: number;
    }>;
  };
  recentBookings?: Array<{
    id: number;
    name: string;
    themes: string;
    latest_booking: string;
    pending_payment: number;
  }>;
  upcomingSessions?: Array<{
    id: number;
    name: string;
    theme: string;
    booking_date: string;
    location: string;
    status: number;
  }>;
}

// Simulated data for chart and other sections
const simulatedData = {
  chartData: {
    thirtyDays: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      bookings: Math.floor(Math.random() * 10),
      unique_customers: Math.floor(Math.random() * 8),
    })),
    ninetyDays: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString(),
      bookings: Math.floor(Math.random() * 20),
      unique_customers: Math.floor(Math.random() * 15),
    })),
    yearly: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString("default", { month: "long" }),
      bookings: Math.floor(Math.random() * 50),
      unique_customers: Math.floor(Math.random() * 40),
    })),
  },
};

// Fetch dashboard data
const {
  data: dashboardData,
  pending,
  error,
  refresh,
} = await useFetch<DashboardData>("/api/dashboard/get-data", {
  transform: (response: any) => ({
    ...response.data,
    ...simulatedData,
  }),
});

// Stats data transformation
const stats = computed(() => [
  {
    name: "Total Bookings",
    stat: dashboardData.value?.stats.totalBookings.toString() || "0",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    description: "Total sessions booked",
    change: "10%", // Simulated growth
    changeType: "increase",
  },
  {
    name: "Active Customers",
    stat: dashboardData.value?.stats.uniqueCustomers.toString() || "0",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    description: "Unique customers",
    change: "8%", // Simulated growth
    changeType: "increase",
  },
  {
    name: "Pending Sessions",
    stat: dashboardData.value?.stats.totalPending.toString() || "0",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Sessions awaiting confirmation",
    change: dashboardData.value?.stats.totalPending.toString() || "0",
    changeType:
      (dashboardData.value?.stats?.totalPending || 0) > 0
        ? "increase"
        : "neutral",
  },
  {
    name: "Theme Distribution",
    stat: (() => {
      const dist = dashboardData.value?.stats.themeDistribution || {};
      const themes = Object.keys(dist);
      if (themes.length === 0) return "No themes";
      if (themes.length === 1) return `${dist[themes[0]]} ${themes[0]}`;

      // Sort themes by count in descending order
      const sortedThemes = themes.sort((a, b) => dist[b] - dist[a]);
      const topThemes = sortedThemes.slice(0, 2);
      const remaining = sortedThemes
        .slice(2)
        .reduce((sum, theme) => sum + dist[theme], 0);

      if (remaining > 0) {
        return `${dist[topThemes[0]]}/${dist[topThemes[1]]}/${remaining}`;
      }
      return `${dist[topThemes[0]]}/${dist[topThemes[1]]}`;
    })(),
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    description: (() => {
      const dist = dashboardData.value?.stats.themeDistribution || {};
      const themes = Object.keys(dist);
      if (themes.length === 0) return "No themes available";
      if (themes.length === 1) return themes[0];

      const sortedThemes = themes.sort((a, b) => dist[b] - dist[a]);
      const topThemes = sortedThemes.slice(0, 2);
      const remaining = sortedThemes.length > 2 ? "Others" : "";

      return remaining
        ? `${topThemes[0]} / ${topThemes[1]} / ${remaining}`
        : `${topThemes[0]} / ${topThemes[1]}`;
    })(),
    change: (() => {
      const dist = dashboardData.value?.stats.themeDistribution || {};
      const themes = Object.keys(dist);
      if (themes.length === 0) return "0%";
      if (themes.length === 1) return "100%";

      const sortedThemes = themes.sort((a, b) => dist[b] - dist[a]);
      const total = themes.reduce((sum, theme) => sum + dist[theme], 0);
      const topThemes = sortedThemes.slice(0, 2);

      if (themes.length > 2) {
        const remaining = sortedThemes
          .slice(2)
          .reduce((sum, theme) => sum + dist[theme], 0);
        return `${Math.round((dist[topThemes[0]] / total) * 100)}/${Math.round(
          (dist[topThemes[1]] / total) * 100
        )}/${Math.round((remaining / total) * 100)}`;
      }

      return `${Math.round((dist[topThemes[0]] / total) * 100)}/${Math.round(
        (dist[topThemes[1]] / total) * 100
      )}`;
    })(),
    changeType: "neutral",
  },
]);

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Chart data structure
const timeRange = ref("30");

interface TimeSeriesDataPoint {
  date?: string;
  month?: string;
  bookings: number;
  unique_customers: number;
}

const selectedTimeSeriesData = computed(() => {
  if (!dashboardData.value) return { labels: [], bookings: [], customers: [] };

  const data: TimeSeriesDataPoint[] =
    timeRange.value === "30"
      ? dashboardData.value.chartData?.thirtyDays || []
      : timeRange.value === "90"
      ? dashboardData.value.chartData?.ninetyDays || []
      : dashboardData.value.chartData?.yearly || [];

  return {
    labels: data.map((d) => (d.date ? formatDate(d.date) : d.month || "")),
    bookings: data.map((d) => d.bookings),
    customers: data.map((d) => d.unique_customers),
  };
});

// Add this ref to store the chart instance
const chart = ref<Chart | null>(null);

// Create chart function
const createChart = () => {
  const ctx = document.getElementById("overview-chart") as HTMLCanvasElement;
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chart.value) {
    chart.value.destroy();
  }

  // Also check for any existing chart with Chart.js's registry
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  // Create gradient for bookings
  const bookingsGradient = ctx
    .getContext("2d")
    ?.createLinearGradient(0, 0, 0, 400);
  if (bookingsGradient) {
    bookingsGradient.addColorStop(0, "var(--color-primary)");
    bookingsGradient.addColorStop(1, "rgba(var(--color-primary), 0)");
  }

  // Create gradient for customers
  const customersGradient = ctx
    .getContext("2d")
    ?.createLinearGradient(0, 0, 0, 400);
  if (customersGradient) {
    customersGradient.addColorStop(0, "var(--color-bg-secondary)");
    customersGradient.addColorStop(1, "rgba(var(--color-bg-secondary), 0)");
  }

  // Create new chart
  chart.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: selectedTimeSeriesData.value.labels,
      datasets: [
        {
          label: "Bookings",
          data: selectedTimeSeriesData.value.bookings,
          borderColor: "var(--color-primary)",
          backgroundColor: bookingsGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointHoverBackgroundColor: "white",
          pointBorderColor: "var(--color-primary)",
          pointHoverBorderColor: "var(--color-primary)",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: "y",
          order: 1,
        },
        {
          label: "Customers",
          data: selectedTimeSeriesData.value.customers,
          borderColor: "var(--color-bg-secondary)",
          backgroundColor: customersGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointHoverBackgroundColor: "white",
          pointBorderColor: "var(--color-bg-secondary)",
          pointHoverBorderColor: "var(--color-bg-secondary)",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: "y1",
          order: 0,
        },
      ],
    },
    options: chartOptions,
  });
};

// Clean up chart on component unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});

// Watch for time range changes and update chart
watch([timeRange, dashboardData], () => {
  if (dashboardData.value) {
    createChart();
  }
});

// Chart options with proper TypeScript types
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        boxWidth: 8,
        boxHeight: 8,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: 500,
        },
      },
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#111827",
      bodyColor: "#4B5563",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: {
        size: 14,
        weight: "600",
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.dataset.yAxisID === "y") {
            label += context.parsed.y + " bookings";
          } else {
            label += context.parsed.y + " customers";
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#6B7280",
        padding: 8,
      },
    },
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
      grid: {
        color: "#F3F4F6",
        drawBorder: false,
      },
      border: {
        dash: [5, 5],
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#6B7280",
        padding: 8,
        maxTicksLimit: 6,
      },
      title: {
        display: true,
        text: "Bookings",
        font: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: "600",
        },
        color: "#374151",
        padding: { bottom: 10 },
      },
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      grid: {
        drawOnChartArea: false,
        drawBorder: false,
      },
      border: {
        dash: [5, 5],
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
        },
        color: "#6B7280",
        padding: 8,
        maxTicksLimit: 6,
      },
      title: {
        display: true,
        text: "Customers",
        font: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: "600",
        },
        color: "#374151",
        padding: { bottom: 10 },
      },
    },
  },
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 3:
      return "bg-green-100 text-[var(--color-success)]";
    case 2:
      return "bg-blue-100 text-[var(--color-primary)]";
    case 1:
      return "bg-yellow-100 text-[var(--color-warning)]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSessionStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "bg-yellow-100 text-[var(--color-warning)]";
    case 2:
      return "bg-green-100 text-[var(--color-success)]";
    case 3:
      return "bg-red-100 text-[var(--color-error)]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getChangeColor = (type: string) => {
  return type === "increase"
    ? "text-[var(--color-success)]"
    : "text-[var(--color-error)]";
};
</script>

<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center h-96">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-96">
      <div class="text-center">
        <p class="text-lg font-medium text-gray-900">Something went wrong</p>
        <p class="mt-1 text-sm text-gray-500">{{ error.message }}</p>
        <button
          type="button"
          @click="() => refresh()"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Welcome Section -->
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Welcome back!</h1>
        <p class="mt-1 text-sm text-gray-500">
          Here's an overview of your photography business.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in stats"
          :key="item.name"
          class="relative bg-white rounded-xl overflow-hidden"
        >
          <div class="p-6">
            <!-- Icon and Title -->
            <div class="flex items-center">
              <div
                class="flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--color-bg-primary)]"
              >
                <svg
                  class="w-6 h-6 text-[var(--color-primary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :d="item.icon"
                  />
                </svg>
              </div>
              <p class="ml-4 text-sm font-medium text-gray-500">
                {{ item.name }}
              </p>
            </div>

            <!-- Stats and Change -->
            <div class="mt-4">
              <div class="flex items-baseline">
                <p class="text-2xl font-bold text-gray-900">{{ item.stat }}</p>
                <span
                  :class="[
                    'ml-2 text-sm font-semibold flex items-center',
                    getChangeColor(item.changeType),
                  ]"
                >
                  <svg
                    v-if="item.changeType === 'increase'"
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <svg
                    v-else-if="item.changeType === 'decrease'"
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                  {{ item.change }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
            </div>

            <!-- Progress Bar -->
            <div
              class="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-[var(--color-primary)] rounded-full"
                :style="{
                  width:
                    item.changeType === 'increase'
                      ? `${Math.min(parseInt(item.change), 100)}%`
                      : '20%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Recent Bookings -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  Recent Bookings
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                  Latest photography bookings
                </p>
              </div>
              <NuxtLink
                to="/dashboard/bookings"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All
              </NuxtLink>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li
              v-for="booking in dashboardData?.recentBookings || []"
              :key="booking.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ booking.name }}
                  </p>
                  <div class="flex items-center mt-1">
                    <p class="text-sm text-gray-500">{{ booking.theme }}</p>
                    <span class="mx-2 text-gray-500">·</span>
                    <p class="text-sm text-gray-500">
                      {{ formatDate(booking.latest_booking) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="getStatusColor(booking.payment_status)"
                  >
                    {{
                      booking.payment_status == 1
                        ? "Pending"
                        : booking.payment_status == 2
                        ? "Partial"
                        : "Paid"
                    }}
                  </span>
                </div>
              </div>
            </li>
            <li
              v-if="(dashboardData?.recentBookings ?? []).length === 0"
              class="p-6 text-center"
            >
              <p class="text-sm text-gray-500">No recent bookings</p>
            </li>
          </ul>
        </div>

        <!-- Upcoming Sessions -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  Upcoming Sessions
                </h2>
                <p class="mt-1 text-sm text-gray-500">Next 7 days</p>
              </div>
              <NuxtLink
                to="/dashboard/calendar"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Calendar
              </NuxtLink>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-200">
            <li
              v-for="session in dashboardData?.upcomingSessions || []"
              :key="session.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ session.name }}
                  </p>
                  <div class="flex items-center mt-1">
                    <p class="text-sm text-gray-500">{{ session.theme }}</p>
                    <span class="mx-2 text-gray-500">·</span>
                    <p class="text-sm text-gray-500">
                      {{ formatDate(session.booking_date) }}
                    </p>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ session.number_of_pax }} Pax
                  </p>
                </div>
                <div>
                  <span
                    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="getSessionStatusColor(session.status)"
                  >
                    {{
                      session.status == 1
                        ? "Pending"
                        : session.status == 2
                        ? "Paid"
                        : "Cancelled"
                    }}
                  </span>
                </div>
              </div>
            </li>
            <li
              v-if="(dashboardData?.upcomingSessions ?? []).length === 0"
              class="p-6 text-center"
            >
              <p class="text-sm text-gray-500">
                No upcoming sessions in the next 7 days
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Monthly Overview Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-medium text-[var(--color-text-primary)]">
              Monthly Overview
            </h2>
            <p class="mt-1 text-sm text-[var(--color-text-muted)]">
              Bookings and revenue trends
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <select
              v-model="timeRange"
              class="rounded-lg border-gray-300 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
        </div>
        <div class="h-[400px] w-full">
          <canvas id="overview-chart"></canvas>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.el-skeleton {
  --el-skeleton-color: var(--color-bg-secondary);
}
</style>
