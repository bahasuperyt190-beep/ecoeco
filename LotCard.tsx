import React from 'react';
import { WasteLot, UserSummary } from '../types.ts';
import { Language, Translations } from '../i18n.ts';
import { formatKzt, formatWeight, getCategoryInfo, calculateCo2, getDistanceKm, getCategoryLocalizedName } from '../utils.ts';
import { Navigation, MessageSquare, QrCode, Trash2, CheckCircle, ShieldCheck, MapPin, Star } from 'lucide-react';

interface LotCardProps {
  lot: WasteLot;
  currentUser: UserSummary | null;
  userCoords: { lat: number; lng: number };
  onSelectLot: (lot: WasteLot) => void;
  onOpenKaspiPayment: (lot: WasteLot) => void;
  onOpenChat: (lot: WasteLot) => void;
  onShowRoute: (lot: WasteLot) => void;
  onDeleteLot: (lotId: string) => void;
  onOpenRateUser?: (user: UserSummary) => void;
  lang: Language;
  t: Translations;
}

export const LotCard: React.FC<LotCardProps> = ({
  lot,
  currentUser,
  userCoords,
  onSelectLot,
  onOpenKaspiPayment,
  onOpenChat,
  onShowRoute,
  onDeleteLot,
  onOpenRateUser,
  lang,
  t,
}) => {
  const cat = getCategoryInfo(lot.category);
  const localizedCatName = getCategoryLocalizedName(lot.category, lang);
  const isOwner = currentUser ? lot.owner.id === currentUser.id : false;
  const totalSum = lot.pricePerUnit * lot.amount;
  const co2 = calculateCo2(lot.category, lot.amount, lot.unit);
  const distance = getDistanceKm(userCoords.lat, userCoords.lng, lot.location.lat, lot.location.lng);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Image and Overlay */}
        <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelectLot(lot)}>
          {lot.imageUrl ? (
            <img
              src={lot.imageUrl}
              alt={lot.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 font-bold text-xs gap-1.5 p-4 text-center">
              <span className="text-3xl">
                {cat.id === 'plastic' ? '🧴' : cat.id === 'paper' ? '📦' : cat.id === 'metal' ? '⚙️' : cat.id === 'glass' ? '🍾' : cat.id === 'electronics' ? '💻' : cat.id === 'oil' ? '🛢️' : '🌱'}
              </span>
              <span className="text-xs font-semibold text-stone-700">{localizedCatName}</span>
            </div>
          )}

          {/* Type Flag (Clean corner mark) */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs backdrop-blur-md ${
                lot.type === 'sell'
                  ? 'bg-emerald-600/95 text-white'
                  : 'bg-blue-600/95 text-white'
              }`}
            >
              {lot.type === 'sell' ? t.sell : t.buy}
            </span>
          </div>

          {/* Paid / Deal Status */}
          {lot.paid && (
            <div className="absolute top-3 right-3">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-700 text-white shadow-xs flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.paidKaspi}</span>
              </span>
            </div>
          )}

          {/* Distance Indicator */}
          <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>~{distance} km {t.distanceFromYou}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Unboxed Metadata Line (anti-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span className="text-stone-800">{localizedCatName.split('(')[0].trim()}</span>
            <span aria-hidden="true">·</span>
            <span>{lot.location.city}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">-{co2} kg CO₂</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectLot(lot)}
            className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {lot.title}
          </h3>

          {/* Price & Quantity Block */}
          <div className="pt-1 flex items-baseline justify-between border-t border-stone-100">
            <div>
              <div className="text-lg font-bold text-stone-900 tracking-tight font-mono">
                {formatKzt(lot.pricePerUnit)}
                <span className="text-xs font-normal text-stone-500 ml-1">/ {lot.unit}</span>
              </div>
              <div className="text-xs text-stone-500 font-medium">
                {lang === 'en' ? 'Batch:' : lang === 'kk' ? 'Партиясы:' : 'Партия:'}{' '}
                <span className="text-stone-800 font-semibold">{formatWeight(lot.amount, lot.unit)}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-stone-400">{t.dealSum}</div>
              <div className="text-sm font-bold text-emerald-700 font-mono">
                {formatKzt(totalSum)}
              </div>
            </div>
          </div>

          {/* Owner details */}
          <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between">
            <span className="truncate max-w-[150px] font-medium text-stone-700">👤 {lot.owner.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenRateUser) onOpenRateUser(lot.owner);
              }}
              className="flex items-center gap-1 text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200/60 transition-colors cursor-pointer font-bold text-[11px]"
              title={t.rateUserTitle}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{lot.owner.rating !== null && lot.owner.rating !== undefined ? Number(lot.owner.rating).toFixed(1) : t.newUserBadge}</span>
              {lot.owner.ratingsCount ? <span className="text-[10px] text-stone-400 font-normal">({lot.owner.ratingsCount})</span> : null}
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-stone-50/80 border-t border-stone-100 flex items-center gap-2">
        {/* Deal / Route Buttons */}
        {lot.paid ? (
          <button
            onClick={() => onShowRoute(lot)}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.routeToLot}</span>
          </button>
        ) : !isOwner ? (
          <button
            onClick={() => onOpenKaspiPayment(lot)}
            className="flex-1 py-2 px-3 bg-[#f14635] hover:bg-[#d9291b] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.payKaspiQr}</span>
          </button>
        ) : (
          <div className="flex-1 text-[11px] font-medium text-stone-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.yourLot}</span>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={() => onOpenChat(lot)}
          title={t.chatWithSeller}
          className="p-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-emerald-700" />
        </button>

        {/* Delete button (for owner OR for already purchased/paid lots) */}
        {(isOwner || lot.paid || lot.status === 'paid' || lot.status === 'completed') && (
          <button
            type="button"
            onClick={() => {
              const confirmMsg = lot.paid || lot.status === 'paid' || lot.status === 'completed'
                ? t.deletePurchasedLotConfirm
                : t.deleteLotConfirm;
              if (window.confirm(confirmMsg)) {
                onDeleteLot(lot.id);
              }
            }}
            title={lot.paid || lot.status === 'paid' || lot.status === 'completed' ? t.deletePurchasedLotConfirm : t.deleteLotConfirm}
            className="p-2 bg-white hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-200 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
