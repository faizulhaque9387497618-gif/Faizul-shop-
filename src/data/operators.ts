import { Operator, RechargeOffer, PaymentGateway, Country, OperatorName } from '../types';

export const INDIAN_OPERATORS: Operator[] = [
  {
    id: 'Jio',
    country: 'IN',
    name: 'Jio',
    nameLocal: 'रिलायंस जियो',
    color: '#0F3CC9',
    lightBg: '#EBF1FD',
    borderColor: '#9BB8F9',
    prefixes: ['600', '700', '701', '798', '799', '800', '888', '899', '900', '932', '933'],
    tagline: 'True 5G • Digital Life',
    logoLetter: 'Jio'
  },
  {
    id: 'Airtel',
    country: 'IN',
    name: 'Airtel',
    nameLocal: 'एयरटेल',
    color: '#E40000',
    lightBg: '#FDF0F0',
    borderColor: '#F8A5A5',
    prefixes: ['981', '982', '983', '984', '987', '991', '992', '993', '994', '801', '813'],
    tagline: 'airtel 5G Plus',
    logoLetter: 'A'
  },
  {
    id: 'Vi',
    country: 'IN',
    name: 'Vi',
    nameLocal: 'वोडाफोन आइडिया',
    color: '#E1192A',
    lightBg: '#FFF3E8',
    borderColor: '#FFC899',
    prefixes: ['989', '998', '999', '971', '972', '973', '912', '913', '914'],
    tagline: 'Together For Tomorrow • Binge All Night',
    logoLetter: 'Vi'
  },
  {
    id: 'BSNL',
    country: 'IN',
    name: 'BSNL',
    nameLocal: 'बीएसएनएल',
    color: '#005A9C',
    lightBg: '#E8F3FA',
    borderColor: '#A1CFEE',
    prefixes: ['940', '941', '942', '943', '944', '945', '946', '947', '948', '949', '950'],
    tagline: 'Connecting India • Desh Ka Network',
    logoLetter: 'B'
  },
  {
    id: 'MTNL',
    country: 'IN',
    name: 'MTNL',
    nameLocal: 'एमटीएनएल',
    color: '#D32F2F',
    lightBg: '#FDECEC',
    borderColor: '#F7A7A7',
    prefixes: ['986', '996'],
    tagline: 'Mumbai & Delhi Metro Services',
    logoLetter: 'M'
  }
];

export const BANGLADESH_OPERATORS: Operator[] = [
  {
    id: 'Grameenphone',
    country: 'BD',
    name: 'Grameenphone',
    nameLocal: 'গ্রামীণফোন',
    color: '#008FD3',
    lightBg: '#EBF6FC',
    borderColor: '#99D3F3',
    prefixes: ['017', '013'],
    tagline: 'Stay Connected',
    logoLetter: 'GP'
  },
  {
    id: 'Robi',
    country: 'BD',
    name: 'Robi',
    nameLocal: 'রবি',
    color: '#EC1C24',
    lightBg: '#FDE8E9',
    borderColor: '#F7A5A8',
    prefixes: ['018'],
    tagline: 'Ignite the power within',
    logoLetter: 'R'
  },
  {
    id: 'Airtel',
    country: 'BD',
    name: 'Airtel BD',
    nameLocal: 'এয়ারটেল',
    color: '#ED1B24',
    lightBg: '#FDE9EA',
    borderColor: '#F8A4A7',
    prefixes: ['016'],
    tagline: 'The smartphone network',
    logoLetter: 'A'
  },
  {
    id: 'Banglalink',
    country: 'BD',
    name: 'Banglalink',
    nameLocal: 'বাংলালিংক',
    color: '#FF7A00',
    lightBg: '#FFF2E6',
    borderColor: '#FFC899',
    prefixes: ['019', '014'],
    tagline: 'দিন বদলের ডাক',
    logoLetter: 'BL'
  },
  {
    id: 'Teletalk',
    country: 'BD',
    name: 'Teletalk',
    nameLocal: 'টেলিটক',
    color: '#109D59',
    lightBg: '#E7F6EE',
    borderColor: '#9FE1BE',
    prefixes: ['015'],
    tagline: 'আমাদের ফোন',
    logoLetter: 'TT'
  }
];

export const INDIAN_CIRCLES = [
  'Delhi NCR',
  'Mumbai',
  'Kolkata',
  'West Bengal',
  'UP East',
  'UP West',
  'Bihar & Jharkhand',
  'Maharashtra & Goa',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'Andhra Pradesh & Telangana',
  'Rajasthan',
  'Punjab',
  'Madhya Pradesh & CG',
  'Kerala'
];

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    tag: 'UPI • Instant Cashback up to ₹50',
    color: '#5f259f',
    badge: 'Popular',
    iconType: 'phonepe'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    tag: 'Paytm UPI / Paytm Wallet',
    color: '#00baf2',
    badge: 'Fast & Secure',
    iconType: 'paytm'
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    tag: 'Google Pay UPI AutoPay',
    color: '#1a73e8',
    iconType: 'gpay'
  },
  {
    id: 'bhim_upi',
    name: 'BHIM UPI',
    tag: 'Any UPI App (Cred, Navi, Jupiter)',
    color: '#FF9933',
    iconType: 'upi'
  }
];

export const INDIAN_RECHARGE_OFFERS: RechargeOffer[] = [
  {
    id: 'in-1',
    country: 'IN',
    operator: 'Jio',
    amount: 239,
    title: '1.5 GB/day + Unlimited Calls',
    validity: '28 Days',
    category: 'popular',
    badge: 'Best Seller',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day (42 GB Total)',
    sms: '100 SMS/day'
  },
  {
    id: 'in-2',
    country: 'IN',
    operator: 'Jio',
    amount: 299,
    title: '2 GB/day + Unlimited True 5G',
    validity: '28 Days',
    category: 'unlimited',
    badge: '5G Unlimited',
    voice: 'Truly Unlimited',
    data: '2 GB/Day + Unlimited 5G',
    sms: '100 SMS/day'
  },
  {
    id: 'in-3',
    country: 'IN',
    operator: 'Jio',
    amount: 666,
    title: '1.5 GB/day + Unlimited Calls',
    validity: '70 Days',
    category: 'popular',
    badge: 'Great Value',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day (105 GB)',
    sms: '100 SMS/day'
  },
  {
    id: 'in-4',
    country: 'IN',
    operator: 'Jio',
    amount: 849,
    title: '2 GB/day + Unlimited 5G + Hotstar Mobile',
    validity: '84 Days',
    category: 'unlimited',
    badge: 'OTT Included',
    voice: 'Truly Unlimited',
    data: '2 GB/Day (168 GB)',
    sms: '100 SMS/day'
  },
  {
    id: 'in-5',
    country: 'IN',
    operator: 'Jio',
    amount: 19,
    title: 'Data Booster 1.5 GB',
    validity: 'Active Plan',
    category: 'data',
    badge: 'Top Data Add-on',
    data: '1.5 GB High Speed'
  },
  {
    id: 'in-6',
    country: 'IN',
    operator: 'Airtel',
    amount: 299,
    title: '1.5 GB/day + Unlimited Calls + Wynk Music',
    validity: '28 Days',
    category: 'popular',
    badge: 'Best Seller',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day',
    sms: '100 SMS/day'
  },
  {
    id: 'in-7',
    country: 'IN',
    operator: 'Airtel',
    amount: 349,
    title: '2 GB/day + Unlimited 5G Data',
    validity: '28 Days',
    category: 'unlimited',
    badge: 'Unlimited 5G',
    voice: 'Truly Unlimited',
    data: '2 GB/Day + Unlimited 5G',
    sms: '100 SMS/day'
  },
  {
    id: 'in-8',
    country: 'IN',
    operator: 'Airtel',
    amount: 799,
    title: '1.5 GB/day + Unlimited Voice + Apollo 24/7',
    validity: '77 Days',
    category: 'popular',
    badge: 'Value Pack',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day',
    sms: '100 SMS/day'
  },
  {
    id: 'in-9',
    country: 'IN',
    operator: 'Airtel',
    amount: 65,
    title: 'Data Pack 4 GB',
    validity: 'Active Plan',
    category: 'data',
    data: '4 GB High Speed'
  },
  {
    id: 'in-10',
    country: 'IN',
    operator: 'Vi',
    amount: 299,
    title: '1.5 GB/day + Binge All Night (12 AM - 6 AM Free)',
    validity: '28 Days',
    category: 'popular',
    badge: 'Binge Free',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day + Unlimited Night',
    sms: '100 SMS/day'
  },
  {
    id: 'in-11',
    country: 'IN',
    operator: 'Vi',
    amount: 479,
    title: '1.5 GB/day + Weekend Data Rollover',
    validity: '48 Days',
    category: 'popular',
    badge: 'Rollover',
    voice: 'Truly Unlimited',
    data: '1.5 GB/Day',
    sms: '100 SMS/day'
  },
  {
    id: 'in-12',
    country: 'IN',
    operator: 'BSNL',
    amount: 107,
    title: '3 GB Data + 200 Mins Voice Calling',
    validity: '35 Days',
    category: 'popular',
    badge: 'Budget Friendly',
    voice: '200 Mins Local/STD',
    data: '3 GB Total'
  },
  {
    id: 'in-13',
    country: 'IN',
    operator: 'BSNL',
    amount: 197,
    title: '2 GB/day + Unlimited Voice (first 18 days)',
    validity: '70 Days',
    category: 'unlimited',
    badge: 'Long Validity',
    voice: 'Unlimited Local/STD',
    data: '2 GB/Day'
  },
  {
    id: 'in-14',
    country: 'IN',
    operator: 'Jio',
    amount: 3599,
    title: 'Annual 2.5 GB/day + Unlimited 5G for 1 Full Year',
    validity: '365 Days',
    category: 'annual',
    badge: '365 Days',
    voice: 'Truly Unlimited',
    data: '2.5 GB/Day + Unlimited 5G',
    sms: '100 SMS/day'
  }
];

export const BANGLADESH_RECHARGE_OFFERS: RechargeOffer[] = [
  {
    id: 'bd-1',
    country: 'BD',
    operator: 'Grameenphone',
    amount: 48,
    title: '1.5 GB ইন্টারনেট + ৫০ মিনিট',
    validity: '৩ দিন',
    category: 'popular',
    badge: 'হট ডিল'
  },
  {
    id: 'bd-2',
    country: 'BD',
    operator: 'Grameenphone',
    amount: 119,
    title: '5 GB ডাটা প্যাক',
    validity: '৭ দিন',
    category: 'data',
    badge: 'জনপ্রিয়'
  },
  {
    id: 'bd-3',
    country: 'BD',
    operator: 'Robi',
    amount: 98,
    title: '160 মিনিট যে কোনো অপারেটরে',
    validity: '৭ দিন',
    category: 'popular',
    badge: 'সেরা অফার'
  },
  {
    id: 'bd-4',
    country: 'BD',
    operator: 'Banglalink',
    amount: 58,
    title: '3 GB ইন্টারনেট প্যাক',
    validity: '৪ দিন',
    category: 'data'
  },
  {
    id: 'bd-5',
    country: 'BD',
    operator: 'Airtel',
    amount: 39,
    title: '2 GB + ৩০ মিনিট',
    validity: '২ দিন',
    category: 'popular'
  },
  {
    id: 'bd-6',
    country: 'BD',
    operator: 'Teletalk',
    amount: 93,
    title: '5 GB স্টুডেন্ট ডাটা প্যাক',
    validity: '১৫ দিন',
    category: 'data',
    badge: 'স্পেশাল'
  }
];

export const INDIAN_CONTACTS = [
  { name: 'Papa (Jio)', phone: '9876543210', op: 'Jio', circle: 'Delhi NCR' },
  { name: 'Mummy (Airtel)', phone: '9812345678', op: 'Airtel', circle: 'UP West' },
  { name: 'Rahul Friend (Vi)', phone: '9123456789', op: 'Vi', circle: 'Mumbai' },
  { name: 'Work Sim (BSNL)', phone: '9412345678', op: 'BSNL', circle: 'Kolkata' },
  { name: 'Self Jio 5G', phone: '7001234567', op: 'Jio', circle: 'Delhi NCR' }
];

export const BANGLADESH_CONTACTS = [
  { name: 'আম্মু (Mother)', phone: '01712345678', op: 'Grameenphone', circle: 'Dhaka' },
  { name: 'আব্বু (Father)', phone: '01898765432', op: 'Robi', circle: 'Chittagong' },
  { name: 'বন্ধু আসিফ (Friend)', phone: '01911223344', op: 'Banglalink', circle: 'Dhaka' },
  { name: 'অফিস সিম (Office)', phone: '01655443322', op: 'Airtel', circle: 'Sylhet' },
  { name: 'নিজের নম্বর (Self)', phone: '01533221100', op: 'Teletalk', circle: 'Dhaka' }
];

export function detectIndianOperator(phone: string): { op: OperatorName; circle?: string } | null {
  const cleaned = phone.replace(/\D/g, '');
  const digits = cleaned.startsWith('91') && cleaned.length === 12 ? cleaned.substring(2) : cleaned;

  if (digits.length >= 2) {
    const firstTwo = digits.substring(0, 2);
    const firstThree = digits.substring(0, 3);
    const firstDigit = digits.charAt(0);

    // BSNL
    if (firstTwo === '94' || firstTwo === '95') {
      return { op: 'BSNL', circle: 'Delhi NCR' };
    }
    // MTNL
    if (firstThree === '986' || firstThree === '996') {
      return { op: 'MTNL', circle: 'Mumbai' };
    }
    // Jio
    if (['70', '79', '80', '88', '89', '60', '62', '63', '74'].includes(firstTwo)) {
      return { op: 'Jio', circle: 'Delhi NCR' };
    }
    // Airtel
    if (['98', '99', '97', '81', '82', '83'].includes(firstTwo)) {
      return { op: 'Airtel', circle: 'Delhi NCR' };
    }
    // Vi
    if (['91', '90', '96', '77', '78', '84', '85'].includes(firstTwo)) {
      return { op: 'Vi', circle: 'Mumbai' };
    }
    if (firstDigit === '7' || firstDigit === '6') {
      return { op: 'Jio', circle: 'Delhi NCR' };
    }
    if (firstDigit === '9' || firstDigit === '8') {
      return { op: 'Airtel', circle: 'Delhi NCR' };
    }
  }
  return null;
}

export function detectBangladeshOperator(phone: string): OperatorName | null {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 3) {
    const prefix3 = cleaned.substring(0, 3);
    for (const op of BANGLADESH_OPERATORS) {
      if (op.prefixes.includes(prefix3)) {
        return op.id;
      }
    }
  }
  return null;
}
