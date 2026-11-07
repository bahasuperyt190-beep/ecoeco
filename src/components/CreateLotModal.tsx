import React, { useState } from 'react';
import { WasteLot, WasteCategory, UnitType, UserSummary, CATEGORIES } from '../types.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { formatKzt, calculateCo2, calculateTrees, getCategoryInfo, getCategoryLocalizedName } from '../utils.ts';
import { InteractiveMap } from './InteractiveMap.tsx';
import { X, Upload, MapPin, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CreateLotModalProps {
  currentUser: UserSummary;
  onClose: () => void;
  onLotCreated: (lot: WasteLot) => void;
  lang?: Language;
  t?: Translations;
}

export const CreateLotModal: React.FC<CreateLotModalProps> = ({
  currentUser,
  onClose,
  onLotCreated,
  lang = 'ru',
  t = TRANSLATIONS.ru,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WasteCategory>('plastic');
  const [type, setType] = useState<'sell' | 'buy'>(currentUser.role === 'buyer' ? 'buy' : 'sell');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [unit, setUnit] = useState<UnitType>('кг');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city] = useState('Алматы');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 43.2389,
    lng: 76.8897,
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const numPrice = Number(pricePerUnit) || 0;
  const numAmount = Number(amount) || 0;
  const totalSum = numPrice * numAmount;
  const co2Savings = calculateCo2(category, numAmount, unit);
  const trees = calculateTrees(co2Savings);

  const handleCategoryChange = (newCat: WasteCategory) => {
    setCategory(newCat);
    if (newCat === 'oil') setUnit('л');
    else setUnit('кг');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter listing title' : lang === 'kk' ? 'Лот атауын енгізіңіз' : 'Укажите название лота');
      return;
    }
    if (numPrice <= 0 || numAmount <= 0) {
      setErrorMsg(lang === 'en' ? 'Please enter valid price and amount' : lang === 'kk' ? 'Дұрыс баға мен көлемді енгізіңіз' : 'Укажите корректную цену и объем сырья');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          type,
          pricePerUnit: numPrice,
          amount: numAmount,
          unit,
          owner: currentUser,
          location: {
            lat: coords.lat,
            lng: coords.lng,
            address: address.trim() || (lang === 'en' ? 'Almaty, Kazakhstan' : lang === 'kk' ? 'Алматы қаласы' : 'г. Алматы'),
            city,
          },
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onLotCreated(data.lot);
        onClose();
      } else {
        setErrorMsg(data.error || 'Error saving lot');
      }
    } catch (err) {
      setErrorMsg(lang === 'en' ? 'Could not save lot to server' : lang === 'kk' ? 'Лотты серверде сақтау мүмкін болмады' : 'Не удалось сохранить лот на сервере');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{t.createLotModalTitle}</h2>
            <p className="text-xs text-stone-500">
              {t.createLotModalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Type Toggle: Sell vs Buy */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('sell')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'sell'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.iAmSelling}
            </button>
            <button
              type="button"
              onClick={() => setType('buy')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                type === 'buy'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.iAmBuying}
            </button>
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">{t.categoryLabel}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const locName = getCategoryLocalizedName(cat.id, lang);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      category === cat.id
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 leading-tight">{locName.split('(')[0].trim()}</div>
                    <div className="text-[10px] text-stone-500 mt-1">{cat.defaultPriceRange}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">{t.lotTitleLabel}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.lotTitlePlaceholder}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Price & Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">{t.pricePerUnitLabel}</label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                min="1"
                placeholder="100"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">{t.amountLabel}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={unit === 'т' ? 0.05 : 50}
                step="0.01"
                placeholder="250"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">{t.unitLabel}</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as UnitType)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="кг">{t.unitKg}</option>
                <option value="т">{t.unitT}</option>
                <option value="л">{t.unitL}</option>
              </select>
            </div>
          </div>

          {/* Location on Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">{t.locationLabel}</label>
              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{showMapPicker ? t.hideMap : t.selectPointOnMap}</span>
              </button>
            </div>

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.addressPlaceholder}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />

            {showMapPicker && (
              <div className="space-y-1 animate-in fade-in duration-200">
                <InteractiveMap
                  lots={[]}
                  selectedLot={null}
                  onSelectLot={() => {}}
                  userLocation={{ lat: 43.2389, lng: 76.8897, address: '', city: 'Алматы' }}
                  activeRouteLot={null}
                  onClearRoute={() => {}}
                  isPickerMode={true}
                  pickedLocation={coords}
                  onPickLocation={(lat, lng) => setCoords({ lat, lng })}
                  height="260px"
                  lang={lang}
                  t={t}
                />
                <div className="text-[11px] text-stone-500 font-mono">
                  Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </div>
              </div>
            )}
          </div>

          {/* Photo & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">{t.photoLabel}</label>
              <div className="flex items-center gap-3">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                )}
                <label className="cursor-pointer px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>{t.uploadPhotoBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Impact Calculation Preview */}
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.ecoImpactPreview}</span>
              </div>
              <div className="text-xs text-stone-700">
                {t.dealSum}: <span className="font-bold text-stone-900">{formatKzt(totalSum)}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                🌱 CO₂: ~{co2Savings} kg ({trees} {lang === 'en' ? 'trees' : lang === 'kk' ? 'ағаш' : 'деревьев'})
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">{t.additionalDescLabel}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPlaceholder}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? t.publishing : t.publishLotBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
