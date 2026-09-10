export type ProductRow = {
  id: number;
  dummy_id: number | null;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  brand: string | null;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at"> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<
          Omit<ProductRow, "id" | "created_at"> & {
            id?: number;
            created_at?: string;
          }
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
