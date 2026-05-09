import { apiGet } from './api';
import { mockShipments } from '../data/shipments';

/**
 * Get paginated, filtered shipments
 */
export const getShipments = async ({ page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
  return apiGet(() => {
    let filtered = [...mockShipments];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.carrier.toLowerCase().includes(q) ||
          s.origin.name.toLowerCase().includes(q) ||
          s.destination.name.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter((s) => s.status === status);
    }

    filtered.sort((a, b) => {
      const aVal = new Date(a[sortBy]).getTime();
      const bVal = new Date(b[sortBy]).getTime();
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      shipments: data,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  });
};

/**
 * Get single shipment with full timeline
 */
export const getShipmentById = async (id) => {
  return apiGet(() => {
    const shipment = mockShipments.find((s) => s.id === id || s.trackingNumber === id);
    if (!shipment) throw new Error('Shipment not found');
    return shipment;
  });
};

/**
 * Get shipment counts by status (for filter tabs)
 */
export const getShipmentCounts = async () => {
  return apiGet(() => {
    const counts = { All: mockShipments.length };
    mockShipments.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, 100);
};
