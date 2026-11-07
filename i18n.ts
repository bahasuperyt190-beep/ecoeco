export type Language = 'ru' | 'kk' | 'en';

export interface Translations {
  // Brand & Nav
  brandTagline: string;
  kazakhstan: string;
  co2Saved: string;
  treesSaved: string;
  dealsArchive: string;
  createLot: string;
  switchAccount: string;
  clearDatabase: string;
  sellerRole: string;
  buyerRole: string;
  loginRegister: string;

  // Hero & Calculator
  circularEco: string;
  heroTitle: string;
  heroSubtitle: string;
  collectedWaste: string;
  co2Reduction: string;
  forestEquivalent: string;
  marketTurnover: string;
  ecoCalcTitle: string;
  calcSubtitle: string;
  whatToRecycle: string;
  wasteAmount: string;
  estIncome: string;
  treesEquivalentBadge: string;
  findBuyersBtn: string;

  // Filters & Views
  searchPlaceholder: string;
  all: string;
  sell: string;
  buy: string;
  allCategories: string;
  lotsFound: string;
  emptyLotsTitle: string;
  emptyLotsDesc: string;
  publishFirstLot: string;
  resetFilters: string;

  // Card & Map
  dealSum: string;
  distanceFromYou: string;
  lotOwner: string;
  paidKaspi: string;
  routeToLot: string;
  payKaspiQr: string;
  yourLot: string;
  chatWithSeller: string;
  deleteLotConfirm: string;
  mapTitle: string;
  activeLotsCountMap: string;
  clickToPickPoint: string;
  routeToLotTitle: string;
  hideRoute: string;

  // Kaspi QR Modal
  kaspiSafeDeal: string;
  paymentToSeller: string;
  qrValidFor: string;
  scanInstructions: string;
  simulatePaymentBtn: string;
  paymentProcessing: string;
  paymentSuccessTitle: string;
  paymentSuccessDesc: string;
  paymentSum: string;
  receiptNumber: string;
  sellerNameLabel: string;
  contactPhone: string;
  viewOnMapBtn: string;

  // Chat
  dealChat: string;
  dealStatus: string;
  statusActive: string;
  statusReserved: string;
  statusPaid: string;
  statusCompleted: string;
  reserveBtn: string;
  completeDealBtn: string;
  noMessagesTitle: string;
  noMessagesDesc: string;
  quickReply1: string;
  quickReply2: string;
  quickReply3: string;
  quickReply4: string;
  chatInputPlaceholder: string;

  // Create Lot Modal
  createLotModalTitle: string;
  createLotModalSubtitle: string;
  iAmSelling: string;
  iAmBuying: string;
  categoryLabel: string;
  lotTitleLabel: string;
  lotTitlePlaceholder: string;
  pricePerUnitLabel: string;
  amountLabel: string;
  unitLabel: string;
  unitKg: string;
  unitT: string;
  unitL: string;
  locationLabel: string;
  selectPointOnMap: string;
  hideMap: string;
  addressPlaceholder: string;
  photoLabel: string;
  uploadPhotoBtn: string;
  ecoImpactPreview: string;
  additionalDescLabel: string;
  descPlaceholder: string;
  cancelBtn: string;
  publishLotBtn: string;
  publishing: string;

  // Auth Modal
  accountsTitle: string;
  accountsSubtitle: string;
  switchTab: string;
  newAccountTab: string;
  noAccountsTitle: string;
  noAccountsDesc: string;
  selectProfileHint: string;
  activeBadge: string;
  registerMoreBtn: string;
  yourRoleTitle: string;
  sellerRoleDesc: string;
  buyerRoleDesc: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  cityLabel: string;
  companyLabel: string;
  companyPlaceholder: string;
  registerAndLoginBtn: string;

  // Archive Modal
  archiveTitle: string;
  archiveSubtitle: string;
  emptyArchiveTitle: string;
  emptyArchiveDesc: string;
  openOnMap: string;
  dateLabel: string;
  clearPurchasedLots: string;
  clearPurchasedConfirm: string;
  deletePurchasedLotConfirm: string;
  deleteLotBtn: string;

  // Rating & Reviews
  rateUserTitle: string;
  rateUserDesc: string;
  yourRating: string;
  reviewPlaceholder: string;
  submitRating: string;
  submittingRating: string;
  ratingSuccess: string;
  cannotRateSelf: string;
  rateBtn: string;
  newUserBadge: string;
  reviewsCount: string;
  quickTag1: string;
  quickTag2: string;
  quickTag3: string;
  quickTag4: string;
  score1: string;
  score2: string;
  score3: string;
  score4: string;
  score5: string;

  // Footer
  footerDesc: string;
  footerCities: string;

  // Categories
  catPlastic: string;
  catPaper: string;
  catMetal: string;
  catGlass: string;
  catElectronics: string;
  catOil: string;
  catOrganic: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: {
    brandTagline: 'Маркетплейс вторичного сырья и отходов',
    kazakhstan: 'Казахстан',
    co2Saved: 'Спасено CO₂',
    treesSaved: 'Деревьев сохранено',
    dealsArchive: 'Архив сделок',
    createLot: 'Создать лот',
    switchAccount: 'Сменить аккаунт',
    clearDatabase: 'Очистить базу данных',
    sellerRole: 'Продавец вторсырья',
    buyerRole: 'Заготовитель / Покупатель',
    loginRegister: 'Вход / Регистрация',

    circularEco: 'Циркулярная экономика Казахстана',
    heroTitle: 'Маркетплейс вторсырья без посредников',
    heroSubtitle: 'Сдавайте и закупайте пластик, макулатуру, металл и отработанные масла напрямую. Быстрая оплата через Kaspi QR и навигация к ближайшему пункту сбора на карте.',
    collectedWaste: 'Собрано сырья',
    co2Reduction: 'Сокращение CO₂',
    forestEquivalent: 'Лесной эквивалент',
    marketTurnover: 'Объем рынка',
    ecoCalcTitle: 'Эко-калькулятор вторсырья',
    calcSubtitle: 'Казахстан 2026',
    whatToRecycle: 'Что планируете сдать?',
    wasteAmount: 'Объем сырья',
    estIncome: 'Примерный доход:',
    treesEquivalentBadge: 'Эквивалент деревьев:',
    findBuyersBtn: 'Найти скупщиков в регионе',

    searchPlaceholder: 'Поиск по названию, компании или улице...',
    all: 'Все',
    sell: 'Продажа',
    buy: 'Скупка',
    allCategories: 'Все категории',
    lotsFound: 'Найдено партий',
    emptyLotsTitle: 'На платформе пока нет объявлений',
    emptyLotsDesc: 'Опубликуйте первое объявление о продаже вторсырья или заявку на скупку отходов.',
    publishFirstLot: '+ Разместить первый лот',
    resetFilters: 'Сбросить фильтры',

    dealSum: 'Сумма сделки',
    distanceFromYou: 'от вас',
    lotOwner: 'Владелец:',
    paidKaspi: 'Оплачен Kaspi',
    routeToLot: 'Маршрут вывоза',
    payKaspiQr: 'Kaspi QR Оплата',
    yourLot: 'Ваш активный лот',
    chatWithSeller: 'Открыть чат по лоту',
    deleteLotConfirm: 'Удалить этот лот из системы?',
    mapTitle: 'Карта пунктов сбора и лотов',
    activeLotsCountMap: 'активных лотов',
    clickToPickPoint: 'Кликните по карте, чтобы установить точку',
    routeToLotTitle: 'Маршрут к лоту',
    hideRoute: 'Скрыть маршрут',

    kaspiSafeDeal: 'Безопасная эко-сделка',
    paymentToSeller: 'К оплате продавцу',
    qrValidFor: 'QR действителен:',
    scanInstructions: 'Откройте Kaspi.kz → нажмите Kaspi QR и наведите камеру',
    simulatePaymentBtn: 'Подтвердить оплату через Kaspi Gold',
    paymentProcessing: 'Подтверждение платежа...',
    paymentSuccessTitle: 'Оплата прошла успешно!',
    paymentSuccessDesc: 'Сумма переведена продавцу, контакты и навигация разблокированы',
    paymentSum: 'Сумма платежа',
    receiptNumber: 'Номер чека Kaspi',
    sellerNameLabel: 'Продавец',
    contactPhone: 'Телефон для связи',
    viewOnMapBtn: 'Посмотреть точку вывоза на карте',

    dealChat: 'Чат по сделке',
    dealStatus: 'Статус сделки:',
    statusActive: 'Активен',
    statusReserved: 'Забронирован',
    statusPaid: 'Оплачен Kaspi QR',
    statusCompleted: 'Завершена',
    reserveBtn: 'Забронировать',
    completeDealBtn: 'Завершить сделку',
    noMessagesTitle: 'Начните диалог по этой партии',
    noMessagesDesc: 'Задайте вопрос продавцу о чистоте сырья, времени работы склада или условиях погрузки',
    quickReply1: 'Здравствуйте! Сырье еще в наличии?',
    quickReply2: 'Сможем приехать и взвесить сегодня?',
    quickReply3: 'Уточните точный ориентир подъезда к складу?',
    quickReply4: 'Оплату перевел, машина уже на маршруте.',
    chatInputPlaceholder: 'Напишите сообщение...',

    createLotModalTitle: 'Публикация лота вторсырья',
    createLotModalSubtitle: 'Разместите объявление о продаже или скупке сырья с геометкой на карте',
    iAmSelling: '📦 Продаю отходы / вторсырье',
    iAmBuying: '🔄 Скупаю вторичное сырье',
    categoryLabel: 'Категория сырья',
    lotTitleLabel: 'Название лота',
    lotTitlePlaceholder: 'Например: ПЭТ бутылка прозрачная тюкованная 500 кг',
    pricePerUnitLabel: 'Цена за единицу (₸)',
    amountLabel: 'Количество',
    unitLabel: 'Единица изм.',
    unitKg: 'Килограммы (кг)',
    unitT: 'Тонны (т)',
    unitL: 'Литры (л)',
    locationLabel: 'Точка сбора / склад',
    selectPointOnMap: 'Выбрать точку на карте',
    hideMap: 'Скрыть карту',
    addressPlaceholder: 'Адрес (например, г. Алматы, пр. Рыскулова 103)',
    photoLabel: 'Фотография лота',
    uploadPhotoBtn: 'Загрузить фото',
    ecoImpactPreview: 'Экологический эффект',
    additionalDescLabel: 'Дополнительное описание (по желанию)',
    descPlaceholder: 'Укажите условия самовывоза, график работы весовой...',
    cancelBtn: 'Отмена',
    publishLotBtn: 'Опубликовать лот на платформе',
    publishing: 'Публикация...',

    accountsTitle: 'Управление аккаунтами',
    accountsSubtitle: 'Вход, регистрация и переключение ролей',
    switchTab: 'Сменить аккаунт',
    newAccountTab: '+ Новый аккаунт',
    noAccountsTitle: 'Нет сохраненных аккаунтов',
    noAccountsDesc: 'Зарегистрируйте свой первый профиль, чтобы публиковать лоты и совершать сделки.',
    selectProfileHint: 'Выберите активный профиль для работы на маркетплейсе:',
    activeBadge: 'Активен',
    registerMoreBtn: 'Зарегистрировать еще один аккаунт',
    yourRoleTitle: 'Ваша роль на маркетплейсе',
    sellerRoleDesc: 'Вы создаете лоты, указываете цены на сырье и получаете оплату через Kaspi QR.',
    buyerRoleDesc: 'Вы скупаете вторсырье, бронируете партии, оплачиваете по QR и забираете самовывозом.',
    nameLabel: 'Имя или название компании',
    namePlaceholder: 'Например: Баха, ТОО «KazEcorazvitie»',
    phoneLabel: 'Номер телефона (для Kaspi и связи)',
    cityLabel: 'Город / Регион',
    companyLabel: 'Организация (по желанию)',
    companyPlaceholder: 'Склад, ресторан, СТО',
    registerAndLoginBtn: 'Зарегистрироваться и войти',

    archiveTitle: 'Архив завершенных сделок',
    archiveSubtitle: 'История оплат через Kaspi QR, квитанции и точки вывоза',
    emptyArchiveTitle: 'В архиве пока нет оплаченных лотов',
    emptyArchiveDesc: 'Оплатите любой доступный лот через Kaspi QR, и он автоматически появится здесь со всеми координатами и маршрутом вывоза.',
    openOnMap: 'Открыть на карте',
    dateLabel: 'Дата оплаты',
    clearPurchasedLots: 'Очистить купленные лоты',
    clearPurchasedConfirm: 'Очистить все купленные лоты из системы?',
    deletePurchasedLotConfirm: 'Удалить этот купленный лот?',
    deleteLotBtn: 'Удалить лот',

    rateUserTitle: 'Оценить пользователя',
    rateUserDesc: 'Поделитесь впечатлением о пункте приема или поставщике вторсырья',
    yourRating: 'Ваша оценка',
    reviewPlaceholder: 'Напишите комментарий к оценке (по желанию)...',
    submitRating: 'Отправить отзыв',
    submittingRating: 'Отправка...',
    ratingSuccess: 'Спасибо! Ваша оценка и отзыв сохранены',
    cannotRateSelf: 'Вы не можете оценивать свой собственный профиль',
    rateBtn: 'Оценить',
    newUserBadge: 'Новый',
    reviewsCount: 'оценок',
    quickTag1: '⚡ Быстрая сделка',
    quickTag2: '⚖️ Честный вес',
    quickTag3: '💰 Быстрая оплата Kaspi',
    quickTag4: '🤝 Вежливый партнер',
    score1: '1 - Плохо',
    score2: '2 - Так себе',
    score3: '3 - Нормально',
    score4: '4 - Хорошо',
    score5: '5 - Отлично!',

    footerDesc: 'Единая платформа циркулярной переработки отходов и торговли вторичным сырьем.',
    footerCities: 'Алматы · Астана · Шымкент · Қазақстан 2026',

    catPlastic: 'Пластик (PET / HDPE)',
    catPaper: 'Макулатура и картон',
    catMetal: 'Металлолом (черный/цветной)',
    catGlass: 'Стеклобой и тара',
    catElectronics: 'Электронный лом (WEEE)',
    catOil: 'Отработанные масла',
    catOrganic: 'Органика и жмых',
  },

  kk: {
    brandTagline: 'Қайталама шикізат пен қалдықтар маркетплейсі',
    kazakhstan: 'Қазақстан',
    co2Saved: 'Үнемделген CO₂',
    treesSaved: 'Сақталған ағаштар',
    dealsArchive: 'Мәмілелер архиві',
    createLot: 'Лот жасау',
    switchAccount: 'Аккаунтты ауыстыру',
    clearDatabase: 'Деректер қорын тазалау',
    sellerRole: 'Қалдық сатушысы',
    buyerRole: 'Дайындаушы / Сатып алушы',
    loginRegister: 'Кіру / Тіркелу',

    circularEco: 'Қазақстанның айналмалы (циркулярлы) экономикасы',
    heroTitle: 'Қайталама шикізат маркетплейсі — делдалсыз',
    heroSubtitle: 'Пластик, макулатура, металл және пайдаланылған майларды тікелей тапсырыңыз және сатып алыңыз. Kaspi QR арқылы жедел төлем және картадағы ең жақын жинау пунктіне навигация.',
    collectedWaste: 'Жиналған шикізат',
    co2Reduction: 'CO₂ азайту',
    forestEquivalent: 'Орман баламасы',
    marketTurnover: 'Нарық көлемі',
    ecoCalcTitle: 'Шикізаттың эко-калькуляторы',
    calcSubtitle: 'Қазақстан 2026',
    whatToRecycle: 'Нені өткізуді жоспарлайсыз?',
    wasteAmount: 'Шикізат көлемі',
    estIncome: 'Болжамды табыс:',
    treesEquivalentBadge: 'Ағаш баламасы:',
    findBuyersBtn: 'Өңірдегі сатып алушыларды табу',

    searchPlaceholder: 'Атауы, компания немесе көше бойынша іздеу...',
    all: 'Барлығы',
    sell: 'Сату',
    buy: 'Сатып алу',
    allCategories: 'Барлық санаттар',
    lotsFound: 'Табылған партиялар',
    emptyLotsTitle: 'Платформада әзірге хабарландыру жоқ',
    emptyLotsDesc: 'Қайталама шикізатты сату туралы алғашқы хабарландыруды немесе сатып алуға өтінім жариялаңыз.',
    publishFirstLot: '+ Бірінші лотты орналастыру',
    resetFilters: 'Сүзгілерді тазарту',

    dealSum: 'Мәміле сомасы',
    distanceFromYou: 'сізден қашықтықта',
    lotOwner: 'Иесі:',
    paidKaspi: 'Kaspi арқылы төленді',
    routeToLot: 'Әкету бағыты',
    payKaspiQr: 'Kaspi QR Төлеу',
    yourLot: 'Сіздің белсенді лотыңыз',
    chatWithSeller: 'Лот бойынша чатты ашу',
    deleteLotConfirm: 'Бұл лотты жүйеден өшіру керек пе?',
    mapTitle: 'Жинау пункттері мен лоттар картасы',
    activeLotsCountMap: 'белсенді лот',
    clickToPickPoint: 'Нүктені белгілеу үшін картаны басыңыз',
    routeToLotTitle: 'Лотқа дейінгі бағыт',
    hideRoute: 'Бағытты жасыру',

    kaspiSafeDeal: 'Қауіпсіз эко-мәміле',
    paymentToSeller: 'Сатушыға төленетін сома',
    qrValidFor: 'QR жарамдылық уақыты:',
    scanInstructions: 'Kaspi.kz ашыңыз → Kaspi QR басыңыз және камераны бағыттаңыз',
    simulatePaymentBtn: 'Kaspi Gold арқылы төлемді растау',
    paymentProcessing: 'Төлем расталуда...',
    paymentSuccessTitle: 'Төлем сәтті өтті!',
    paymentSuccessDesc: 'Сома сатушыға аударылды, байланыс нөмірі мен навигация ашылды',
    paymentSum: 'Төлем сомасы',
    receiptNumber: 'Kaspi чегінің нөмірі',
    sellerNameLabel: 'Сатушы',
    contactPhone: 'Байланыс телефоны',
    viewOnMapBtn: 'Әкету нүктесін картадан көру',

    dealChat: 'Мәміле бойынша чат',
    dealStatus: 'Мәміле күйі:',
    statusActive: 'Белсенді',
    statusReserved: 'Брондалды',
    statusPaid: 'Kaspi QR арқылы төленді',
    statusCompleted: 'Аяқталды',
    reserveBtn: 'Брондау',
    completeDealBtn: 'Мәмілені аяқтау',
    noMessagesTitle: 'Осы партия бойынша диалогты бастаңыз',
    noMessagesDesc: 'Сатушыға шикізаттың тазалығы, қойманың жұмыс уақыты немесе тиеу шарттары туралы сұрақ қойыңыз',
    quickReply1: 'Сәлеметсіз бе! Шикізат әлі бар ма?',
    quickReply2: 'Бүгін келіп өлшеп алып кете аламыз ба?',
    quickReply3: 'Қоймаға кіретін дәл бағдарды айта аласыз ба?',
    quickReply4: 'Төлем жасадым, көлік жолға шықты.',
    chatInputPlaceholder: 'Хабарлама жазыңыз...',

    createLotModalTitle: 'Қайталама шикізат лотын жариялау',
    createLotModalSubtitle: 'Шикізатты сату немесе сатып алу туралы картадағы белгісімен хабарландыру жариялаңыз',
    iAmSelling: '📦 Қалдықтарды / шикізатты сатамын',
    iAmBuying: '🔄 Қайталама шикізат сатып аламын',
    categoryLabel: 'Шикізат санаты',
    lotTitleLabel: 'Лоттың атауы',
    lotTitlePlaceholder: 'Мысалы: Престелген мөлдір ПЭТ бөтелкелер 500 кг',
    pricePerUnitLabel: 'Бірлік бағасы (₸)',
    amountLabel: 'Көлемі',
    unitLabel: 'Өлшем бірлігі',
    unitKg: 'Килограмм (кг)',
    unitT: 'Тонна (т)',
    unitL: 'Литр (л)',
    locationLabel: 'Жинау нүктесі / қойма',
    selectPointOnMap: 'Картадан нүктені таңдау',
    hideMap: 'Картаны жасыру',
    addressPlaceholder: 'Мекенжай (мысалы: Алматы қ., Рысқұлов даңғылы 103)',
    photoLabel: 'Лоттың фотосуреті',
    uploadPhotoBtn: 'Фото жүктеу',
    ecoImpactPreview: 'Экологиялық әсері',
    additionalDescLabel: 'Қосымша сипаттама (қалауыңыз бойынша)',
    descPlaceholder: 'Өздігінен алып кету шарттары, таразы кестесі туралы жазыңыз...',
    cancelBtn: 'Бас тарту',
    publishLotBtn: 'Лотты платформада жариялау',
    publishing: 'Жариялануда...',

    accountsTitle: 'Аккаунттарды басқару',
    accountsSubtitle: 'Кіру, тіркелу және рөлдерді ауыстыру',
    switchTab: 'Аккаунтты ауыстыру',
    newAccountTab: '+ Жаңа аккаунт',
    noAccountsTitle: 'Сақталған аккаунттар жоқ',
    noAccountsDesc: 'Лоттар жариялау және мәміле жасау үшін алғашқы профиліңізді тіркеңіз.',
    selectProfileHint: 'Маркетплейсте жұмыс істеу үшін белсенді профильді таңдаңыз:',
    activeBadge: 'Белсенді',
    registerMoreBtn: 'Тағы бір аккаунт тіркеу',
    yourRoleTitle: 'Маркетплейстегі сіздің рөліңіз',
    sellerRoleDesc: 'Сіз лоттар жасайсыз, шикізат бағасын көрсетесіз және Kaspi QR арқылы төлем аласыз.',
    buyerRoleDesc: 'Сіз шикізат сатып аласыз, партияларды брондайсыз, QR арқылы төлеп, алып кетесіз.',
    nameLabel: 'Аты немесе компания атауы',
    namePlaceholder: 'Мысалы: Баха, «KazEcorazvitie» ЖШС',
    phoneLabel: 'Телефон нөмірі (Kaspi және байланыс үшін)',
    cityLabel: 'Қала / Өңір',
    companyLabel: 'Ұйым (қалауыңыз бойынша)',
    companyPlaceholder: 'Қойма, мейрамхана, техникалық қызмет көрсету станциясы',
    registerAndLoginBtn: 'Тіркелу және кіру',

    archiveTitle: 'Аяқталған мәмілелер архиві',
    archiveSubtitle: 'Kaspi QR арқылы төлемдер тарихы, чектер және әкету нүктелері',
    emptyArchiveTitle: 'Архивте әзірге төленген лоттар жоқ',
    emptyArchiveDesc: 'Кез келген қолжетімді лотты Kaspi QR арқылы төлеңіз, сонда ол барлық координаттарымен және маршрутымен осында пайда болады.',
    openOnMap: 'Картадан ашу',
    dateLabel: 'Төлем күні',
    clearPurchasedLots: 'Сатып алынғандарды тазарту',
    clearPurchasedConfirm: 'Барлық сатып алынған лоттарды жүйеден өшіру керек пе?',
    deletePurchasedLotConfirm: 'Бұл сатып алынған лотты өшіру керек пе?',
    deleteLotBtn: 'Лотты өшіру',

    rateUserTitle: 'Пайдаланушыны бағалау',
    rateUserDesc: 'Қабылдау пункті немесе шикізат жеткізушісі туралы әсеріңізбен бөлісіңіз',
    yourRating: 'Сіздің бағаңыз',
    reviewPlaceholder: 'Бағаға пікір жазыңыз (қалауыңыз бойынша)...',
    submitRating: 'Пікір жіберу',
    submittingRating: 'Жіберілуде...',
    ratingSuccess: 'Рахмет! Сіздің бағаңыз бен пікіріңіз сақталды',
    cannotRateSelf: 'Өз профиліңізді бағалай алмайсыз',
    rateBtn: 'Бағалау',
    newUserBadge: 'Жаңа',
    reviewsCount: 'баға',
    quickTag1: '⚡ Жылдам мәміле',
    quickTag2: '⚖️ Дәл өлшеу',
    quickTag3: '💰 Kaspi жедел төлем',
    quickTag4: '🤝 Әдепті серіктес',
    score1: '1 - Нашар',
    score2: '2 - Орташа',
    score3: '3 - Жақсы',
    score4: '4 - Өте жақсы',
    score5: '5 - Тамаша!',

    footerDesc: 'Қалдықтарды қайта өңдеу және қайталама шикізат саудасының бірыңғай платформасы.',
    footerCities: 'Алматы · Астана · Шымкент · Қазақстан 2026',

    catPlastic: 'Пластик (PET / HDPE)',
    catPaper: 'Макулатура және картон',
    catMetal: 'Металл сынықтары (қара/түсті)',
    catGlass: 'Шыны сынықтары мен ыдыстар',
    catElectronics: 'Электрондық қалдықтар (WEEE)',
    catOil: 'Пайдаланылған майлар',
    catOrganic: 'Органика мен күнжара',
  },

  en: {
    brandTagline: 'Secondary Raw Materials & Waste Marketplace',
    kazakhstan: 'Kazakhstan',
    co2Saved: 'CO₂ Saved',
    treesSaved: 'Trees Preserved',
    dealsArchive: 'Deals Archive',
    createLot: 'Create Lot',
    switchAccount: 'Switch Account',
    clearDatabase: 'Clear Database',
    sellerRole: 'Waste Seller',
    buyerRole: 'Recycler / Buyer',
    loginRegister: 'Sign In / Register',

    circularEco: 'Circular Economy of Kazakhstan',
    heroTitle: 'Direct Recyclables Marketplace Without Middlemen',
    heroSubtitle: 'Sell and purchase plastic, cardboard, metals, and used motor oils directly. Instant Kaspi QR checkout and route navigation to the nearest collection facility.',
    collectedWaste: 'Collected Raw Materials',
    co2Reduction: 'CO₂ Reduction',
    forestEquivalent: 'Forest Equivalent',
    marketTurnover: 'Market Turnover',
    ecoCalcTitle: 'Recyclables Eco-Calculator',
    calcSubtitle: 'Kazakhstan 2026',
    whatToRecycle: 'What do you plan to supply?',
    wasteAmount: 'Material Quantity',
    estIncome: 'Estimated Revenue:',
    treesEquivalentBadge: 'Tree Equivalent:',
    findBuyersBtn: 'Find Regional Buyers',

    searchPlaceholder: 'Search by title, organization or street...',
    all: 'All',
    sell: 'For Sale',
    buy: 'Wanted / Buying',
    allCategories: 'All Categories',
    lotsFound: 'Batches Found',
    emptyLotsTitle: 'No listings posted yet',
    emptyLotsDesc: 'Publish the first recyclables sale listing or a buying request on the platform.',
    publishFirstLot: '+ Post First Listing',
    resetFilters: 'Reset Filters',

    dealSum: 'Deal Amount',
    distanceFromYou: 'from you',
    lotOwner: 'Supplier:',
    paidKaspi: 'Paid via Kaspi',
    routeToLot: 'Pickup Route',
    payKaspiQr: 'Pay via Kaspi QR',
    yourLot: 'Your Active Listing',
    chatWithSeller: 'Open Deal Chat',
    deleteLotConfirm: 'Delete this listing from system?',
    mapTitle: 'Map of Facilities & Listings',
    activeLotsCountMap: 'active listings',
    clickToPickPoint: 'Click on the map to set coordinates',
    routeToLotTitle: 'Route to Facility',
    hideRoute: 'Hide Route',

    kaspiSafeDeal: 'Secure Eco-Escrow Deal',
    paymentToSeller: 'Payable to Supplier',
    qrValidFor: 'QR valid for:',
    scanInstructions: 'Open Kaspi.kz → Tap Kaspi QR → Scan Code',
    simulatePaymentBtn: 'Confirm Payment with Kaspi Gold',
    paymentProcessing: 'Confirming transaction...',
    paymentSuccessTitle: 'Payment Successful!',
    paymentSuccessDesc: 'Funds transferred to supplier, contact details and navigation unlocked',
    paymentSum: 'Payment Amount',
    receiptNumber: 'Kaspi Receipt #',
    sellerNameLabel: 'Supplier',
    contactPhone: 'Contact Phone',
    viewOnMapBtn: 'View Pickup Point on Map',

    dealChat: 'Deal Chat',
    dealStatus: 'Deal Status:',
    statusActive: 'Active',
    statusReserved: 'Reserved',
    statusPaid: 'Paid via Kaspi QR',
    statusCompleted: 'Completed',
    reserveBtn: 'Reserve Batch',
    completeDealBtn: 'Complete Deal',
    noMessagesTitle: 'Start negotiation for this batch',
    noMessagesDesc: 'Ask the supplier about material purity, weighing equipment or pickup schedule',
    quickReply1: 'Hello! Is this batch still available?',
    quickReply2: 'Can our truck arrive and weigh today?',
    quickReply3: 'Could you clarify warehouse access landmarks?',
    quickReply4: 'Payment sent via Kaspi, truck is en route.',
    chatInputPlaceholder: 'Write a message...',

    createLotModalTitle: 'Publish Recyclables Listing',
    createLotModalSubtitle: 'List scrap materials for sale or procurement with precise map coordinates',
    iAmSelling: '📦 Selling Waste / Recyclables',
    iAmBuying: '🔄 Buying Secondary Raw Materials',
    categoryLabel: 'Material Category',
    lotTitleLabel: 'Listing Title',
    lotTitlePlaceholder: 'E.g. Baled transparent PET bottles 500 kg',
    pricePerUnitLabel: 'Price per unit (₸)',
    amountLabel: 'Quantity',
    unitLabel: 'Unit',
    unitKg: 'Kilograms (kg)',
    unitT: 'Tons (t)',
    unitL: 'Liters (l)',
    locationLabel: 'Facility / Collection Point',
    selectPointOnMap: 'Pick Point on Map',
    hideMap: 'Hide Map',
    addressPlaceholder: 'Address (e.g. Almaty, 103 Ryskulov Ave)',
    photoLabel: 'Batch Photo',
    uploadPhotoBtn: 'Upload Photo',
    ecoImpactPreview: 'Ecological Impact',
    additionalDescLabel: 'Additional Description (optional)',
    descPlaceholder: 'Provide pickup terms, scale hours, packaging details...',
    cancelBtn: 'Cancel',
    publishLotBtn: 'Publish Listing on Marketplace',
    publishing: 'Publishing...',

    accountsTitle: 'Account Management',
    accountsSubtitle: 'Sign in, register and switch operational roles',
    switchTab: 'Switch Account',
    newAccountTab: '+ New Account',
    noAccountsTitle: 'No saved profiles',
    noAccountsDesc: 'Register your initial account to post listings and negotiate transactions.',
    selectProfileHint: 'Select active profile for marketplace operations:',
    activeBadge: 'Active',
    registerMoreBtn: 'Register Another Account',
    yourRoleTitle: 'Your Marketplace Role',
    sellerRoleDesc: 'You create listings, set unit pricing and receive payments via Kaspi QR.',
    buyerRoleDesc: 'You purchase recyclables, reserve batches, pay via QR and handle transport.',
    nameLabel: 'Name or Organization',
    namePlaceholder: 'E.g. Bakha, KazEcorazvitie LLP',
    phoneLabel: 'Phone Number (for Kaspi & Logistics)',
    cityLabel: 'City / Region',
    companyLabel: 'Company (optional)',
    companyPlaceholder: 'Warehouse, restaurant, workshop',
    registerAndLoginBtn: 'Register & Continue',

    archiveTitle: 'Completed Transactions Archive',
    archiveSubtitle: 'Kaspi QR payment records, receipts and pickup locations',
    emptyArchiveTitle: 'No completed deals yet',
    emptyArchiveDesc: 'Pay for any available batch via Kaspi QR, and it will appear here with full coordinates and route details.',
    openOnMap: 'View on Map',
    dateLabel: 'Payment Date',
    clearPurchasedLots: 'Clear purchased lots',
    clearPurchasedConfirm: 'Remove all purchased lots from the system?',
    deletePurchasedLotConfirm: 'Delete this purchased lot?',
    deleteLotBtn: 'Delete lot',

    rateUserTitle: 'Rate Partner',
    rateUserDesc: 'Share feedback about collection facility speed and material reliability',
    yourRating: 'Your Rating',
    reviewPlaceholder: 'Write a review or feedback (optional)...',
    submitRating: 'Submit Review',
    submittingRating: 'Submitting...',
    ratingSuccess: 'Thank you! Your rating and review have been recorded',
    cannotRateSelf: 'You cannot rate your own profile',
    rateBtn: 'Rate',
    newUserBadge: 'New',
    reviewsCount: 'reviews',
    quickTag1: '⚡ Fast Transaction',
    quickTag2: '⚖️ Honest Weight',
    quickTag3: '💰 Instant Kaspi Pay',
    quickTag4: '🤝 Polite Partner',
    score1: '1 - Poor',
    score2: '2 - Fair',
    score3: '3 - Good',
    score4: '4 - Very Good',
    score5: '5 - Excellent!',

    footerDesc: 'Unified platform for circular waste processing and secondary raw materials trading.',
    footerCities: 'Almaty · Astana · Shymkent · Kazakhstan 2026',

    catPlastic: 'Plastic (PET / HDPE)',
    catPaper: 'Paper & Cardboard',
    catMetal: 'Scrap Metal (Ferrous / Non-ferrous)',
    catGlass: 'Glass Cullet & Containers',
    catElectronics: 'Electronic Waste (WEEE)',
    catOil: 'Used Industrial Oils',
    catOrganic: 'Organic Waste & Pomace',
  },
};
