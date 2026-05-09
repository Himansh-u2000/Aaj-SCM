import * as XLSX from 'xlsx';

/**
 * Export an array of order objects to an Excel file (.xlsx)
 * @param {Array} orders - Array of order objects
 * @param {string} filename - Filename without extension
 */
export const exportOrdersToExcel = (orders, filename = 'orders_export') => {
  // Transform order objects into flat rows
  const rows = orders.map((order) => ({
    'Order ID': order.orderId,
    'Customer': order.customer,
    'Destination': order.destination,
    'Status': order.status,
    'Amount (USD)': order.amount,
    'Priority': order.priority,
    'Items': order.items,
    'Weight': order.weight,
    'Tracking Number': order.trackingNumber,
    'Order Date': new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    'Estimated Delivery': order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : 'N/A',
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Order ID
    { wch: 22 }, // Customer
    { wch: 18 }, // Destination
    { wch: 12 }, // Status
    { wch: 14 }, // Amount
    { wch: 10 }, // Priority
    { wch: 8 },  // Items
    { wch: 10 }, // Weight
    { wch: 18 }, // Tracking Number
    { wch: 22 }, // Order Date
    { wch: 18 }, // Estimated Delivery
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  // Download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
};
