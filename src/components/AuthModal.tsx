import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  Lock,
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Zap,
  Smartphone
} from 'lucide-react';
import { Country, UserAccount } from '../types';
import {
  loginWithPin,
  loginWithOtp,
  registerUser,
  DEFAULT_USER
} from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  country: Country;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  isPaytmTheme?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  country,
  onClose,
  onSuccess,
  isPaytmTheme = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'otp' | 'pin'>('otp');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('9876543210');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [countdown, setCountdown] = useState(30);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [showSignupPin, setShowSignupPin] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessNotice(null);
  }, [initialMode, isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, countdown]);

  const brandColor = isPaytmTheme ? '#002970' : '#5f259f';
  const accentColor = isPaytmTheme ? '#00baf2' : '#7c3aed';

  const handleSendOtp = () => {
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length < (country === 'IN' ? 10 : 11)) {
      setErrorMessage(
        country === 'IN'
          ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें'
          : 'সঠিক মোবাইল নম্বর লিখুন'
      );
      return;
    }

    setErrorMessage(null);
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    setCountdown(30);
    setSuccessNotice(`OTP भेजा गया: ${mockOtp}`);
  };

  const handleVerifyOtpLogin = () => {
    if (!enteredOtp || enteredOtp.length !== 6) {
      setErrorMessage('कृपया 6 अंकों का सही OTP दर्ज करें');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      setErrorMessage('अमान्य OTP। कृपया पुनः प्रयास करें।');
      return;
    }

    const res = loginWithOtp(loginPhone);
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.message || 'लॉगिन विफल हुआ');
    }
  };

  const handlePinLogin = () => {
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length < (country === 'IN' ? 10 : 11)) {
      setErrorMessage('कृपया सही मोबाइल नंबर दर्ज करें');
      return;
    }
    if (!loginPin || loginPin.length !== 4) {
      setErrorMessage('कृपया 4 अंकों का सुरक्षा PIN दर्ज करें');
      return;
    }

    const res = loginWithPin(cleanPhone, loginPin);
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.message || 'लॉगिन विफल रहा');
    }
  };

  const handleDemoLogin = () => {
    onSuccess(DEFAULT_USER);
    onClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें');
      return;
    }

    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (cleanPhone.length < (country === 'IN' ? 10 : 11)) {
      setErrorMessage('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें');
      return;
    }

    if (!signupPin || signupPin.length !== 4) {
      setErrorMessage('कृपया 4 अंकों का सुरक्षा/UPI पिन बनाएं');
      return;
    }

    if (signupPin !== signupConfirmPin) {
      setErrorMessage('सुरक्षा पिन मेल नहीं खा रहा है');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('कृपया नियम और शर्तों को स्वीकार करें');
      return;
    }

    const res = registerUser({
      name: signupName.trim(),
      phoneNumber: cleanPhone,
      email: signupEmail.trim() || undefined,
      country,
      pin: signupPin,
      walletBalance: 50, // ₹50 welcome bonus!
      kycVerified: true,
    });

    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.message || 'खाता नहीं बन सका');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs select-none"
      >
        <motion.div
          id="auth-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div
            className="px-5 py-4 text-white relative transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs"
                  style={{
                    backgroundColor: isPaytmTheme ? '#00baf2' : '#ffffff',
                    color: isPaytmTheme ? '#ffffff' : '#5f259f',
                  }}
                >
                  {isPaytmTheme ? 'P' : 'पे'}
                </div>
                <div>
                  <h3 className="text-base font-extrabold leading-tight">
                    {mode === 'login' ? 'लॉग इन करें (Login)' : 'नया खाता बनाएं (Create Account)'}
                  </h3>
                  <p className="text-[11px] text-white/80">
                    Faizul Pay • 100% सुरक्षित UPI एवं वॉलेट
                  </p>
                </div>
              </div>

              <button
                id="auth-modal-close-btn"
                type="button"
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex gap-1 mt-3 bg-black/20 p-1 rounded-xl text-xs font-semibold">
              <button
                id="tab-login-mode"
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                लॉग इन (Login)
              </button>
              <button
                id="tab-signup-mode"
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                खाता बनाएं (Sign Up)
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 max-h-[80vh] overflow-y-auto space-y-3.5">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success / OTP Notice */}
            {successNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold">{successNotice}</span>
                </div>
                {generatedOtp && (
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                  >
                    ऑटो-फिल
                  </button>
                )}
              </div>
            )}

            {/* LOGIN MODE */}
            {mode === 'login' ? (
              <div className="space-y-3.5">
                {/* Method Switcher: OTP vs PIN */}
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">लॉगिन विधि:</span>
                  <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[11px] font-semibold">
                    <button
                      id="login-method-otp"
                      type="button"
                      onClick={() => {
                        setLoginMethod('otp');
                        setErrorMessage(null);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        loginMethod === 'otp'
                          ? 'bg-purple-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      OTP लॉगिन
                    </button>
                    <button
                      id="login-method-pin"
                      type="button"
                      onClick={() => {
                        setLoginMethod('pin');
                        setErrorMessage(null);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        loginMethod === 'pin'
                          ? 'bg-purple-700 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      सुरक्षा PIN
                    </button>
                  </div>
                </div>

                {/* Mobile Input */}
                <div>
                  <label
                    htmlFor="login-phone"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    मोबाइल नंबर (Mobile Number)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={15} />
                    </div>
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-xs font-bold text-slate-500 font-mono pr-2 border-r border-slate-200 my-2">
                      +91
                    </div>
                    <input
                      id="login-phone"
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-18 pr-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* If OTP Method */}
                {loginMethod === 'otp' ? (
                  <div className="space-y-3">
                    {!otpSent ? (
                      <button
                        id="send-otp-btn"
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Zap size={14} />
                        <span>OTP प्राप्त करें (Get OTP)</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label
                            htmlFor="otp-input"
                            className="font-bold text-slate-700"
                          >
                            6-अंकों का OTP दर्ज करें
                          </label>
                          {countdown > 0 ? (
                            <span className="text-[10px] text-slate-400">
                              पुनः भेजें {countdown}s में
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-[10px] text-purple-700 font-bold hover:underline cursor-pointer"
                            >
                              पुनः OTP भेजें
                            </button>
                          )}
                        </div>
                        <input
                          id="otp-input"
                          type="text"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="● ● ● ● ● ●"
                          maxLength={6}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-center text-base font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                          id="verify-otp-btn"
                          type="button"
                          onClick={handleVerifyOtpLogin}
                          className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          style={{ backgroundColor: brandColor }}
                        >
                          <span>सत्यापित करें एवं लॉगिन करें</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* If PIN Method */
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor="login-pin"
                          className="text-xs font-bold text-slate-700"
                        >
                          4-अंकों का सुरक्षा/UPI PIN
                        </label>
                        <span className="text-[10px] text-slate-400">डिफ़ॉल्ट: 1234</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock size={15} />
                        </div>
                        <input
                          id="login-pin"
                          type={showLoginPin ? 'text' : 'password'}
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="● ● ● ●"
                          maxLength={4}
                          className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-10 py-2 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPin(!showLoginPin)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showLoginPin ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      id="login-pin-submit-btn"
                      type="button"
                      onClick={handlePinLogin}
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{ backgroundColor: brandColor }}
                    >
                      <span>लॉग इन करें (Login)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* Quick 1-Click Demo Login */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    id="demo-login-btn"
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full py-2 px-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 hover:bg-purple-100/80 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-purple-600" />
                      <span>डेमो लॉगिन (Faizul Haque)</span>
                    </div>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-mono">
                      1-टैप
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* SIGNUP / CREATE ACCOUNT MODE */
              <form onSubmit={handleSignup} className="space-y-3">
                {/* Welcome Bonus Banner */}
                <div className="p-2.5 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Sparkles size={15} className="text-amber-600" />
                  </div>
                  <div>
                    <span className="font-bold block text-[11px]">
                      🎁 स्वागत बोनस (Welcome Offer):
                    </span>
                    <span className="text-[10px] text-slate-600">
                      नया खाता बनाते ही ₹50 वॉलेट बैलेंस तुरंत मिलेगा!
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    पूरा नाम (Full Name) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={15} />
                    </div>
                    <input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="उदा. Faizul Haque"
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    मोबाइल नंबर (Mobile Number) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={15} />
                    </div>
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-xs font-bold text-slate-500 font-mono pr-2 border-r border-slate-200 my-2">
                      +91
                    </div>
                    <input
                      id="signup-phone"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl pl-18 pr-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    ईमेल आईडी (Email - Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={15} />
                    </div>
                    <input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="faizul@gmail.com"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Security PIN and Confirm PIN */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="signup-pin"
                      className="block text-[11px] font-bold text-slate-700 mb-1"
                    >
                      4-अंकों का PIN *
                    </label>
                    <input
                      id="signup-pin"
                      type={showSignupPin ? 'text' : 'password'}
                      value={signupPin}
                      onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      maxLength={4}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signup-confirm-pin"
                      className="block text-[11px] font-bold text-slate-700 mb-1"
                    >
                      पुनः PIN दर्ज करें *
                    </label>
                    <input
                      id="signup-confirm-pin"
                      type={showSignupPin ? 'text' : 'password'}
                      value={signupConfirmPin}
                      onChange={(e) => setSignupConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      maxLength={4}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Show/Hide PIN toggle */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSignupPin}
                      onChange={(e) => setShowSignupPin(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>पिन दिखाएं (Show PIN)</span>
                  </label>
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
                  <input
                    id="agree-terms-checkbox"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="agree-terms-checkbox" className="cursor-pointer">
                    मैं Faizul Pay के नियम, गोपनीयता नीति और UPI सुरक्षा दिशानिर्देशों से सहमत हूँ।
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  id="create-account-submit-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: brandColor }}
                >
                  <Sparkles size={15} />
                  <span>खाता बनाएं एवं ₹50 पाएं</span>
                </button>
              </form>
            )}

            {/* Bottom Switcher link */}
            <div className="pt-2 text-center text-xs text-slate-600">
              {mode === 'login' ? (
                <span>
                  नया उपयोगकर्ता हैं?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    नया खाता बनाएं (Sign Up)
                  </button>
                </span>
              ) : (
                <span>
                  पहले से खाता है?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    लॉग इन करें (Login)
                  </button>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
