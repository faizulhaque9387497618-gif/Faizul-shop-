export type Country = 'IN' | 'BD';

export type IndianOperatorName = 'Jio' | 'Airtel' | 'Vi' | 'BSNL' | 'MTNL';
export type BangladeshOperatorName = 'Grameenphone' | 'Robi' | 'Airtel' | 'Banglalink' | 'Teletalk';

export type OperatorName = IndianOperatorName | BangladeshOperatorName;

export type PaymentMethodId = 'phonepe' | 'paytm' | 'gpay' | 'bhim_upi' | 'card' | 'wallet';

export interface PaymentGateway {
  id: PaymentMethodId;
  name: string;
  tag: string;
  color: string;
  badge?: string;
  iconType: string;
}

export interface Operator {
  id: OperatorName;
  country: Country;
  name: string;
  nameLocal: string;
  color: string;
  lightBg: string;
  borderColor: string;
  prefixes: string[];
  tagline: string;
  logoLetter: string;
}

export type SimType = 'Prepaid' | 'Postpaid';

export interface RechargeOffer {
  id: string;
  country: Country;
  operator: OperatorName;
  amount: number;
  title: string;
  validity: string;
  category: 'popular' | 'unlimited' | 'data' | 'annual' | 'talktime';
  badge?: string;
  voice?: string;
  data?: string;
  sms?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  country: Country;
  pin: string;
  walletBalance: number;
  createdAt: number;
  avatarLetter: string;
  kycVerified: boolean;
}

export interface RechargeRecord {
  id: string;
  country: Country;
  phoneNumber: string;
  operator: OperatorName;
  circle?: string;
  simType: SimType;
  amount: number;
  paymentMethod: PaymentMethodId;
  timestamp: number;
  status: 'Successful' | 'Processing';
  trxId: string;
  userId?: string;
}
