# Nexa — Online Shop

> **Незавършена работа в паузa:** Админ панел + Clerk auth + Stripe payments. Пълен статус, какво е готово и точните следващи стъпки са в [`ADMIN_AUTH_PAYMENTS.md`](./ADMIN_AUTH_PAYMENTS.md) — прочети го в началото на следващата сесия по тази тема.

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
| 5 | Продукти по категория | `/products?category=[slug]` (не отделен route — филтър на `/products`) |
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
- [x] Детайлна страница на продукт (`/products/[id]`) — галерия, добавяне в кошница, табове (описание/доставка/отзиви), подобни продукти
- [x] Кошница (localStorage, `src/lib/cart-context.tsx`) — брояч в header-а
- [x] Страница „Кошница" (`/cart`) — редакция на количества, премахване, empty state, обобщение на поръчката с прагова безплатна доставка
- [x] Custom 404 страница (`src/app/[locale]/not-found.tsx`)
- [x] Страница „Категории" (`/categories`) — всички 24 категории със снимки и брой продукти, води към `/products?category=slug`
- [x] Двуезичност BG/EN (`next-intl`, locale routing `/bg/...` `/en/...`) — цялото UI е преведено; продуктовите данни (заглавия/описания от DummyJSON) остават на английски по избор
- [x] Страница „Промоции" (`/deals`) — продукти с отстъпка, сортирани по най-голямо намаление, номерирана пагинация (`src/components/ui/Pagination.tsx`, генеричен, `?page=` само)
- [x] Страница „Политика за поверителност" (`/privacy`) — двуезично съдържание, секции в `messages/*.json` (`privacyPage.sections`)
- [x] `robots.txt` (`src/app/robots.ts`, на root ниво извън `[locale]`) — allow всичко, disallow `/cart`, `/checkout`, `/account` във всички езици
- [x] Страница „За нас" (`/about`) — история, реални статистики от Supabase (продукти/категории/брандове), values секция (преизползва `UspBar`), CTA
- [x] Wishlist — localStorage сега (`src/lib/wishlist-context.tsx`, огледава `cart-context.tsx`), сърце бутон на всяка продуктова карта + детайлна страница, брояч в header-а, страница `/wishlist`. `wishlist_items` таблица в Supabase вече съществува (миграция `0003`, RLS enabled без policies — заключена, безопасна по подразбиране) и `src/lib/wishlist-db.ts` носи готови CRUD функции за DB-версията — предстои да се свържат, когато има Clerk потребителски id
- [x] Страница „Контакти" (`/contact`) — адрес/имейл/телефон/работно време + Google Maps (прост iframe embed, без API ключ). Стойностите вече се четат от `store_settings` таблицата (`src/lib/settings.ts`, `getStoreSettings()`) с fallback към `src/lib/constants.ts`, ако редът липсва — редактират се от `/admin/settings`. Адресът все още е **placeholder** (1 Vitosha Blvd, Sofia) до смяна от админ панела
- [x] Google Maps секция и на началната страница ("Посети ни", преди Newsletter) — споделен `src/components/shared/MapEmbed.tsx`, ползван и от `/contact`
- [x] `/products` и `/deals` показват по 24 продукта на страница (`PRODUCTS_PAGE_SIZE` в `src/lib/products.ts`)
- [x] Търсене — live search dropdown, закачен директно за search иконата в header-а (`src/components/layout/SearchModal.tsx`, малък popover ~320px, не цял модал; debounce 250ms; click-outside/Escape затварят; показва топ продукти преди да пишеш), пълна страница с резултати `/search?q=` с пагинация. Търси по `title`/`brand` с `ILIKE`, ускорено от `pg_trgm` GIN индекси (миграция `0004`) — потвърдено с `EXPLAIN`, че се ползват
- [x] Анимации из цялото приложение (пакет `motion`, наследник на Framer Motion) — общи primitives в `src/components/motion/` (`FadeIn` — fade+slide на `whileInView`, `StaggerGrid`/`StaggerItem` — stagger fade за grid-ове), приложени на всички страници и секции (homepage, `/products`, `/deals`, `/search`, `/categories`, `/about`, `/contact`, `/privacy`, related products). Специфични анимации: `ProductCard` hover lift, `WishlistButton` pop, `MobileFilterDrawer` slide-in, `ProductGallery` crossfade, `ProductTabs` плъзгащо се подчертаване (`layoutId`), `AddToCartPanel` text-swap, cart/wishlist редове — `AnimatePresence`/`layout` за remove+reflow, `CountBadge` pop при промяна, 404 страницата. Визуално проверено в браузър (hover, add-to-cart, cart/wishlist премахване, search dropdown, tab switch). **Бъг фикс:** `StaggerGrid` с `whileInView`+`once: true` оставаше скрит (opacity: 0) при пагинация в `/products`, `/deals`, `/search` — контейнерът преживяваше soft navigation-a и новите продукти не наследяваха "show" състоянието. Оправено с `key` на `StaggerGrid`, обвързан с текущите филтри/страница (`JSON.stringify(flat)` / `page` / `` `${q}-${page}` ``), за да се ремаунтва при всяка смяна на съдържанието; същият fix и в `RelatedProducts`
- [x] **Route restructure**: storefront страниците (`/`, `/products`, `/cart`, `/categories`, `/deals`, `/about`, `/contact`, `/privacy`, `/search`, `/wishlist`, `/sign-in`, `/sign-up`) са преместени в route group `src/app/[locale]/(shop)/` със собствен layout (Header/Footer/CartProvider/WishlistProvider). `src/app/[locale]/layout.tsx` вече носи само html/body/NextIntlClientProvider. Причина: `/admin/*` да има собствен UI (sidebar), без клиентския Header/Footer да го обгражда — route groups не добавят сегмент към URL, така че нищо не се е променило откъм адреси
- [x] **Админ панел** (`/admin`, цял sitemap) — код-завършен, **чака Clerk API ключове от теб**, за да проработи (виж бележката по-долу):
  - `/admin` — табло със статистики (продукти/категории/поръчки/марки, приходи, активни промо кодове)
  - `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` — пълно CRUD на продукти (таблица, форма, изтриване с потвърждение)
  - `/admin/categories` — преглед с брой продукти + "премести продукти между категории" (категориите не са отделна таблица, а само `products.category`; free-text преименуване е нарочно забранено, за да не се появи slug без превод в `categoryNames`)
  - `/admin/orders`, `/admin/orders/[id]` — списък/детайли, смяна на статус; празно, докато няма Stripe checkout
  - `/admin/customers` — реален списък от Clerk (`clerkClient().users.getUserList()`), не Supabase
  - `/admin/discounts` — CRUD на промо кодове (нова таблица `discount_codes`)
  - `/admin/settings` — редактира `store_settings` (виж по-горе)
  - Защита: `src/lib/admin/require-admin.ts` проверява Clerk `sessionClaims.metadata.role === "admin"`; всички мутации минават през Server Actions в `src/lib/admin/actions/*.ts`, които ползват `supabaseAdmin` (service role key, `src/lib/supabase/admin-client.ts`, маркиран с `server-only` — build-ът гърми, ако някога се import-не от клиентски код). RLS на новите таблици е locked down (без policies), с изключение на `store_settings` (публично четене)
  - Админ UI текстът е твърдо на български (не минава през next-intl) — вътрешен инструмент е, не клиентска страница
  - Нови миграция `0005_create_admin_tables.sql`: `orders`, `order_items`, `discount_codes`, `store_settings`
- [ ] Checkout страница (`/checkout`) — линкът от кошницата вече сочи натам, страницата предстои; `orders`/`order_items` схемата вече съществува (виж по-горе) и Stripe checkout ще пише в нея
- [ ] Clerk автентикация — пакетът е инсталиран и целият admin-gating код е написан, но **root layout и `src/proxy.ts` умишлено НЕ са пипнати още**, защото `ClerkProvider`/`clerkMiddleware` без валидни ключове чупят целия сайт (не само админ панела). Активира се веднага щом добавиш ключовете в `.env.local` — виж бележката по-долу
- [ ] Stripe интеграция
- [ ] Cloudflare Workers deployment
- [ ] Основен дизайн/UI (Shopify-inspired, тъмно синьо/черно/бяло) — homepage, /products, детайлна страница, /cart и /categories готови, остават другите

## Supabase — връзка и конфигурация
- Project URL: `https://lrrrbzdkvnegosppqtcq.supabase.co`
- Регион: Central EU (Frankfurt) / `eu-central-1`
- Env вариабли в `.env.local` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Supabase клиент: `src/lib/supabase/client.ts`, типове: `src/lib/supabase/types.ts`
- SQL миграции: `supabase/migrations/` (пуска се с `npm run db:migrate`, изисква `DATABASE_URL` env var с pooler connection string — не се записва в repo). `0001` създава `products`, `0002` добавя допълнителни полета (sku, tags, гаранция, доставка, връщане, отзиви) за детайлната страница
- Seed скрипт: `scripts/seed.ts` (пуска се с `npm run db:seed`) — тегли продукти от DummyJSON и ги upsert-ва в `products` по `dummy_id`
- Директната DB връзка (`db.<ref>.supabase.co`) е само IPv6 — тази мрежа няма IPv6, затова се ползва **connection pooling** хостът (`aws-0-eu-central-1.pooler.supabase.com`, порт `6543`, потребител `postgres.<project-ref>`)
- Homepage (`FeaturedProducts`, `CategoryGrid`) вече чете от Supabase (`src/lib/products.ts`), не директно от DummyJSON — заредени са всички 194 продукта, 24 категории
- Миграция `0005_create_admin_tables.sql` (orders, order_items, discount_codes, store_settings) е написана, но **още не е пусната срещу истинската база** — трябва да се пусне ръчно през Supabase SQL Editor (Dashboard → SQL Editor → paste съдържанието на файла → Run), за да не се налага пак да се дава DB паролата
- За admin мутациите (create/edit/delete продукт, промо кодове, настройки) трябва `SUPABASE_SERVICE_ROLE_KEY` в `.env.local` (Dashboard → Settings → API → service_role secret) — само за server-side употреба, никога не се излага на клиента (`src/lib/supabase/admin-client.ts`, `server-only`)

## Clerk — свързване (предстои, чака ключове от теб)
- Пакетът `@clerk/nextjs` е инсталиран; целият admin-gating код е написан (`src/lib/admin/require-admin.ts`, `src/app/[locale]/admin/layout.tsx`, `/sign-in`, `/sign-up` страниците)
- **Умишлено НЕ е пипнат** `src/app/[locale]/layout.tsx` (за `<ClerkProvider>`) и `src/proxy.ts` (за `clerkMiddleware`) — без валидни ключове тези две неща чупят целия сайт, не само админ панела, защото минават през всяка страница
- Какво трябва да направиш:
  1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` и `CLERK_SECRET_KEY` в `.env.local`
  2. В Clerk Dashboard → **Sessions** → Customize session token → добави custom claim: `{ "metadata": "{{user.public_metadata}}" }` (така `sessionClaims.metadata.role` е достъпен в middleware/server код без допълнителна заявка)
  3. След първата регистрация през `/sign-up`, в Clerk Dashboard → **Users** → твоя потребител → Metadata → Public metadata: `{ "role": "admin" }`
- Щом ключовете са налични, аз ще довърша свързването (ClerkProvider в root layout + clerkMiddleware в proxy.ts) и ще тествам `/admin`

## Интернационализация (BG/EN)
- Библиотека: `next-intl`, locale routing с URL префикс (`/bg/...` по подразбиране, `/en/...`)
- `src/i18n/routing.ts`, `src/i18n/navigation.ts` (локализирани `Link`/`useRouter`/`usePathname` — ползвани навсякъде вместо `next/link`/`next/navigation`), `src/i18n/request.ts`
- `src/proxy.ts` (Next.js 16 преименува `middleware.ts` → `proxy.ts`; трябва да е в `src/`, не в root, защото проектът ползва `src/app`) — прави redirect от `/` към locale-a по подразбиране
- Преводи: `messages/bg.json`, `messages/en.json` — типизирани през `src/i18n/global.d.ts`
- Категорийните имена (Smartphones, Laptops...) се превеждат ръчно през `categoryNames` namespace (`src/i18n/category-slug.ts` носи типа за slug-овете); продуктовите заглавия/описания идват от DummyJSON и остават на английски и в двата езика — по избор на потребителя
- Език се превключва от `LanguageSwitcher` в header-а (запазва текущия path + search params)
- Важно: `useTranslations` (от `"next-intl"`) работи само в **синхронни** Server/Client компоненти; за **async** Server Components (тези, които правят `await` преди да викат превода) трябва `getTranslations` (от `"next-intl/server"`), иначе гърми "Invalid hook call"

## Бележки
- Потребителят подготвя акаунти в Cloudflare, Stripe и Clerk паралелно с настройката на проекта.
- По време на разработката потребителят самостоятелно мигрира проекта към **vinext** (Vite-базирана Next.js реализация, за Cloudflare Workers deployment) — вижда се в `package.json` (`vinext`, `@vinext/cloudflare`, `wrangler`, `vite.config.ts`, `wrangler.jsonc`). Това е паралелен build path (`npm run build:vinext` / `dev:vinext`); стандартните `npm run dev`/`npm run build` (plain Next.js) продължават да работят нормално и точно тях ползваме за разработка.
