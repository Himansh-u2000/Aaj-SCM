export const dashboardStats = {
  totalOrders: 12847,
  deliveredOrders: 9632,
  pendingShipments: 1847,
  delayedShipments: 342,
  inTransit: 1026,
  revenue: 2845600,
  avgDeliveryTime: 3.2, // days
  onTimeDeliveryRate: 94.5,
  trends: {
    totalOrders: +12.5,
    deliveredOrders: +8.3,
    pendingShipments: -4.2,
    delayedShipments: +2.1,
  },
};

export const recentActivity = [
  {
    id: 1,
    type: 'order_created',
    title: 'New order created',
    description: 'Order TRK-9234 placed by Acme Corp Logistics',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    icon: 'order',
  },
  {
    id: 2,
    type: 'shipment_delivered',
    title: 'Shipment delivered',
    description: 'TRK-45672-B2C successfully delivered to Chicago, IL',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    icon: 'delivered',
  },
  {
    id: 3,
    type: 'delay_alert',
    title: 'Shipment delayed',
    description: 'TRK-99482-B2C held at Frankfurt Hub — weather delay',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    icon: 'alert',
  },
  {
    id: 4,
    type: 'status_update',
    title: 'Status updated',
    description: 'TRK-8910 status changed to In Transit',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    icon: 'update',
  },
  {
    id: 5,
    type: 'bulk_action',
    title: 'Bulk update completed',
    description: '15 orders marked as Delivered by Priya Sharma',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    icon: 'bulk',
  },
  {
    id: 6,
    type: 'shipment_exception',
    title: 'Exception reported',
    description: 'TRK-78231-A5R — customs documentation issue',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    icon: 'alert',
  },
  {
    id: 7,
    type: 'order_created',
    title: 'New order created',
    description: 'Order TRK-9235 placed by Global Supply Inc.',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    icon: 'order',
  },
  {
    id: 8,
    type: 'shipment_delivered',
    title: 'Shipment delivered',
    description: 'TRK-33201-C1D delivered to Seattle, WA',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    icon: 'delivered',
  },
];

export const ordersByStatus = [
  { status: 'Delivered', count: 9632, percentage: 75 },
  { status: 'In Transit', count: 1026, percentage: 8 },
  { status: 'Pending', count: 1847, percentage: 14.4 },
  { status: 'Delayed', count: 342, percentage: 2.6 },
];

export const weeklyVolume = [
  { day: 'Mon', orders: 245, shipments: 198 },
  { day: 'Tue', orders: 312, shipments: 267 },
  { day: 'Wed', orders: 289, shipments: 245 },
  { day: 'Thu', orders: 367, shipments: 312 },
  { day: 'Fri', orders: 298, shipments: 256 },
  { day: 'Sat', orders: 156, shipments: 134 },
  { day: 'Sun', orders: 89, shipments: 72 },
];

export const carrierSplitData = [
  { label: 'Deliveries Before Time', value: 3214, color: '#22c55e' },
  { label: 'Deliveries On Time', value: 4856, color: '#facc15' },
  { label: 'Delayed 1 Day', value: 1994, color: '#3b82f6' },
  { label: 'Delayed 2 Days', value: 1240, color: '#f472b6' },
  { label: 'Delayed 3 Days', value: 680, color: '#c084fc' },
  { label: 'Delayed 4 Days', value: 421, color: '#2dd4bf' },
  { label: 'Delayed 5+ Days', value: 442, color: '#fb923c' },
];

export const carrierDistribution = [
  { label: 'Delhivery', value: 28, color: '#f87171' },
  { label: 'AAJ', value: 22, color: '#fbbf24' },
  { label: 'DTDC Courier', value: 18, color: '#60a5fa' },
  { label: 'Gati', value: 12, color: '#a78bfa' },
  { label: 'BlueDart Surface', value: 10, color: '#34d399' },
  { label: 'Others', value: 10, color: '#94a3b8' },
];

export const delayAnalysis = [
  { label: 'Delayed 1 Day', count: 1994, color: 'text-red-600', bgColor: 'bg-red-50' },
  { label: 'Delayed 2 Days', count: 1240, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { label: 'Delayed 3 Days', count: 680, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { label: 'Delayed 4 Days', count: 421, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { label: 'Delayed 5+ Days', count: 442, color: 'text-red-700', bgColor: 'bg-red-50' },
];

export const orderVolumeData = {
  daily: [
    { label: 'Mon', value: 245 },
    { label: 'Tue', value: 312 },
    { label: 'Wed', value: 289 },
    { label: 'Thu', value: 367 },
    { label: 'Fri', value: 298 },
    { label: 'Sat', value: 156 },
    { label: 'Sun', value: 89 },
  ],
  weekly: [
    { label: 'W1', value: 1456 },
    { label: 'W2', value: 1789 },
    { label: 'W3', value: 1634 },
    { label: 'W4', value: 1923 },
    { label: 'W5', value: 1545 },
    { label: 'W6', value: 2102 },
    { label: 'W7', value: 1876 },
    { label: 'W8', value: 1756 },
  ],
  monthly: [
    { label: 'Jun', value: 4230 },
    { label: 'Jul', value: 4812 },
    { label: 'Aug', value: 5134 },
    { label: 'Sep', value: 4678 },
    { label: 'Oct', value: 5432 },
    { label: 'Nov', value: 5890 },
    { label: 'Dec', value: 6234 },
    { label: 'Jan', value: 5456 },
    { label: 'Feb', value: 5890 },
    { label: 'Mar', value: 6312 },
    { label: 'Apr', value: 6780 },
    { label: 'May', value: 7120 },
  ],
};
