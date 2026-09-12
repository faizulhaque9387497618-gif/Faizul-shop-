import React from 'react';
import { PaymentMethodId, PaymentGateway } from '../types';
import { PAYMENT_GATEWAYS } from '../data/operators';
import { Check, ShieldCheck, Zap, Smartphone, CreditCard, Sparkles, Wallet, LogIn } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethodId;
  onSelectMethod: (method: PaymentMethodId) => void;
  amount: string;
  currencySymbol: string;
  isLoggedIn?: boolean;
  walletBalance?: number;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  amount,
  currencySymbol,
  isLoggedIn = false,
  walletBalance = 0,
  onOpenAuth,
}) => {
  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Zap size={14} className="text-amber-500" />
          <span>पेमेंट मोड चुनें (Payment Options)</span>
        </label>
        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck size={13} /> 100% Safe UPI
        </span>
      </div>

      {/* If Logged In: Show Wallet as a prime payment option */}
      {isLoggedIn && (
        <button
          id="payment-method-wallet"
          type="button"
          onClick={() => onSelectMethod('wallet')}
          className={`w-full p-2.5 rounded-xl border text-left transition-all relative flex items-center justify-between cursor-pointer ${
            selectedMethod === 'wallet'
              ? 'border-purple-600 bg-purple-50/80 shadow-xs ring-1 ring-purple-600/30'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs">
              <Wallet size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Faizul Pay वॉलेट (Wallet)
                </span>
                <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded leading-none">
                  बैलेंस: {currencySymbol}{walletBalance}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                1-टैप इंस्टेंट भुगतान • 0% गेटवे चार्ज
              </p>
            </div>
          </div>
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
              selectedMethod === 'wallet'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'border border-slate-300 bg-white'
            }`}
          >
            {selectedMethod === 'wallet' && <Check size={12} strokeWidth={3} />}
          </div>
        </button>
      )}

      {/* If Not Logged In: Show sign up offer prompt */}
      {!isLoggedIn && onOpenAuth && (
        <div className="p-2 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <span className="text-slate-700 text-[11px]">
              खाता बनाएं और पहले रिचार्ज पर पाएं <strong>₹50 बोनस</strong>!
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth('signup')}
            className="text-[10px] font-bold text-purple-700 bg-white border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
          >
            <LogIn size={11} />
            <span>खाता बनाएं</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PAYMENT_GATEWAYS.map((gateway: PaymentGateway) => {
          const isSelected = gateway.id === selectedMethod;

          return (
            <button
              key={gateway.id}
              id={`payment-method-${gateway.id}`}
              type="button"
              onClick={() => onSelectMethod(gateway.id)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-600/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Gateway Logo Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: gateway.color }}
                >
                  {gateway.id === 'phonepe' ? (
                    <span className="font-extrabold tracking-tighter">पे</span>
                  ) : gateway.id === 'paytm' ? (
                    <span className="font-extrabold text-[11px] tracking-tight">Paytm</span>
                  ) : gateway.id === 'gpay' ? (
                    <span className="font-bold">G</span>
                  ) : (
                    <span className="font-mono text-[10px]">UPI</span>
                  )}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {gateway.name}
                    </span>
                    {gateway.badge && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 py-0.2 rounded leading-none">
                        {gateway.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                    {gateway.tag}
                  </p>
                </div>
              </div>

              {/* Selection Radio / Check Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'border border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Payment Benefit Highlights */}
      <div className="p-2.5 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-cyan-50/60 rounded-xl border border-purple-100/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-600 shrink-0" />
          <span className="text-slate-700 text-[11px]">
            {selectedMethod === 'phonepe' && 'PhonePe UPI: फ्लैट ₹20 स्क्रैच कार्ड व तत्काल कैशबैक पाएं!'}
            {selectedMethod === 'paytm' && 'Paytm: 1000 कैशबैक पॉइंट्स + सुपरफास्ट UPI पेमेंट!'}
            {selectedMethod === 'gpay' && 'Google Pay: सीधे बैंक खाते से 1-टैप UPI पिन भुगतान!'}
            {selectedMethod === 'bhim_upi' && 'BHIM UPI: 0% सुविधा शुल्क, कोई भी UPI ऐप उपयोग करें!'}
          </span>
        </div>
        <span className="font-mono font-bold text-purple-900 shrink-0 text-xs">
          {currencySymbol}{amount || '0'}
        </span>
      </div>
    </div>
  );
};
