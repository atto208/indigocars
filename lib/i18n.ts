// Public-site localization. English is the editable CMS baseline; the other
// languages override the marketing text + UI chrome below. Non-text settings
// (phone, email, images, links) always come from the CMS so they propagate.

export const LOCALES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";

export function isLocale(x: unknown): x is Locale {
  return typeof x === "string" && LOCALES.some((l) => l.code === x);
}
export function dirOf(locale: Locale): "ltr" | "rtl" {
  return LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
}

// Best supported locale from an Accept-Language header (browser preference).
export function pickLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  for (const part of acceptLanguage.split(",")) {
    const base = part.trim().split(";")[0].split("-")[0].toLowerCase();
    const hit = LOCALES.find((l) => l.code === base);
    if (hit) return hit.code;
  }
  return DEFAULT_LOCALE;
}

// Settings keys that hold translatable marketing text (editable per language).
// Everything else (phone, email, images, links, stat numbers) is shared.
export const LOCALIZED_KEYS = [
  "heroBadge", "heroTitle", "heroSubtitle", "heroCta", "heroImageCaption",
  "fleetTitle", "fleetSubtitle",
  "aboutTitle", "aboutText",
  "stat1Label", "stat2Label", "stat3Label", "stat4Label",
  "contactTitle", "contactSubtitle", "address", "workingHours",
  "whatsappTemplate", "whatsappGeneric", "footerText",
] as const;

// ---- localized marketing content (overrides text fields of the settings) ----
type ContentKeys =
  | "heroBadge" | "heroTitle" | "heroSubtitle" | "heroCta"
  | "fleetTitle" | "fleetSubtitle"
  | "aboutTitle" | "aboutText"
  | "stat1Label" | "stat2Label" | "stat3Label" | "stat4Label"
  | "contactTitle" | "contactSubtitle" | "address" | "workingHours"
  | "whatsappTemplate" | "whatsappGeneric" | "footerText" | "heroImageCaption";

export const CONTENT: Record<Locale, Partial<Record<ContentKeys, string>>> = {
  en: {},
  tr: {
    heroBadge: "Premium Araç Kiralama · İstanbul",
    heroTitle: "Aracı Kirala.\nŞehrin Sahibi Ol.",
    heroSubtitle:
      "İstanbul'un kalbinde premium araç kiralama. Yeni modeller, şeffaf fiyatlar, kapınıza teslim — havalimanı, otel ya da şehrin her yerinde.",
    heroCta: "Araçları İncele",
    fleetTitle: "Filomuz",
    fleetSubtitle:
      "Pratik şehir araçlarından prestijli sedanlara ve geniş minivanlara kadar — her aracımız yeni, tam sigortalı ve titizlikle bakımlı.",
    aboutTitle: "Indigo Cars Hakkında",
    aboutText:
      "Indigo Cars, İstanbul merkezli bir araç kiralama şirketidir ve tek bir basit fikre dayanır: araç kiralamak zahmetsiz olmalı. Gizli ücret yok, bitmek bilmeyen evrak yok, sürpriz yok.\n\n25'in üzerindeki araçtan oluşan filomuz, ekonomik şehir araçlarından premium sedanlara ve geniş minivanlara kadar her şeyi kapsar. Her araç düzenli olarak servis edilir, kiralamalar arasında derinlemesine temizlenir ve tam sigortalıdır.\n\nİstanbul'un her yerine — İstanbul Havalimanı (IST) ve Sabiha Gökçen (SAW) dahil — haftanın 7 günü teslimat ve teslim alma yapıyoruz. Tek bir WhatsApp mesajı yeterli.",
    stat1Label: "Araçlık Filo",
    stat2Label: "Destek & Teslimat",
    stat3Label: "Sigortalı Araç",
    stat4Label: "Müşteri Puanı",
    contactTitle: "İletişime Geçin",
    contactSubtitle:
      "Bir sorunuz mu var ya da araç mı ayırtmak istiyorsunuz? WhatsApp'tan yazın — dakikalar içinde yanıt veriyoruz.",
    address: "İstanbul, Türkiye",
    workingHours: "Her gün · 09:00 – 22:00 (WhatsApp 7/24)",
    whatsappTemplate:
      "Merhaba Indigo Cars! 👋 {car} aracını kiralamak istiyorum. Müsaitlik ve fiyat hakkında bilgi verir misiniz?",
    whatsappGeneric:
      "Merhaba Indigo Cars! 👋 İstanbul'da araç kiralamak istiyorum. Yardımcı olur musunuz?",
    footerText:
      "Indigo Cars — İstanbul'da premium araç kiralama. Havalimanı teslimatı, tam sigorta, 7/24 destek.",
    heroImageCaption: "Citroën C4 X · Konfor Sınıfı",
  },
  ar: {
    heroBadge: "تأجير سيارات فاخرة · إسطنبول",
    heroTitle: "استأجر السيارة.\nوامتلك المدينة.",
    heroSubtitle:
      "تأجير سيارات فاخرة في قلب إسطنبول. موديلات حديثة، أسعار شفافة، وتوصيل إلى بابك — المطار أو الفندق أو أي مكان في المدينة.",
    heroCta: "تصفّح سياراتنا",
    fleetTitle: "أسطولنا",
    fleetSubtitle:
      "من سيارات المدينة العملية إلى السيدان الفاخرة وحافلات العائلة — كل سيارة حديثة ومؤمّنة بالكامل وبصيانة دقيقة.",
    aboutTitle: "عن Indigo Cars",
    aboutText:
      "Indigo Cars شركة تأجير سيارات مقرها إسطنبول، قائمة على فكرة بسيطة: استئجار السيارة يجب أن يكون سهلاً. لا رسوم خفية، ولا أوراق لا تنتهي، ولا مفاجآت.\n\nيضم أسطولنا أكثر من 25 سيارة تغطي كل شيء، من سيارات المدينة الاقتصادية إلى السيدان الفاخرة والحافلات الواسعة. كل سيارة تخضع للصيانة بانتظام، وتُنظَّف بعمق بين الحجوزات، ومؤمّنة بالكامل.\n\nنقوم بالتوصيل والاستلام في أي مكان في إسطنبول — بما في ذلك مطار إسطنبول (IST) ومطار صبيحة كوكجن (SAW) — طوال أيام الأسبوع. رسالة واحدة على واتساب تكفي.",
    stat1Label: "سيارة في الأسطول",
    stat2Label: "دعم وتوصيل",
    stat3Label: "سيارات مؤمّنة",
    stat4Label: "تقييم العملاء",
    contactTitle: "تواصل معنا",
    contactSubtitle:
      "لديك سؤال أو تريد حجز سيارة؟ راسلنا على واتساب — نردّ خلال دقائق.",
    address: "إسطنبول، تركيا",
    workingHours: "كل يوم · 09:00 – 22:00 (واتساب على مدار الساعة)",
    whatsappTemplate:
      "مرحباً Indigo Cars! 👋 أودّ حجز سيارة {car}. هل يمكنكم إخباري بالتوفر والأسعار؟",
    whatsappGeneric:
      "مرحباً Indigo Cars! 👋 أرغب في استئجار سيارة في إسطنبول. هل يمكنكم مساعدتي؟",
    footerText:
      "Indigo Cars — تأجير سيارات فاخرة في إسطنبول. توصيل إلى المطار، تأمين شامل، دعم على مدار الساعة.",
    heroImageCaption: "Citroën C4 X · فئة الراحة",
  },
  ru: {
    heroBadge: "Премиум аренда авто · Стамбул",
    heroTitle: "Арендуй авто.\nВладей городом.",
    heroSubtitle:
      "Премиальная аренда автомобилей в сердце Стамбула. Новые модели, прозрачные цены, доставка к вашей двери — аэропорт, отель или любая точка города.",
    heroCta: "Смотреть авто",
    fleetTitle: "Наш автопарк",
    fleetSubtitle:
      "От компактных городских авто до представительских седанов и семейных минивэнов — каждая машина новая, полностью застрахована и тщательно обслужена.",
    aboutTitle: "О компании Indigo Cars",
    aboutText:
      "Indigo Cars — стамбульская компания по аренде автомобилей, построенная на простой идее: аренда должна быть лёгкой. Никаких скрытых платежей, бесконечных бумаг и сюрпризов.\n\nНаш автопарк из более чем 25 автомобилей охватывает всё — от экономичных городских машин до премиальных седанов и просторных минивэнов. Каждый автомобиль регулярно обслуживается, тщательно моется между арендами и полностью застрахован.\n\nМы доставляем и забираем авто в любой точке Стамбула — включая аэропорт Стамбул (IST) и Сабиха Гёкчен (SAW) — 7 дней в неделю. Достаточно одного сообщения в WhatsApp.",
    stat1Label: "Авто в парке",
    stat2Label: "Поддержка и доставка",
    stat3Label: "Застрахованы",
    stat4Label: "Оценка клиентов",
    contactTitle: "Свяжитесь с нами",
    contactSubtitle:
      "Есть вопрос или хотите забронировать авто? Напишите нам в WhatsApp — отвечаем за пару минут.",
    address: "Стамбул, Турция",
    workingHours: "Каждый день · 09:00 – 22:00 (WhatsApp 24/7)",
    whatsappTemplate:
      "Здравствуйте, Indigo Cars! 👋 Я хочу арендовать {car}. Подскажите, пожалуйста, наличие и цены?",
    whatsappGeneric:
      "Здравствуйте, Indigo Cars! 👋 Я хочу арендовать автомобиль в Стамбуле. Поможете?",
    footerText:
      "Indigo Cars — премиальная аренда авто в Стамбуле. Доставка в аэропорт, полная страховка, поддержка 24/7.",
    heroImageCaption: "Citroën C4 X · Класс комфорт",
  },
  de: {
    heroBadge: "Premium-Autovermietung · Istanbul",
    heroTitle: "Miete das Auto.\nErobere die Stadt.",
    heroSubtitle:
      "Premium-Autovermietung im Herzen Istanbuls. Neue Modelle, transparente Preise, direkt zu Ihnen geliefert — Flughafen, Hotel oder überall in der Stadt.",
    heroCta: "Autos ansehen",
    fleetTitle: "Unsere Flotte",
    fleetSubtitle:
      "Vom wendigen Stadtauto über repräsentative Limousinen bis zum Familienvan — jedes Fahrzeug ist neu, voll versichert und sorgfältig gewartet.",
    aboutTitle: "Über Indigo Cars",
    aboutText:
      "Indigo Cars ist eine Autovermietung mit Sitz in Istanbul, die auf einer einfachen Idee beruht: Autovermietung sollte mühelos sein. Keine versteckten Gebühren, kein endloser Papierkram, keine Überraschungen.\n\nUnsere Flotte aus über 25 Fahrzeugen deckt alles ab — vom sparsamen Stadtauto bis zur Premium-Limousine und zum geräumigen Van. Jedes Auto wird regelmäßig gewartet, zwischen den Vermietungen gründlich gereinigt und ist voll versichert.\n\nWir liefern und holen überall in Istanbul ab — auch am Flughafen Istanbul (IST) und Sabiha Gökçen (SAW) — an 7 Tagen die Woche. Eine WhatsApp-Nachricht genügt.",
    stat1Label: "Autos in der Flotte",
    stat2Label: "Support & Lieferung",
    stat3Label: "Versicherte Fahrzeuge",
    stat4Label: "Kundenbewertung",
    contactTitle: "Kontakt",
    contactSubtitle:
      "Eine Frage oder möchten Sie ein Auto reservieren? Schreiben Sie uns auf WhatsApp — wir antworten innerhalb von Minuten.",
    address: "Istanbul, Türkei",
    workingHours: "Täglich · 09:00 – 22:00 (WhatsApp rund um die Uhr)",
    whatsappTemplate:
      "Hallo Indigo Cars! 👋 Ich möchte den {car} mieten. Können Sie mir Verfügbarkeit und Preise nennen?",
    whatsappGeneric:
      "Hallo Indigo Cars! 👋 Ich möchte ein Auto in Istanbul mieten. Können Sie mir helfen?",
    footerText:
      "Indigo Cars — Premium-Autovermietung in Istanbul. Flughafenlieferung, Vollversicherung, Support rund um die Uhr.",
    heroImageCaption: "Citroën C4 X · Komfortklasse",
  },
};

// ---- UI chrome strings ----
export type UI = {
  nav: { ourCars: string; whyUs: string; about: string; contact: string; bookNow: string };
  whatsapp: string;
  language: string;
  fleetEyebrow: string;
  cat: Record<string, string>;
  trans: Record<string, string>;
  fuel: Record<string, string>;
  spec: { seats: string; hp: string; bags: string; perDay: string };
  popular: string;
  bookCta: string;
  aboutEyebrow: string;
  reviews: { eyebrow: string; title: string; subtitle: string };
  why: {
    eyebrow: string; title: string; subtitle: string;
    deliveredTitle: string; deliveredDesc: string;
    insuredTitle: string; insuredDesc: string;
    supportTitle: string; supportDesc: string;
    airportTitle: string; airportDesc: string; airportsWord: string;
    newestTitle: string; newestDesc: string;
    pricingTitle: string; pricingDesc: string;
  };
  contact: { eyebrow: string; whatsappPhone: string; email: string; location: string; hours: string; cta: string };
};

export const UI_STRINGS: Record<Locale, UI> = {
  en: {
    nav: { ourCars: "Our Cars", whyUs: "Why Us", about: "About", contact: "Contact", bookNow: "Book Now" },
    whatsapp: "WhatsApp", language: "Language",
    fleetEyebrow: "The Fleet",
    cat: { All: "All", Economy: "Economy", Comfort: "Comfort", SUV: "SUV", Luxury: "Luxury", Van: "Van" },
    trans: { Automatic: "Automatic", Manual: "Manual" },
    fuel: { Petrol: "Petrol", Diesel: "Diesel", Hybrid: "Hybrid", Electric: "Electric", LPG: "LPG" },
    spec: { seats: "seats", hp: "hp", bags: "bags", perDay: "per day" },
    popular: "Popular", bookCta: "Book on WhatsApp",
    aboutEyebrow: "About us",
    reviews: { eyebrow: "Reviews", title: "Loved by our renters", subtitle: "Real words from travellers and locals who rented with Indigo Cars." },
    why: {
      eyebrow: "Why Indigo", title: "Renting, Reinvented",
      subtitle: "No paperwork marathons, no hidden fees. Just a new car, delivered where you are — and a team one message away.",
      deliveredTitle: "Delivered to your door", deliveredDesc: "Airport, hotel or anywhere in Istanbul — we bring the car to you and pick it back up.",
      insuredTitle: "100% insured", insuredDesc: "Every car fully covered, so you just drive.",
      supportTitle: "24/7 on WhatsApp", supportDesc: "Real people, replying in minutes — day or night.",
      airportTitle: "Airport pick-up & drop-off", airportDesc: "Istanbul (IST) and Sabiha Gökçen (SAW), on your schedule.", airportsWord: "airports",
      newestTitle: "Newest models", newestDesc: "Recent, fully serviced and deep-cleaned between rentals.",
      pricingTitle: "Transparent pricing", pricingDesc: "The price we quote is the price you pay.",
    },
    contact: { eyebrow: "Get in touch", whatsappPhone: "WhatsApp / Phone", email: "Email", location: "Location", hours: "Working Hours", cta: "Chat on WhatsApp" },
  },
  tr: {
    nav: { ourCars: "Araçlar", whyUs: "Neden Biz", about: "Hakkımızda", contact: "İletişim", bookNow: "Rezervasyon" },
    whatsapp: "WhatsApp", language: "Dil",
    fleetEyebrow: "Filo",
    cat: { All: "Tümü", Economy: "Ekonomi", Comfort: "Konfor", SUV: "SUV", Luxury: "Lüks", Van: "Minivan" },
    trans: { Automatic: "Otomatik", Manual: "Manuel" },
    fuel: { Petrol: "Benzin", Diesel: "Dizel", Hybrid: "Hibrit", Electric: "Elektrik", LPG: "LPG" },
    spec: { seats: "koltuk", hp: "hp", bags: "valiz", perDay: "günlük" },
    popular: "Popüler", bookCta: "WhatsApp'tan Ayırt",
    aboutEyebrow: "Hakkımızda",
    reviews: { eyebrow: "Yorumlar", title: "Müşterilerimiz seviyor", subtitle: "Indigo Cars ile kiralayan gezginlerden ve yerlilerden gerçek yorumlar." },
    why: {
      eyebrow: "Neden Indigo", title: "Kiralama, Yeniden",
      subtitle: "Evrak maratonu yok, gizli ücret yok. Sadece bulunduğunuz yere teslim edilen yeni bir araç — ve bir mesaj uzağınızdaki ekip.",
      deliveredTitle: "Kapınıza teslim", deliveredDesc: "Havalimanı, otel ya da İstanbul'un her yeri — aracı size getirir ve geri alırız.",
      insuredTitle: "%100 sigortalı", insuredDesc: "Her araç tam kapsamlı, siz sadece sürün.",
      supportTitle: "7/24 WhatsApp", supportDesc: "Gerçek insanlar, dakikalar içinde yanıt — gece gündüz.",
      airportTitle: "Havalimanı teslim & alım", airportDesc: "İstanbul (IST) ve Sabiha Gökçen (SAW), sizin programınıza göre.", airportsWord: "havalimanı",
      newestTitle: "En yeni modeller", newestDesc: "Yeni, tam bakımlı ve kiralamalar arasında derin temizlenmiş.",
      pricingTitle: "Şeffaf fiyat", pricingDesc: "Verdiğimiz fiyat, ödediğiniz fiyattır.",
    },
    contact: { eyebrow: "İletişim", whatsappPhone: "WhatsApp / Telefon", email: "E-posta", location: "Konum", hours: "Çalışma Saatleri", cta: "WhatsApp'tan Yaz" },
  },
  ar: {
    nav: { ourCars: "سياراتنا", whyUs: "لماذا نحن", about: "من نحن", contact: "تواصل", bookNow: "احجز الآن" },
    whatsapp: "واتساب", language: "اللغة",
    fleetEyebrow: "الأسطول",
    cat: { All: "الكل", Economy: "اقتصادي", Comfort: "كومفورت", SUV: "دفع رباعي", Luxury: "فاخر", Van: "فان" },
    trans: { Automatic: "أوتوماتيك", Manual: "يدوي" },
    fuel: { Petrol: "بنزين", Diesel: "ديزل", Hybrid: "هجين", Electric: "كهرباء", LPG: "غاز" },
    spec: { seats: "مقاعد", hp: "حصان", bags: "حقائب", perDay: "يومياً" },
    popular: "الأكثر طلباً", bookCta: "احجز عبر واتساب",
    aboutEyebrow: "من نحن",
    reviews: { eyebrow: "التقييمات", title: "عملاؤنا يحبّوننا", subtitle: "كلمات حقيقية من مسافرين ومقيمين استأجروا مع Indigo Cars." },
    why: {
      eyebrow: "لماذا Indigo", title: "تأجير بمفهوم جديد",
      subtitle: "لا أوراق مرهقة ولا رسوم خفية. فقط سيارة جديدة تصل إليك أينما كنت — وفريق على بُعد رسالة واحدة.",
      deliveredTitle: "توصيل إلى بابك", deliveredDesc: "المطار أو الفندق أو أي مكان في إسطنبول — نوصل السيارة إليك ونستلمها لاحقاً.",
      insuredTitle: "تأمين 100%", insuredDesc: "كل سيارة مؤمّنة بالكامل، فقط قُدها.",
      supportTitle: "واتساب على مدار الساعة", supportDesc: "أشخاص حقيقيون يردّون خلال دقائق — ليلاً أو نهاراً.",
      airportTitle: "استلام وتسليم بالمطار", airportDesc: "مطار إسطنبول (IST) وصبيحة كوكجن (SAW)، حسب وقتك.", airportsWord: "مطاران",
      newestTitle: "أحدث الموديلات", newestDesc: "حديثة، بصيانة كاملة وتنظيف عميق بين الحجوزات.",
      pricingTitle: "أسعار شفافة", pricingDesc: "السعر الذي نخبرك به هو ما تدفعه.",
    },
    contact: { eyebrow: "تواصل معنا", whatsappPhone: "واتساب / هاتف", email: "البريد الإلكتروني", location: "الموقع", hours: "ساعات العمل", cta: "تحدّث عبر واتساب" },
  },
  ru: {
    nav: { ourCars: "Авто", whyUs: "Почему мы", about: "О нас", contact: "Контакты", bookNow: "Забронировать" },
    whatsapp: "WhatsApp", language: "Язык",
    fleetEyebrow: "Автопарк",
    cat: { All: "Все", Economy: "Эконом", Comfort: "Комфорт", SUV: "Внедорожник", Luxury: "Люкс", Van: "Минивэн" },
    trans: { Automatic: "Автомат", Manual: "Механика" },
    fuel: { Petrol: "Бензин", Diesel: "Дизель", Hybrid: "Гибрид", Electric: "Электро", LPG: "Газ" },
    spec: { seats: "мест", hp: "л.с.", bags: "сумки", perDay: "в день" },
    popular: "Популярно", bookCta: "Бронь в WhatsApp",
    aboutEyebrow: "О нас",
    reviews: { eyebrow: "Отзывы", title: "Нас выбирают", subtitle: "Реальные отзывы путешественников и местных, арендовавших у Indigo Cars." },
    why: {
      eyebrow: "Почему Indigo", title: "Аренда по-новому",
      subtitle: "Никаких бумажных марафонов и скрытых платежей. Просто новое авто с доставкой туда, где вы — и команда на расстоянии одного сообщения.",
      deliveredTitle: "Доставка к двери", deliveredDesc: "Аэропорт, отель или любая точка Стамбула — привезём авто и заберём обратно.",
      insuredTitle: "100% страховка", insuredDesc: "Каждое авто полностью застраховано — просто садитесь и едьте.",
      supportTitle: "WhatsApp 24/7", supportDesc: "Живые люди, ответ за минуты — днём и ночью.",
      airportTitle: "Подача и возврат в аэропорту", airportDesc: "Стамбул (IST) и Сабиха Гёкчен (SAW), по вашему графику.", airportsWord: "аэропорта",
      newestTitle: "Новейшие модели", newestDesc: "Свежие, полностью обслужены и тщательно вымыты между арендами.",
      pricingTitle: "Прозрачные цены", pricingDesc: "Названная цена — это то, что вы платите.",
    },
    contact: { eyebrow: "Связаться", whatsappPhone: "WhatsApp / Телефон", email: "Эл. почта", location: "Адрес", hours: "Часы работы", cta: "Написать в WhatsApp" },
  },
  de: {
    nav: { ourCars: "Autos", whyUs: "Warum wir", about: "Über uns", contact: "Kontakt", bookNow: "Buchen" },
    whatsapp: "WhatsApp", language: "Sprache",
    fleetEyebrow: "Die Flotte",
    cat: { All: "Alle", Economy: "Economy", Comfort: "Komfort", SUV: "SUV", Luxury: "Luxus", Van: "Van" },
    trans: { Automatic: "Automatik", Manual: "Schaltung" },
    fuel: { Petrol: "Benzin", Diesel: "Diesel", Hybrid: "Hybrid", Electric: "Elektro", LPG: "LPG" },
    spec: { seats: "Sitze", hp: "PS", bags: "Koffer", perDay: "pro Tag" },
    popular: "Beliebt", bookCta: "Per WhatsApp buchen",
    aboutEyebrow: "Über uns",
    reviews: { eyebrow: "Bewertungen", title: "Von unseren Mietern geliebt", subtitle: "Echte Stimmen von Reisenden und Einheimischen, die bei Indigo Cars gemietet haben." },
    why: {
      eyebrow: "Warum Indigo", title: "Mieten, neu gedacht",
      subtitle: "Kein Papierkram-Marathon, keine versteckten Gebühren. Nur ein neues Auto, geliefert wo Sie sind — und ein Team eine Nachricht entfernt.",
      deliveredTitle: "Direkt zu Ihnen geliefert", deliveredDesc: "Flughafen, Hotel oder überall in Istanbul — wir bringen das Auto und holen es wieder ab.",
      insuredTitle: "100% versichert", insuredDesc: "Jedes Auto voll abgesichert — einfach losfahren.",
      supportTitle: "24/7 auf WhatsApp", supportDesc: "Echte Menschen, Antwort in Minuten — Tag und Nacht.",
      airportTitle: "Abholung & Rückgabe am Flughafen", airportDesc: "Istanbul (IST) und Sabiha Gökçen (SAW), nach Ihrem Zeitplan.", airportsWord: "Flughäfen",
      newestTitle: "Neueste Modelle", newestDesc: "Aktuell, voll gewartet und zwischen den Mieten gründlich gereinigt.",
      pricingTitle: "Transparente Preise", pricingDesc: "Der genannte Preis ist der Preis, den Sie zahlen.",
    },
    contact: { eyebrow: "Kontakt", whatsappPhone: "WhatsApp / Telefon", email: "E-Mail", location: "Standort", hours: "Öffnungszeiten", cta: "Auf WhatsApp schreiben" },
  },
};
