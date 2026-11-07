/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WasteLot, UserSummary, EcoStats, WasteCategory } from './types.ts';
import { Language, TRANSLATIONS } from './i18n.ts';
import { Navbar } from './components/Navbar.tsx';
import { EcoCalculatorBar } from './components/EcoCalculatorBar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { LotCard } from './components/LotCard.tsx';
import { InteractiveMap } from './components/InteractiveMap.tsx';
import { KaspiQrModal } from './components/KaspiQrModal.tsx';
import { ChatDrawer } from './components/ChatDrawer.tsx';
import { CreateLotModal } from './components/CreateLotModal.tsx';
import { DealsArchiveModal } from './components/DealsArchiveModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { RateUserModal } from './components/RateUserModal.tsx';
import { Sparkles, MapPin, PackageX, RefreshCw, UserPlus } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('ecobridge_lang');
    return (saved === 'kk' || saved === 'en' || saved === 'ru') ? (saved as Language) : 'ru';
  });
  const t = TRANSLATIONS[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('ecobridge_lang', newLang);
  };

  const [lots, setLots] = useState<WasteLot[]>([]);
  const [stats, setStats] = useState<EcoStats | null>(null);
  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const [userCoords] = useState<{ lat: number; lng: number }>({
    lat: 43.2389,
    lng: 76.8897,
  });

  // Filters & Views
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('grid');

  // Selected lots & modals
  const [selectedLot, setSelectedLot] = useState<WasteLot | null>(null);
  const [activeRouteLot, setActiveRouteLot] = useState<WasteLot | null>(null);
  const [kaspiPaymentLot, setKaspiPaymentLot] = useState<WasteLot | null>(null);
  const [activeChatLot, setActiveChatLot] = useState<WasteLot | null>(null);
  const [isCreateLotOpen, setIsCreateLotOpen] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [rateTargetUser, setRateTargetUser] = useState<UserSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Users from Server API
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setAllUsers(data.users);

        const savedUid = localStorage.getItem('ecobridge_active_uid');
        const matched = data.users.find((u: UserSummary) => u.id === savedUid);

        if (matched) {
          setCurrentUser(matched);
        } else if (data.users.length > 0) {
          setCurrentUser(data.users[0]);
          localStorage.setItem('ecobridge_active_uid', data.users[0].id);
        } else {
          // If no users exist in database yet, automatically register default user
          registerDefaultUser();
        }
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  }, []);

  const registerDefaultUser = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Баха (Эко-партнер)',
          role: 'seller',
          phone: '+7 (705) 999-11-22',
          company: 'Пункт сбора вторсырья',
          city: 'Алматы',
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAllUsers([data.user]);
        setCurrentUser(data.user);
        localStorage.setItem('ecobridge_active_uid', data.user.id);
      }
    } catch (e) {
      console.error('Failed to register default user:', e);
    }
  };

  // Fetch Lots from Server API (with privacy support)
  const fetchLots = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (currentUser?.id) params.append('userId', currentUser.id);
      if (currentUser?.name) params.append('userName', currentUser.name);

      const res = await fetch(`/api/lots?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLots(data.lots || []);
      }
    } catch (e) {
      console.error('Failed to load lots:', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedType, searchQuery, currentUser?.id, currentUser?.name]);

  // Fetch Impact Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchLots();
    fetchStats();
  }, [fetchUsers, fetchLots, fetchStats]);

  // Switch Account or Select
  const handleSelectUser = (user: UserSummary) => {
    setCurrentUser(user);
    localStorage.setItem('ecobridge_active_uid', user.id);
  };

  // User Registered Handler
  const handleUserRegistered = (newUser: UserSummary) => {
    setAllUsers((prev) => {
      const exists = prev.some((u) => u.id === newUser.id);
      return exists ? prev.map((u) => (u.id === newUser.id ? newUser : u)) : [...prev, newUser];
    });
    setCurrentUser(newUser);
    localStorage.setItem('ecobridge_active_uid', newUser.id);
  };

  // Delete User Handler
  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        const remaining = allUsers.filter((u) => u.id !== userId);
        setAllUsers(remaining);
        if (currentUser?.id === userId) {
          const next = remaining.length > 0 ? remaining[0] : null;
          setCurrentUser(next);
          if (next) {
            localStorage.setItem('ecobridge_active_uid', next.id);
          } else {
            localStorage.removeItem('ecobridge_active_uid');
          }
        }
      }
    } catch (e) {
      console.error('Failed to delete user:', e);
    }
  };

  // Switch role between buyer and seller for current user
  const handleSwitchRole = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const nextRole: 'buyer' | 'seller' = currentUser.role === 'buyer' ? 'seller' : 'buyer';
    const updated = { ...currentUser, role: nextRole };

    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    try {
      await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
    } catch (e) {
      console.error('Failed to update role on server:', e);
    }
  };

  // Clear All Data
  const handleClearAll = async () => {
    if (window.confirm('Очистить все лоты и историю сделок?')) {
      try {
        await fetch('/api/clear-all', { method: 'POST' });
        await fetchLots();
        await fetchStats();
      } catch (e) {
        console.error('Clear failed:', e);
      }
    }
  };

  // Clear Purchased Lots
  const handleClearPurchasedLots = async () => {
    try {
      const res = await fetch('/api/lots/clear-purchased', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLots((prev) => prev.filter((l) => !l.paid && l.status !== 'paid' && l.status !== 'completed'));
        if (selectedLot && (selectedLot.paid || selectedLot.status === 'paid' || selectedLot.status === 'completed')) {
          setSelectedLot(null);
        }
        if (activeRouteLot && (activeRouteLot.paid || activeRouteLot.status === 'paid' || activeRouteLot.status === 'completed')) {
          setActiveRouteLot(null);
        }
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to clear purchased lots:', e);
    }
  };

  // Delete Lot
  const handleDeleteLot = async (lotId: string) => {
    try {
      const res = await fetch(`/api/lots/${lotId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLots((prev) => prev.filter((l) => l.id !== lotId));
        if (selectedLot?.id === lotId) setSelectedLot(null);
        if (activeRouteLot?.id === lotId) setActiveRouteLot(null);
        fetchStats();
      }
    } catch (e) {
      console.error('Failed to delete lot', e);
    }
  };

  // Handle successful Kaspi payment
  const handlePaymentSuccess = (paidLot: WasteLot) => {
    setLots((prev) => prev.map((l) => (l.id === paidLot.id ? paidLot : l)));
    setActiveRouteLot(paidLot);
    setViewMode('split');
    fetchStats();
  };

  // Handle lot update from chat or deal status changes
  const handleLotUpdated = (updatedLot: WasteLot) => {
    setLots((prev) => prev.map((l) => (l.id === updatedLot.id ? updatedLot : l)));
    if (selectedLot?.id === updatedLot.id) setSelectedLot(updatedLot);
    fetchStats();
  };

  // Handle user rating submitted
  const handleRatingSubmitted = (updatedUser: UserSummary) => {
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setLots((prev) =>
      prev.map((l) => {
        let updated = { ...l };
        if (l.owner.id === updatedUser.id) {
          updated.owner = {
            ...l.owner,
            rating: updatedUser.rating,
            ratingsCount: updatedUser.ratingsCount,
          };
        }
        if (l.dealWith?.id === updatedUser.id) {
          updated.dealWith = {
            ...l.dealWith,
            rating: updatedUser.rating,
            ratingsCount: updatedUser.ratingsCount,
          };
        }
        return updated;
      })
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('ecobridge_active_user', JSON.stringify(updatedUser));
    }
  };

  // Quick filter from calculator
  const handleQuickFilterCategory = (cat: WasteCategory) => {
    setSelectedCategory(cat);
    const element = document.getElementById('catalog-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Third-party privacy filter:
  // Active lots: visible to everyone.
  // Purchased lots: visible ONLY between the seller (lot.owner) and the buyer (lot.dealWith).
  // For any third party, purchased lots disappear completely.
  const isLotVisible = useCallback((lot: WasteLot, user: UserSummary | null): boolean => {
    const isPurchased = lot.paid || lot.status === 'paid' || lot.status === 'completed';
    if (!isPurchased) return true;
    if (!user) return false;
    const isSeller =
      lot.owner?.id === user.id ||
      (Boolean(lot.owner?.name) && lot.owner?.name.toLowerCase().trim() === user.name.toLowerCase().trim());
    const isBuyer =
      lot.dealWith?.id === user.id ||
      (Boolean(lot.dealWith?.name) && lot.dealWith?.name.toLowerCase().trim() === user.name.toLowerCase().trim());
    return Boolean(isSeller || isBuyer);
  }, []);

  const visibleLots = useMemo(() => {
    return lots.filter((lot) => isLotVisible(lot, currentUser));
  }, [lots, currentUser, isLotVisible]);

  // Deselect lots if they become hidden to the active user (e.g. after switching profile)
  useEffect(() => {
    if (selectedLot && !isLotVisible(selectedLot, currentUser)) {
      setSelectedLot(null);
    }
    if (activeRouteLot && !isLotVisible(activeRouteLot, currentUser)) {
      setActiveRouteLot(null);
    }
    if (activeChatLot && !isLotVisible(activeChatLot, currentUser)) {
      setActiveChatLot(null);
    }
  }, [currentUser, selectedLot, activeRouteLot, activeChatLot, isLotVisible]);

  const archiveCount = visibleLots.filter(
    (l) => l.paid || l.status === 'completed' || l.status === 'paid'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navbar with Auth, Language Switcher and Account Switcher */}
      <Navbar
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onOpenCreateLot={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsCreateLotOpen(true);
          }
        }}
        onOpenArchive={() => setIsArchiveOpen(true)}
        onClearAll={handleClearAll}
        archiveCount={archiveCount}
        stats={stats}
        lang={lang}
        onChangeLang={handleLanguageChange}
        t={t}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <aside role="note" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {lang === 'en' ? 'Academic demo • Synthetic listings and demo accounts. QR payment is simulated; no money is transferred. CO₂ values are illustrative estimates, not verified recycling results. Do not enter personal details.' : lang === 'kk' ? 'Оқу демосы • Жасанды лоттар мен демо аккаунттар. QR төлемі модельденген, ақша аударылмайды. CO₂ мәндері болжамды. Жеке деректерді енгізбеңіз.' : 'Учебная демоверсия • Синтетические лоты и демоаккаунты. QR-оплата моделируется: деньги не переводятся. CO₂ — условная оценка, не подтверждённый результат переработки. Не вводите личные данные.'}
        </aside>
        {/* Hero Eco Calculator Bar */}
        <EcoCalculatorBar
          stats={stats}
          onQuickFilterCategory={handleQuickFilterCategory}
          lang={lang}
          t={t}
        />

        {/* Catalog & Filter Section */}
        <section id="catalog-section" className="space-y-4 pt-2">
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            totalLotsCount={visibleLots.length}
            lang={lang}
            t={t}
          />

          {/* Views Layout */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500">...</p>
            </div>
          ) : viewMode === 'map' ? (
            /* Standalone Full Map View */
            <div className="space-y-3">
              <InteractiveMap
                lots={visibleLots}
                selectedLot={selectedLot}
                onSelectLot={(lot) => setSelectedLot(lot)}
                userLocation={{
                  lat: userCoords.lat,
                  lng: userCoords.lng,
                  address: lang === 'en' ? 'Almaty city' : 'г. Алматы',
                  city: lang === 'en' ? 'Almaty' : 'Алматы',
                }}
                activeRouteLot={activeRouteLot}
                onClearRoute={() => setActiveRouteLot(null)}
                height="620px"
                lang={lang}
                t={t}
              />

              {/* Selected lot quick bar on map */}
              {selectedLot && (
                <div className="max-w-md mx-auto">
                  <LotCard
                    lot={selectedLot}
                    currentUser={currentUser}
                    userCoords={userCoords}
                    onSelectLot={() => {}}
                    onOpenKaspiPayment={(l) => {
                      if (!currentUser) setIsAuthModalOpen(true);
                      else setKaspiPaymentLot(l);
                    }}
                    onOpenChat={(l) => {
                      if (!currentUser) setIsAuthModalOpen(true);
                      else setActiveChatLot(l);
                    }}
                    onShowRoute={(l) => setActiveRouteLot(l)}
                    onDeleteLot={handleDeleteLot}
                    onOpenRateUser={(u) => setRateTargetUser(u)}
                    lang={lang}
                    t={t}
                  />
                </div>
              )}
            </div>
          ) : viewMode === 'split' ? (
            /* Split View: Map on Left / Lots on Right */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 sticky top-22">
                <InteractiveMap
                  lots={visibleLots}
                  selectedLot={selectedLot}
                  onSelectLot={(lot) => setSelectedLot(lot)}
                  userLocation={{
                    lat: userCoords.lat,
                    lng: userCoords.lng,
                    address: lang === 'en' ? 'Almaty city' : 'г. Алматы',
                    city: lang === 'en' ? 'Almaty' : 'Алматы',
                  }}
                  activeRouteLot={activeRouteLot}
                  onClearRoute={() => setActiveRouteLot(null)}
                  height="600px"
                  lang={lang}
                  t={t}
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="text-xs font-semibold text-stone-500">
                  {t.lotsFound}: {visibleLots.length}
                </div>
                {visibleLots.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                    <PackageX className="w-10 h-10 text-stone-400 mx-auto" />
                    <p className="text-xs font-semibold text-stone-700">{t.emptyLotsTitle}</p>
                    <p className="text-xs text-stone-500">
                      {t.emptyLotsDesc}
                    </p>
                    <button
                      onClick={() => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setIsCreateLotOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      {t.publishFirstLot}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleLots.map((lot) => (
                      <LotCard
                        key={lot.id}
                        lot={lot}
                        currentUser={currentUser}
                        userCoords={userCoords}
                        onSelectLot={(l) => {
                          setSelectedLot(l);
                          setActiveRouteLot(l);
                        }}
                        onOpenKaspiPayment={(l) => {
                          if (!currentUser) setIsAuthModalOpen(true);
                          else setKaspiPaymentLot(l);
                        }}
                        onOpenChat={(l) => {
                          if (!currentUser) setIsAuthModalOpen(true);
                          else setActiveChatLot(l);
                        }}
                        onShowRoute={(l) => {
                          setActiveRouteLot(l);
                          setSelectedLot(l);
                        }}
                        onDeleteLot={handleDeleteLot}
                        onOpenRateUser={(u) => setRateTargetUser(u)}
                        lang={lang}
                        t={t}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="space-y-4">
              {visibleLots.length === 0 ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <PackageX className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">{t.emptyLotsTitle}</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      {t.emptyLotsDesc}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setIsCreateLotOpen(true);
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      {t.publishFirstLot}
                    </button>
                    {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedType('all');
                          setSearchQuery('');
                        }}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                      >
                        {t.resetFilters}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleLots.map((lot) => (
                    <LotCard
                      key={lot.id}
                      lot={lot}
                      currentUser={currentUser}
                      userCoords={userCoords}
                      onSelectLot={(l) => {
                        setSelectedLot(l);
                        setActiveRouteLot(l);
                        setViewMode('split');
                      }}
                      onOpenKaspiPayment={(l) => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setKaspiPaymentLot(l);
                      }}
                      onOpenChat={(l) => {
                        if (!currentUser) setIsAuthModalOpen(true);
                        else setActiveChatLot(l);
                      }}
                      onShowRoute={(l) => {
                        setActiveRouteLot(l);
                        setViewMode('split');
                      }}
                      onDeleteLot={handleDeleteLot}
                      onOpenRateUser={(u) => setRateTargetUser(u)}
                      lang={lang}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-stone-200 text-stone-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-extrabold text-stone-900 text-base tracking-tight">EcoBridge Kazakhstan</div>
            <p className="text-stone-400">
              {t.footerDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-stone-600 font-medium">
            <button onClick={() => setSelectedCategory('plastic')} className="hover:text-emerald-700">{t.catPlastic}</button>
            <button onClick={() => setSelectedCategory('paper')} className="hover:text-emerald-700">{t.catPaper}</button>
            <button onClick={() => setSelectedCategory('metal')} className="hover:text-emerald-700">{t.catMetal}</button>
            <button onClick={() => setSelectedCategory('oil')} className="hover:text-emerald-700">{t.catOil}</button>
            <button onClick={() => setIsArchiveOpen(true)} className="hover:text-emerald-700">{t.dealsArchive}</button>
          </div>

          <div className="text-center md:text-right text-[11px] text-stone-400">
            {t.footerCities}
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          allUsers={allUsers}
          onClose={() => setIsAuthModalOpen(false)}
          onSelectUser={handleSelectUser}
          onUserRegistered={handleUserRegistered}
          onDeleteUser={handleDeleteUser}
          lang={lang}
          t={t}
        />
      )}

      {isCreateLotOpen && currentUser && (
        <CreateLotModal
          currentUser={currentUser}
          onClose={() => setIsCreateLotOpen(false)}
          onLotCreated={(newLot) => {
            setLots((prev) => [newLot, ...prev]);
            setSelectedLot(newLot);
            fetchStats();
          }}
          lang={lang}
          t={t}
        />
      )}

      {kaspiPaymentLot && currentUser && (
        <KaspiQrModal
          lot={kaspiPaymentLot}
          currentUser={currentUser}
          onClose={() => setKaspiPaymentLot(null)}
          onPaymentSuccess={handlePaymentSuccess}
          lang={lang}
          t={t}
        />
      )}

      {activeChatLot && currentUser && (
        <ChatDrawer
          lot={activeChatLot}
          currentUser={currentUser}
          onClose={() => setActiveChatLot(null)}
          onLotUpdated={handleLotUpdated}
          onOpenKaspiPayment={(l) => {
            setActiveChatLot(null);
            setKaspiPaymentLot(l);
          }}
          onOpenRateUser={(u) => setRateTargetUser(u)}
          lang={lang}
          t={t}
        />
      )}

      {isArchiveOpen && (
        <DealsArchiveModal
          lots={lots}
          currentUser={currentUser}
          onClose={() => setIsArchiveOpen(false)}
          onShowOnMap={(l) => {
            setActiveRouteLot(l);
            setSelectedLot(l);
            setViewMode('split');
          }}
          onClearPurchasedLots={handleClearPurchasedLots}
          onDeleteLot={handleDeleteLot}
          onOpenRateUser={(u) => setRateTargetUser(u)}
          lang={lang}
          t={t}
        />
      )}

      {rateTargetUser && (
        <RateUserModal
          targetUser={rateTargetUser}
          currentUser={currentUser}
          onClose={() => setRateTargetUser(null)}
          onRatingSubmitted={handleRatingSubmitted}
          lang={lang}
          t={t}
        />
      )}
    </div>
  );
}
