import React from 'react';
import { OperatorName, SimType, Country, Operator } from '../types';
import { INDIAN_OPERATORS, BANGLADESH_OPERATORS, INDIAN_CIRCLES } from '../data/operators';
import { Check, ChevronDown, MapPin } from 'lucide-react';

interface OperatorSelectorProps {
  country: Country;
  selectedOperator: OperatorName;
  onSelectOperator: (operator: OperatorName) => void;
  selectedCircle: string;
  onSelectCircle: (circle: string) => void;
  simType: SimType;
  onChangeSimType: (type: SimType) => void;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  country,
  selectedOperator,
  onSelectOperator,
  selectedCircle,
  onSelectCircle,
  simType,
  onChangeSimType,
}) => {
  const operators: Operator[] = country === 'IN' ? INDIAN_OPERATORS : BANGLADESH_OPERATORS;
  const currentOp = operators.find((op) => op.id === selectedOperator) || operators[0];

  return (
    <div className="space-y-3">
      {/* Header and SIM Type Switcher */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="operator-dropdown"
          className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5"
        >
          <span>{country === 'IN' ? 'ऑपरेटर चुनें (Operator)' : 'অপারেটর নির্বাচন করুন'}</span>
          <span className="text-xs font-normal text-slate-500">
            ({currentOp.nameLocal})
          </span>
        </label>

        {/* SIM Type Pill Toggle */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          {(['Prepaid', 'Postpaid'] as SimType[]).map((type) => (
            <button
              key={type}
              id={`sim-type-${type.toLowerCase()}`}
              type="button"
              onClick={() => onChangeSimType(type)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                simType === type
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {country === 'IN'
                ? type === 'Prepaid' ? 'प्रीपेड' : 'पोस्टपेड'
                : type === 'Prepaid' ? 'প্রিপেইড' : 'পোস্টপেইড'}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Quick Operator Chips */}
      <div
        className={`grid gap-1.5 ${
          country === 'IN' ? 'grid-cols-5' : 'grid-cols-5'
        }`}
      >
        {operators.map((op) => {
          const isSelected = op.id === selectedOperator;
          return (
            <button
              key={op.id}
              id={`operator-chip-${op.id.toLowerCase()}`}
              type="button"
              onClick={() => onSelectOperator(op.id)}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all duration-150 cursor-pointer relative text-center ${
                isSelected
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-600/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[11px] mb-1 shadow-2xs"
                style={{ backgroundColor: op.color }}
              >
                {op.logoLetter || op.name.charAt(0)}
              </div>
              <span className="text-[11px] font-bold text-slate-800 truncate w-full px-0.5">
                {op.name}
              </span>
              <span className="text-[9px] text-slate-500 leading-none mt-0.5 truncate w-full px-0.5">
                {country === 'IN' ? op.prefixes[0] + '..' : op.prefixes[0]}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operator Dropdown + Indian Telecom Circle selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Operator Dropdown */}
        <div className="relative">
          <select
            id="operator-dropdown"
            value={selectedOperator}
            onChange={(e) => onSelectOperator(e.target.value as OperatorName)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 appearance-none pr-8 shadow-2xs"
          >
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name} ({op.nameLocal})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Circle Selector (Shown for India) */}
        {country === 'IN' && (
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
              <MapPin size={13} />
            </div>
            <select
              id="circle-dropdown"
              value={selectedCircle}
              onChange={(e) => onSelectCircle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-8 py-2 text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 appearance-none shadow-2xs"
            >
              {INDIAN_CIRCLES.map((circle) => (
                <option key={circle} value={circle}>
                  {circle} Circle
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <ChevronDown size={16} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
