import React, { useState, useEffect } from 'react';
import {
  Phone,
  Banknote,
  Smartphone,
  CheckCircle2,
  Users,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Signal,
  Wifi,
  BatteryMedium,
  Globe,
  Lock,
  ChevronDown,
  LogIn,
  UserPlus,
  UserCheck,
  Wallet as WalletIcon
} from 'lucide-react';
import {
  Country,
  OperatorName,
  SimType,
  PaymentMethodId,
  RechargeRecord,
  UserAccount
} from './types';
import {
  INDIAN_OPERATORS,
  BANGLADESH_OPERATORS,
  INDIAN_CIRCLES,
  INDIAN_CONTACTS,
  BANGLADESH_CONTACTS,
  detectIndianOperator,
  detectBangladeshOperator,
  PAYMENT_GATEWAYS
} from './data/operators';
import { OperatorSelector } from './components/OperatorSelector';
import { QuickAmountSelector } from './components/QuickAmountSelector';
import { PaymentMethodSelector } from './components/PaymentMethodSelector';
import { SnackBar } from './components/SnackBar';
import { RechargeDialog } from './components/RechargeDialog';
import { RecentRecharges } from './components/RecentRecharges';
import { AuthModal } from './components/AuthModal';
import { UserProfileSheet } from './components/UserProfileSheet';
import {
  getCurrentUser,
  setCurrentUser as setStoredCurrentUser,
  updateUserWallet,
  DEFAULT_USER
} from './utils/authStorage';

export default function App() {
  // Country: Default to India as requested ("India app banaye toh PhonePe, Paytam")
  const [country, setCountry] = useState<Country>('IN');

  // Input states
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [amount, setAmount] = useState('239');
  const [selectedOperator, setSelectedOperator] = useState<OperatorName>('Jio');
  const [selectedCircle, setSelectedCircle] = useState('Delhi NCR');
  const [simType, setSimType] = useState<SimType>('Prepaid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('phonepe');

  // Authentication & Profile states
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  // Dialog & Notification
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);

  // Mobile Frame preview toggle
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Contacts picker dropdown toggle
  const [showContacts, setShowContacts] = useState(false);

  // App Theme: 'phonepe' | 'paytm'
  const [appBrandTheme, setAppBrandTheme] = useState<'phonepe' | 'paytm'>('phonepe');

  // Switch brand theme automatically when gateway changes or manually
  useEffect(() => {
    if (paymentMethod === 'paytm') {
      setAppBrandTheme('paytm');
    } else if (paymentMethod === 'phonepe') {
      setAppBrandTheme('phonepe');
    }
  }, [paymentMethod]);

  // History state
  const [history, setHistory] = useState<RechargeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('faizul_pay_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'hist-in-1',
        country: 'IN',
        phoneNumber: '9876543210',
        operator: 'Jio',
        circle: 'Delhi NCR',
        simType: 'Prepaid',
        amount: 239,
        paymentMethod: 'phonepe',
        timestamp: Date.now() - 3600000 * 3,
        status: 'Successful',
        trxId: 'T26091184920'
      },
      {
        id: 'hist-in-2',
        country: 'IN',
        phoneNumber: '9812345678',
        operator: 'Airtel',
        circle: 'UP West',
        simType: 'Prepaid',
        amount: 299,
        paymentMethod: 'paytm',
        timestamp: Date.now() - 3600000 * 28,
        status: 'Successful',
        trxId: 'PTM918274620'
      }
    ];
  });

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('faizul_pay_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save recharge history', e);
    }
  }, [history]);

  // When country switches, update defaults
  const handleCountrySwitch = (newCountry: Country) => {
    setCountry(newCountry);
    if (newCountry === 'IN') {
      setSelectedOperator('Jio');
      setPhoneNumber('9876543210');
      setAmount('239');
      setSelectedCircle('Delhi NCR');
      setPaymentMethod('phonepe');
    } else {
      setSelectedOperator('Grameenphone');
      setPhoneNumber('01712345678');
      setAmount('50');
      setSelectedCircle('Dhaka');
    }
  };

  // Handle phone input change with auto-detection
  const handlePhoneChange = (val: string) => {
    const sanitized = val.replace(/[^\d]/g, '');
    setPhoneNumber(sanitized);

    if (country === 'IN') {
      const detected = detectIndianOperator(sanitized);
      if (detected) {
        setSelectedOperator(detected.op);
        if (detected.circle) {
          setSelectedCircle(detected.circle);
        }
      }
    } else {
      const detected = detectBangladeshOperator(sanitized);
      if (detected) {
        setSelectedOperator(detected);
      }
    }
  };

  // Validation logic
  const handleProcessRecharge = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanAmount = amount.trim();

    if (country === 'IN') {
      if (cleanPhone.length < 10 || !cleanAmount || Number(cleanAmount) <= 0) {
        setSnackBarMessage('कृपया सही 10 अंकों का मोबाइल नंबर और रिचार्ज राशि दर्ज करें');
        return;
      }
    } else {
      if (cleanPhone.length < 11 || !cleanAmount || Number(cleanAmount) <= 0) {
        setSnackBarMessage('সঠিক নম্বর এবং টাকার পরিমাণ লিখুন');
        return;
      }
    }

    setIsDialogOpen(true);
  };

  const handleRechargeComplete = (trxId: string) => {
    const newRecord: RechargeRecord = {
      id: 'rec-' + Date.now(),
      country,
      phoneNumber: phoneNumber.trim(),
      operator: selectedOperator,
      circle: country === 'IN' ? selectedCircle : undefined,
      simType,
      amount: parseFloat(amount),
      paymentMethod,
      timestamp: Date.now(),
      status: 'Successful',
      trxId,
      userId: currentUser?.id,
    };

    setHistory((prev) => [newRecord, ...prev]);

    // Handle user wallet deduction or reward cashback
    if (currentUser) {
      if (paymentMethod === 'wallet') {
        const updated = updateUserWallet(currentUser.id, -parseFloat(amount));
        if (updated) setCurrentUser(updated);
      } else {
        // ₹10 loyalty cashback into wallet on every successful recharge
        const updated = updateUserWallet(currentUser.id, 10);
        if (updated) {
          setCurrentUser(updated);
          setSnackBarMessage(`🎉 ₹10 कैशबैक आपके Faizul Pay वॉलेट में जोड़ा गया!`);
        }
      }
    }
  };

  const contacts = country === 'IN' ? INDIAN_CONTACTS : BANGLADESH_CONTACTS;

  const handleSelectContact = (c: typeof contacts[0]) => {
    setPhoneNumber(c.phone);
    setSelectedOperator(c.op as OperatorName);
    if (c.circle) {
      setSelectedCircle(c.circle);
    }
    setShowContacts(false);
  };

  const handleRepeatRecharge = (rec: RechargeRecord) => {
    setCountry(rec.country);
    setPhoneNumber(rec.phoneNumber);
    setSelectedOperator(rec.operator);
    if (rec.circle) setSelectedCircle(rec.circle);
    setSimType(rec.simType);
    setAmount(rec.amount.toString());
    setPaymentMethod(rec.paymentMethod);
  };

  const currentOperators = country === 'IN' ? INDIAN_OPERATORS : BANGLADESH_OPERATORS;
  const currentOp = currentOperators.find((op) => op.id === selectedOperator) || currentOperators[0];
  const currencySymbol = country === 'IN' ? '₹' : '৳';

  const isPaytmTheme = appBrandTheme === 'paytm';
  const headerBgColor = isPaytmTheme ? '#002970' : '#5f259f';
  const headerAccentColor = isPaytmTheme ? '#00baf2' : '#f59e0b';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:p-4 md:p-6 select-none font-sans">
      {/* Top Bar for Desktop View */}
      <header className="w-full max-w-md md:max-w-xl flex items-center justify-between px-4 py-3 mb-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 tracking-tight">Faizul Pay</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-medium">PhonePe & Paytm Recharge</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Country Selector */}
          <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-300 text-xs shadow-2xs">
            <button
              id="country-toggle-in"
              type="button"
              onClick={() => handleCountrySwitch('IN')}
              className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                country === 'IN'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇮🇳</span>
              <span>India</span>
            </button>
            <button
              id="country-toggle-bd"
              type="button"
              onClick={() => handleCountrySwitch('BD')}
              className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                country === 'BD'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇧🇩</span>
              <span>BD</span>
            </button>
          </div>

          {/* View mode toggle */}
          <button
            id="view-mode-toggle"
            type="button"
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:border-purple-600 hover:text-purple-700 transition-colors shadow-2xs font-medium cursor-pointer"
          >
            <Smartphone size={13} />
            <span className="hidden sm:inline">
              {isMobileFrame ? 'Full View' : 'Device View'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Container: Device Shell or Responsive Card */}
      <div
        id="app-scaffold-container"
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] rounded-[36px] shadow-2xl border-[8px] border-slate-800 bg-white overflow-hidden my-auto'
            : 'max-w-xl rounded-2xl shadow-xl border border-slate-200 bg-white overflow-hidden'
        }`}
      >
        {/* Mobile Device Status Bar */}
        {isMobileFrame && (
          <div
            className="text-white/95 px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium tracking-tight transition-colors"
            style={{ backgroundColor: headerBgColor }}
          >
            <span>9:41</span>
            <div className="w-20 h-4 bg-black/30 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryMedium size={14} />
            </div>
          </div>
        )}

        {/* Brand Theme Bar: PhonePe vs Paytm quick aesthetic toggle */}
        <div
          className="px-4 py-1.5 text-white/90 flex items-center justify-between text-[11px] border-b border-white/10"
          style={{ backgroundColor: headerBgColor }}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight">BRAND UI:</span>
            <button
              id="theme-toggle-phonepe"
              type="button"
              onClick={() => {
                setAppBrandTheme('phonepe');
                setPaymentMethod('phonepe');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                appBrandTheme === 'phonepe'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              PhonePe पे
            </button>
            <button
              id="theme-toggle-paytm"
              type="button"
              onClick={() => {
                setAppBrandTheme('paytm');
                setPaymentMethod('paytm');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                appBrandTheme === 'paytm'
                  ? 'bg-[#00baf2] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Paytm
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
            <ShieldCheck size={12} />
            <span>NPCI UPI Verified</span>
          </div>
        </div>

        {/* AppBar Header */}
        <div
          className="text-white px-5 py-3.5 shadow-md flex items-center justify-between relative transition-colors"
          style={{ backgroundColor: headerBgColor }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-xs"
              style={{
                backgroundColor: isPaytmTheme ? '#00baf2' : '#ffffff',
                color: isPaytmTheme ? '#ffffff' : '#5f259f'
              }}
            >
              {isPaytmTheme ? 'P' : 'पे'}
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wide leading-tight">
                {country === 'IN' ? 'मोबाइल रिचार्ज (Mobile Recharge)' : 'মোবাইল রিচার্জ'}
              </h1>
              <p className="text-[10px] text-white/80 font-medium">
                Faizul Pay • {isPaytmTheme ? 'Paytm Fast UPI' : 'PhonePe Instant UPI'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className="hidden sm:flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 border border-white/25 items-center gap-1"
              title={`Active: ${currentOp.name}`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentOp.color }}
              />
              <span>{currentOp.name}</span>
            </div>

            {/* Profile / Auth Button */}
            {currentUser ? (
              <button
                id="header-user-profile-btn"
                type="button"
                onClick={() => setIsProfileSheetOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all cursor-pointer text-xs font-semibold shadow-2xs"
                title="प्रोफ़ाइल और वॉलेट देखें"
              >
                <span className="w-5 h-5 rounded-full bg-white text-purple-950 font-bold flex items-center justify-center text-[10px] shadow-2xs">
                  {currentUser.avatarLetter || currentUser.name.charAt(0)}
                </span>
                <span className="hidden sm:inline max-w-[65px] truncate text-[11px] font-bold">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.2 rounded-full font-mono">
                  {currencySymbol}{currentUser.walletBalance.toFixed(0)}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  id="header-login-btn"
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white text-purple-950 hover:bg-slate-100 transition-all font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <LogIn size={12} />
                  <span>Login</span>
                </button>
                <button
                  id="header-signup-btn"
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:flex px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-all font-semibold text-xs items-center gap-1 cursor-pointer"
                >
                  <UserPlus size={12} />
                  <span>साइन अप</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body Content */}
        <main className="p-4 sm:p-5 bg-white max-h-[85vh] overflow-y-auto space-y-4">
          {/* User Status / Welcome Strip */}
          {currentUser ? (
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-slate-50 border border-purple-100/90 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                  {currentUser.avatarLetter}
                </div>
                <div className="truncate">
                  <span className="text-slate-600 text-[11px]">नमस्ते, </span>
                  <strong className="text-slate-900">{currentUser.name}</strong>
                  <span className="text-purple-700 font-bold ml-1.5 font-mono text-[11px]">
                    • वॉलेट: {currencySymbol}{currentUser.walletBalance}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(true)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline shrink-0 cursor-pointer"
              >
                वॉलेट प्रबंधित करें
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-amber-50/90 via-purple-50/60 to-cyan-50/50 border border-amber-200/90 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-900 text-xs block truncate">
                    लॉग इन या नया खाता बनाएं
                  </span>
                  <span className="text-[10px] text-slate-600">
                    साइनअप पर ₹50 वेलकम बोनस वॉलेट में पाएं!
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="strip-login-btn"
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-purple-600 text-slate-800 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  लॉग इन
                </button>
                <button
                  id="strip-signup-btn"
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  खाता बनाएं
                </button>
              </div>
            </div>
          )}
          {/* Operator Banner Highlights */}
          <div
            className="p-3 rounded-xl border flex items-center justify-between transition-colors"
            style={{
              backgroundColor: currentOp.lightBg,
              borderColor: currentOp.borderColor
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                style={{ backgroundColor: currentOp.color }}
              >
                {currentOp.logoLetter || currentOp.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                  <span>{currentOp.name}</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({currentOp.nameLocal})
                  </span>
                </h2>
                <p className="text-[11px] text-slate-600 font-medium">
                  {country === 'IN'
                    ? `${selectedCircle} Circle • ${simType === 'Prepaid' ? 'प्रीपेड' : 'पोस्टपेड'}`
                    : `কোড: ${currentOp.prefixes.join(', ')} • ${simType}`}
                </p>
              </div>
            </div>

            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white shadow-2xs"
              style={{ color: currentOp.color, borderColor: currentOp.borderColor }}
            >
              {currentOp.tagline.split('•')[0]}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Field 1: Phone Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="phone-number-input"
                  className="text-sm font-bold text-slate-900 tracking-tight"
                >
                  {country === 'IN' ? 'मोबाइल नंबर दर्ज करें' : 'মোবাইল নম্বর লিখুন'}
                </label>
                <button
                  id="contact-picker-btn"
                  type="button"
                  onClick={() => setShowContacts(!showContacts)}
                  className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Users size={13} />
                  <span>
                    {country === 'IN' ? 'संपर्क (Contacts)' : 'ফোনবুক'} ({contacts.length})
                  </span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={17} />
                </div>
                {country === 'IN' && (
                  <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none text-xs font-bold text-slate-500 font-mono pr-2 border-r border-slate-200 my-2">
                    +91
                  </div>
                )}
                <input
                  id="phone-number-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={country === 'IN' ? '98765 43210' : '017XXXXXXXX'}
                  maxLength={country === 'IN' ? 10 : 14}
                  className={`w-full bg-white border border-slate-300 rounded-lg pr-20 py-2.5 text-base font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 shadow-2xs ${
                    country === 'IN' ? 'pl-20' : 'pl-10'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                  {phoneNumber.length > 0 && (
                    <button
                      id="clear-phone-btn"
                      type="button"
                      onClick={() => setPhoneNumber('')}
                      className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                  {phoneNumber.length >= (country === 'IN' ? 10 : 11) && (
                    <span className="text-emerald-600" title="Valid Number">
                      <CheckCircle2 size={18} />
                    </span>
                  )}
                </div>
              </div>

              {/* Sample Contacts Dropdown */}
              {showContacts && (
                <div
                  id="contacts-list-dropdown"
                  className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-xs space-y-1"
                >
                  <div className="text-[11px] font-bold text-slate-500 px-2 py-1">
                    {country === 'IN'
                      ? 'संपर्क सूची से नंबर चुनें (Select Contact):'
                      : 'ক্লিক করে নম্বর সিলেক্ট করুন:'}
                  </div>
                  {contacts.map((c) => (
                    <button
                      key={c.phone}
                      type="button"
                      onClick={() => handleSelectContact(c)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-100/70 flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono ml-2">
                          {c.phone}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        {c.op} {c.circle ? `• ${c.circle}` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 2: Operator & Circle Selector */}
            <OperatorSelector
              country={country}
              selectedOperator={selectedOperator}
              onSelectOperator={(op) => setSelectedOperator(op)}
              selectedCircle={selectedCircle}
              onSelectCircle={(c) => setSelectedCircle(c)}
              simType={simType}
              onChangeSimType={(type) => setSimType(type)}
            />

            {/* Field 3: Amount & Plans */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="amount-input"
                  className="text-sm font-bold text-slate-900 tracking-tight"
                >
                  {country === 'IN' ? 'रिचार्ज राशि (Amount)' : 'টাকার পরিমাণ (৳)'}
                </label>
                {amount && (
                  <span className="text-xs text-purple-700 font-mono font-bold">
                    {currencySymbol}{amount}
                  </span>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-lg font-mono">
                  {currencySymbol}
                </div>
                <input
                  id="amount-input"
                  type="number"
                  min="10"
                  max="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={country === 'IN' ? '239' : '50'}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 shadow-2xs"
                />
                {amount && (
                  <button
                    id="clear-amount-btn"
                    type="button"
                    onClick={() => setAmount('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Amount & Detailed Plan Browser */}
              <QuickAmountSelector
                country={country}
                currencySymbol={currencySymbol}
                currentAmount={amount}
                onSelectAmount={(amt) => setAmount(amt)}
                selectedOperator={selectedOperator}
              />
            </div>

            {/* Field 4: Payment Gateway Selector (PhonePe, Paytm, Google Pay, UPI, Wallet) */}
            {country === 'IN' && (
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelectMethod={(m) => setPaymentMethod(m)}
                amount={amount}
                currencySymbol={currencySymbol}
                isLoggedIn={!!currentUser}
                walletBalance={currentUser?.walletBalance || 0}
                onOpenAuth={(m) => {
                  setAuthModalMode(m);
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {/* Recharge Action Button */}
            <div className="pt-2">
              <button
                id="recharge-submit-btn"
                type="button"
                onClick={handleProcessRecharge}
                className="w-full h-[52px] text-white font-extrabold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: isPaytmTheme
                    ? '#00baf2'
                    : paymentMethod === 'phonepe'
                    ? '#5f259f'
                    : '#6b21a8'
                }}
              >
                <span>
                  {country === 'IN'
                    ? paymentMethod === 'phonepe'
                      ? `PhonePe से ${currencySymbol}${amount || 0} रिचार्ज करें`
                      : paymentMethod === 'paytm'
                      ? `Paytm से ${currencySymbol}${amount || 0} भुगतान करें`
                      : `${currencySymbol}${amount || 0} रिचार्ज करें`
                    : 'রিচার্জ করুন'}
                </span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Security & Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-purple-700" />
              100% सुरक्षित UPI पेमेंट्स
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap size={13} className="text-amber-500" />
              तुरंत रिचार्ज
            </span>
          </div>

          {/* Recent Recharges History */}
          <RecentRecharges
            records={history}
            currencySymbol={currencySymbol}
            onRepeatRecharge={handleRepeatRecharge}
            onClearHistory={() => setHistory([])}
          />
        </main>

        {/* Mobile Device Home Bar */}
        {isMobileFrame && (
          <div className="bg-slate-900 py-2 flex justify-center">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        )}
      </div>

      {/* Confirmation & Payment Dialog (PhonePe / Paytm / UPI) */}
      <RechargeDialog
        isOpen={isDialogOpen}
        country={country}
        currencySymbol={currencySymbol}
        phone={phoneNumber}
        amount={amount}
        operator={selectedOperator}
        circle={country === 'IN' ? selectedCircle : undefined}
        simType={simType}
        paymentMethod={paymentMethod}
        onClose={() => setIsDialogOpen(false)}
        onRechargeComplete={handleRechargeComplete}
      />

      {/* Authentication Modal (Login & Create Account) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        country={country}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setSnackBarMessage(`नमस्ते ${user.name}! आप सफलतापूर्वक लॉगिन हो गए हैं।`);
        }}
        isPaytmTheme={isPaytmTheme}
      />

      {/* User Profile & Faizul Pay Wallet Sheet */}
      {currentUser && (
        <UserProfileSheet
          isOpen={isProfileSheetOpen}
          user={currentUser}
          country={country}
          currencySymbol={currencySymbol}
          onClose={() => setIsProfileSheetOpen(false)}
          onLogout={() => {
            setStoredCurrentUser(null);
            setCurrentUser(null);
            setSnackBarMessage('आप सफलतापूर्वक लॉग आउट हो चुके हैं।');
          }}
          onRechargeMyNumber={(ph) => {
            setPhoneNumber(ph);
            handlePhoneChange(ph);
            setSnackBarMessage(`आपका नंबर ${ph} सेट किया गया`);
          }}
          onWalletUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
          isPaytmTheme={isPaytmTheme}
        />
      )}

      {/* SnackBar Notification */}
      <SnackBar
        message={snackBarMessage}
        onClose={() => setSnackBarMessage(null)}
      />
    </div>
  );
}
