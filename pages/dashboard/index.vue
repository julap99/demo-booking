<script setup>
definePageMeta({
  layout: "dashboard",
});

// Sample data (replace with actual API calls)
const stats = ref([
  {
    name: "Total Bookings",
    stat: "0",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    description: "Total sessions booked",
    change: "0%",
    changeType: "increase",
  },
  {
    name: "Active Customers",
    stat: "0",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    description: "Unique customers",
    change: "0%",
    changeType: "increase",
  },
  {
    name: "Pending Bookings",
    stat: "0",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Awaiting confirmation",
    change: "0",
    changeType: "increase",
  },
  {
    name: "Theme Distribution",
    stat: "0/0",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    description: "Theme A / Theme B",
    change: "50/50",
    changeType: "neutral",
  },
]);

const recentBookings = ref([
  {
    id: 1,
    customerName: "Emma Thompson",
    date: "March 15, 2024",
    time: "2:00 PM",
    type: "Portrait Session",
    status: "Confirmed",
    price: "Contact for price"
  },
  {
    id: 2,
    customerName: "James Wilson",
    date: "March 14, 2024",
    time: "10:30 AM",
    type: "Family Session",
    status: "Pending",
    price: "Contact for price"
  },
  {
    id: 3,
    customerName: "Sarah Parker",
    date: "March 13, 2024",
    time: "4:00 PM",
    type: "Wedding Session",
    status: "Confirmed",
    price: "Contact for price"
  }
]);

const upcomingSessions = ref([
  {
    id: 1,
    customerName: "Oliver Brown",
    date: "March 20, 2024",
    time: "11:00 AM",
    type: "Family Portrait",
    status: "Confirmed",
    location: "Central Park"
  },
  {
    id: 2,
    customerName: "Sophie Miller",
    date: "March 21, 2024",
    time: "3:30 PM",
    type: "Engagement",
    status: "Confirmed",
    location: "Beach Side"
  },
  {
    id: 3,
    customerName: "Lucas Davis",
    date: "March 22, 2024",
    time: "10:00 AM",
    type: "Graduation",
    status: "Pending",
    location: "University Campus"
  },
  {
    id: 4,
    customerName: "Isabella White",
    date: "March 23, 2024",
    time: "2:00 PM",
    type: "Maternity",
    status: "Confirmed",
    location: "Studio"
  }
]);

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Chart data structure
const timeSeriesData = ref({
  30: {
    labels: [],
    bookings: [],
    customers: [],
  },
  90: {
    labels: [],
    bookings: [],
    customers: [],
  },
  365: {
    labels: [],
    bookings: [],
    customers: [],
  },
});

const timeRange = ref("30");

const selectedTimeSeriesData = computed(
  () => timeSeriesData.value[timeRange.value]
);

// Add this ref to store the chart instance
const chart = ref(null);

// Create chart function
const createChart = () => {
  const ctx = document.getElementById('overview-chart');
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
  const bookingsGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  bookingsGradient.addColorStop(0, 'rgba(120, 83, 64, 0.2)');
  bookingsGradient.addColorStop(1, 'rgba(120, 83, 64, 0)');

  // Create gradient for customers
  const customersGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
  customersGradient.addColorStop(0, 'rgba(188, 170, 164, 0.2)');
  customersGradient.addColorStop(1, 'rgba(188, 170, 164, 0)');

  // Create new chart
  chart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: selectedTimeSeriesData.value.labels,
      datasets: [
        {
          label: 'Bookings',
          data: selectedTimeSeriesData.value.bookings,
          borderColor: 'rgb(120, 83, 64)',
          backgroundColor: bookingsGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: 'white',
          pointHoverBackgroundColor: 'white',
          pointBorderColor: 'rgb(120, 83, 64)',
          pointHoverBorderColor: 'rgb(120, 83, 64)',
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: 'y',
          order: 1
        },
        {
          label: 'Customers',
          data: selectedTimeSeriesData.value.customers,
          borderColor: 'rgb(188, 170, 164)',
          backgroundColor: customersGradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: 'white',
          pointHoverBackgroundColor: 'white',
          pointBorderColor: 'rgb(188, 170, 164)',
          pointHoverBorderColor: 'rgb(188, 170, 164)',
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: 'y1',
          order: 0
        }
      ]
    },
    options: chartOptions
  });
};

// Clean up chart on component unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const data = await $fetch('/api/dashboard/get-data');
    
    // Update stats
    if (data) {
      const { stats: apiStats, recentBookings: recent, upcomingSessions: upcoming, chartData: apiChartData } = data;
      
      // Update stats array
      stats.value[0].stat = apiStats.totalBookings.toString();
      stats.value[0].change = `+${Math.round(
        (apiStats.totalBookings / (apiStats.totalBookings + 5)) * 100
      )}%`;

      stats.value[1].stat = apiStats.uniqueCustomers.toString();
      stats.value[1].change = `+${Math.round(
        (apiStats.uniqueCustomers / (apiStats.uniqueCustomers + 2)) * 100
      )}%`;

      stats.value[2].stat = apiStats.totalPending.toString();
      stats.value[2].change = apiStats.totalPending.toString();
      stats.value[2].changeType =
        apiStats.totalPending > 0 ? "increase" : "neutral";

      const themeA = apiStats.themeDistribution["Theme A"] || 0;
      const themeB = apiStats.themeDistribution["Theme B"] || 0;
      stats.value[3].stat = `${themeA}/${themeB}`;
      stats.value[3].change = `${Math.round(
        (themeA / (themeA + themeB)) * 100
      )}/${Math.round((themeB / (themeA + themeB)) * 100)}`;

      // Update recent bookings
      recentBookings.value = recent.map((booking) => ({
        id: booking.id,
        customerName: booking.name,
        date: formatDate(booking.latest_booking),
        time: new Date(booking.latest_booking).toLocaleTimeString(),
        type: booking.themes?.split(",")[0] || "N/A",
        status: booking.pending_bookings > 0 ? "Pending" : "Confirmed",
        price: "Contact for price",
      }));

      // Update upcoming sessions
      upcomingSessions.value = upcoming.map((session) => ({
        id: session.id,
        customerName: session.name,
        date: formatDate(session.booking_date),
        time: new Date(session.booking_date).toLocaleTimeString(),
        type: session.theme || "N/A",
        status: session.status,
        location: session.location || "TBD",
      }));

      // Update chart data
      if (apiChartData.thirtyDays.length > 0) {
        timeSeriesData.value['30'] = {
          labels: apiChartData.thirtyDays.map(d => formatDate(d.date)),
          bookings: apiChartData.thirtyDays.map(d => d.bookings),
          customers: apiChartData.thirtyDays.map(d => d.unique_customers)
        };
      }

      if (apiChartData.ninetyDays.length > 0) {
        timeSeriesData.value['90'] = {
          labels: apiChartData.ninetyDays.map(d => {
            const [year, month] = d.month.split('-');
            return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
          }),
          bookings: apiChartData.ninetyDays.map(d => d.bookings),
          customers: apiChartData.ninetyDays.map(d => d.unique_customers)
        };
      }

      if (apiChartData.yearly.length > 0) {
        timeSeriesData.value['365'] = {
          labels: apiChartData.yearly.map(d => {
            const [year, month] = d.month.split('-');
            return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
          }),
          bookings: apiChartData.yearly.map(d => d.bookings),
          customers: apiChartData.yearly.map(d => d.unique_customers)
        };
      }

      // Create chart after data is loaded
      createChart();
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

onMounted(() => {
  fetchDashboardData();
});

// Watch for time range changes and update chart
watch(timeRange, () => {
  createChart();
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        padding: 20,
        boxWidth: 8,
        boxHeight: 8,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "500",
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
        label: function (context) {
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
      type: "linear",
      display: true,
      position: "left",
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
      type: "linear",
      display: true,
      position: "right",
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

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getChangeColor = (type) => {
  return type === "increase" ? "text-green-600" : "text-red-600";
};
</script>

<template>
  <div class="space-y-8">
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
              class="flex items-center justify-center w-12 h-12 rounded-lg bg-[#F5E6E0]"
            >
              <svg 
                class="w-6 h-6 text-[#785340]" 
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
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600',
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
                  v-else
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

          <!-- Progress Bar (optional visual element) -->
          <div class="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-[#785340] rounded-full" 
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
              <h2 class="text-lg font-medium text-gray-900">Recent Bookings</h2>
              <p class="mt-1 text-sm text-gray-500">
                Latest photography sessions
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
            v-for="booking in recentBookings"
            :key="booking.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ booking.customerName }}
                </p>
                <div class="flex items-center mt-1">
                  <p class="text-sm text-gray-500">{{ booking.type }}</p>
                  <span class="mx-2 text-gray-500">·</span>
                  <p class="text-sm text-gray-500">
                    {{ booking.date }} at {{ booking.time }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="getStatusColor(booking.status)"
                >
                  {{ booking.status }}
                </span>
                <span class="text-sm font-medium text-gray-900">{{
                  booking.price
                }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Upcoming Sessions -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-medium text-gray-900">Upcoming Sessions</h2>
              <p class="mt-1 text-sm text-gray-500">Next 7 days</p>
            </div>
            <NuxtLink
              to="/dashboard/bookings"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Calendar
            </NuxtLink>
          </div>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li
            v-for="session in upcomingSessions"
            :key="session.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-150"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ session.customerName }}
                </p>
                <div class="flex items-center mt-1">
                  <p class="text-sm text-gray-500">{{ session.type }}</p>
                  <span class="mx-2 text-gray-500">·</span>
                  <p class="text-sm text-gray-500">
                    {{ session.date }} at {{ session.time }}
                  </p>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  📍 {{ session.location }}
                </p>
              </div>
              <div>
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="getStatusColor(session.status)"
                >
                  {{ session.status }}
                </span>
              </div>
            </div>
          </li>
          <li v-if="upcomingSessions.length === 0" class="p-6 text-center">
            <p class="text-sm text-gray-500">No upcoming sessions in the next 7 days</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Monthly Overview Chart -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Monthly Overview</h2>
          <p class="mt-1 text-sm text-gray-500">Bookings and revenue trends</p>
        </div>
        <div class="flex items-center space-x-4">
          <select 
            v-model="timeRange"
            class="rounded-lg border-gray-300 text-sm focus:ring-[#785340] focus:border-[#785340]"
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
  </div>
</template>

<script>
// Import Chart.js
import Chart from "chart.js/auto";
</script> 
