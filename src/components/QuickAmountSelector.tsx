import React, { useState } from 'react';
import { INDIAN_RECHARGE_OFFERS, BANGLADESH_RECHARGE_OFFERS } from '../data/operators';
import { OperatorName, RechargeOffer, Country } from '../types';
import { Sparkles, Wifi, PhoneCall, Calendar, ShieldCheck, Flame } from 'lucide-react';

interface QuickAmountSelectorProps {
  country: Country;
  currencySymbol: string;
  currentAmount: string;
  onSelectAmount: (amount: string) => void;
  selectedOperator: OperatorName;
}

export const QuickAmountSelector: React.FC<QuickAmountSelectorProps> = ({
  country,
  currencySymbol,
  currentAmount,
  onSelectAmount,
  selectedOperator,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'unlimited' | 'data' | 'annual'>('all');

  const allOffers = country === 'IN' ? INDIAN_RECHARGE_OFFERS : BANGLADESH_RECHARGE_OFFERS;
  const operatorOffers = allOffers.filter((off) => off.operator === selectedOperator);

  const filteredOffers = activeCategory === 'all'
    ? operatorOffers
    : operatorOffers.filter((o) => o.category === activeCategory);

  const quickAmounts = country === 'IN'
    ? [19, 65, 239, 299, 666, 849]
    : [20, 50, 100, 200, 500, 1000];

  return (
    <div className="space-y-3 pt-1">
      {/* Quick Amount Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700">
            {country === 'IN' ? 'त्वरित राशि (Popular Amounts)' : 'জনপ্রিয় অ্যামাউন্ট'}
          </span>
          <span className="text-[11px] text-purple-700 font-semibold">
            {country === 'IN' ? 'टैप करके चुनें' : 'ট্যাপ করে বসান'}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {quickAmounts.map((amt) => {
            const isSelected = currentAmount === amt.toString();
            return (
              <button
                key={amt}
                id={`quick-amount-${amt}`}
                type="button"
                onClick={() => onSelectAmount(amt.toString())}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold font-mono border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                {currencySymbol}{amt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Recommended Deals and Plan Browser */}
      {operatorOffers.length > 0 && (
        <div className="pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sparkles size={13} className="text-amber-500" />
              <span>{selectedOperator} {country === 'IN' ? 'रिचार्ज प्लान्स (Plans)' : 'স্পেশাল অফার'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {filteredOffers.length} {country === 'IN' ? 'प्लान उपलब्ध' : 'অফার'}
            </span>
          </div>

          {/* Category Tabs for India */}
          {country === 'IN' && (
            <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: 'सभी प्लान्स' },
                { id: 'popular', label: '🔥 बेस्ट सेलर' },
                { id: 'unlimited', label: '5G अनलिमिटेड' },
                { id: 'data', label: 'डेटा बूस्टर' },
                { id: 'annual', label: '365 दिन' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                  className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Plan Cards */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
            {filteredOffers.map((offer: RechargeOffer) => {
              const isSelected = currentAmount === offer.amount.toString();

              return (
                <div
                  key={offer.id}
                  id={`offer-${offer.id}`}
                  onClick={() => onSelectAmount(offer.amount.toString())}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/60 shadow-xs ring-1 ring-purple-600/30'
                      : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                          {offer.title}
                        </span>
                        {offer.badge && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Flame size={10} className="text-amber-600" />
                            {offer.badge}
                          </span>
                        )}
                      </div>

                      {/* Detail Chips: Data, Validity, Calls */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                          <Calendar size={11} className="text-purple-600" />
                          {offer.validity}
                        </span>
                        {offer.data && (
                          <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            <Wifi size={11} className="text-blue-600" />
                            {offer.data}
                          </span>
                        )}
                        {offer.voice && (
                          <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            <PhoneCall size={11} className="text-emerald-600" />
                            {offer.voice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount & Select Button */}
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold font-mono text-purple-700 block">
                        {currencySymbol}{offer.amount}
                      </span>
                      <span className="text-[10px] text-purple-600 font-semibold underline group-hover:text-purple-800">
                        {isSelected ? 'चयनित (Selected)' : 'चुनें'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
