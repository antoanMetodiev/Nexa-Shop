# Админ панел + Supabase Auth + Stripe — работен статус

> Auth доставчикът е сменен от Clerk на **Supabase Auth** (2026-09-11) — Clerk Production instance изискваше custom domain с DNS запис, който потребителят няма (само споделения `workers.dev`). Целият Clerk код е премахнат, заменен с `@supabase/ssr`. Този файл е "hand-off" бележка — чети го в началото на следващата сесия по темата, преди да питаш потребителя откъде да продължиш.

## Какво вече е направено

### 1. Админ панел — код-завършен
Целият `/admin` sitemap (Dashboard, Products CRUD, Categories, Orders, Customers, Discounts, Settings) е написан и минава `npm run build`/`npm run lint` чисто.

Файлове:
- `src/app/[locale]/admin/layout.tsx` — гейт през `requireAdminPage`, sidebar (`AdminSidebar`), `<SignOutButton/>`
- `src/app/[locale]/admin/page.tsx` — табло
- `src/app/[locale]/admin/products/page.tsx`, `products/new/page.tsx`, `products/[id]/edit/page.tsx`
- `src/app/[locale]/admin/categories/page.tsx`
- `src/app/[locale]/admin/orders/page.tsx`, `orders/[id]/page.tsx`
- `src/app/[locale]/admin/customers/page.tsx`
- `src/app/[locale]/admin/discounts/page.tsx`
- `src/app/[locale]/admin/settings/page.tsx`
- `src/components/admin/*` — `AdminSidebar`, `SignOutButton`, `ProductForm`, `DeleteProductButton`, `ReassignCategoryForm`, `OrderStatusSelect`, `DiscountForm`, `DiscountRow`, `SettingsForm`
- `src/lib/admin/require-admin.ts` — `requireAdminPage` (redirect за страници), `requireAdminAction` (throw за server actions). Проверява `user.app_metadata.role === "admin"` на Supabase auth user-а
- `src/lib/admin/orders.ts`, `discounts.ts`, `customers.ts`, `order-status.ts` (последният е нарочно БЕЗ `server-only`, защото го import-ва клиентски компонент — не пипай това разделение)
- `src/lib/admin/actions/products.ts`, `categories.ts`, `orders.ts`, `discounts.ts`, `settings.ts` — Server Actions с `"use server"`, всички викат `requireAdminAction()` първо, после пишат през `supabaseAdmin`
- `src/lib/supabase/admin-client.ts` — service-role Supabase клиент, маркиран `server-only` (build гърми, ако някога се import-не от клиентски бъндъл)

### 2. Supabase Auth — код готов, чака dashboard конфигурация
- `@supabase/ssr` в `package.json`
- `src/lib/supabase/browser-client.ts` — `createBrowserClient`, ползван само от client components (sign in/up/out, Google OAuth start)
- `src/lib/supabase/server.ts` — `createServerClient` върху `next/headers` cookies, ползван от Server Components/Actions
- `src/proxy.ts` — комбинира `next-intl` middleware-a със Supabase session refresh (`supabase.auth.getUser()` на всеки request, за да е свежа сесийната cookie)
- `src/app/[locale]/layout.tsx` — вече **без** ClerkProvider (чист html/body/NextIntlClientProvider)
- `/sign-in`, `/sign-up` (`src/app/[locale]/(shop)/sign-in/page.tsx`, `.../sign-up/page.tsx`) — custom email+password форми (не catch-all рутове както при Clerk — обикновени `page.tsx`) + бутон "Продължи с Google"
- `src/app/auth/callback/route.ts` (root ниво, извън `[locale]`, като `robots.ts`) — обменя OAuth `code` за сесия (`exchangeCodeForSession`), после redirect към default locale home
- Email confirmation е включена по подразбиране в Supabase — нов потребител вижда "Провери имейла си" вместо директен login, докато не кликне линка

**Все още не работи локално**, докато потребителят не довърши dashboard стъпките — виж "Стъпка 1" по-долу.

### 3. Route restructure (route group `(shop)`)
Всички storefront страници (`/`, `/products`, `/cart`, `/categories`, `/deals`, `/about`, `/contact`, `/privacy`, `/search`, `/wishlist`, `/sign-in`, `/sign-up`) са преместени в `src/app/[locale]/(shop)/` със собствен layout (Header/Footer/CartProvider/WishlistProvider). Причина: `/admin/*` да не се обгражда от клиентския Header/Footer. Route groups не добавят сегмент към URL — адресите не са се променили. `src/app/[locale]/layout.tsx` носи само html/body/NextIntlClientProvider (общо за shop и admin).

### 4. Нова DB схема — миграция написана, **НЕ Е ПУСНАТА** срещу истинската база
`supabase/migrations/0005_create_admin_tables.sql` създава:
- `orders`, `order_items` — за бъдещия Stripe checkout
- `discount_codes` — промо кодове (вече функционално CRUD-нато от admin панела)
- `store_settings` — singleton ред с адрес/имейл/телефон/праг за безплатна доставка; **единствената** от новите таблици с публична SELECT policy (чете се от `/contact`, `/cart`, homepage `StoreLocation`)

Всички са RLS enabled, без write policies (мутации само през `supabaseAdmin` service-role клиента, гейтнати от admin role проверка в Server Actions).

### 5. `store_settings` вече е закачено към публичния сайт
- `src/lib/settings.ts` → `getStoreSettings()` (публичен `supabase` клиент, fallback към `src/lib/constants.ts`, ако редът липсва)
- `/contact` (`src/app/[locale]/(shop)/contact/page.tsx`), `MapEmbed`, `StoreLocation` (homepage), `/cart` (`freeShippingThreshold` минава през `CartView` → `OrderSummary`) — всички вече четат от там
- **Известно ограничение (нарочно, не е бъг)**: `store_name` полето в `store_settings` съществува и се редактира от `/admin/settings`, но НЕ е закачено към branding-а на сайта (`SITE_NAME`, `— Nexa` суфиксите в `generateMetadata` навсякъде) — това би значело рефакторинг на ~15 файла за козметична полза, пропуснато нарочно. Ако някога стане нужно, издирвай `SITE_NAME` в `src/lib/constants.ts`
- Друго известно несъответствие: homepage `UspBar` показва статичен текст "За поръчки над $100" (превод в `messages/bg.json` → `home.usp.shippingDesc`) — не е свързан динамично към `free_shipping_threshold`. Ако админ смени прага, тази конкретна маркетингова реплика на homepage няма да се обнови автоматично (самата логика в количката е коректна и динамична).

## Какво трябва да се направи оттук нататък (по ред)

### Стъпка 1 — Потребителят трябва да достави:
1. **Supabase** Dashboard → Authentication → URL Configuration: Site URL = `http://localhost:3000`, добавя `http://localhost:3000/auth/callback` в Redirect URLs
2. **Supabase** Dashboard → Authentication → Providers → Google: enable, паства съществуващия Google Client ID + Secret (направени в Google Cloud Console по-рано за Clerk — преизползваме ги)
3. **Google Cloud Console** → същия OAuth client → Authorized redirect URIs → добавя `https://<project-ref>.supabase.co/auth/v1/callback`
4. По избор: Supabase Authentication → Providers → Email → "Confirm email" toggle — оставя включено или го спира за по-бързо локално тестване
5. `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard → Settings → API → service_role secret) — нужен за admin мутациите и `/admin/customers` (`listUsers()`)
6. Да пусне съдържанието на `supabase/migrations/0005_create_admin_tables.sql` през Supabase **SQL Editor**
7. След първата регистрация локално през новия `/sign-up` — една SQL команда в SQL Editor да маркира потребителя като admin:
   ```sql
   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = '<неговия имейл>';
   ```

### Стъпка 2 — Проверка на целия auth + админ панел flow:
- Публичният сайт работи както преди (никакви console грешки)
- `/sign-up` с email+password → "Провери имейла си" (или директен login, ако Confirm email е спрян) → SQL admin flag → `/sign-in` → `/admin` достъпен
- "Продължи с Google" бутон — пълен OAuth roundtrip през `/auth/callback`
- `SignOutButton` в admin header-а работи
- Non-admin потребител на `/admin` → redirect към `/`

### Стъпка 3 — Проверка на целия админ панел с реални данни:
- Създаване/редакция/изтриване на продукт от `/admin/products`
- Merge на категории от `/admin/categories`
- Създаване на промо код от `/admin/discounts`
- Редакция на `/admin/settings` → проверка, че се отразява на `/contact`, `/cart`, homepage
- `/admin/customers` показва регистрирания потребител от Supabase Auth
- `/admin/orders` е celebrated празно (очаквано, чака Stripe)

### Стъпка 4 — Stripe checkout (по-голяма задача, отделно планиране си струва):
Все още нищо не е построено за това. Ще трябва (грубо, не е финален план — да се обсъди в самата сесия):
- `/checkout` страница (адрес за доставка, преглед на поръчката) — в момента `OrderSummary` бутонът вече сочи към `/checkout`, но страницата не съществува
- Stripe акаунт + ключове (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, webhook secret) — нов ask към потребителя, аналогично на Supabase
- Stripe Checkout Session или Payment Element (да се реши кой подход — питай потребителя при въпроси)
- Webhook route handler (`/api/webhooks/stripe` или подобно) — при успешно плащане: insert в `orders` + `order_items` (схемата вече съществува от миграция `0005`), update на `stripe_payment_intent_id`
- Обвързване с Supabase auth `user.id`, ако потребителят е логнат, иначе guest checkout по email (полето `orders.user_id` вече е nullable точно за това)
- `/account/orders` (клиентска история на поръчки) — засега не съществува, в sitemap-а е като отделна страница

## Важни детайли, които да не се забравят следващия път
- `src/lib/admin/order-status.ts` е нарочно разделен от `src/lib/admin/orders.ts`, за да не изтече `supabaseAdmin` (service role) в клиентския бъндъл през `OrderStatusSelect.tsx`. Ако добавяш нов клиентски компонент, който има нужда от нещо от `lib/admin/*`, провери първо дали го internal-и `server-only` и раздели по същия начин.
- Категориите НЯМАТ отделна таблица — те са само `products.category`, а всеки slug трябва да има превод в `messages/bg.json`/`messages/en.json` → `categoryNames`. Затова `/admin/categories` не позволява free-text преименуване, само merge между съществуващи категории. Ако някога стане нужда от истински нови категории, ще трябва или (а) да се добавят преводи ръчно при всяко създаване, или (б) да се направи истинска `categories` таблица — реши се с потребителя, преди да се променя това поведение.
- Admin UI текстът е твърдо на български (не минава през next-intl `messages/*.json`) — съзнателно решение, защото е вътрешен инструмент, не клиентска страница. Не го конвертирай към next-intl, освен ако потребителят изрично поиска.
- Клиентските `/sign-in`, `/sign-up` страници **минават** през next-intl (`messages/*.json` → `auth` namespace) — за разлика от admin UI-я, това са публични клиентски страници.
- `admin/*.role` живее в `app_metadata` (не `user_metadata`) — само service role key може да го пише, обикновен signed-in потребител не може сам да си даде admin права дори през client-side supabase-js извиквания.
- `.env.local` е gitignored, проверено — никакви ключове/пароли не се пишат в код или тук в този файл.
