import { useState, useEffect, useCallback } from 'react';
import Badge from '../../components/Badge/Badge';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import { Spinner } from '../../components/Loader/Loader';
import RouteProgress from '../../components/RouteProgress/RouteProgress';
import ShipmentDetailDrawer from './ShipmentDetailDrawer';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getShipments, getShipmentCounts } from '../../services/shipmentService';
import { formatDateShort, formatWeight } from '../../utils/formatters';
import { SHIPMENT_STATUS } from '../../utils/constants';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [counts, setCounts] = useState({});
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination({ initialLimit: 10 });

  const tabs = ['All', ...Object.values(SHIPMENT_STATUS)];

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    const result = await getShipments({
      page: pagination.page, limit: pagination.limit,
      search: debouncedSearch, status: statusFilter,
    });
    if (result.success) {
      setShipments(result.data.shipments);
      pagination.setTotal(result.data.pagination.total);
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchShipments(); }, [fetchShipments]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    getShipmentCounts().then((res) => { if (res.success) setCounts(res.data); });
  }, []);

  const openDrawer = useCallback((shipment) => {
    setSelectedShipment(shipment);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedShipment(null), 300);
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Shipment Tracking</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Monitor and track all shipments in real-time.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search tracking #, carrier..." className="sm:w-72" />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === tab
                ? 'bg-primary text-white'
                : 'bg-white text-secondary-600 border border-secondary-200 hover:bg-secondary-50'
              }`}
          >
            {tab}
            {counts[tab] !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === tab ? 'bg-white/20' : 'bg-secondary-100'
                }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shipments Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : shipments.length === 0 ? (
        <EmptyState title="No shipments found" description="Try adjusting your search or filter." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shipments.map((shipment) => (
              <Card key={shipment.id} hover padding="p-0" className="cursor-pointer overflow-hidden" onClick={() => openDrawer(shipment)}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-primary">{shipment.trackingNumber}</p>
                      <p className="text-xs text-secondary-500 mt-0.5">{shipment.carrier} · {shipment.service}</p>
                    </div>
                    <Badge status={shipment.status} dot size="sm" />
                  </div>
                  <div className="mt-3 ">
                    <RouteProgress
                      origin={shipment.origin}
                      destination={shipment.destination}
                      status={shipment.status}
                      timeline={shipment.timeline}
                      compact
                    />
                  </div>
                  {shipment.isDelayed && shipment.delayReason && (
                    <div className="mt-2 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {shipment.delayReason}
                    </div>
                  )}
                </div>
                <div className="px-4 py-2.5 bg-secondary-50/50 border-t border-secondary-100 flex items-center justify-between text-xs text-secondary-500">
                  <span>ETA: {formatDateShort(shipment.estimatedArrival)}</span>
                  <span>{formatWeight(shipment.weight)}</span>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={pagination.goToPage} />
        </>
      )}

      {/* Shipment Detail Drawer */}
      <ShipmentDetailDrawer shipment={selectedShipment} isOpen={drawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default Shipments;
