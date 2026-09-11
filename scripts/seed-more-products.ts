// One-off catalog expansion: hand-authored products (not from DummyJSON,
// which only has 194 total — already fully seeded by seed.ts) added on top
// of the existing catalog, skewed towards tech. Images/galleries are reused
// from existing same-category DummyJSON products (cdn.dummyjson.com is
// already the only external image host the site trusts), so no new image
// hosting/config is needed and nothing can ever 404.
import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type NewProduct = {
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  sku: string;
  tags: string[];
  warranty_information: string;
  shipping_information: string;
  return_policy: string;
  availability_status: string;
  reviews: Review[];
};

function reviews(seed: number): Review[] {
  const pool: Review[] = [
    {
      rating: 5,
      comment: "Отлично качество, точно както се очаква.",
      date: "2026-07-12T10:20:00.000Z",
      reviewerName: "Иван Георгиев",
      reviewerEmail: "ivan.georgiev@example.com",
    },
    {
      rating: 4,
      comment: "Много добра стойност за парите, бърза доставка.",
      date: "2026-08-03T15:40:00.000Z",
      reviewerName: "Мария Петрова",
      reviewerEmail: "maria.petrova@example.com",
    },
    {
      rating: 5,
      comment: "Препоръчвам, реагира точно както описанието.",
      date: "2026-08-21T08:05:00.000Z",
      reviewerName: "Стефан Николов",
      reviewerEmail: "stefan.nikolov@example.com",
    },
  ];
  return [pool[seed % 3], pool[(seed + 1) % 3]];
}

const TECH_WARRANTY = {
  smartphones: {
    warranty_information: "Lifetime warranty",
    shipping_information: "Ships in 1 month",
    return_policy: "60 days return policy",
  },
  laptops: {
    warranty_information: "3 year warranty",
    shipping_information: "Ships in 2 weeks",
    return_policy: "90 days return policy",
  },
  tablets: {
    warranty_information: "2 year warranty",
    shipping_information: "Ships in 1-2 business days",
    return_policy: "No return policy",
  },
  "mobile-accessories": {
    warranty_information: "6 months warranty",
    shipping_information: "Ships in 1 week",
    return_policy: "7 days return policy",
  },
} as const;

const OTHER_WARRANTY = {
  warranty_information: "1 year warranty",
  shipping_information: "Ships in 3-5 business days",
  return_policy: "30 days return policy",
};

const products: NewProduct[] = [
  // --- Smartphones ---
  {
    title: "iPhone 16 Pro Max",
    description:
      "Най-новият флагман на Apple — титаниев корпус, чип A18 Pro и камера с невероятна детайлност.",
    category: "smartphones",
    brand: "Apple",
    price: 1449,
    discount_percentage: 5,
    rating: 4.8,
    stock: 40,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp",
    ],
    sku: "TECH-APL-IP16PM",
    tags: ["smartphones", "apple", "5g"],
    ...TECH_WARRANTY.smartphones,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "Samsung Galaxy S25 Ultra",
    description:
      "Флагманският Galaxy с AI функции, 200MP камера и S Pen в комплекта.",
    category: "smartphones",
    brand: "Samsung",
    price: 1399,
    discount_percentage: 8,
    rating: 4.7,
    stock: 35,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp",
    ],
    sku: "TECH-SAM-S25U",
    tags: ["smartphones", "samsung", "5g"],
    ...TECH_WARRANTY.smartphones,
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "Google Pixel 9 Pro",
    description:
      "Чист Android, най-добрата компютърна фотография в клас и Gemini AI вградено.",
    category: "smartphones",
    brand: "Google",
    price: 1099,
    discount_percentage: 10,
    rating: 4.6,
    stock: 30,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/vivo-x21/3.webp",
    ],
    sku: "TECH-GGL-PX9P",
    tags: ["smartphones", "google", "android"],
    ...TECH_WARRANTY.smartphones,
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  {
    title: "Xiaomi 14 Ultra",
    description:
      "Leica оптика, Snapdragon 8 Gen 4 и бързо зареждане 90W — премиум клас на разумна цена.",
    category: "smartphones",
    brand: "Xiaomi",
    price: 999,
    discount_percentage: 12,
    rating: 4.5,
    stock: 50,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/3.webp",
    ],
    sku: "TECH-XMI-14U",
    tags: ["smartphones", "xiaomi", "android"],
    ...TECH_WARRANTY.smartphones,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "OnePlus 12",
    description:
      "Hasselblad камера, зареждане за 20 минути до 100% и гладък 120Hz дисплей.",
    category: "smartphones",
    brand: "OnePlus",
    price: 899,
    discount_percentage: 15,
    rating: 4.4,
    stock: 45,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/1.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/2.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/3.webp",
      "https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/4.webp",
    ],
    sku: "TECH-1PL-12",
    tags: ["smartphones", "oneplus", "android"],
    ...TECH_WARRANTY.smartphones,
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  // --- Laptops ---
  {
    title: "MacBook Air M4",
    description:
      "По-тънък, по-бърз, до 20 часа издръжливост на батерията — идеален за работа в движение.",
    category: "laptops",
    brand: "Apple",
    price: 1299,
    discount_percentage: 5,
    rating: 4.8,
    stock: 25,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/3.webp",
    ],
    sku: "TECH-APL-MBA-M4",
    tags: ["laptops", "apple", "ultrabook"],
    ...TECH_WARRANTY.laptops,
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  {
    title: "Dell XPS 14 (2026)",
    description:
      "InfinityEdge дисплей, премиум алуминиев корпус и мощен процесор за професионалисти.",
    category: "laptops",
    brand: "Dell",
    price: 1599,
    discount_percentage: 10,
    rating: 4.6,
    stock: 20,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/3.webp",
    ],
    sku: "TECH-DEL-XPS14",
    tags: ["laptops", "dell", "ultrabook"],
    ...TECH_WARRANTY.laptops,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "ASUS ROG Zephyrus G16",
    description:
      "Геймърски лаптоп с високоскоростен дисплей и мощна дискретна видеокарта в тънко тяло.",
    category: "laptops",
    brand: "ASUS",
    price: 2199,
    discount_percentage: 8,
    rating: 4.7,
    stock: 15,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/3.webp",
    ],
    sku: "TECH-ASU-ROGZ16",
    tags: ["laptops", "asus", "gaming"],
    ...TECH_WARRANTY.laptops,
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "Lenovo ThinkPad X1 Carbon Gen 12",
    description:
      "Бизнес класика — карбонов корпус, страхотна клавиатура и военен стандарт за устойчивост.",
    category: "laptops",
    brand: "Lenovo",
    price: 1799,
    discount_percentage: 6,
    rating: 4.6,
    stock: 18,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/3.webp",
    ],
    sku: "TECH-LEN-X1C12",
    tags: ["laptops", "lenovo", "business"],
    ...TECH_WARRANTY.laptops,
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  {
    title: "HP Spectre x360 16",
    description:
      "2-в-1 конвертируем лаптоп с OLED дисплей и елегантен дизайн за създатели.",
    category: "laptops",
    brand: "HP",
    price: 1699,
    discount_percentage: 12,
    rating: 4.5,
    stock: 22,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/2.webp",
      "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/3.webp",
    ],
    sku: "TECH-HP-SPECX360",
    tags: ["laptops", "hp", "2-in-1"],
    ...TECH_WARRANTY.laptops,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  // --- Tablets ---
  {
    title: 'iPad Pro M4 13"',
    description:
      "Ultra Retina XDR дисплей и чип M4 — таблет, който замества лаптоп за повечето задачи.",
    category: "tablets",
    brand: "Apple",
    price: 1299,
    discount_percentage: 5,
    rating: 4.8,
    stock: 30,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp",
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/2.webp",
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/3.webp",
      "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/4.webp",
    ],
    sku: "TECH-APL-IPADPRO",
    tags: ["tablets", "apple"],
    ...TECH_WARRANTY.tablets,
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "Samsung Galaxy Tab S10 Ultra",
    description:
      "Огромен AMOLED дисплей, S Pen в комплекта и производителност за професионална работа.",
    category: "tablets",
    brand: "Samsung",
    price: 1199,
    discount_percentage: 10,
    rating: 4.6,
    stock: 28,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/1.webp",
      "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/2.webp",
      "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/3.webp",
      "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/4.webp",
    ],
    sku: "TECH-SAM-TABS10U",
    tags: ["tablets", "samsung"],
    ...TECH_WARRANTY.tablets,
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  // --- Mobile accessories (wearables / audio / gadgets) ---
  {
    title: "Apple Watch Ultra 3",
    description:
      "Титаниев корпус, сателитна връзка при спешност и до 42 часа издръжливост на батерията.",
    category: "mobile-accessories",
    brand: "Apple",
    price: 899,
    discount_percentage: 5,
    rating: 4.7,
    stock: 40,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/2.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/3.webp",
    ],
    sku: "TECH-APL-WATCHU3",
    tags: ["wearables", "apple", "smartwatch"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "Sony WH-1000XM6 Wireless Headphones",
    description:
      "Индустриален еталон за активно шумопотискане — перфектни за пътуване и офис.",
    category: "mobile-accessories",
    brand: "Sony",
    price: 429,
    discount_percentage: 15,
    rating: 4.8,
    stock: 60,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp",
    ],
    sku: "TECH-SNY-WH1000XM6",
    tags: ["audio", "sony", "headphones"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "AirPods Pro 3",
    description:
      "Ново поколение активно шумопотискане и адаптивен звук, оптимизиран за твоето ухо.",
    category: "mobile-accessories",
    brand: "Apple",
    price: 279,
    discount_percentage: 10,
    rating: 4.7,
    stock: 80,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/3.webp",
    ],
    sku: "TECH-APL-AIRPODSP3",
    tags: ["audio", "apple", "earbuds"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  {
    title: "Anker MagSafe Power Bank 10000mAh",
    description:
      "Магнитно захващащ се external батерия — заряд в движение без кабели.",
    category: "mobile-accessories",
    brand: "Anker",
    price: 59.99,
    discount_percentage: 20,
    rating: 4.4,
    stock: 100,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/2.webp",
    ],
    sku: "TECH-ANK-MAGPWR10K",
    tags: ["accessories", "anker", "charging"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "JBL Charge 6 Bluetooth Speaker",
    description:
      "Мощен звук, водоустойчив корпус и до 20 часа работа — перфектна за плаж и парти.",
    category: "mobile-accessories",
    brand: "JBL",
    price: 199,
    discount_percentage: 18,
    rating: 4.6,
    stock: 55,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/2.webp",
    ],
    sku: "TECH-JBL-CHARGE6",
    tags: ["audio", "jbl", "speaker"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "Samsung Galaxy Buds 3 Pro",
    description:
      "Компактни, с активно шумопотискане и кристално чист звук за ежедневна употреба.",
    category: "mobile-accessories",
    brand: "Samsung",
    price: 219,
    discount_percentage: 12,
    rating: 4.5,
    stock: 65,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp",
    ],
    sku: "TECH-SAM-BUDS3PRO",
    tags: ["audio", "samsung", "earbuds"],
    ...TECH_WARRANTY["mobile-accessories"],
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  // --- Non-tech variety ---
  {
    title: "Ray-Ban Aviator Classic",
    description: "Иконичен дизайн от 1937 г. — стъкла с UV защита и метална рамка.",
    category: "sunglasses",
    brand: "Ray-Ban",
    price: 169,
    discount_percentage: 10,
    rating: 4.7,
    stock: 40,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/1.webp",
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/2.webp",
      "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/3.webp",
    ],
    sku: "FASH-RB-AVIATOR",
    tags: ["sunglasses", "ray-ban"],
    ...OTHER_WARRANTY,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
  {
    title: "Michael Kors Leather Tote",
    description: "Елегантна чанта от истинска кожа с достатъчно място за ежедневието.",
    category: "womens-bags",
    brand: "Michael Kors",
    price: 289,
    discount_percentage: 15,
    rating: 4.6,
    stock: 20,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/1.webp",
      "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/2.webp",
      "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/3.webp",
    ],
    sku: "FASH-MK-TOTE",
    tags: ["bags", "michael-kors"],
    ...OTHER_WARRANTY,
    availability_status: "In Stock",
    reviews: reviews(1),
  },
  {
    title: "Wilson Pro Staff Tennis Racket",
    description: "Ракетата на професионалистите — прецизен контрол и стабилна мощ.",
    category: "sports-accessories",
    brand: "Wilson",
    price: 249,
    discount_percentage: 10,
    rating: 4.7,
    stock: 30,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/1.webp",
    ],
    sku: "SPRT-WLS-PROSTAFF",
    tags: ["sports", "tennis", "wilson"],
    ...OTHER_WARRANTY,
    availability_status: "In Stock",
    reviews: reviews(2),
  },
  {
    title: "Modern LED Floor Lamp",
    description: "Минималистична LED лампа с регулируема яркост — топла атмосфера за дома.",
    category: "home-decoration",
    brand: "Nexa Home",
    price: 89.99,
    discount_percentage: 20,
    rating: 4.5,
    stock: 45,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
    images: [
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/1.webp",
    ],
    sku: "HOME-NX-LEDLAMP",
    tags: ["home", "decoration", "lighting"],
    ...OTHER_WARRANTY,
    availability_status: "In Stock",
    reviews: reviews(0),
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }
  const supabase = createClient(url, key);

  let inserted = 0;
  for (const product of products) {
    const { error } = await supabase.from("products").insert({
      ...product,
      dummy_id: null,
      slug: slugify(product.title),
    });
    if (error) {
      console.error(`Failed to insert "${product.title}":`, error.message);
      continue;
    }
    inserted++;
  }
  console.log(`Inserted ${inserted}/${products.length} products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
