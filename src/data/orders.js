import { ORDER_STATUS } from '../utils/constants';

const customers = [
  'Acme Corp Logistics', 'Global Supply Inc.', 'Nexus Retail', 'Prime Industries',
  'Summit Foods', 'TechLine Solutions', 'Meridian Exports', 'Atlas Freight Co.',
  'Pinnacle Trading', 'OceanView Imports', 'Swift Commerce', 'Nova Manufacturing',
  'Sterling Wholesale', 'Pacific Rim Traders', 'Continental Goods', 'Eagle Distribution',
  'Metro Supplies', 'Vanguard Shipping', 'Horizon Logistics', 'Apex Materials',
  'Delta Cargo', 'Quantum Retail', 'FusionTech Corp', 'Skyline Distributors',
  'Emerald Trading Co.',
];

const destinations = [
  { city: 'Chicago', state: 'IL' }, { city: 'Frankfurt', state: 'DE' },
  { city: 'Seattle', state: 'WA' }, { city: 'Dallas', state: 'TX' },
  { city: 'Denver', state: 'CO' }, { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' }, { city: 'Miami', state: 'FL' },
  { city: 'London', state: 'UK' }, { city: 'Tokyo', state: 'JP' },
  { city: 'Singapore', state: 'SG' }, { city: 'Mumbai', state: 'IN' },
  { city: 'Sydney', state: 'AU' }, { city: 'Toronto', state: 'CA' },
  { city: 'Dubai', state: 'AE' }, { city: 'Shanghai', state: 'CN' },
  { city: 'Rotterdam', state: 'NL' }, { city: 'Hamburg', state: 'DE' },
  { city: 'São Paulo', state: 'BR' }, { city: 'Mexico City', state: 'MX' },
];

const statuses = [
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.DELAYED,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
];

const priorities = ['High', 'Medium', 'Low'];

const carriers = [
  'Global Freight Inc.', 'Swift Logistics', 'Pacific Cargo Lines',
  'Continental Express', 'Eagle Transport', 'Atlas Shipping Co.',
  'Meridian Freight', 'Apex Carriers', 'Delta Air Cargo', 'OceanWay Shipping',
];

const vehicles = [
  'MH-12-AB-1234', 'DL-01-CD-5678', 'KA-05-EF-9012', 'TN-09-GH-3456',
  'GJ-06-IJ-7890', 'RJ-14-KL-2345', 'UP-32-MN-6789', 'AP-09-OP-0123',
];

const transportationModes = ['Road', 'Air', 'Sea', 'Rail', 'Multimodal'];

const generateOrderId = (index) => `TRK-${8900 + index}`;

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomAmount = () => (Math.random() * 15000 + 500).toFixed(2);

const generateDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomBetween(6, 22), randomBetween(0, 59), 0, 0);
  return date.toISOString();
};

const generateOrders = (count = 500) => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const dest = randomFrom(destinations);
    const status = randomFrom(statuses);
    const daysAgo = randomBetween(0, 60);
    const createdAt = generateDate(daysAgo);

    orders.push({
      id: i + 1,
      orderId: generateOrderId(i + 2),
      customer: randomFrom(customers),
      destination: `${dest.city}, ${dest.state}`,
      region: dest.state,
      date: createdAt,
      amount: parseFloat(randomAmount()),
      status,
      priority: randomFrom(priorities),
      items: randomBetween(1, 25),
      weight: `${randomBetween(10, 5000)} kg`,
      estimatedDelivery: generateDate(daysAgo - randomBetween(2, 10)),
      trackingNumber: `TRK-${randomBetween(10000, 99999)}-${String.fromCharCode(65 + randomBetween(0, 25))}${randomBetween(0, 9)}${String.fromCharCode(65 + randomBetween(0, 25))}`,
      carrier: randomFrom(carriers),
      vehicleName: randomFrom(vehicles),
      transportationMode: randomFrom(transportationModes),
      actualDelivery: status === ORDER_STATUS.DELIVERED ? generateDate(daysAgo - randomBetween(1, 5)) : null,
    });
  }
  return orders;
};

export const mockOrders = generateOrders(1248);
