import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Phone,
  Mail,
  Wallet,
  ShieldCheck,
  LogOut,
  PlusCircle,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UserAccount, Country } from '../types';
import { updateUserWallet } from '../utils/authStorage';

interface UserProfileSheetProps {
  isOpen: boolean;
  user: UserAccount;
  country: Country;
  currencySymbol: string;
  onClose: () => void;
  onLogout: () => void;
  onRechargeMyNumber: (phone: string) => void;
  onWalletUpdated: (updatedUser: UserAccount) => void;
  isPaytmTheme?: boolean;
}

export const UserProfileSheet: React.FC<UserProfileSheetProps> = ({
  isOpen,
  user,
  country,
  currencySymbol,
  onClose,
  onLogout,
  onRechargeMyNumber,
  onWalletUpdated,
  isPaytmTheme = false,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const brandColor = isPaytmTheme ? '#002970' : '#5f259f';
  const accentColor = isPaytmTheme ? '#00baf2' : '#7c3aed';

  const handleAddWalletMoney = (addAmt: number) => {
    setIsAddingMoney(true);
    setTimeout(() => {
      const updated = updateUserWallet(user.id, addAmt);
      setIsAddingMoney(false);
      if (updated) {
        onWalletUpdated(updated);
        setNotification(`वॉलेट में ${currencySymbol}${addAmt} सफलतापूर्वक जोड़े गए!`);
        setTimeout(() => setNotification(null), 2500);
      }
    }, 500);
  };

  return (
    <AnimatePresence>
      <div
        id="profile-sheet-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs select-none"
      >
        <motion.div
          id="profile-sheet-container"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4 text-white relative transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                उपयोगकर्ता प्रोफ़ाइल (User Profile)
              </span>
              <button
                id="profile-sheet-close-btn"
                type="button"
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Details */}
            <div className="flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shadow-md border-2 border-white/30"
                style={{ backgroundColor: accentColor }}
              >
                {user.avatarLetter || user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-extrabold text-white leading-tight truncate">
                    {user.name}
                  </h3>
                  {user.kycVerified && (
                    <span
                      className="text-emerald-300 inline-flex"
                      title="NPCI KYC Verified"
                    >
                      <ShieldCheck size={16} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 font-mono">
                  +91 {user.phoneNumber}
                </p>
                {user.email && (
                  <p className="text-[11px] text-white/70 truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Notification Banner */}
            {notification && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* Faizul Pay Wallet Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/70 to-slate-50 border border-purple-100/90 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Wallet size={16} className="text-purple-700" />
                  <span>Faizul Pay वॉलेट (Wallet Balance)</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-full">
                  इंस्टेंट UPI
                </span>
              </div>

              <div className="flex items-baseline justify-between my-2">
                <span className="text-2xl font-extrabold font-mono text-purple-900">
                  {currencySymbol}{user.walletBalance.toFixed(0)}
                </span>
                <span className="text-[11px] text-slate-500">
                  रिचार्ज में उपयोग योग्य
                </span>
              </div>

              {/* Add Money Quick Buttons */}
              <div className="pt-2 border-t border-purple-100/80">
                <span className="text-[10px] font-bold text-slate-600 block mb-1.5">
                  वॉलेट टॉप-अप करें (Add Money):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={isAddingMoney}
                      onClick={() => handleAddWalletMoney(amt)}
                      className="py-1 px-2 rounded-lg bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <PlusCircle size={12} />
                      <span>+{currencySymbol}{amt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action: Recharge My Number */}
            <button
              id="recharge-my-number-btn"
              type="button"
              onClick={() => {
                onRechargeMyNumber(user.phoneNumber);
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Smartphone size={15} />
                </div>
                <div className="text-left">
                  <span>मेरा नंबर रिचार्ज करें</span>
                  <span className="block text-[10px] text-slate-500 font-mono font-normal">
                    {user.phoneNumber}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-purple-600" />
            </button>

            {/* Account Details & Security */}
            <div className="space-y-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Lock size={13} className="text-slate-400" />
                  <span>सुरक्षा UPI PIN</span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  •••• (सक्रिय)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>KYC स्थिति</span>
                </span>
                <span className="font-semibold text-emerald-700">
                  सत्यापित (Verified)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>देश (Country)</span>
                <span className="font-semibold text-slate-900">
                  {country === 'IN' ? '🇮🇳 भारत (India)' : '🇧🇩 Bangladesh'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-2">
              <button
                id="user-logout-btn"
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>लॉग आउट करें (Logout)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
