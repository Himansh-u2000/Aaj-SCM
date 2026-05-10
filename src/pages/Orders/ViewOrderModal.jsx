import { memo } from 'react';
import Modal from '../../components/Modal/Modal';
import Badge from '../../components/Badge/Badge';
import { formatCurrency, formatDateShort } from '../../utils/formatters';

/**
 * View Order Modal — displays detailed order information in a read-only grid.
 */
const ViewOrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <Modal isOpen={!!order} onClose={onClose} title="Order Details" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold text-primary">{order.orderId}</p>
            <p className="text-sm text-secondary-500 mt-0.5">Tracking: {order.trackingNumber}</p>
          </div>
          <Badge status={order.status} size="md" dot />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Customer', value: order.customer },
            { label: 'Destination', value: order.destination },
            { label: 'Order Date', value: formatDateShort(order.date) },
            { label: 'Amount', value: formatCurrency(order.amount) },
            { label: 'Priority', value: order.priority },
            { label: 'Items', value: `${order.items} items · ${order.weight}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-secondary-50 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-secondary-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Logistics Details */}
        <div>
          <p className="text-xs font-semibold text-secondary-600 uppercase tracking-wider mb-2">Logistics Details</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Carrier', value: order.carrier },
              { label: 'Transportation Mode', value: order.transportationMode },
              { label: 'Vehicle', value: order.vehicleName },
              { label: 'Actual Delivery', value: order.actualDelivery ? formatDateShort(order.actualDelivery) : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-secondary-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="border border-secondary-100 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Estimated Delivery</p>
            <p className="text-sm font-semibold text-secondary-800">{formatDateShort(order.estimatedDelivery)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ViewOrderModal);
