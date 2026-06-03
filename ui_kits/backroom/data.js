'use strict';
window.BR_DATA = {
  owner: { name: 'Felix Plowman', initials: 'FP', role: 'Owner' },
  venue: { name: 'The Finch', suburb: 'Collingwood, VIC' },

  tonight: {
    revenue:    8420,
    covers:     94,
    avgSpend:   89.6,
    tips:       312,
    openTables: 6,
    hourly: [2, 8, 24, 38, 44, 52, 61, 48, 32, 14],
    hours:  ['5pm','6pm','7pm','8pm','9pm','10pm','11pm','12am','1am','2am'],
    topItems: [
      { name: 'Dry-aged sirloin, 300g',  count: 22, revenue: 1078 },
      { name: 'Dark chocolate délice',   count: 31, revenue:  434 },
      { name: 'Negroni',                 count: 44, revenue:  572 },
      { name: 'Hand-rolled tagliatelle', count: 18, revenue:  558 },
      { name: 'Whole sea bream',         count: 15, revenue:  675 },
    ],
    costs: {
      labour: { amount: 2840, pct: 33.7, target: 30, status: 'amber' },
      food:   {              pct: 29.2, target: 32, status: 'green' },
      prime:  {              pct: 62.9, target: 65, status: 'green' },
      voids:  { amount: 145, pct:  1.7, target:  5, status: 'green' },
    },
    channels: [
      { label: 'Dine-in',       revenue: 6840, pct: 81 },
      { label: 'Delivery',      revenue:  980, pct: 12 },
      { label: 'QR / Takeaway', revenue:  600, pct:  7 },
    ],
    staffOnTonight: [
      { name: 'Priya Mehta',   initials: 'PM', role: 'Floor Manager', section: 'All floor',  clockedIn: '4:45 pm' },
      { name: 'Tom Whitfield', initials: 'TW', role: 'Bar',           section: 'Bar',         clockedIn: '5:00 pm' },
      { name: 'James Okafor',  initials: 'JO', role: 'Senior Waiter', section: 'Section A/B', clockedIn: '5:10 pm' },
      { name: 'Luca Ferrari',  initials: 'LF', role: 'Waiter',        section: 'Section C',   clockedIn: '5:15 pm' },
    ],
  },

  stock: [
    { item: 'Dry-aged sirloin, 300g',     supplier: 'Mornington Meats',    current: 4,   par: 12,  unit: 'kg',       status: 'low'      },
    { item: 'Negroni pre-batch',          supplier: 'Young & Rashleigh',   current: 1.5, par: 4,   unit: 'litres',   status: 'critical' },
    { item: 'Whole sea bream',            supplier: 'Flinders Seafood',    current: 6,   par: 10,  unit: 'portions', status: 'low'      },
    { item: 'Dark chocolate',             supplier: 'Melbourne Fresh Co.', current: 2,   par: 5,   unit: 'kg',       status: 'low'      },
    { item: 'Tagliatelle (house)',        supplier: 'Melbourne Fresh Co.', current: 3,   par: 6,   unit: 'kg',       status: 'low'      },
    { item: 'Pinot Noir, Bass Phillip',   supplier: 'Young & Rashleigh',   current: 8,   par: 24,  unit: 'bottles',  status: 'low'      },
    { item: 'Burrata',                    supplier: 'Primo Dairy',         current: 8,   par: 8,   unit: 'balls',    status: 'ok'       },
    { item: 'Charred leeks',              supplier: 'Melbourne Fresh Co.', current: 14,  par: 20,  unit: 'kg',       status: 'ok'       },
    { item: 'Sauvignon Blanc, Ata Rangi', supplier: 'Young & Rashleigh',   current: 24,  par: 36,  unit: 'bottles',  status: 'ok'       },
  ],

  suppliers: [
    { id: 1, name: 'Mornington Meats',    category: 'Meat & Poultry', contact: 'Sarah Chen',      phone: '03 5978 1234', email: 'sarah@morningtonmeats.com.au',    nextOrder: 'Tomorrow · Wed 4 Jun',  dueToday: true  },
    { id: 2, name: 'Flinders Seafood',    category: 'Seafood',        contact: 'Tom Russo',       phone: '03 5989 5678', email: 'tom@flindersseafood.com.au',      nextOrder: 'Thu 5 Jun',              dueToday: false },
    { id: 3, name: 'Melbourne Fresh Co.', category: 'Produce',        contact: 'James Whitfield', phone: '03 9123 4567', email: 'james@melbournefresh.com.au',     nextOrder: 'Sat 6 Jun',              dueToday: false },
    { id: 4, name: 'Young & Rashleigh',   category: 'Wine & Spirits', contact: 'Emma Barker',     phone: '02 9876 5432', email: 'emma@youngandrashleigh.com.au',   nextOrder: 'Tue 9 Jun',              dueToday: false },
    { id: 5, name: 'Primo Dairy',         category: 'Dairy & Eggs',   contact: 'Nick Portelli',   phone: '03 9345 6789', email: 'nick@primodairy.com.au',          nextOrder: 'Sat 6 Jun',              dueToday: false },
  ],

  priceAlerts: [
    { item: 'Dry-aged sirloin, 300g', supplier: 'Mornington Meats',  oldPrice: 48.50, newPrice: 54.00, unit: 'per kg',      changePct: 11.3 },
    { item: 'Whole sea bream',        supplier: 'Flinders Seafood',   oldPrice: 22.00, newPrice: 26.50, unit: 'per portion', changePct: 20.5 },
  ],

  aiOrder: {
    supplierName: 'Mornington Meats',
    dueDate: 'Tomorrow · Wed 4 Jun',
    lines: [
      { item: 'Dry-aged sirloin, 300g', qty: '10 kg', note: 'Low stock · 3 nights at current pace'  },
      { item: 'Chicken supreme',        qty: '4 kg',  note: 'Consistent weekly usage'                },
      { item: 'Lamb rack',              qty: '3 kg',  note: 'New Thursday special added'             },
      { item: 'Pork belly, skin-on',    qty: '2 kg',  note: 'Based on last 3-week average'          },
    ],
    basis: 'Suggested from 4-week sales data, current stock levels, and this week\'s bookings: 94 Tue · 112 Wed · 88 Thu.',
  },

  staff: [
    { id: 1, name: 'Priya Mehta',   role: 'Floor Manager', rate: 38, initials: 'PM',
      shiftDays: [{ day:'Mon', hours:7.5, penalty:1.0 },{ day:'Tue', hours:7.5, penalty:1.0 },{ day:'Wed', hours:7.5, penalty:1.0 },{ day:'Fri', hours:7.5, penalty:1.0 },{ day:'Sat', hours:6.5, penalty:1.25 }] },
    { id: 2, name: 'Tom Whitfield', role: 'Bar',           rate: 35, initials: 'TW',
      shiftDays: [{ day:'Tue', hours:6.0, penalty:1.0 },{ day:'Wed', hours:6.0, penalty:1.0 },{ day:'Thu', hours:6.0, penalty:1.0 },{ day:'Fri', hours:6.0, penalty:1.0 },{ day:'Sat', hours:7.0, penalty:1.25 }] },
    { id: 3, name: 'James Okafor',  role: 'Senior Waiter', rate: 34, initials: 'JO',
      shiftDays: [{ day:'Tue', hours:7.0, penalty:1.0 },{ day:'Thu', hours:7.0, penalty:1.0 },{ day:'Fri', hours:7.0, penalty:1.0 },{ day:'Sat', hours:8.0, penalty:1.25 }] },
    { id: 4, name: 'Chloe Nguyen',  role: 'Waiter',        rate: 32, initials: 'CN',
      shiftDays: [{ day:'Wed', hours:6.0, penalty:1.0 },{ day:'Thu', hours:6.0, penalty:1.0 },{ day:'Fri', hours:6.0, penalty:1.0 },{ day:'Sat', hours:6.5, penalty:1.25 }] },
    { id: 5, name: 'Luca Ferrari',  role: 'Waiter',        rate: 32, initials: 'LF',
      shiftDays: [{ day:'Mon', hours:6.5, penalty:1.0 },{ day:'Tue', hours:6.5, penalty:1.0 },{ day:'Sat', hours:7.0, penalty:1.25 }] },
    { id: 6, name: 'Sophie Park',   role: 'Runner',        rate: 28, initials: 'SP',
      shiftDays: [{ day:'Fri', hours:6.0, penalty:1.0 },{ day:'Sat', hours:6.5, penalty:1.25 },{ day:'Sun', hours:6.0, penalty:1.5 }] },
    { id: 7, name: 'Anika Ross',    role: 'Runner',        rate: 28, initials: 'AR',
      shiftDays: [{ day:'Wed', hours:5.0, penalty:1.0 },{ day:'Fri', hours:5.5, penalty:1.0 },{ day:'Sat', hours:5.5, penalty:1.25 }] },
  ],
  tipPool: { total: 1840, period: 'Mon 2 – Sat 7 Jun 2026' },

  menuItems: [
    { name: 'Sparkling water, 750mL',     category: 'Non-alc',   sold: 62, revenue: 434,  margin: 85.7 },
    { name: 'Triple-cooked chips',        category: 'Sides',     sold: 45, revenue: 449,  margin: 80.0 },
    { name: 'Negroni',                    category: 'Cocktails', sold: 44, revenue: 572,  margin: 80.1 },
    { name: 'House red wine',             category: 'Wine',      sold: 38, revenue: 760,  margin: 70.0 },
    { name: 'Dark chocolate délice',      category: 'Dessert',   sold: 31, revenue: 434,  margin: 64.3 },
    { name: 'Charred leeks, romesco',     category: 'Entrées',   sold: 28, revenue: 504,  margin: 66.7 },
    { name: 'Crispy squid, aioli',        category: 'Entrées',   sold: 24, revenue: 432,  margin: 61.1 },
    { name: 'Dry-aged sirloin, 300g',     category: 'Mains',     sold: 22, revenue: 1078, margin: 45.5 },
    { name: 'Burrata, peach & basil',     category: 'Entrées',   sold: 21, revenue: 399,  margin: 57.9 },
    { name: 'Hand-rolled tagliatelle',    category: 'Mains',     sold: 18, revenue: 558,  margin: 54.8 },
    { name: 'Beef tartare, capers',       category: 'Entrées',   sold: 17, revenue: 442,  margin: 53.8 },
    { name: 'Whole sea bream',            category: 'Mains',     sold: 15, revenue: 675,  margin: 48.9 },
    { name: 'Sauvignon Blanc, Ata Rangi', category: 'Wine',      sold: 12, revenue: 588,  margin: 42.9 },
    { name: 'Roast cauliflower, tahini',  category: 'Mains',     sold:  8, revenue: 200,  margin: 60.0 },
    { name: 'Vanilla ice cream',          category: 'Dessert',   sold:  6, revenue:  90,  margin: 66.7 },
  ],
  marginTarget: 60,

  dailyRevenue: [
    { day: 'Mon', date: '2 Jun', revenue: 3200,  lastWeek: 2900  },
    { day: 'Tue', date: '3 Jun', revenue: 4800,  lastWeek: 4200  },
    { day: 'Wed', date: '4 Jun', revenue: 5400,  lastWeek: 4800  },
    { day: 'Thu', date: '5 Jun', revenue: 5800,  lastWeek: 5400  },
    { day: 'Fri', date: '6 Jun', revenue: 8600,  lastWeek: 7900  },
    { day: 'Sat', date: '7 Jun', revenue: 12400, lastWeek: 11200 },
    { day: 'Sun', date: '8 Jun', revenue: 2600,  lastWeek: 2100  },
  ],

  weeklyRevenue: [
    { label: '7 Apr',  value: 31200 },
    { label: '14 Apr', value: 33800 },
    { label: '21 Apr', value: 29400 },
    { label: '28 Apr', value: 35100 },
    { label: '5 May',  value: 36200 },
    { label: '12 May', value: 34900 },
    { label: '19 May', value: 38600 },
    { label: '26 May', value: 42800 },
  ],

  weekComps: [
    { label: 'This week', revenue: 42800, covers: 487, avgSpend: 87.9, tips: 1840 },
    { label: 'Last week', revenue: 38600, covers: 451, avgSpend: 85.6, tips: 1620 },
    { label: '4-wk avg',  revenue: 36200, covers: 430, avgSpend: 84.2, tips: 1520 },
  ],

  insights: [
    { icon: 'trending-up', tone: 'green', title: 'Revenue up 10.9%',       body: 'vs last week. Strongest night: Saturday $12,400.'                                                        },
    { icon: 'clock',       tone: 'amber', title: 'Peak hour shifting',      body: '9pm is now your highest-volume hour, up from 8pm last month. Consider adjusting kitchen prep timing.'   },
    { icon: 'star',        tone: 'gold',  title: 'Dark chocolate délice',   body: 'Your top seller this week — outsold all other desserts 3:1. Worth a spotlight on the wine list.'        },
    { icon: 'users',       tone: 'green', title: 'Repeat guests up 18%',    body: '6 guests dined for a second time this week. Month-on-month repeat visits continuing to grow.'           },
  ],
};
