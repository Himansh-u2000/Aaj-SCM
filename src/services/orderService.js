import { apiGet, apiPut } from './api';
import { mockOrders } from '../data/orders';

/**
 * Get paginated, filtered, sorted orders
 * @param {object} params
 * @returns {Promise}
 */
export const getOrders = async ({ page = 1, limit = 10, search = '', status = '', region = '', sortBy = 'date', sortOrder = 'desc', dateFrom = '', dateTo = '' } = {}) => {
  return apiGet(() => {
    let filtered = [...mockOrders];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.destination.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (status && status !== 'All Statuses') {
      filtered = filtered.filter((o) => o.status === status);
    }

    // Region filter
    if (region && region !== 'All Regions') {
      filtered = filtered.filter((o) => o.destination.includes(region));
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((o) => new Date(o.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => new Date(o.date) <= to);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (sortBy === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      orders: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  });
};

/**
 * Get ALL filtered orders (no pagination) — for export
 */
export const getAllFilteredOrders = async ({ search = '', status = '', region = '', sortBy = 'date', sortOrder = 'desc', dateFrom = '', dateTo = '' } = {}) => {
  return apiGet(() => {
    let filtered = [...mockOrders];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.destination.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'All Statuses') {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (region && region !== 'All Regions') {
      filtered = filtered.filter((o) => o.destination.includes(region));
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((o) => new Date(o.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => new Date(o.date) <= to);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'amount') { aVal = parseFloat(aVal); bVal = parseFloat(bVal); }
      else if (sortBy === 'date') { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime(); }
      else { aVal = String(aVal).toLowerCase(); bVal = String(bVal).toLowerCase(); }
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, 100);
};

/**
 * Get single order by ID
 */
export const getOrderById = async (id) => {
  return apiGet(() => {
    const order = mockOrders.find((o) => o.id === id || o.orderId === id);
    if (!order) throw new Error('Order not found');
    return order;
  });
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id, newStatus) => {
  return apiPut(() => {
    const order = mockOrders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = newStatus;
    return order;
  });
};

/**
 * Bulk update orders to a specific status
 */
export const bulkUpdateOrders = async (ids, newStatus) => {
  return apiPut(() => {
    const updated = [];
    ids.forEach((id) => {
      const order = mockOrders.find((o) => o.id === id);
      if (order) {
        order.status = newStatus;
        updated.push(order);
      }
    });
    return { updated: updated.length, status: newStatus };
  }, 600);
};
