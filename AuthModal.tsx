import React, { useState } from 'react';
import { UserSummary } from '../types.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { X, UserPlus, CheckCircle, Users, ShieldCheck, Trash2, Building2, Phone, MapPin } from 'lucide-react';

interface AuthModalProps {
  currentUser: UserSummary | null;
  allUsers: UserSummary[];
  onClose: () => void;
  onSelectUser: (user: UserSummary) => void;
  onUserRegistered: (newUser: UserSummary) => void;
  onDeleteUser: (userId: string) => void;
  lang?: Language;
  t?: Translations;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  allUsers,
  onClose,
  onSelectUser,
  onUserRegistered,
  onDeleteUser,
  lang = 'ru',
  t = TRANSLATIONS[lang || 'ru'],
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'register'>(
    allUsers.length === 0 ? 'register' : 'switch'
  );

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<'seller' | 'buyer'>('seller');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState(lang === 'kk' ? 'Алматы' : lang === 'en' ? 'Almaty' : 'Алматы');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Введите имя или название организации');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role,
          phone: phone.trim() || '+7 (777) 000-00-00',
          company: company.trim(),
          city: city.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onUserRegistered(data.user);
        onSelectUser(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Ошибка при регистрации аккаунта');
      }
    } catch (err) {
      setErrorMsg('Не удалось связаться с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 my-8 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{t.accountsTitle}</h2>
              <p className="text-xs text-stone-500">{t.accountsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-stone-100/70 border-b border-stone-200 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'switch'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.switchTab} ({allUsers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.newAccountTab}</span>
          </button>
        </div>

        {/* Tab 1: Switch Account */}
        {activeTab === 'switch' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {allUsers.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-stone-800">{t.noAccountsTitle}</div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  {t.noAccountsDesc}
                </p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  {t.registerAndLoginBtn}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-stone-500 mb-1">
                  {t.selectProfileHint}
                </div>
                {allUsers.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        onClose();
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                          : 'border-stone-200 hover:border-emerald-300 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            u.role === 'seller'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-stone-900 truncate">
                              {u.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>{t.activeBadge}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5">
                            {u.role === 'seller' ? t.sellerRole : t.buyerRole}
                            {u.company ? ` · ${u.company}` : ''}
                            {u.phone ? ` · ${u.phone}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`${u.name}?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('register')}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.registerMoreBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Register New Profile Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">{t.yourRoleTitle}</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    role === 'seller'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  📦 {t.sellerRole}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    role === 'buyer'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🔄 {t.buyerRole}
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                {role === 'seller' ? t.sellerRoleDesc : t.buyerRoleDesc}
              </p>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">{t.phoneLabel}</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (705) 123-45-67"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* City & Organization */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">{t.cityLabel}</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Алматы"
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">{t.companyLabel}</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t.companyPlaceholder}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <span>...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.registerAndLoginBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
