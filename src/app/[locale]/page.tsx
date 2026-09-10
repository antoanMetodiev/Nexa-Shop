import { Hero } from "@/components/home/Hero";
import { UspBar } from "@/components/home/UspBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Newsletter } from "@/components/home/Newsletter";
import { StoreLocation } from "@/components/home/StoreLocation";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <UspBar />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <StoreLocation />
      <Newsletter />
    </>
  );
}
