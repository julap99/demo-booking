export interface DashboardStats {
  totalBookings: number
  uniqueCustomers: number
  totalPending: number
  themeDistribution: Record<string, number>
  bookingsGrowth: number
  customersGrowth: number
}

export interface RecentBooking {
  id: string
  name: string
  latest_booking: string
  themes: string
  pending_bookings: number
}

export interface UpcomingSession {
  id: string
  name: string
  booking_date: string
  theme: string
  status: string
  location: string
}

export interface ChartDataPoint {
  date?: string
  month?: string
  bookings: number
  unique_customers: number
}

export interface DashboardData {
  stats: DashboardStats
  recentBookings: RecentBooking[]
  upcomingSessions: UpcomingSession[]
  chartData: {
    thirtyDays: ChartDataPoint[]
    ninetyDays: ChartDataPoint[]
    yearly: ChartDataPoint[]
  }
} 