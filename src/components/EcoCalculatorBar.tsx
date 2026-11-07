import React, { useState } from 'react';
import { EcoStats, WasteCategory, CATEGORIES } from '../types.ts';
import { Language, Translations } from '../i18n.ts';
import { formatKzt, calculateCo2, calculateTrees, getCategoryInfo, getCategoryLocalizedName } from '../utils.ts';
import { Leaf, Trees, Coins, Recycle, ArrowRight, Calculator } from 'lucide-react';

interface EcoCalculatorBarProps {
  stats: EcoStats | null;
  lang: Language;
  t: Translations;
  onQuickFilterCategory: (cat: WasteCategory) => void;
}

export const EcoCalculatorBar: React.FC<EcoCalculatorBarProps> = ({
  stats,
  lang,
  t,
  onQuickFilterCategory,
}) => {
  const [calcCat, setCalcCat] = useState<WasteCategory>('plastic');
  const [calcKg, setCalcKg] = useState<number>(250);

  const currentCat = getCategoryInfo(calcCat);
  const estCo2 = calculateCo2(calcCat, calcKg, 'кг');
  const estTrees = calculateTrees(estCo2);
  const avgPrice =
    calcCat === 'plastic'
      ? 130
      : calcCat === 'paper'
      ? 55
      : calcCat === 'metal'
      ? 850
      : calcCat === 'glass'
      ? 30
      : calcCat === 'electronics'
      ? 600
      : calcCat === 'oil'
      ? 110
      : 35;
  const estKzt = avgPrice * calcKg;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -top-20 w-60 h-60 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Section: Hero Pitch & Live Numbers */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-white/10">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.circularEco}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
            {t.heroTitle}
          </h1>
          <p className="text-sm text-emerald-100/80 leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                <Recycle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.collectedWaste}</span>
              </div>
              <div className="text-base font-extrabold mt-1 font-mono">
                {stats ? stats.totalKgRecycled.toLocaleString('ru-RU') : '0'} kg
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.co2Reduction}</span>
              </div>
              <div className="text-base font-extrabold mt-1 font-mono text-emerald-300">
                {stats ? stats.totalCo2SavedKg.toLocaleString('ru-RU') : '0'} kg
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.forestEquivalent}</span>
              </div>
              <div className="text-base font-extrabold mt-1 font-mono">
                {stats ? stats.treesSaved : '0'} 🌲
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.marketTurnover}</span>
              </div>
              <div className="text-base font-extrabold mt-1 font-mono text-amber-300">
                {stats ? formatKzt(stats.totalTurnoverKzt) : '0 ₸'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Quick Eco-Calculator Widget */}
        <div className="bg-white/95 text-stone-900 p-5 rounded-2xl shadow-2xl max-w-sm w-full border border-white/20 shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-900">{t.ecoCalcTitle}</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">{t.calcSubtitle}</span>
          </div>

          <div className="py-3 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                {t.whatToRecycle}
              </label>
              <select
                value={calcCat}
                onChange={(e) => setCalcCat(e.target.value as WasteCategory)}
                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getCategoryLocalizedName(c.id, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                <span>{t.wasteAmount}</span>
                <span className="font-mono text-emerald-700 font-bold">{calcKg} kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="2000"
                step="20"
                value={calcKg}
                onChange={(e) => setCalcKg(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Calculated Values */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">{t.estIncome}</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{formatKzt(estKzt)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-stone-500">{t.co2Reduction}:</span>
                <span className="font-bold text-emerald-700 font-mono">-{estCo2} kg CO₂</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-stone-500">{t.treesEquivalentBadge}</span>
                <span className="font-bold text-emerald-800">🌲 ~{estTrees} {lang === 'en' ? 'trees/yr' : lang === 'kk' ? 'ағаш/жыл' : 'дер./год'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onQuickFilterCategory(calcCat)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>{t.findBuyersBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
