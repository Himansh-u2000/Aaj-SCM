import { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button/Button';
import Badge from '../../components/Badge/Badge';
import Dropdown from '../../components/Dropdown/Dropdown';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import Modal from '../../components/Modal/Modal';
import DataTable from '../../components/DataTable/DataTable';
import EmptyState from '../../components/EmptyState/EmptyState';
import { TableSkeleton } from '../../components/Loader/Loader';
import ViewOrderModal from './ViewOrderModal';
import EditOrderModal from './EditOrderModal';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getOrders, bulkUpdateOrders, getAllFilteredOrders } from '../../services/orderService';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { ORDER_STATUS, REGIONS } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/toastSlice';
import { exportOrdersToExcel } from '../../utils/exportUtils';

const Orders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exporting, setExporting] = useState(false);

  // Modal state
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination({ initialLimit: 10 });
  const statusOptions = ['All Statuses', ...Object.values(ORDER_STATUS)];

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await getOrders({
      page: pagination.page, limit: pagination.limit,
      search: debouncedSearch, status: statusFilter, region: regionFilter,
      sortBy, sortOrder, dateFrom, dateTo,
    });
    if (result.success) {
      setOrders(result.data.orders);
      pagination.setTotal(result.data.pagination.total);
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, regionFilter, sortBy, sortOrder, dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter, regionFilter, dateFrom, dateTo]);

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

  const handleBulkStatusUpdate = useCallback(async () => {
    if (!bulkStatus) return;
    const result = await bulkUpdateOrders([...selectedIds], bulkStatus);
    if (result.success) {
      dispatch(showToast(`${result.data.updated} orders updated to ${result.data.status}`, 'success'));
      setSelectedIds(new Set());
      setBulkStatusModal(false);
      setBulkStatus('');
      fetchOrders();
    }
  }, [selectedIds, bulkStatus, fetchOrders, dispatch]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    const result = await getAllFilteredOrders({
      search: debouncedSearch, status: statusFilter, region: regionFilter,
      sortBy, sortOrder, dateFrom, dateTo,
    });
    if (result.success) {
      exportOrdersToExcel(result.data, 'aaj_scm_orders');
      dispatch(showToast(`Exported ${result.data.length} orders to Excel`, 'success'));
    } else {
      dispatch(showToast('Export failed', 'error'));
    }
    setExporting(false);
  }, [debouncedSearch, statusFilter, regionFilter, sortBy, sortOrder, dateFrom, dateTo, dispatch]);

  const clearDateRange = useCallback(() => {
    setDateFrom('');
    setDateTo('');
    setShowDateRange(false);
  }, []);

  // Table column definitions
  const columns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (row) => <button onClick={() => setViewOrder(row)} className="font-semibold text-primary hover:underline">{row.orderId}</button> },
    { key: 'customer', label: 'Customer', sortable: true, cellClass: 'text-secondary-700' },
    { key: 'destination', label: 'Destination', sortable: true, cellClass: 'text-secondary-600', hideOn: 'hidden md:table-cell' },
    { key: 'date', label: 'Date', sortable: true, hideOn: 'hidden lg:table-cell', render: (row) => <span className="text-secondary-500 whitespace-nowrap">{formatDateShort(row.date)}</span> },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', hideOn: 'hidden sm:table-cell', render: (row) => <span className="font-semibold text-secondary-800">{formatCurrency(row.amount)}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} size="sm" /> },
  ];

  const renderActions = (row) => (
    <>
      <button onClick={() => setViewOrder(row)} className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="View">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      </button>
      <button onClick={() => setEditOrder(row)} className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="Edit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      <button className="p-1.5 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors" title="More">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
      </button>
    </>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Order Management</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Manage and track all logistics orders across the network.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={showFilters ? 'secondary' : 'outline'} size="sm" onClick={() => setShowFilters(p => !p)} leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>}>Filter</Button>
          <Button variant={showDateRange ? 'secondary' : 'outline'} size="sm" onClick={() => setShowDateRange(p => !p)} leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>Date Range</Button>
          <Button variant="outline" size="sm" onClick={handleExport} loading={exporting} leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>Export</Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-secondary-100 p-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Dropdown label="Status" options={statusOptions} value={statusFilter} onChange={setStatusFilter} fullWidth />
            <Dropdown label="Destination" options={REGIONS} value={regionFilter} onChange={setRegionFilter} fullWidth />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">Quick Search</label>
              <SearchBar value={search} onChange={setSearch} placeholder="ID, Customer..." />
            </div>
          </div>
        </div>
      )}

      {/* Date Range Panel */}
      {showDateRange && (
        <div className="bg-white rounded-xl border border-secondary-100 p-4 animate-fade-in">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" onClick={clearDateRange}>Clear Dates</Button>
            )}
          </div>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-white rounded-xl border border-secondary-100 px-4 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-semibold text-secondary-800">{selectedIds.size} Selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setBulkStatusModal(true); setBulkStatus(''); }}>Update Status</Button>
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
            <DataTable
              columns={columns}
              data={orders}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              renderActions={renderActions}
            />
            <div className="px-4 py-3 border-t border-secondary-100">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={pagination.goToPage} />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />
      <EditOrderModal order={editOrder} onClose={() => setEditOrder(null)} onSaved={fetchOrders} />

      {/* Bulk Status Update Modal */}
      <Modal
        isOpen={bulkStatusModal}
        onClose={() => setBulkStatusModal(false)}
        title="Update Status"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setBulkStatusModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleBulkStatusUpdate} disabled={!bulkStatus}>Apply to {selectedIds.size} Orders</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">Select a new status for the <strong>{selectedIds.size}</strong> selected orders:</p>
          <div className="space-y-2">
            {Object.values(ORDER_STATUS).map((s) => (
              <button key={s} onClick={() => setBulkStatus(s)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${ bulkStatus === s ? 'border-primary bg-primary/5' : 'border-secondary-100 hover:bg-secondary-50' }`}>
                <Badge status={s} size="sm" />
                <span className="text-sm font-medium text-secondary-800">{s}</span>
                {bulkStatus === s && <svg className="w-4 h-4 text-primary ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
