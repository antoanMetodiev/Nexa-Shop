# Админ панел + Clerk + Stripe — работен статус

> Спряно на пауза по избор на потребителя (2026-09-10), за да се работи по front-end красоти. Ще се продължи в отделна сесия. Този файл е "hand-off" бележка — чети го в началото на следващата сесия по темата, преди да питаш потребителя откъде да продължиш.

## Какво вече е направено

### 1. Админ панел — код-завършен, но неактивен (чака Clerk ключове)
Целият `/admin` sitemap (Dashboard, Products CRUD, Categories, Orders, Customers, Discounts, Settings) е написан и минава `npm run build`/`npm run lint` чисто. **Не работи все още**, защото Clerk не е свързан — виж секция 2.

Файлове:
- `src/app/[locale]/admin/layout.tsx` — гейт през `requireAdminPage`, sidebar (`AdminSidebar`), `<UserButton/>`
- `src/app/[locale]/admin/page.tsx` — табло
- `src/app/[locale]/admin/products/page.tsx`, `products/new/page.tsx`, `products/[id]/edit/page.tsx`
- `src/app/[locale]/admin/categories/page.tsx`
- `src/app/[locale]/admin/orders/page.tsx`, `orders/[id]/page.tsx`
- `src/app/[locale]/admin/customers/page.tsx`
- `src/app/[locale]/admin/discounts/page.tsx`
- `src/app/[locale]/admin/settings/page.tsx`
- `src/components/admin/*` — `AdminSidebar`, `ProductForm`, `DeleteProductButton`, `ReassignCategoryForm`, `OrderStatusSelect`, `DiscountForm`, `DiscountRow`, `SettingsForm`
- `src/lib/admin/require-admin.ts` — `requireAdminPage` (redirect за страници), `requireAdminAction` (throw за server actions). Проверява `sessionClaims.metadata.role === "admin"`
- `src/lib/admin/orders.ts`, `discounts.ts`, `customers.ts`, `order-status.ts` (последният е нарочно БЕЗ `server-only`, защото го import-ва клиентски компонент — не пипай това разделение)
- `src/lib/admin/actions/products.ts`, `categories.ts`, `orders.ts`, `discounts.ts`, `settings.ts` — Server Actions с `"use server"`, всички викат `requireAdminAction()` първо, после пишат през `supabaseAdmin`
- `src/lib/supabase/admin-client.ts` — service-role Supabase клиент, маркиран `server-only` (build гърми, ако някога се import-не от клиентски бъндъл)

### 2. Clerk — инсталиран пакет, НО НЕ Е СВЪРЗАН
- `@clerk/nextjs` (v7.9.2) е в `package.json`
- **Умишлено НЕ е пипнато**: `src/app/[locale]/layout.tsx` (няма `<ClerkProvider>`) и `src/proxy.ts` (няма `clerkMiddleware`)
- Причина: `ClerkProvider`/`clerkMiddleware` без валидни ключове в `.env.local` чупят **целия сайт** (минават през всяка заявка), не само админ панела — затова изчакахме
- `/sign-in` и `/sign-up` страници вече съществуват (`src/app/[locale]/(shop)/sign-in/[[...sign-in]]/page.tsx`, `.../sign-up/...`), рендерират Clerk-ови `<SignIn/>`/`<SignUp/>` компоненти, но няма да работят докато ClerkProvider не е окачен в root layout

### 3. Route restructure (route group `(shop)`)
Всички storefront страници (`/`, `/products`, `/cart`, `/categories`, `/deals`, `/about`, `/contact`, `/privacy`, `/search`, `/wishlist`, `/sign-in`, `/sign-up`) са преместени в `src/app/[locale]/(shop)/` със собствен layout (Header/Footer/CartProvider/WishlistProvider). Причина: `/admin/*` да не се обгражда от клиентския Header/Footer. Route groups не добавят сегмент към URL — адресите не са се променили. `src/app/[locale]/layout.tsx` сега носи само html/body/NextIntlClientProvider (общо за shop и admin).

### 4. Нова DB схема — миграция написана, **НЕ Е ПУСНАТА** срещу истинската база
`supabase/migrations/0005_create_admin_tables.sql` създава:
- `orders`, `order_items` — за бъдещия Stripe checkout
- `discount_codes` — промо кодове (вече функционално CRUD-нато от admin панела)
- `store_settings` — singleton ред с адрес/имейл/телефон/праг за безплатна доставка; **единствената** от новите таблици с публична SELECT policy (чете се от `/contact`, `/cart`, homepage `StoreLocation`)

Всички са RLS enabled, без write policies (мутации само през `supabaseAdmin` service-role клиента, гейтнати от Clerk admin проверка в Server Actions).

### 5. `store_settings` вече е закачено към публичния сайт
- `src/lib/settings.ts` → `getStoreSettings()` (публичен `supabase` клиент, fallback към `src/lib/constants.ts`, ако редът липсва)
- `/contact` (`src/app/[locale]/(shop)/contact/page.tsx`), `MapEmbed`, `StoreLocation` (homepage), `/cart` (`freeShippingThreshold` минава през `CartView` → `OrderSummary`) — всички вече четат от там
- **Известно ограничение (нарочно, не е бъг)**: `store_name` полето в `store_settings` съществува и се редактира от `/admin/settings`, но НЕ е закачено към branding-а на сайта (`SITE_NAME`, `— Nexa` суфиксите в `generateMetadata` навсякъде) — това би значело рефакторинг на ~15 файла за козметична полза, пропуснато нарочно. Ако някога стане нужно, издирвай `SITE_NAME` в `src/lib/constants.ts`
- Друго известно несъответствие: homepage `UspBar` показва статичен текст "За поръчки над $100" (превод в `messages/bg.json` → `home.usp.shippingDesc`) — не е свързан динамично към `free_shipping_threshold`. Ако админ смени прага, тази конкретна маркетингова реплика на homepage няма да се обнови автоматично (самата логика в количката е коректна и динамична).

## Какво трябва да се направи оттук нататък (по ред)

### Стъпка 1 — Потребителят трябва да достави:
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` и `CLERK_SECRET_KEY` (от Clerk dashboard → API Keys)
2. `SUPABASE_SERVICE_ROLE_KEY` (от Supabase dashboard → Settings → API → service_role secret) — нужен за admin мутациите (create/edit/delete продукт, промо кодове, настройки)
3. Да пусне съдържанието на `supabase/migrations/0005_create_admin_tables.sql` през Supabase **SQL Editor** (Dashboard → SQL Editor → paste → Run) — избягва да се праща DB паролата пак
4. В Clerk Dashboard → **Sessions** → Customize session token → добави custom claim: `{ "metadata": "{{user.public_metadata}}" }` (иначе `sessionClaims.metadata.role` няма да съществува в middleware/server кода)
5. След първата регистрация през `/sign-up`, в Clerk Dashboard → **Users** → потребителя → Metadata → Public metadata: `{ "role": "admin" }`

### Стъпка 2 — Аз довършвам Clerk свързването:
1. Добавям ключовете в `.env.local` (никога не се пишат никъде другаде)
2. `src/app/[locale]/layout.tsx` — обвивам `{children}` в `<ClerkProvider>` (с `afterSignOutUrl` **на ClerkProvider ниво**, не на `<UserButton/>` — в Clerk v7 `afterSignOutUrl` вече не е UserButton prop, това е breaking change спрямо по-стари версии, вече го знам)
3. `src/proxy.ts` — комбинирам `clerkMiddleware()` с текущия `next-intl` middleware (трябва внимателно да се тества locale routing-ът да продължи да работи заедно с Clerk защитата на `/admin/*`)
4. Тествам: публичният сайт работи както преди, `/sign-up` → регистрация → ръчно слагам `role: admin` метаданните → `/admin` става достъпен, non-admin потребител на `/admin` бива redirect-нат към `/`

### Стъпка 3 — Проверка на целия админ панел с реални данни:
- Създаване/редакция/изтриване на продукт от `/admin/products`
- Merge на категории от `/admin/categories`
- Създаване на промо код от `/admin/discounts`
- Редакция на `/admin/settings` → проверка, че се отразява на `/contact`, `/cart`, homepage
- `/admin/customers` показва регистрирания потребител от Clerk
- `/admin/orders` е celebrated празно (очаквано, чака Stripe)

### Стъпка 4 — Stripe checkout (по-голяма задача, отделно планиране си струва):
Все още нищо не е построено за това. Ще трябва (грубо, не е финален план — да се обсъди в самата сесия):
- `/checkout` страница (адрес за доставка, преглед на поръчката) — в момента `OrderSummary` бутонът вече сочи към `/checkout`, но страницата не съществува
- Stripe акаунт + ключове (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, webhook secret) — нов ask към потребителя, аналогично на Clerk/Supabase
- Stripe Checkout Session или Payment Element (да се реши кой подход — питай потребителя при въпроси)
- Webhook route handler (`/api/webhooks/stripe` или подобно) — при успешно плащане: insert в `orders` + `order_items` (схемата вече съществува от миграция `0005`), update на `stripe_payment_intent_id`
- Обвързване с Clerk `user_id`, ако потребителят е логнат, иначе guest checkout по email (полето `orders.user_id` вече е nullable точно за това)
- `/account/orders` (клиентска история на поръчки) — засега не съществува, в sitemap-а е като отделна страница

## Важни детайли, които да не се забравят следващия път
- `src/lib/admin/order-status.ts` е нарочно разделен от `src/lib/admin/orders.ts`, за да не изтече `supabaseAdmin` (service role) в клиентския бъндъл през `OrderStatusSelect.tsx`. Ако добавяш нов клиентски компонент, който има нужда от нещо от `lib/admin/*`, провери първо дали го internal-и `server-only` и раздели по същия начин.
- Категориите НЯМАТ отделна таблица — те са само `products.category`, а всеки slug трябва да има превод в `messages/bg.json`/`messages/en.json` → `categoryNames`. Затова `/admin/categories` не позволява free-text преименуване, само merge между съществуващи категории. Ако някога стане нужда от истински нови категории, ще трябва или (а) да се добавят преводи ръчно при всяко създаване, или (б) да се направи истинска `categories` таблица — реши се с потребителя, преди да се променя това поведение.
- Admin UI текстът е твърдо на български (не минава през next-intl `messages/*.json`) — съзнателно решение, защото е вътрешен инструмент, не клиентска страница. Не го конвертирай към next-intl, освен ако потребителят изрично поиска.
- `.env.local` е gitignored, проверено — никакви ключове/пароли не се пишат в код или тук в този файл.
