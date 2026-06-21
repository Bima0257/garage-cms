export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      abouts: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          google_maps: string | null
          id: number
          image: string | null
          mission: string | null
          name: string
          opening_hours: Json | null
          phone: string | null
          social_media: Json | null
          tagline: string | null
          updated_at: string | null
          vision: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          google_maps?: string | null
          id?: number
          image?: string | null
          mission?: string | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          social_media?: Json | null
          tagline?: string | null
          updated_at?: string | null
          vision?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          google_maps?: string | null
          id?: number
          image?: string | null
          mission?: string | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          social_media?: Json | null
          tagline?: string | null
          updated_at?: string | null
          vision?: string | null
          whatsapp?: string | null
        }
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
      }
      heroes: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          is_active: boolean | null
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
      }
      modal_promotions: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: number
          image: string | null
          is_active: boolean | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: number
          image?: string | null
          is_active?: boolean | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          discount_price: number | null
          id: number
          image: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          short_description: string | null
          slug: string
          stock_status: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price?: number
          short_description?: string | null
          slug: string
          stock_status?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          short_description?: string | null
          slug?: string
          stock_status?: string | null
          updated_at?: string | null
        }
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
      }
      services: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: number
          image: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_from: number
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_from?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_from?: number
          updated_at?: string | null
        }
      }
      settings: {
        Row: {
          created_at: string | null
          favicon: string | null
          footer_text: string | null
          id: number
          logo: string | null
          meta_description: string | null
          meta_title: string | null
          site_name: string
          tagline: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          favicon?: string | null
          footer_text?: string | null
          id?: number
          logo?: string | null
          meta_description?: string | null
          meta_title?: string | null
          site_name?: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          favicon?: string | null
          footer_text?: string | null
          id?: number
          logo?: string | null
          meta_description?: string | null
          meta_title?: string | null
          site_name?: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
      }
      social_media: {
        Row: {
          created_at: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          platform: string
          sort_order: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          platform: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          platform?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          last_login_at: string | null
          name: string
          password: string
          photo: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          last_login_at?: string | null
          name: string
          password: string
          photo?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          last_login_at?: string | null
          name?: string
          password?: string
          photo?: string | null
          updated_at?: string | null
          username?: string
        }
      }
    }
  }
}

// Type exports
export type About = Database['public']['Tables']['abouts']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type Hero = Database['public']['Tables']['heroes']['Row']
export type ModalPromotion = Database['public']['Tables']['modal_promotions']['Row']
export type ProductCategory = Database['public']['Tables']['product_categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ServiceCategory = Database['public']['Tables']['service_categories']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Settings = Database['public']['Tables']['settings']['Row']
export type SocialMedia = Database['public']['Tables']['social_media']['Row']
export type User = Database['public']['Tables']['users']['Row']
