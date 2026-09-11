import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupabaseUserProvider } from "@/lib/supabase/user-context";
import { ProfileProvider } from "@/lib/profile-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseUserProvider>
      <ProfileProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </ProfileProvider>
    </SupabaseUserProvider>
  );
}
