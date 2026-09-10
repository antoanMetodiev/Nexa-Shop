import { Client } from "pg";

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
            discount_percentage, rating, stock, thumbnail, images)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
           images = excluded.images`,
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
