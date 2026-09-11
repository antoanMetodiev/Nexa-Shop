export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

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
  sku: string | null;
  tags: string[];
  warranty_information: string | null;
  shipping_information: string | null;
  return_policy: string | null;
  availability_status: string | null;
  reviews: ProductReview[];
};

export type WishlistItemRow = {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
};

export type CartItemRow = {
  id: number;
  user_id: string;
  product_id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type OrderRow = {
  id: number;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shipping_address: Record<string, unknown> | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number | null;
  title: string;
  thumbnail: string | null;
  unit_price: number;
  quantity: number;
  created_at: string;
};

export type DiscountCodeRow = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
  updated_at: string;
};

export type StoreSettingsRow = {
  id: number;
  store_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  free_shipping_threshold: number;
  updated_at: string;
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
      wishlist_items: {
        Row: WishlistItemRow;
        Insert: Omit<WishlistItemRow, "id" | "created_at"> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<
          Omit<WishlistItemRow, "id" | "created_at"> & {
            id?: number;
            created_at?: string;
          }
        >;
        Relationships: [];
      };
      cart_items: {
        Row: CartItemRow;
        Insert: Omit<CartItemRow, "id" | "created_at" | "updated_at"> & {
          id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<CartItemRow, "id" | "created_at" | "updated_at"> & {
            id?: number;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at" | "updated_at"> & {
          id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<OrderRow, "id" | "created_at" | "updated_at"> & {
            id?: number;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, "id" | "created_at"> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<
          Omit<OrderItemRow, "id" | "created_at"> & {
            id?: number;
            created_at?: string;
          }
        >;
        Relationships: [];
      };
      discount_codes: {
        Row: DiscountCodeRow;
        Insert: Omit<
          DiscountCodeRow,
          "id" | "created_at" | "updated_at" | "used_count"
        > & {
          id?: number;
          created_at?: string;
          updated_at?: string;
          used_count?: number;
        };
        Update: Partial<
          Omit<DiscountCodeRow, "id" | "created_at" | "updated_at"> & {
            id?: number;
            created_at?: string;
            updated_at?: string;
          }
        >;
        Relationships: [];
      };
      store_settings: {
        Row: StoreSettingsRow;
        Insert: Omit<StoreSettingsRow, "updated_at"> & {
          updated_at?: string;
        };
        Update: Partial<
          Omit<StoreSettingsRow, "updated_at"> & { updated_at?: string }
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
