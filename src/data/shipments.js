import { SHIPMENT_STATUS } from '../utils/constants';

const carriers = [
  'Global Freight Inc.', 'Swift Logistics', 'Pacific Cargo Lines',
  'Continental Express', 'Eagle Transport', 'Atlas Shipping Co.',
  'Meridian Freight', 'Apex Carriers', 'Delta Air Cargo', 'OceanWay Shipping',
];

const services = [
  'Priority Air', 'Standard Ground', 'Express Freight', 'Ocean Cargo',
  'Rail Freight', 'Economy Air', 'Same Day', 'Next Day Air',
];

const locations = [
  { name: 'Shenzhen, CN', code: 'SZX' },
  { name: 'Rotterdam, NL', code: 'RTM' },
  { name: 'Frankfurt, DE', code: 'FRA' },
  { name: 'Chicago, IL', code: 'ORD' },
  { name: 'Los Angeles, CA', code: 'LAX' },
  { name: 'Singapore, SG', code: 'SIN' },
  { name: 'Mumbai, IN', code: 'BOM' },
  { name: 'Dubai, AE', code: 'DXB' },
  { name: 'London, UK', code: 'LHR' },
  { name: 'Tokyo, JP', code: 'NRT' },
  { name: 'Sydney, AU', code: 'SYD' },
  { name: 'New York, NY', code: 'JFK' },
];

const timelineEventTypes = [
  'Order Placed & Processed',
  'Departed Origin Hub',
  'Arrived at Port of Entry',
  'Customs Cleared',
  'In Transit to Destination',
  'Arrived at Sorting Facility',
  'Held at Sorting Facility',
  'Out for Delivery',
  'Delivered',
];

const exceptionNotes = [
  'Weather conditions delaying outbound flights.',
  'Customs documentation requires additional verification.',
  'Vehicle breakdown — replacement dispatched.',
  'Port congestion causing delays.',
  'Security hold — random inspection.',
  'Address verification required.',
  'Recipient unavailable — delivery rescheduled.',
];

const operationalNotes = [
  { author: 'Rajesh Kumar', note: 'Contacted carrier for status update.' },
  { author: 'Priya Sharma', note: 'Customer notified about delay.' },
  { author: 'System', note: 'Auto-escalated due to SLA breach.' },
  { author: 'Amit Patel', note: 'Rerouted via alternate hub.' },
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTimeline = (status, daysAgo) => {
  const events = [];
  const numEvents = status === SHIPMENT_STATUS.DELIVERED ? randomBetween(5, 7) : randomBetween(2, 5);
  
  for (let i = 0; i < numEvents; i++) {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() - daysAgo + i);
    eventDate.setHours(randomBetween(6, 22), randomBetween(0, 59));

    const eventType = timelineEventTypes[Math.min(i, timelineEventTypes.length - 1)];
    const isException = eventType === 'Held at Sorting Facility' && status === SHIPMENT_STATUS.DELAYED;

    events.push({
      id: i + 1,
      event: eventType,
      location: `${randomFrom(locations).name}`,
      facility: randomFrom(['International Airport', 'Cargo Hub', 'Distribution Center', 'Sorting Facility']),
      timestamp: eventDate.toISOString(),
      completed: i < numEvents - 1 || status === SHIPMENT_STATUS.DELIVERED,
      isException,
      exceptionNote: isException ? randomFrom(exceptionNotes) : null,
    });
  }

  return events.reverse();
};

const generateShipments = (count = 200) => {
  const statuses = [
    SHIPMENT_STATUS.IN_TRANSIT,
    SHIPMENT_STATUS.DELIVERED,
    SHIPMENT_STATUS.DELAYED,
    SHIPMENT_STATUS.EXCEPTION,
    SHIPMENT_STATUS.PENDING,
    SHIPMENT_STATUS.OUT_FOR_DELIVERY,
  ];

  const shipments = [];
  for (let i = 0; i < count; i++) {
    const status = randomFrom(statuses);
    const origin = randomFrom(locations);
    let dest = randomFrom(locations);
    while (dest.code === origin.code) dest = randomFrom(locations);

    const daysAgo = randomBetween(0, 30);
    const isDelayed = status === SHIPMENT_STATUS.DELAYED || status === SHIPMENT_STATUS.EXCEPTION;

    shipments.push({
      id: i + 1,
      trackingNumber: `TRK-${randomBetween(10000, 99999)}-${String.fromCharCode(65 + randomBetween(0, 25))}${randomBetween(0, 9)}${String.fromCharCode(65 + randomBetween(0, 25))}`,
      orderId: `TRK-${8900 + randomBetween(0, 500)}`,
      carrier: randomFrom(carriers),
      service: randomFrom(services),
      status,
      isDelayed,
      origin: { name: origin.name, code: origin.code },
      destination: { name: dest.name, code: dest.code },
      currentLocation: randomFrom(locations).name,
      weight: randomBetween(50, 5000),
      volume: `${randomBetween(1, 20)} CBM`,
      pallets: randomBetween(1, 12),
      estimatedArrival: new Date(Date.now() + randomBetween(1, 14) * 86400000).toISOString(),
      createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      timeline: generateTimeline(status, daysAgo),
      notes: isDelayed ? [randomFrom(operationalNotes)] : [],
      delayReason: isDelayed ? randomFrom([
        'Weather Delay at Hub',
        'Customs Hold',
        'Port Congestion',
        'Vehicle Breakdown',
        'Security Inspection',
      ]) : null,
      delayDescription: isDelayed ? `Shipment is held at sorting facility due to severe weather conditions in the region. Expected delay of ${randomBetween(12, 72)} hours.` : null,
    });
  }
  return shipments;
};

export const mockShipments = generateShipments(250);
