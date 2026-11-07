import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

const DATA_DIR = process.env.ECOBRIDGE_DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface for database schema
interface DbSchema {
  lots: any[];
  chats: Record<string, any[]>;
  dealsArchive: any[];
  users: any[];
}

function ensureDb(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DbSchema = {
      lots: [],
      chats: {},
      dealsArchive: [],
      users: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.lots)) parsed.lots = [];
    if (!parsed.chats) parsed.chats = {};
    if (!Array.isArray(parsed.dealsArchive)) parsed.dealsArchive = [];
    if (!Array.isArray(parsed.users)) parsed.users = [];
    for (const u of parsed.users) {
      if (!Array.isArray(u.reviews)) u.reviews = [];
      u.ratingsCount = u.reviews.length;
      if (u.reviews.length === 0) {
        u.rating = null;
      } else {
        const total = u.reviews.reduce((s: number, r: any) => s + (r.score || 5), 0);
        u.rating = Math.round((total / u.reviews.length) * 10) / 10;
      }
    }
    return parsed;
  } catch (e) {
    const initialData: DbSchema = {
      lots: [],
      chats: {},
      dealsArchive: [],
      users: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to db.json:', e);
  }
}

// ---------------- API ROUTES ----------------

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, service: 'eco-bridge', mode: 'academic-demo' });
});

// GET /api/lots
app.get('/api/lots', (req: Request, res: Response) => {
  const db = ensureDb();
  let result = [...db.lots];

  const { category, type, search, status, userId, userName } = req.query;

  // Third-party privacy filter:
  // Already purchased/paid/completed lots are confidential between the 2 participants (seller and buyer).
  // For any third party, purchased lots must disappear.
  const reqUserId = userId ? String(userId).trim() : '';
  const reqUserName = userName ? String(userName).toLowerCase().trim() : '';

  result = result.filter((l) => {
    const isPurchased = l.paid || l.status === 'paid' || l.status === 'completed';
    if (!isPurchased) {
      return true; // Active/unpurchased lots are public
    }
    // Only visible if requester is seller (owner) or buyer (dealWith)
    if (!reqUserId && !reqUserName) {
      return false; // Anonymous visitors cannot see purchased lots
    }
    const isSeller =
      (reqUserId && l.owner?.id === reqUserId) ||
      (reqUserName && l.owner?.name?.toLowerCase().trim() === reqUserName);
    const isBuyer =
      (reqUserId && l.dealWith?.id === reqUserId) ||
      (reqUserName && l.dealWith?.name?.toLowerCase().trim() === reqUserName);
    return Boolean(isSeller || isBuyer);
  });

  if (category && category !== 'all') {
    result = result.filter((l) => l.category === category);
  }

  if (type && type !== 'all') {
    result = result.filter((l) => l.type === type);
  }

  if (status && status !== 'all') {
    result = result.filter((l) => l.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.owner?.name && l.owner.name.toLowerCase().includes(q)) ||
        (l.location?.address && l.location.address.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, lots: result });
});

// GET /api/lots/:id
app.get('/api/lots/:id', (req: Request, res: Response) => {
  const db = ensureDb();
  const lot = db.lots.find((l) => l.id === req.params.id);
  if (!lot) {
    return res.status(404).json({ success: false, error: 'Лот не найден' });
  }

  const { userId, userName } = req.query;
  const isPurchased = lot.paid || lot.status === 'paid' || lot.status === 'completed';
  if (isPurchased) {
    const reqUserId = userId ? String(userId).trim() : '';
    const reqUserName = userName ? String(userName).toLowerCase().trim() : '';
    const isSeller =
      (reqUserId && lot.owner?.id === reqUserId) ||
      (reqUserName && lot.owner?.name?.toLowerCase().trim() === reqUserName);
    const isBuyer =
      (reqUserId && lot.dealWith?.id === reqUserId) ||
      (reqUserName && lot.dealWith?.name?.toLowerCase().trim() === reqUserName);
    if (!isSeller && !isBuyer) {
      return res.status(403).json({ success: false, error: 'Этот лот уже куплен и доступен только продавцу и покупателю' });
    }
  }

  res.json({ success: true, lot });
});

// POST /api/lots
app.post('/api/lots', (req: Request, res: Response) => {
  const { title, description, category, type, pricePerUnit, amount, unit, owner, location, imageUrl } = req.body;

  if (!title || !pricePerUnit || !amount || !category || !location) {
    return res.status(400).json({ success: false, error: 'Пожалуйста, заполните обязательные поля' });
  }

  const quantity = Number(amount);
  const price = Number(pricePerUnit);
  const normalizedQuantity = unit === 'т' ? quantity * 1000 : quantity;
  if (!Number.isFinite(quantity) || normalizedQuantity < 50 || !Number.isFinite(price) || price <= 0) {
    return res.status(400).json({ success: false, error: 'Минимум 50 кг/л (0.05 т); цена должна быть положительным числом.' });
  }
  if (!['plastic', 'paper', 'metal', 'glass', 'electronics', 'oil', 'organic'].includes(category) ||
      !['кг', 'т', 'л'].includes(unit || 'кг') ||
      !Number.isFinite(Number(location.lat)) || Math.abs(Number(location.lat)) > 90 ||
      !Number.isFinite(Number(location.lng)) || Math.abs(Number(location.lng)) > 180) {
    return res.status(400).json({ success: false, error: 'Проверьте категорию, единицу измерения и координаты.' });
  }
  const db = ensureDb();
  const newLot = {
    id: `lot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: String(title).trim(),
    description: description ? String(description).trim() : '',
    category,
    type: type === 'buy' ? 'buy' : 'sell',
    pricePerUnit: Number(pricePerUnit),
    amount: Number(amount),
    unit: unit || 'кг',
    owner: owner || {
      id: 'user-current',
      name: 'Пользователь EcoBridge',
      role: type === 'buy' ? 'buyer' : 'seller',
      phone: '+7 (777) 000-00-00',
    },
    location: {
      lat: Number(location.lat),
      lng: Number(location.lng),
      address: location.address || 'г. Алматы',
      city: location.city || 'Алматы',
    },
    imageUrl: imageUrl || null,
    status: 'active',
    paid: false,
    dealWith: null,
    createdAt: new Date().toISOString(),
  };

  db.lots.unshift(newLot);
  saveDb(db);

  res.status(201).json({ success: true, lot: newLot });
});

// PATCH /api/lots/:id/status
app.patch('/api/lots/:id/status', (req: Request, res: Response) => {
  const { status, dealWith } = req.body;
  const db = ensureDb();
  const lotIndex = db.lots.findIndex((l) => l.id === req.params.id);

  if (lotIndex === -1) {
    return res.status(404).json({ success: false, error: 'Лот не найден' });
  }

  const lot = db.lots[lotIndex];
  if (status) lot.status = status;
  if (dealWith) lot.dealWith = dealWith;
  if (status === 'completed') {
    lot.completedAt = new Date().toISOString();
  }

  saveDb(db);
  res.json({ success: true, lot });
});

// POST /api/lots/:id/pay (Kaspi QR simulator confirmation)
app.post('/api/lots/:id/pay', (req: Request, res: Response) => {
  const { buyer } = req.body;
  const db = ensureDb();
  const lotIndex = db.lots.findIndex((l) => l.id === req.params.id);

  if (lotIndex === -1) {
    return res.status(404).json({ success: false, error: 'Лот не найден' });
  }

  const lot = db.lots[lotIndex];
  lot.paid = true;
  lot.status = 'paid';
  lot.paidAt = new Date().toISOString();
  lot.dealWith = buyer || {
    id: 'user-buyer-kaspi',
    name: 'Покупатель Kaspi QR',
    role: 'buyer',
    phone: '+7 (705) 333-22-11',
  };

  // Add payment notification in chat
  if (!db.chats[lot.id]) {
    db.chats[lot.id] = [];
  }

  db.chats[lot.id].push({
    id: `msg-${Date.now()}`,
    lotId: lot.id,
    senderId: 'system',
    senderName: 'ECO-BRIDGE Demo',
    senderRole: 'buyer',
    text: `✅ Оплата ${lot.pricePerUnit * lot.amount} ₸ подтверждена в симуляторе; реальные деньги не переводились. Сделка зафиксирована, геолокация и прямой маршрут разблокированы.`,
    timestamp: new Date().toISOString(),
  });

  if (!db.dealsArchive) db.dealsArchive = [];
  db.dealsArchive.unshift({ ...lot });

  saveDb(db);
  res.json({ success: true, lot });
});

// DELETE /api/lots/:id
app.delete('/api/lots/:id', (req: Request, res: Response) => {
  const db = ensureDb();
  const id = req.params.id;
  const initialLength = db.lots.length;
  db.lots = db.lots.filter((l) => l.id !== id);

  if (db.dealsArchive) {
    db.dealsArchive = db.dealsArchive.filter((l) => l.id !== id);
  }
  if (db.chats && db.chats[id]) {
    delete db.chats[id];
  }

  saveDb(db);
  res.json({ success: true, message: 'Лот удален' });
});

// POST /api/lots/clear-purchased (Clears all paid and completed lots)
app.post('/api/lots/clear-purchased', (_req: Request, res: Response) => {
  const db = ensureDb();
  const purchasedIds = new Set(
    db.lots
      .filter((l) => l.paid || l.status === 'paid' || l.status === 'completed')
      .map((l) => l.id)
  );

  db.lots = db.lots.filter((l) => !l.paid && l.status !== 'paid' && l.status !== 'completed');
  db.dealsArchive = [];

  for (const id of purchasedIds) {
    if (db.chats && db.chats[id]) {
      delete db.chats[id];
    }
  }

  saveDb(db);
  res.json({ success: true, count: purchasedIds.size, message: 'Купленные лоты успешно очищены' });
});

// GET /api/chats/:lotId
app.get('/api/chats/:lotId', (req: Request, res: Response) => {
  const db = ensureDb();
  const messages = db.chats[req.params.lotId] || [];
  res.json({ success: true, messages });
});

// POST /api/chats/:lotId
app.post('/api/chats/:lotId', (req: Request, res: Response) => {
  const { senderId, senderName, senderRole, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Текст сообщения не может быть пустым' });
  }

  const db = ensureDb();
  const lotId = req.params.lotId;
  if (!db.chats[lotId]) {
    db.chats[lotId] = [];
  }

  const newMsg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    lotId,
    senderId: senderId || 'user-anon',
    senderName: senderName || 'Участник',
    senderRole: senderRole || 'buyer',
    text: String(text).trim(),
    timestamp: new Date().toISOString(),
  };

  db.chats[lotId].push(newMsg);
  saveDb(db);

  res.status(201).json({ success: true, message: newMsg });
});

// GET /api/stats (Real Eco Impact and Market Turnover based strictly on actual data)
app.get('/api/stats', (_req: Request, res: Response) => {
  const db = ensureDb();

  const CO2_FACTORS: Record<string, number> = {
    plastic: 1.5,
    paper: 0.9,
    metal: 2.8,
    glass: 0.35,
    electronics: 4.2,
    oil: 2.1,
    organic: 0.5,
  };

  let totalKg = 0;
  let totalCo2Kg = 0;
  let totalTurnoverKzt = 0;
  let completedDealsCount = 0;
  let activeLotsCount = 0;

  for (const lot of db.lots) {
    const factor = CO2_FACTORS[lot.category] || 1.0;
    const kgMultiplier = lot.unit === 'т' ? 1000 : 1;
    const lotKg = (lot.amount || 0) * kgMultiplier;
    const lotVolumeKzt = (lot.pricePerUnit || 0) * (lot.amount || 0);

    if (lot.status === 'active') {
      activeLotsCount++;
    }

    // Only completed pickup records count toward completed demo totals.
    // Litres are excluded: converting volume to mass requires material density.
    if (lot.status === 'completed') {
      if (lot.unit !== 'л') {
        totalKg += lotKg;
        totalCo2Kg += lotKg * factor;
      }
      totalTurnoverKzt += lotVolumeKzt;
      completedDealsCount++;
    }
  }

  const treesSaved = totalCo2Kg > 0 ? Math.round(totalCo2Kg / 22) : 0;

  res.json({
    success: true,
    stats: {
      totalKgRecycled: Math.round(totalKg),
      totalCo2SavedKg: Math.round(totalCo2Kg),
      treesSaved,
      totalTurnoverKzt: Math.round(totalTurnoverKzt),
      activeLotsCount,
      completedDealsCount,
    },
  });
});

// ---------------- USERS & ACCOUNTS API ----------------

// GET /api/users
app.get('/api/users', (_req: Request, res: Response) => {
  const db = ensureDb();
  res.json({ success: true, users: db.users || [] });
});

// POST /api/users (Register or Login)
app.post('/api/users', (req: Request, res: Response) => {
  const { name, role, phone, company, city } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, error: 'Пожалуйста, введите имя или название организации' });
  }

  const db = ensureDb();
  if (!db.users) db.users = [];

  const trimmedName = String(name).trim();
  const existingUser = db.users.find(
    (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existingUser) {
    // If role or phone provided, update them
    if (role) existingUser.role = role === 'buyer' ? 'buyer' : 'seller';
    if (phone) existingUser.phone = String(phone).trim();
    if (company !== undefined) existingUser.company = String(company).trim();
    if (city !== undefined) existingUser.city = String(city).trim();
    saveDb(db);
    return res.json({ success: true, user: existingUser, isNew: false });
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: trimmedName,
    role: role === 'buyer' ? 'buyer' : 'seller',
    phone: phone ? String(phone).trim() : '+7 (777) 000-00-00',
    company: company ? String(company).trim() : '',
    city: city ? String(city).trim() : 'Алматы',
    rating: null,
    ratingsCount: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  res.status(201).json({ success: true, user: newUser, isNew: true });
});

// POST /api/users/:id/rate (Submit an authentic user rating)
app.post('/api/users/:id/rate', (req: Request, res: Response) => {
  const { fromUserId, fromUserName, score, comment, tags } = req.body;
  const db = ensureDb();
  const targetUser = db.users.find((u) => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ success: false, error: 'Пользователь не найден' });
  }

  if (fromUserId && fromUserId === targetUser.id) {
    return res.status(400).json({ success: false, error: 'Нельзя оценивать собственный профиль' });
  }

  const numScore = Number(score);
  if (isNaN(numScore) || numScore < 1 || numScore > 5) {
    return res.status(400).json({ success: false, error: 'Оценка должна быть от 1 до 5' });
  }

  if (!Array.isArray(targetUser.reviews)) {
    targetUser.reviews = [];
  }

  const existingIdx = fromUserId
    ? targetUser.reviews.findIndex((r: any) => r.fromUserId === fromUserId)
    : -1;

  const reviewItem = {
    fromUserId: fromUserId || 'user-anon',
    fromUserName: fromUserName || 'Партнер EcoBridge',
    score: numScore,
    comment: comment ? String(comment).trim() : '',
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString(),
  };

  if (existingIdx !== -1) {
    targetUser.reviews[existingIdx] = reviewItem;
  } else {
    targetUser.reviews.unshift(reviewItem);
  }

  const totalScore = targetUser.reviews.reduce((sum: number, r: any) => sum + r.score, 0);
  targetUser.rating = Math.round((totalScore / targetUser.reviews.length) * 10) / 10;
  targetUser.ratingsCount = targetUser.reviews.length;

  // Sync updated rating across all existing lots in db.lots
  for (const lot of db.lots) {
    if (lot.owner?.id === targetUser.id) {
      lot.owner.rating = targetUser.rating;
      lot.owner.ratingsCount = targetUser.ratingsCount;
    }
    if (lot.dealWith?.id === targetUser.id) {
      lot.dealWith.rating = targetUser.rating;
      lot.dealWith.ratingsCount = targetUser.ratingsCount;
    }
  }

  saveDb(db);
  res.json({
    success: true,
    user: targetUser,
    rating: targetUser.rating,
    ratingsCount: targetUser.ratingsCount,
    reviews: targetUser.reviews,
  });
});

// GET /api/users/:id/ratings
app.get('/api/users/:id/ratings', (req: Request, res: Response) => {
  const db = ensureDb();
  const targetUser = db.users.find((u) => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ success: false, error: 'Пользователь не найден' });
  }
  res.json({
    success: true,
    rating: targetUser.rating ?? null,
    ratingsCount: targetUser.reviews?.length || 0,
    reviews: targetUser.reviews || [],
  });
});

// PATCH /api/users/:id
app.patch('/api/users/:id', (req: Request, res: Response) => {
  const db = ensureDb();
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Пользователь не найден' });
  }

  const { name, role, phone, company, city } = req.body;
  if (name) user.name = String(name).trim();
  if (role) user.role = role === 'buyer' ? 'buyer' : 'seller';
  if (phone) user.phone = String(phone).trim();
  if (company !== undefined) user.company = String(company).trim();
  if (city !== undefined) user.city = String(city).trim();

  saveDb(db);
  res.json({ success: true, user });
});

// DELETE /api/users/:id
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const db = ensureDb();
  const len = db.users.length;
  db.users = db.users.filter((u) => u.id !== req.params.id);
  if (db.users.length === len) {
    return res.status(404).json({ success: false, error: 'Пользователь не найден' });
  }
  saveDb(db);
  res.json({ success: true, message: 'Аккаунт удален' });
});

// POST /api/clear-all (Clears all lots and resets)
app.post('/api/clear-all', (_req: Request, res: Response) => {
  const db = ensureDb();
  db.lots = [];
  db.chats = {};
  db.dealsArchive = [];
  // Keep users intact so user accounts remain available
  saveDb(db);
  res.json({ success: true, message: 'Все лоты и сделки очищены' });
});

// Start server and handle Vite integration
async function startServer() {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoBridge server listening on port ${PORT}`);
  });
}

if (process.env.ECOBRIDGE_TEST !== '1') startServer();
