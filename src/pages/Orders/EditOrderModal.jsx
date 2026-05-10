import { memo, useState, useCallback } from 'react';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import { formatCurrency } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
import { updateOrderStatus } from '../../services/orderService';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/toastSlice';

/**
 * Edit Order Modal — allows changing the order status.
 */
const EditOrderModal = ({ order, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const [editStatus, setEditStatus] = useState(order?.status || '');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!order) return;
    setSaving(true);
    const result = await updateOrderStatus(order.id, editStatus);
    if (result.success) {
      dispatch(showToast(`Order ${order.orderId} updated to ${editStatus}`, 'success'));
      onSaved?.();
      onClose();
    } else {
      dispatch(showToast('Failed to update order', 'error'));
    }
    setSaving(false);
  }, [order, editStatus, dispatch, onSaved, onClose]);

  if (!order) return null;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title="Edit Order"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Order info header */}
        <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-secondary-800">{order.orderId}</p>
            <p className="text-xs text-secondary-500">{order.customer} · {order.destination}</p>
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
          {[
            { label: 'Amount', value: formatCurrency(order.amount) },
            { label: 'Priority', value: order.priority },
            { label: 'Items', value: `${order.items} items` },
            { label: 'Weight', value: order.weight },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-secondary-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default memo(EditOrderModal);
