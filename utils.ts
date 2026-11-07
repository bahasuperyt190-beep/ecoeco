import { WasteCategory, CATEGORIES } from './types.ts';
import { Language, TRANSLATIONS } from './i18n.ts';

export function formatKzt(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(amount)) + ' ₸';
}

export function formatWeight(amount: number, unit: string): string {
  return `${new Intl.NumberFormat('ru-RU').format(amount)} ${unit}`;
}

export function getCategoryInfo(categoryId: WasteCategory) {
  return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
}

export function getCategoryLocalizedName(categoryId: WasteCategory, lang: Language): string {
  const t = TRANSLATIONS[lang];
  switch (categoryId) {
    case 'plastic':
      return t.catPlastic;
    case 'paper':
      return t.catPaper;
    case 'metal':
      return t.catMetal;
    case 'glass':
      return t.catGlass;
    case 'electronics':
      return t.catElectronics;
    case 'oil':
      return t.catOil;
    case 'organic':
      return t.catOrganic;
    default:
      return t.catPlastic;
  }
}

export function calculateCo2(category: WasteCategory, amount: number, unit: string): number {
  const cat = getCategoryInfo(category);
  const factor = cat.co2FactorKgPerUnit;
  const kgMultiplier = unit === 'т' ? 1000 : 1;
  return Math.round(amount * kgMultiplier * factor * 10) / 10;
}

export function calculateTrees(co2Kg: number): number {
  return Math.max(0, Math.round(co2Kg / 22));
}

// Distance between two coordinates in kilometers (Haversine formula)
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getEstimatedDriveMinutes(distanceKm: number): number {
  // Average city driving speed 30 km/h with traffic in Almaty
  const hours = distanceKm / 30;
  return Math.max(5, Math.round(hours * 60));
}
