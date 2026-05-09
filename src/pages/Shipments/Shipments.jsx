import { useState, useEffect, useCallback } from 'react';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
import Drawer from '../../components/Drawer/Drawer';
import Timeline from '../../components/Timeline/Timeline';
import EmptyState from '../../components/EmptyState/EmptyState';
import { Spinner } from '../../components/Loader/Loader';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getShipments, getShipmentCounts } from '../../services/shipmentService';
import { formatDateShort, formatWeight } from '../../utils/formatters';
import { SHIPMENT_STATUS } from '../../utils/constants';
import logo from '../../assets/logo-1-1-300x108.jpg';

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
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === tab
                ? 'bg-primary text-white'
                : 'bg-white text-secondary-600 border border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            {tab}
            {counts[tab] !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                statusFilter === tab ? 'bg-white/20' : 'bg-secondary-100'
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shipments List */}
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
                  <div className="mt-3 flex items-center gap-2 text-xs text-secondary-500">
                    <span className="font-medium text-secondary-700">{shipment.origin.code}</span>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-px bg-secondary-200" />
                      <svg className="w-3 h-3 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      <div className="flex-1 h-px bg-secondary-200" />
                    </div>
                    <span className="font-medium text-secondary-700">{shipment.destination.code}</span>
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
      <Drawer isOpen={drawerOpen} onClose={closeDrawer} width="max-w-lg">
        {selectedShipment && (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 border-b border-secondary-100">
              <div className="flex items-start justify-between gap-3 pr-6">
                <div>
                  <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Shipment ID</p>
                  <p className="text-xl font-bold text-secondary-800 mt-0.5">{selectedShipment.trackingNumber}</p>
                </div>
                <img src={logo} alt="AAJ" className="h-8 object-contain" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge status={selectedShipment.status} dot size="md" />
                {selectedShipment.isDelayed && (
                  <span className="text-xs text-secondary-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Est. Arrival: {formatDateShort(selectedShipment.estimatedArrival)}
                  </span>
                )}
              </div>
            </div>

            {/* Alert for delayed */}
            {selectedShipment.isDelayed && selectedShipment.delayDescription && (
              <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800">{selectedShipment.delayReason}</p>
                    <p className="text-xs text-red-600 mt-0.5">{selectedShipment.delayDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Carrier & Weight Info */}
            <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
              <div className="px-3 py-2.5 bg-secondary-50 rounded-lg">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Carrier</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{selectedShipment.carrier}</p>
                <p className="text-xs text-secondary-500">Service: {selectedShipment.service}</p>
              </div>
              <div className="px-3 py-2.5 bg-secondary-50 rounded-lg">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Weight & Vol</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{formatWeight(selectedShipment.weight)}</p>
                <p className="text-xs text-secondary-500">{selectedShipment.pallets} Pallets / {selectedShipment.volume}</p>
              </div>
            </div>

            {/* Route Overview */}
            <div className="mx-5 mt-4 px-3 py-3 border border-secondary-100 rounded-lg">
              <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider mb-2">Route Overview</p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-sm font-semibold text-secondary-800">{selectedShipment.origin.name}</p>
                  <p className="text-[10px] text-secondary-400">Origin ({selectedShipment.origin.code})</p>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 h-px bg-secondary-300" />
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                  <div className="flex-1 h-px bg-secondary-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-secondary-800">{selectedShipment.destination.name}</p>
                  <p className="text-[10px] text-secondary-400">Destination ({selectedShipment.destination.code})</p>
                </div>
              </div>
            </div>

            {/* Tracking History */}
            <div className="mx-5 mt-5 flex-1 overflow-y-auto">
              <h3 className="text-sm font-semibold text-secondary-800 mb-4">Tracking History</h3>
              <Timeline events={selectedShipment.timeline} />
            </div>

            {/* Operational Notes */}
            <div className="mx-5 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-secondary-800">Operational Notes</h3>
                <button className="text-xs font-medium text-primary hover:text-primary-700 transition-colors">+ Add Note</button>
              </div>
              {selectedShipment.notes.length > 0 ? (
                <div className="space-y-2">
                  {selectedShipment.notes.map((note, i) => (
                    <div key={i} className="px-3 py-2 bg-secondary-50 rounded-lg text-xs">
                      <span className="font-medium text-secondary-700">{note.author}: </span>
                      <span className="text-secondary-600">{note.note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary-400 italic">No operational notes yet.</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-secondary-100 mt-4 flex items-center gap-3">
              <Button variant="outline" size="md" className="flex-1" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                Update ETA
              </Button>
              <Button variant="primary" size="md" className="flex-1" leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}>
                Contact Carrier
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Shipments;
