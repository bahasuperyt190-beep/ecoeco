import React from 'react';
import { WasteLot, UserSummary } from '../types.ts';
import { formatKzt, formatWeight, getCategoryLocalizedName, calculateCo2 } from '../utils.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { X, CheckCircle, Navigation, Calendar, MapPin, Receipt, Trash2, Star } from 'lucide-react';

interface DealsArchiveModalProps {
  lots: WasteLot[];
  currentUser: UserSummary | null;
  onClose: () => void;
  onShowOnMap: (lot: WasteLot) => void;
  onClearPurchasedLots: () => void;
  onDeleteLot: (lotId: string) => void;
  onOpenRateUser?: (user: UserSummary) => void;
  lang?: Language;
  t?: Translations;
}

export const DealsArchiveModal: React.FC<DealsArchiveModalProps> = ({
  lots,
  currentUser,
  onClose,
  onShowOnMap,
  onClearPurchasedLots,
  onDeleteLot,
  onOpenRateUser,
  lang = 'ru',
  t = TRANSLATIONS[lang || 'ru'],
}) => {
  // Filter lots that are paid or completed AND where current user is either seller or buyer
  const archiveLots = lots.filter((l) => {
    const isPaid = l.paid || l.status === 'completed' || l.status === 'paid';
    if (!isPaid) return false;
    if (!currentUser) return false;
    const isSeller =
      l.owner?.id === currentUser.id ||
      (Boolean(l.owner?.name) && l.owner?.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim());
    const isBuyer =
      l.dealWith?.id === currentUser.id ||
      (Boolean(l.dealWith?.name) && l.dealWith?.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim());
    return Boolean(isSeller || isBuyer);
  });

  const dateLocale = lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">{t.archiveTitle}</h2>
                {archiveLots.length > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {archiveLots.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                {t.archiveSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {archiveLots.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t.clearPurchasedConfirm)) {
                    onClearPurchasedLots();
                  }
                }}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={t.clearPurchasedLots}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">{t.clearPurchasedLots}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {archiveLots.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Receipt className="w-7 h-7" />
              </div>
              <div className="text-stone-800 font-bold text-sm">{t.emptyArchiveTitle}</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {t.emptyArchiveDesc}
              </p>
            </div>
          ) : (
            archiveLots.map((lot) => {
              const categoryName = getCategoryLocalizedName(lot.category, lang);
              const co2 = calculateCo2(lot.category, lot.amount, lot.unit);
              const totalSum = lot.pricePerUnit * lot.amount;

              return (
                <div
                  key={lot.id}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 hover:border-emerald-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{lot.title}</span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>{t.paidKaspi}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {categoryName} · {formatWeight(lot.amount, lot.unit)}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-sm font-bold text-stone-900 font-mono">
                        {formatKzt(totalSum)}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        🌱 -{co2} кг CO₂
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                      <span className="truncate">{lot.location.address || lot.location.city}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>
                        {lot.paidAt
                          ? new Date(lot.paidAt).toLocaleDateString(dateLocale, {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-stone-500">
                      {currentUser && (lot.owner?.id === currentUser.id || lot.owner?.name === currentUser.name) ? (
                        <>
                          <span className="text-stone-400">{lang === 'en' ? 'Buyer:' : lang === 'kk' ? 'Сатып алушы:' : 'Покупатель:'}</span>{' '}
                          <span className="font-semibold text-stone-800">{lot.dealWith?.name || (lang === 'en' ? 'Buyer' : 'Покупатель')}</span>
                          {lot.dealWith?.phone ? ` (${lot.dealWith.phone})` : ''}
                        </>
                      ) : (
                        <>
                          <span className="text-stone-400">{t.sellerNameLabel}:</span>{' '}
                          <span className="font-semibold text-stone-800">{lot.owner.name}</span> ({lot.owner.phone})
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {(() => {
                        const isSeller = currentUser && (lot.owner?.id === currentUser.id || lot.owner?.name === currentUser.name);
                        const partner = isSeller ? lot.dealWith : lot.owner;
                        if (!partner || (currentUser && partner.id === currentUser.id)) return null;
                        return (
                          <button
                            type="button"
                            onClick={() => onOpenRateUser && onOpenRateUser(partner)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title={t.rateUserTitle}
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{t.rateBtn}</span>
                          </button>
                        );
                      })()}

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(t.deletePurchasedLotConfirm)) {
                            onDeleteLot(lot.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={t.deleteLotBtn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onShowOnMap(lot);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{t.openOnMap}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
