# Nexa — Online Shop

## Какво е проектът
Уеб приложение, подобно на Shopify / eMag — пълноценен онлайн магазин.

## Технически стек
- **Frontend:** Next.js
- **Backend & Database:** Supabase
- **Deployment:** Cloudflare Workers
- **Плащания:** Stripe API
- **Автентикация:** Clerk
- **Данни за продукти (seed):** [DummyJSON](https://dummyjson.com) — снимки, цени, категории и др., за да се напълни базата данни с примерни продукти

## Дизайн
Вдъхновен от Shopify, изграждан постепенно ("леко-полека").

**Основна цветова палитра:**
- Тъмно синьо
- Черно
- Бяло

## Sitemap — всички страници

### 1. Магазин (публична част)
| # | Страница | Route |
|---|---|---|
| 1 | Начална страница | `/` |
| 2 | Каталог с всички продукти | `/products` |
| 3 | Продуктова страница (детайли) | `/products/[slug]` |
| 4 | Категории (списък) | `/categories` |
| 5 | Продукти по категория | `/categories/[slug]` |
| 6 | Марки/брандове (списък) | `/brands` |
| 7 | Продукти по марка | `/brands/[slug]` |
| 8 | Резултати от търсене | `/search` |
| 9 | Промоции / намаления | `/deals` |
| 10 | Любими продукти (wishlist) | `/wishlist` |
| 11 | Кошница | `/cart` |
| 12 | Checkout (адрес, доставка, плащане) | `/checkout` |
| 13 | Потвърждение на поръчка | `/checkout/success` |

### 2. Автентикация (Clerk)
| # | Страница | Route |
|---|---|---|
| 14 | Вход | `/sign-in` |
| 15 | Регистрация | `/sign-up` |

### 3. Клиентски профил (защитени страници)
| # | Страница | Route |
|---|---|---|
| 16 | Преглед на профила | `/account` |
| 17 | История на поръчките | `/account/orders` |
| 18 | Детайли на поръчка | `/account/orders/[id]` |
| 19 | Адреси за доставка | `/account/addresses` |
| 20 | Настройки на профила | `/account/settings` |
| 21 | Методи за плащане (Stripe) | `/account/payment-methods` |

### 4. Информационни / статични страници
| # | Страница | Route |
|---|---|---|
| 22 | За нас | `/about` |
| 23 | Контакти | `/contact` |
| 24 | Често задавани въпроси (FAQ) | `/faq` |
| 25 | Доставка и връщане | `/shipping-returns` |
| 26 | Условия за ползване | `/terms` |
| 27 | Политика за поверителност | `/privacy` |
| 28 | 404 — страница не е намерена | `not-found` |

### 5. Админ панел (защитени, само за администратор)
| # | Страница | Route |
|---|---|---|
| 29 | Табло (Dashboard / статистики) | `/admin` |
| 30 | Продукти (списък) | `/admin/products` |
| 31 | Нов продукт | `/admin/products/new` |
| 32 | Редакция на продукт | `/admin/products/[id]/edit` |
| 33 | Категории (управление) | `/admin/categories` |
| 34 | Поръчки (списък) | `/admin/orders` |
| 35 | Детайли на поръчка (админ) | `/admin/orders/[id]` |
| 36 | Клиенти | `/admin/customers` |
| 37 | Промо кодове / отстъпки | `/admin/discounts` |
| 38 | Настройки на магазина | `/admin/settings` |

> Приоритет за MVP: секции 1–4 (магазин, вход, профил, статични страници) вървят първи. Админ панелът (секция 5) идва след като основният магазин работи и има реални данни (Supabase + Stripe + Clerk свързани).

## Статус
- [x] Инициализиран Next.js проект
- [x] Начална страница (Hero, USP лента, категории, топ продукти, промо банер, newsletter)
- [x] Supabase проект и схема на базата данни (`products` таблица + RLS за публично четене)
- [x] Seed на продукти от DummyJSON (194 продукта, 24 категории заредени в Supabase)
- [x] Страница „Продукти" (`/products`) — филтри (категория, цена, рейтинг, бранд), сортиране, номерирана пагинация
- [ ] Clerk автентикация
- [ ] Stripe интеграция
- [ ] Cloudflare Workers deployment
- [ ] Основен дизайн/UI (Shopify-inspired, тъмно синьо/черно/бяло) — homepage и /products готови, остават другите страници

## Supabase — връзка и конфигурация
- Project URL: `https://lrrrbzdkvnegosppqtcq.supabase.co`
- Регион: Central EU (Frankfurt) / `eu-central-1`
- Env вариабли в `.env.local` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Supabase клиент: `src/lib/supabase/client.ts`, типове: `src/lib/supabase/types.ts`
- SQL миграции: `supabase/migrations/` (пуска се с `npm run db:migrate`, изисква `DATABASE_URL` env var с pooler connection string — не се записва в repo)
- Seed скрипт: `scripts/seed.ts` (пуска се с `npm run db:seed`) — тегли продукти от DummyJSON и ги upsert-ва в `products` по `dummy_id`
- Директната DB връзка (`db.<ref>.supabase.co`) е само IPv6 — тази мрежа няма IPv6, затова се ползва **connection pooling** хостът (`aws-0-eu-central-1.pooler.supabase.com`, порт `6543`, потребител `postgres.<project-ref>`)
- Homepage (`FeaturedProducts`, `CategoryGrid`) вече чете от Supabase (`src/lib/products.ts`), не директно от DummyJSON — заредени са всички 194 продукта, 24 категории

## Бележки
Потребителят подготвя акаунти в Cloudflare, Stripe и Clerk паралелно с настройката на проекта.
