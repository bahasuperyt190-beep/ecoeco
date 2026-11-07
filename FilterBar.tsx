import React from 'react';
import { WasteCategory, LotType, CATEGORIES } from '../types.ts';
import { Language, Translations } from '../i18n.ts';
import { getCategoryLocalizedName } from '../utils.ts';
import { Search, LayoutGrid, Map as MapIcon, Columns2, X } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'map' | 'split';
  onChangeViewMode: (mode: 'grid' | 'map' | 'split') => void;
  totalLotsCount: number;
  lang: Language;
  t: Translations;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode,
  totalLotsCount,
  lang,
  t,
}) => {
  return (
    <div className="space-y-3">
      {/* Top Controls: Search, Type Switcher & View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9.5 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter Buttons (Segmented Button Control) */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => onSelectType('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              selectedType === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => onSelectType('sell')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              selectedType === 'sell'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.sell}
          </button>
          <button
            onClick={() => onSelectType('buy')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
              selectedType === 'buy'
                ? 'bg-white text-blue-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.buy}
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-stone-200 shadow-2xs text-xs">
          <button
            onClick={() => onChangeViewMode('grid')}
            title="Grid view"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('split')}
            title="Split view"
            className={`p-1.5 rounded-lg transition-all hidden md:block ${
              viewMode === 'split'
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Columns2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeViewMode('map')}
            title="Map view"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'map'
                ? 'bg-emerald-50 text-emerald-700 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Filter Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
          }`}
        >
          {t.allCategories} ({totalLotsCount})
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const locName = getCategoryLocalizedName(cat.id, lang);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{locName.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
