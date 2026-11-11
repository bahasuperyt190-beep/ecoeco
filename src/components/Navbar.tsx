import React from 'react';
import { UserSummary, EcoStats } from '../types.ts';
import { Language, Translations } from '../i18n.ts';
import { Plus, Archive, RotateCcw, User, Sprout, ArrowRightLeft, Globe } from 'lucide-react';

interface NavbarProps {
  currentUser: UserSummary | null;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  t: Translations;
  onOpenAuthModal: () => void;
  onSwitchRole: () => void;
  onOpenCreateLot: () => void;
  onOpenArchive: () => void;
  onClearAll: () => void;
  archiveCount: number;
  stats: EcoStats | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  lang,
  onChangeLang,
  t,
  onOpenAuthModal,
  onSwitchRole,
  onOpenCreateLot,
  onOpenArchive,
  onClearAll,
  archiveCount,
  stats,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2 sm:min-h-18">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 text-lg tracking-tight">EcoBridge</span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                {t.kazakhstan}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Real-time Impact Ticker (Desktop) */}
        {stats && (
          <div className="hidden xl:flex items-center gap-4 py-1.5 px-3.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-stone-500">{t.co2Saved}:</span>
              <span className="font-bold text-stone-900 font-mono">
                {stats.totalCo2SavedKg.toLocaleString('ru-RU')} kg
              </span>
            </div>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">{t.treesSaved}:</span>
              <span className="font-bold text-emerald-700 font-mono">
                🌲 {stats.treesSaved}
              </span>
            </div>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {/* Language Switcher Control (РУС / ҚАЗ / ENG) */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              title="Русский язык"
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'ru'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              РУС
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('kk')}
              title="Қазақ тілі"
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'kk'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              ҚАЗ
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              title="English"
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              ENG
            </button>
          </div>

          {/* User Account / Switcher Button */}
          {currentUser ? (
            <button
              onClick={onOpenAuthModal}
              title={t.switchAccount}
              aria-label={t.switchAccount}
              className="flex items-center gap-2 py-1.5 px-3 bg-stone-100 hover:bg-stone-200/90 rounded-xl border border-stone-200 text-xs text-stone-800 transition-colors cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  currentUser.role === 'seller' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold leading-none truncate max-w-[110px]">{currentUser.name}</div>
                <div className="text-[10px] text-stone-500">
                  {currentUser.role === 'seller' ? t.sellerRole : t.buyerRole}
                </div>
              </div>
              <ArrowRightLeft className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{t.loginRegister}</span>
            </button>
          )}

          {/* Archive / Deals Button */}
          <button
            onClick={onOpenArchive}
            aria-label={t.dealsArchive}
            className="relative py-2 px-2.5 sm:px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Archive className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">{t.dealsArchive}</span>
            {archiveCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {archiveCount}
              </span>
            )}
          </button>

          {/* Create Lot Button */}
          <button
            onClick={onOpenCreateLot}
            aria-label={t.createLot}
            className="py-2 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="inline">{t.createLot}</span>
          </button>

          {/* Clear Database Button */}
          <button
            onClick={onClearAll}
            title={t.clearDatabase}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
