// Order statuses
export const ORDER_STATUS = {
  DELIVERED: 'Delivered',
  IN_TRANSIT: 'In Transit',
  DELAYED: 'Delayed',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  CANCELLED: 'Cancelled',
};

// Shipment statuses
export const SHIPMENT_STATUS = {
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  DELAYED: 'Delayed',
  EXCEPTION: 'Exception',
  PENDING: 'Pending',
  OUT_FOR_DELIVERY: 'Out for Delivery',
};

// Status color mapping for Tailwind classes
export const STATUS_COLORS = {
  [ORDER_STATUS.DELIVERED]: {
    bg: 'bg-status-delivered-bg',
    text: 'text-status-delivered',
    dot: 'bg-status-delivered',
    border: 'border-status-delivered',
  },
  [ORDER_STATUS.IN_TRANSIT]: {
    bg: 'bg-status-transit-bg',
    text: 'text-status-transit',
    dot: 'bg-status-transit',
    border: 'border-status-transit',
  },
  [ORDER_STATUS.DELAYED]: {
    bg: 'bg-status-delayed-bg',
    text: 'text-status-delayed',
    dot: 'bg-status-delayed',
    border: 'border-status-delayed',
  },
  [ORDER_STATUS.PENDING]: {
    bg: 'bg-status-pending-bg',
    text: 'text-status-pending',
    dot: 'bg-status-pending',
    border: 'border-status-pending',
  },
  [ORDER_STATUS.PROCESSING]: {
    bg: 'bg-status-processing-bg',
    text: 'text-status-processing',
    dot: 'bg-status-processing',
    border: 'border-status-processing',
  },
  [ORDER_STATUS.CANCELLED]: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-600',
    border: 'border-red-600',
  },
  [SHIPMENT_STATUS.EXCEPTION]: {
    bg: 'bg-status-delayed-bg',
    text: 'text-status-delayed',
    dot: 'bg-status-delayed',
    border: 'border-status-delayed',
  },
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: {
    bg: 'bg-status-transit-bg',
    text: 'text-status-transit',
    dot: 'bg-status-transit',
    border: 'border-status-transit',
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50],
};

// Navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: 'dashboard' },
  { label: 'Orders', path: '/orders', icon: 'orders' },
  { label: 'Shipments', path: '/shipments', icon: 'shipments' },
  { label: 'Inventory', path: '/inventory', icon: 'inventory' },
  { label: 'Reports', path: '/reports', icon: 'reports' },
];

// Regions for filter
export const REGIONS = [
  'All Regions',
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East',
  'Africa',
];
