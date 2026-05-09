import { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import Checkbox from '../../components/Checkbox/Checkbox';
import Dropdown from '../../components/Dropdown/Dropdown';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import EmptyState from '../../components/EmptyState/EmptyState';
import { TableSkeleton } from '../../components/Loader/Loader';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getOrders, bulkUpdateOrders, updateOrderStatus } from '../../services/orderService';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { ORDER_STATUS, REGIONS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';

const Orders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Modal state
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination({ initialLimit: 10 });

  const statusOptions = ['All Statuses', ...Object.values(ORDER_STATUS)];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await getOrders({
      page: pagination.page,
      limit: pagination.limit,
      search: debouncedSearch,
      status: statusFilter,
      region: regionFilter,
      sortBy,
      sortOrder,
    });
    if (result.success) {
      setOrders(result.data.orders);
      pagination.setTotal(result.data.pagination.total);
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, regionFilter, sortBy, sortOrder]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter, regionFilter]);

  const handleSort = useCallback((column) => {
    setSortOrder((prev) => sortBy === column ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
    setSortBy(column);
  }, [sortBy]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === orders.length ? new Set() : new Set(orders.map((o) => o.id))
    );
  }, [orders]);

  const handleBulkAction = useCallback(async (action) => {
    const result = await bulkUpdateOrders([...selectedIds], action);
    if (result.success) {
      showToast(`${result.data.updated} orders updated`, 'success');
      setSelectedIds(new Set());
      fetchOrders();
    }
  }, [selectedIds, fetchOrders, showToast]);

  // View modal
  const openViewModal = useCallback((order) => setViewOrder(order), []);
  const closeViewModal = useCallback(() => setViewOrder(null), []);

  // Edit modal
  const openEditModal = useCallback((order) => {
    setEditOrder(order);
    setEditStatus(order.status);
  }, []);
  const closeEditModal = useCallback(() => {
    setEditOrder(null);
    setEditStatus('');
  }, []);
  const handleEditSave = useCallback(async () => {
    if (!editOrder) return;
    setEditSaving(true);
    const result = await updateOrderStatus(editOrder.id, editStatus);
    if (result.success) {
      showToast(`Order ${editOrder.orderId} updated to ${editStatus}`, 'success');
      closeEditModal();
      fetchOrders();
    } else {
      showToast('Failed to update order', 'error');
    }
    setEditSaving(false);
  }, [editOrder, editStatus, fetchOrders, showToast, closeEditModal]);

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <svg className="w-3 h-3 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    return sortOrder === 'asc'
      ? <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Order Management</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Manage and track all logistics orders across the network.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>}>Filter</Button>
          <Button variant="outline" size="sm" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>Date Range</Button>
          <Button variant="outline" size="sm" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>Export</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-secondary-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Dropdown label="Status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} fullWidth />
          <Dropdown label="Destination" options={REGIONS} value={regionFilter} onChange={setRegionFilter} fullWidth />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">Quick Search</label>
            <SearchBar value={search} onChange={setSearch} placeholder="ID, Customer..." />
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-white rounded-xl border border-secondary-100 px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-semibold text-secondary-800">{selectedIds.size} Selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('markDelivered')}>Update Status</Button>
            <Button variant="outline" size="sm">Print Labels</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-100 bg-secondary-50/50">
                    <th className="pl-4 pr-2 py-3 w-10"><Checkbox checked={selectedIds.size === orders.length && orders.length > 0} indeterminate={selectedIds.size > 0 && selectedIds.size < orders.length} onChange={toggleSelectAll} /></th>
                    <th className="px-3 py-3 text-left"><button onClick={() => handleSort('orderId')} className="flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800">Order ID <SortIcon column="orderId" /></button></th>
                    <th className="px-3 py-3 text-left"><button onClick={() => handleSort('customer')} className="flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800">Customer <SortIcon column="customer" /></button></th>
                    <th className="px-3 py-3 text-left hidden md:table-cell"><button onClick={() => handleSort('destination')} className="flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800">Destination <SortIcon column="destination" /></button></th>
                    <th className="px-3 py-3 text-left hidden lg:table-cell"><button onClick={() => handleSort('date')} className="flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800">Date <SortIcon column="date" /></button></th>
                    <th className="px-3 py-3 text-right hidden sm:table-cell"><button onClick={() => handleSort('amount')} className="flex items-center gap-1 text-xs font-semibold text-secondary-600 uppercase tracking-wider hover:text-secondary-800 ml-auto">Amount <SortIcon column="amount" /></button></th>
                    <th className="px-3 py-3 text-left"><span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">Status</span></th>
                    <th className="px-3 py-3 text-right pr-4"><span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-50">
                  {orders.map((order) => (
                    <tr key={order.id} className={`hover:bg-secondary-50/50 transition-colors ${selectedIds.has(order.id) ? 'bg-primary-50/30' : ''}`}>
                      <td className="pl-4 pr-2 py-3"><Checkbox checked={selectedIds.has(order.id)} onChange={() => toggleSelect(order.id)} /></td>
                      <td className="px-3 py-3"><button onClick={() => openViewModal(order)} className="font-semibold text-primary hover:underline">{order.orderId}</button></td>
                      <td className="px-3 py-3 text-secondary-700">{order.customer}</td>
                      <td className="px-3 py-3 text-secondary-600 hidden md:table-cell">{order.destination}</td>
                      <td className="px-3 py-3 text-secondary-500 hidden lg:table-cell whitespace-nowrap">{formatDateShort(order.date)}</td>
                      <td className="px-3 py-3 text-right font-semibold text-secondary-800 hidden sm:table-cell">{formatCurrency(order.amount)}</td>
                      <td className="px-3 py-3"><Badge status={order.status} size="sm" /></td>
                      <td className="px-3 py-3 pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openViewModal(order)} className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="View">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button onClick={() => openEditModal(order)} className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="More">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-secondary-100">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={pagination.goToPage} />
            </div>
          </>
        )}
      </div>

      {/* ===== VIEW ORDER MODAL ===== */}
      <Modal isOpen={!!viewOrder} onClose={closeViewModal} title="Order Details" size="lg">
        {viewOrder && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-primary">{viewOrder.orderId}</p>
                <p className="text-sm text-secondary-500 mt-0.5">Tracking: {viewOrder.trackingNumber}</p>
              </div>
              <Badge status={viewOrder.status} size="md" dot />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Customer</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{viewOrder.customer}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Destination</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{viewOrder.destination}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Order Date</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{formatDateShort(viewOrder.date)}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Amount</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{formatCurrency(viewOrder.amount)}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Priority</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{viewOrder.priority}</p>
              </div>
              <div className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Items</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{viewOrder.items} items · {viewOrder.weight}</p>
              </div>
            </div>

            {/* Est Delivery */}
            <div className="border border-secondary-100 rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-sm font-semibold text-secondary-800">{formatDateShort(viewOrder.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ===== EDIT ORDER MODAL ===== */}
      <Modal
        isOpen={!!editOrder}
        onClose={closeEditModal}
        title="Edit Order"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
            <Button variant="primary" onClick={handleEditSave} loading={editSaving}>Save Changes</Button>
          </>
        }
      >
        {editOrder && (
          <div className="space-y-5">
            {/* Order info header */}
            <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-secondary-800">{editOrder.orderId}</p>
                <p className="text-xs text-secondary-500">{editOrder.customer} · {editOrder.destination}</p>
              </div>
            </div>

            {/* Status update */}
            <Dropdown
              label="Order Status"
              options={Object.values(ORDER_STATUS)}
              value={editStatus}
              onChange={setEditStatus}
              fullWidth
            />

            {/* Order Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Amount</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{formatCurrency(editOrder.amount)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Priority</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{editOrder.priority}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Items</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{editOrder.items} items</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Weight</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{editOrder.weight}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
