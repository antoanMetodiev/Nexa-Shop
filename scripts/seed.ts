import { Client } from "pg";

type DummyReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  sku: string;
  tags: string[];
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  availabilityStatus: string;
  reviews: DummyReview[];
};

function slugify(title: string, id: number): string {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${id}`;
}

async function fetchProducts(): Promise<DummyProduct[]> {
  const res = await fetch("https://dummyjson.com/products?limit=0");
  if (!res.ok) {
    throw new Error(`DummyJSON request failed: ${res.status}`);
  }
  const data = await res.json();
  return data.products as DummyProduct[];
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL env var is required");
  }

  console.log("Fetching products from DummyJSON...");
  const products = await fetchProducts();
  console.log(`Fetched ${products.length} products.`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    for (const product of products) {
      await client.query(
        `insert into public.products
           (dummy_id, slug, title, description, category, brand, price,
            discount_percentage, rating, stock, thumbnail, images,
            sku, tags, warranty_information, shipping_information,
            return_policy, availability_status, reviews)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                 $13, $14, $15, $16, $17, $18, $19)
         on conflict (dummy_id) do update set
           slug = excluded.slug,
           title = excluded.title,
           description = excluded.description,
           category = excluded.category,
           brand = excluded.brand,
           price = excluded.price,
           discount_percentage = excluded.discount_percentage,
           rating = excluded.rating,
           stock = excluded.stock,
           thumbnail = excluded.thumbnail,
           images = excluded.images,
           sku = excluded.sku,
           tags = excluded.tags,
           warranty_information = excluded.warranty_information,
           shipping_information = excluded.shipping_information,
           return_policy = excluded.return_policy,
           availability_status = excluded.availability_status,
           reviews = excluded.reviews`,
        [
          product.id,
          slugify(product.title, product.id),
          product.title,
          product.description,
          product.category,
          product.brand ?? null,
          product.price,
          product.discountPercentage,
          product.rating,
          product.stock,
          product.thumbnail,
          product.images,
          product.sku ?? null,
          product.tags ?? [],
          product.warrantyInformation ?? null,
          product.shippingInformation ?? null,
          product.returnPolicy ?? null,
          product.availabilityStatus ?? null,
          JSON.stringify(product.reviews ?? []),
        ],
      );
    }
    console.log(`Seeded ${products.length} products.`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
