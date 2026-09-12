import React from 'react';
import { RechargeRecord } from '../types';
import { INDIAN_OPERATORS, BANGLADESH_OPERATORS, PAYMENT_GATEWAYS } from '../data/operators';
import { History, RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';

interface RecentRechargesProps {
  records: RechargeRecord[];
  currencySymbol: string;
  onRepeatRecharge: (record: RechargeRecord) => void;
  onClearHistory: () => void;
}

export const RecentRecharges: React.FC<RecentRechargesProps> = ({
  records,
  currencySymbol,
  onRepeatRecharge,
  onClearHistory,
}) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <History size={14} className="text-purple-700" />
          <span>हालिया रिचार्ज (Recent History)</span>
        </div>
        <button
          id="clear-history-btn"
          type="button"
          onClick={onClearHistory}
          className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
          title="इतिहास साफ़ करें"
        >
          <Trash2 size={12} />
          <span>साफ़ करें</span>
        </button>
      </div>

      <div className="space-y-2">
        {records.slice(0, 4).map((rec) => {
          const allOps = [...INDIAN_OPERATORS, ...BANGLADESH_OPERATORS];
          const op = allOps.find((o) => o.id === rec.operator);
          const gw = PAYMENT_GATEWAYS.find((g) => g.id === rec.paymentMethod);
          const dateStr = new Date(rec.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={rec.id}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-purple-200 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-2xs"
                  style={{ backgroundColor: op?.color || '#5f259f' }}
                >
                  {rec.operator.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {rec.phoneNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {rec.operator} {rec.circle ? `(${rec.circle})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <span>{dateStr}</span>
                    <span>•</span>
                    {gw && (
                      <span className="font-semibold text-slate-600">
                        {gw.name}
                      </span>
                    )}
                    <span>•</span>
                    <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                      <CheckCircle2 size={10} /> {rec.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold font-mono text-purple-800">
                  {currencySymbol}{rec.amount}
                </span>
                <button
                  id={`repeat-recharge-${rec.id}`}
                  type="button"
                  onClick={() => onRepeatRecharge(rec)}
                  className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-colors cursor-pointer"
                  title="फिर से रिचार्ज करें (Repeat)"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
