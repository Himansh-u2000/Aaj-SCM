import { memo, useState, useCallback } from 'react';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Drawer from '../../components/Drawer/Drawer';
import Timeline from '../../components/Timeline/Timeline';
import RouteProgress from '../../components/RouteProgress/RouteProgress';
import { formatDateShort, formatWeight } from '../../utils/formatters';
import logo from '../../assets/logo-1-1-300x108.jpg';

const ShipmentDetailDrawer = ({ shipment, isOpen, onClose }) => {
  const [localNotes, setLocalNotes] = useState([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Merge shipment notes + locally added notes
  const allNotes = shipment ? [...shipment.notes, ...localNotes] : [];

  const handleAddNote = useCallback(() => {
    if (!noteText.trim()) return;
    setLocalNotes((prev) => [
      ...prev,
      { author: 'You', note: noteText.trim(), timestamp: new Date().toISOString() },
    ]);
    setNoteText('');
    setShowNoteInput(false);
  }, [noteText]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
    if (e.key === 'Escape') {
      setShowNoteInput(false);
      setNoteText('');
    }
  }, [handleAddNote]);

  if (!shipment) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="max-w-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-secondary-100">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div>
              <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Shipment ID</p>
              <p className="text-xl font-bold text-secondary-800 mt-0.5">{shipment.trackingNumber}</p>
            </div>
            <img src={logo} alt="AAJ" className="h-8 object-contain" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge status={shipment.status} dot size="md" />
            {shipment.isDelayed && (
              <span className="text-xs text-secondary-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Est. Arrival: {formatDateShort(shipment.estimatedArrival)}
              </span>
            )}
          </div>
        </div>

        {/* Delay Alert */}
        {shipment.isDelayed && shipment.delayDescription && (
          <div className="mx-5 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800">{shipment.delayReason}</p>
                <p className="text-xs text-red-600 mt-0.5">{shipment.delayDescription}</p>
              </div>
            </div>
          </div>
        )}

        {/* Carrier & Weight */}
        <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
          <div className="px-3 py-2.5 bg-secondary-50 rounded-lg">
            <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Carrier</p>
            <p className="text-sm font-semibold text-secondary-800 mt-0.5">{shipment.carrier}</p>
            <p className="text-xs text-secondary-500">Service: {shipment.service}</p>
          </div>
          <div className="px-3 py-2.5 bg-secondary-50 rounded-lg">
            <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Weight & Vol</p>
            <p className="text-sm font-semibold text-secondary-800 mt-0.5">{formatWeight(shipment.weight)}</p>
            <p className="text-xs text-secondary-500">{shipment.pallets} Pallets / {shipment.volume}</p>
          </div>
        </div>

        {/* Route Progress */}
        <div className="mx-5 mt-4">
          <RouteProgress
            origin={shipment.origin}
            destination={shipment.destination}
            status={shipment.status}
            timeline={shipment.timeline}
          />
        </div>

        {/* Tracking History */}
        <div className="mx-5 mt-5 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-secondary-800 mb-4">Tracking History</h3>
          <Timeline events={shipment.timeline} />
        </div>

        {/* Operational Notes */}
        <div className="mx-5 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-secondary-800">Operational Notes</h3>
            {!showNoteInput && (
              <button
                onClick={() => setShowNoteInput(true)}
                className="text-xs font-medium text-primary hover:text-primary-700 transition-colors"
              >
                + Add Note
              </button>
            )}
          </div>

          {/* Add Note Input */}
          {showNoteInput && (
            <div className="mb-3 animate-fade-in">
              <div className="border border-secondary-200 rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your note here..."
                  rows={2}
                  autoFocus
                  className="w-full px-3 py-2 text-sm text-secondary-800 bg-transparent border-none outline-none resize-none placeholder:text-secondary-400"
                />
                <div className="flex items-center justify-between px-3 py-2 border-t border-secondary-100">
                  <span className="text-[10px] text-secondary-400">Press Enter to submit · Esc to cancel</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { setShowNoteInput(false); setNoteText(''); }}
                      className="px-2.5 py-1 text-xs font-medium text-secondary-500 hover:text-secondary-700 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {allNotes.length > 0 ? (
            <div className="space-y-2">
              {allNotes.map((note, i) => (
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
          <Button variant="outline" size="md" className="flex-1" leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }>Update ETA</Button>
          <Button variant="primary" size="md" className="flex-1" leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }>Contact Carrier</Button>
        </div>
      </div>
    </Drawer>
  );
};

export default memo(ShipmentDetailDrawer);
