import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Lock,
  Wallet
} from 'lucide-react';
import { OperatorName, SimType, PaymentMethodId, Country } from '../types';
import { INDIAN_OPERATORS, BANGLADESH_OPERATORS, PAYMENT_GATEWAYS } from '../data/operators';
import { playSuccessChime, speakSoundboxAnnouncement } from '../utils/soundbox';

interface RechargeDialogProps {
  isOpen: boolean;
  country: Country;
  currencySymbol: string;
  phone: string;
  amount: string;
  operator: OperatorName;
  circle?: string;
  simType: SimType;
  paymentMethod: PaymentMethodId;
  onClose: () => void;
  onRechargeComplete: (trxId: string) => void;
}

export const RechargeDialog: React.FC<RechargeDialogProps> = ({
  isOpen,
  country,
  currencySymbol,
  phone,
  amount,
  operator,
  circle,
  simType,
  paymentMethod,
  onClose,
  onRechargeComplete,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [upiPin, setUpiPin] = useState('1234');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const operators = country === 'IN' ? INDIAN_OPERATORS : BANGLADESH_OPERATORS;
  const opInfo = operators.find((op) => op.id === operator) || operators[0];
  const gatewayInfo =
    paymentMethod === 'wallet'
      ? { id: 'wallet' as PaymentMethodId, name: 'Faizul Pay Wallet', tag: 'वॉलेट बैलेंस', color: '#5f259f' }
      : (PAYMENT_GATEWAYS.find((gw) => gw.id === paymentMethod) || PAYMENT_GATEWAYS[0]);

  const handleConfirmRecharge = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedTrx =
        paymentMethod === 'phonepe'
          ? 'T' + Date.now().toString().slice(-8) + Math.floor(1000 + Math.random() * 9000)
          : paymentMethod === 'paytm'
          ? 'PTM' + Math.floor(100000000 + Math.random() * 900000000)
          : paymentMethod === 'wallet'
          ? 'FPW' + Date.now().toString().slice(-8)
          : 'TRX' + Math.floor(10000000 + Math.random() * 90000000);

      setTrxId(generatedTrx);
      setIsProcessing(false);
      setIsSuccess(true);
      onRechargeComplete(generatedTrx);

      // Play authentic sound chime and optional voice announcement
      if (soundEnabled) {
        if (paymentMethod === 'paytm') {
          playSuccessChime('paytm');
          setTimeout(() => {
            speakSoundboxAnnouncement(`Paytm par ${amount} rupaye prapt hue.`);
          }, 350);
        } else if (paymentMethod === 'phonepe') {
          playSuccessChime('phonepe');
          setTimeout(() => {
            speakSoundboxAnnouncement(`Payment of rupees ${amount} successful on PhonePe.`);
          }, 400);
        } else {
          playSuccessChime('upi');
          setTimeout(() => {
            speakSoundboxAnnouncement(`Faizul Pay par ${amount} rupaye ka recharge safal hua.`);
          }, 400);
        }
      }
    }, 1300);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  const copyTrx = () => {
    navigator.clipboard.writeText(trxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isPaytm = paymentMethod === 'paytm';
  const isPhonePe = paymentMethod === 'phonepe';

  return (
    <AnimatePresence>
      <div
        id="recharge-dialog-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      >
        <motion.div
          id="recharge-dialog-content"
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {!isSuccess ? (
            <div>
              {/* Header customized by Gateway (Paytm Cyan vs PhonePe Purple) */}
              <div
                className="px-5 py-4 text-white flex items-center justify-between"
                style={{
                  backgroundColor: isPaytm ? '#002970' : isPhonePe ? '#5f259f' : '#334155',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold text-xs">
                    {isPaytm ? 'Paytm' : isPhonePe ? 'पे' : 'UPI'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold leading-tight">
                      {country === 'IN' ? 'रिचार्ज भुगतान (Confirm Pay)' : 'রিচার্জ নিশ্চিতকরণ'}
                    </h3>
                    <p className="text-[11px] text-white/80">
                      {gatewayInfo.name} Gateway • 256-bit Secure
                    </p>
                  </div>
                </div>
                <button
                  id="dialog-close-top-btn"
                  onClick={handleClose}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Main Recharge Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>मोबाइल नंबर</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {country === 'IN' && !phone.startsWith('+91') ? `+91 ${phone}` : phone}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>ऑपरेटर & सर्किल</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: opInfo.color }}
                      />
                      {operator} {circle ? `• ${circle}` : ''} ({simType})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>भुगतान माध्यम</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: gatewayInfo.color }}
                      />
                      {gatewayInfo.name}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">कुल देय राशि (Amount)</span>
                    <span className="text-xl font-extrabold font-mono text-purple-800">
                      {currencySymbol}{amount}
                    </span>
                  </div>
                </div>

                {/* Simulated UPI PIN or 1-Click Pay verification */}
                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                      <Lock size={12} />
                      <span>UPI पिन (Simulated PIN)</span>
                    </label>
                    <span className="text-[10px] text-purple-600 font-medium">डिफ़ॉल्ट: 1234</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg bg-white border border-purple-300 flex items-center justify-center font-mono font-bold text-base text-purple-900 shadow-2xs"
                      >
                        ●
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soundbox Voice Announcement Toggle */}
                <div className="flex items-center justify-between px-1 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="flex items-center gap-1.5 hover:text-purple-700 cursor-pointer"
                  >
                    {soundEnabled ? (
                      <Volume2 size={15} className="text-emerald-600" />
                    ) : (
                      <VolumeX size={15} className="text-slate-400" />
                    )}
                    <span className="text-[11px]">
                      {isPaytm ? 'Paytm साउंडबॉक्स आवाज' : 'PhonePe भुगतान टोन'}
                    </span>
                  </button>
                  <span className="text-[10px] text-slate-400">
                    {soundEnabled ? 'सक्रिय (On)' : 'बंद (Off)'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    id="dialog-cancel-btn"
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    id="dialog-confirm-btn"
                    type="button"
                    onClick={handleConfirmRecharge}
                    disabled={isProcessing}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    style={{
                      backgroundColor: isPaytm ? '#00baf2' : isPhonePe ? '#5f259f' : '#6b21a8',
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>भुगतान हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <span>{currencySymbol}{amount} भुगतान करें</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Success Receipt View styled with PhonePe / Paytm theme */
            <div className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner text-white"
                style={{
                  backgroundColor: isPaytm ? '#00baf2' : '#10b981',
                }}
              >
                <CheckCircle2 size={36} />
              </motion.div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">
                {country === 'IN' ? 'रिचार्ज सफल हुआ!' : 'রিচার্জ সফল হয়েছে!'}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mb-4 flex items-center justify-center gap-1">
                <Sparkles size={12} />
                {gatewayInfo.name} द्वारा सफलतापूर्वक प्रोसेस्ड
              </p>

              {/* Soundbox Badge banner */}
              {soundEnabled && (
                <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-center gap-1.5 font-medium">
                  <Volume2 size={14} className="text-amber-600" />
                  <span>
                    {isPaytm
                      ? `"${amount} रुपये प्राप्त हुए" साउंडबॉक्स बज उठा!`
                      : `PhonePe पेमेंट कन्फर्मेशन बज उठा!`}
                  </span>
                </div>
              )}

              {/* Transaction Receipt Details */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left mb-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>मोबाइल नंबर</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {country === 'IN' && !phone.startsWith('+91') ? `+91 ${phone}` : phone}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>ऑपरेटर & सर्किल</span>
                  <span className="font-semibold text-slate-900">
                    {operator} {circle ? `(${circle})` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>पेमेंट गेटवे</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: gatewayInfo.color }}
                    />
                    {gatewayInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>रिचार्ज राशि</span>
                  <span className="font-bold text-base text-purple-700 font-mono">
                    {currencySymbol}{amount}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-500 text-[11px]">
                  <span>UTR / संदर्भ संख्या</span>
                  <button
                    id="copy-trx-btn"
                    onClick={copyTrx}
                    className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                    title="कॉपी करें"
                  >
                    {trxId}
                    {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                  </button>
                </div>
              </div>

              <button
                id="dialog-success-done-btn"
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: isPaytm ? '#002970' : isPhonePe ? '#5f259f' : '#6b21a8',
                }}
              >
                पूर्ण हुआ (Done)
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
