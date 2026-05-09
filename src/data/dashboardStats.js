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
