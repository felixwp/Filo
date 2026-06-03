/* Filo POS — fake data for the UI kit prototype. Attaches to window.FILO_DATA. */
(function () {
  const staff = [
    { id: 's1', name: 'Marco Bellini', role: 'Front of house', section: 'Section A', initials: 'MB' },
    { id: 's2', name: 'Priya Nair',    role: 'Sommelier',      section: 'Section B', initials: 'PN' },
    { id: 's3', name: 'Tom Hayes',     role: 'Manager',        section: 'All floor', initials: 'TH' },
    { id: 's4', name: 'Aoife Byrne',   role: 'Front of house', section: 'Section C', initials: 'AB' },
  ];

  // Floor plan tables. status: available | occupied | ordering | bill
  const tables = [
    { id: 't1',  num: 1,  seats: 2, x: 40,  y: 70,  shape: 'round',  status: 'occupied', covers: 2, mins: 24, section: 'A' },
    { id: 't2',  num: 2,  seats: 2, x: 180, y: 70,  shape: 'round',  status: 'available', section: 'A' },
    { id: 't3',  num: 3,  seats: 4, x: 320, y: 60,  shape: 'square', status: 'ordering', covers: 4, mins: 8, section: 'A' },
    { id: 't4',  num: 4,  seats: 4, x: 480, y: 60,  shape: 'square', status: 'occupied', covers: 3, mins: 51, section: 'B' },
    { id: 't5',  num: 5,  seats: 2, x: 620, y: 70,  shape: 'round',  status: 'available', section: 'B' },
    { id: 't8',  num: 8,  seats: 4, x: 40,  y: 250, shape: 'square', status: 'bill', covers: 4, mins: 96, bill: 164, section: 'A' },
    { id: 't9',  num: 9,  seats: 6, x: 200, y: 240, shape: 'rect',   status: 'occupied', covers: 5, mins: 33, section: 'B' },
    { id: 't10', num: 10, seats: 2, x: 440, y: 250, shape: 'round',  status: 'available', section: 'C' },
    { id: 't12', num: 12, seats: 2, x: 580, y: 250, shape: 'round',  status: 'occupied', covers: 2, mins: 42, birthday: true, section: 'C' },
    { id: 't14', num: 14, seats: 8, x: 40,  y: 430, shape: 'rect',   status: 'ordering', covers: 7, mins: 12, section: 'C' },
    { id: 't15', num: 15, seats: 4, x: 300, y: 440, shape: 'square', status: 'available', section: 'C' },
    { id: 't16', num: 16, seats: 2, x: 460, y: 440, shape: 'round',  status: 'available', section: 'B' },
  ];

  const menu = {
    Starters: [
      { id: 'm1', name: 'Burrata, peach & basil', price: 14, tags: ['V', 'GF'], pair: ['w2'] },
      { id: 'm2', name: 'Beef tartare, capers', price: 16, tags: [], pair: ['w1'] },
      { id: 'm3', name: 'Charred leeks, romesco', price: 12, tags: ['VG', 'GF'], pair: ['w3'] },
      { id: 'm4', name: 'Crispy squid, aioli', price: 13, tags: ['DF'], pair: ['w2'] },
    ],
    Mains: [
      { id: 'm5', name: 'Dry-aged sirloin, 300g', price: 34, tags: ['GF'], pair: ['w1', 'c1'] },
      { id: 'm6', name: 'Hand-rolled tagliatelle', price: 19, tags: ['V'], pair: ['w2'] },
      { id: 'm7', name: 'Whole sea bream', price: 28, tags: ['GF', 'DF'], pair: ['w3'] },
      { id: 'm8', name: 'Roast cauliflower, tahini', price: 17, tags: ['VG', 'GF', 'DF'], pair: ['w3'] },
    ],
    Sides: [
      { id: 'm9', name: 'Triple-cooked chips', price: 6, tags: ['VG', 'GF', 'DF'], pair: [] },
      { id: 'm10', name: 'Charred hispi', price: 7, tags: ['V', 'GF'], pair: [] },
    ],
    Desserts: [
      { id: 'm11', name: 'Dark chocolate délice', price: 10, tags: ['V'], pair: ['w4'] },
      { id: 'm12', name: 'Affogato', price: 8, tags: ['V', 'GF'], pair: ['c2'] },
    ],
    Wine: [
      { id: 'w1', name: 'Margaux 2015', price: 18, unit: '175ml', tags: [], kind: 'wine', pair: ['m5', 'm2'] },
      { id: 'w2', name: 'Sancerre, Loire', price: 12, unit: '175ml', tags: [], kind: 'wine', pair: ['m1', 'm6'] },
      { id: 'w3', name: 'Assyrtiko, Santorini', price: 11, unit: '175ml', tags: [], kind: 'wine', pair: ['m7', 'm8'] },
      { id: 'w4', name: 'Tawny Port, 10yr', price: 9, unit: '75ml', tags: [], kind: 'wine', pair: ['m11'] },
    ],
    Cocktails: [
      { id: 'c1', name: 'Old Fashioned', price: 13, tags: [], kind: 'cocktail', pair: ['m5'] },
      { id: 'c2', name: 'Espresso Martini', price: 12, tags: [], kind: 'cocktail', pair: ['m12'] },
      { id: 'c3', name: 'Negroni', price: 12, tags: [], kind: 'cocktail', pair: [] },
    ],
  };

  // flat lookup
  const byId = {};
  Object.values(menu).forEach(list => list.forEach(i => { byId[i.id] = i; }));

  const dashboard = {
    revenue: 8420,
    covers: 86,
    avgSpend: 48.2,
    tips: 612,
    open: 7,
    topItems: [
      { name: 'Dry-aged sirloin', count: 23, revenue: 782 },
      { name: 'Margaux 2015', count: 19, revenue: 342 },
      { name: 'Burrata, peach', count: 17, revenue: 238 },
      { name: 'Old Fashioned', count: 15, revenue: 195 },
    ],
    hourly: [6, 12, 22, 38, 64, 78, 86, 72, 48, 30],
    labourPct: 33.7,
    labourTarget: 30,
    labourStatus: 'amber',
    channels: [
      { label: 'Dine-in',       pct: 81, revenue: 6820 },
      { label: 'Delivery',      pct: 12, revenue:  980 },
      { label: 'QR / Takeaway', pct:  7, revenue:  620 },
    ],
  };

  window.FILO_DATA = { staff, tables, menu, byId, dashboard };
})();
