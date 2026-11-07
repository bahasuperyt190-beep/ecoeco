export type WasteCategory =
  | 'plastic'
  | 'paper'
  | 'glass'
  | 'metal'
  | 'electronics'
  | 'oil'
  | 'organic';

export type LotType = 'sell' | 'buy';

export type LotStatus = 'active' | 'reserved' | 'paid' | 'completed';

export type UnitType = 'кг' | 'т' | 'л';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export interface UserReview {
  fromUserId: string;
  fromUserName: string;
  score: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
}

export interface UserSummary {
  id: string;
  name: string;
  role: 'seller' | 'buyer';
  phone: string;
  company?: string;
  city?: string;
  rating?: number | null;
  ratingsCount?: number;
  reviews?: UserReview[];
}

export interface WasteLot {
  id: string;
  title: string;
  description?: string;
  category: WasteCategory;
  type: LotType; // 'sell' = продажа, 'buy' = скупка
  pricePerUnit: number; // в тенге ₸
  amount: number;
  unit: UnitType;
  owner: UserSummary;
  location: LocationData;
  imageUrl?: string;
  status: LotStatus;
  paid: boolean;
  dealWith?: UserSummary | null;
  paidAt?: string;
  completedAt?: string;
  createdAt: string;
  qrPayload?: string;
}

export interface ChatMessage {
  id: string;
  lotId: string;
  senderId: string;
  senderName: string;
  senderRole: 'seller' | 'buyer';
  text: string;
  timestamp: string;
}

export interface EcoStats {
  totalKgRecycled: number;
  totalCo2SavedKg: number;
  treesSaved: number;
  totalTurnoverKzt: number;
  activeLotsCount: number;
  completedDealsCount: number;
}

export interface CategoryMeta {
  id: WasteCategory;
  name: string;
  description: string;
  co2FactorKgPerUnit: number; // кг CO2 экономии на 1 кг/л
  defaultPriceRange: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'plastic',
    name: 'Пластик (PET / HDPE)',
    description: 'Бутылки, канистры, пленка, ящики',
    co2FactorKgPerUnit: 1.5,
    defaultPriceRange: '80 - 160 ₸/кг',
    color: '#059669',
  },
  {
    id: 'paper',
    name: 'Макулатура и картон',
    description: 'Гофрокартон, архивы, книги, газеты',
    co2FactorKgPerUnit: 0.9,
    defaultPriceRange: '35 - 75 ₸/кг',
    color: '#0284c7',
  },
  {
    id: 'metal',
    name: 'Металлолом (черный/цветной)',
    description: 'Медь, алюминий, латунь, сталь',
    co2FactorKgPerUnit: 2.8,
    defaultPriceRange: '110 - 3200 ₸/кг',
    color: '#ea580c',
  },
  {
    id: 'glass',
    name: 'Стеклобой и тара',
    description: 'Бутылочное стекло, банки, листовое стекло',
    co2FactorKgPerUnit: 0.35,
    defaultPriceRange: '15 - 40 ₸/кг',
    color: '#0d9488',
  },
  {
    id: 'electronics',
    name: 'Электронный лом (WEEE)',
    description: 'Платы, старая бытовая техника, кабели',
    co2FactorKgPerUnit: 4.2,
    defaultPriceRange: '200 - 1500 ₸/кг',
    color: '#7c3aed',
  },
  {
    id: 'oil',
    name: 'Отработанные масла',
    description: 'Моторные, гидравлические, индустриальные масла',
    co2FactorKgPerUnit: 2.1,
    defaultPriceRange: '70 - 150 ₸/л',
    color: '#ca8a04',
  },
  {
    id: 'organic',
    name: 'Органика и жмых',
    description: 'Древесные опилки, жмых, компост',
    co2FactorKgPerUnit: 0.5,
    defaultPriceRange: '20 - 50 ₸/кг',
    color: '#16a34a',
  },
];
