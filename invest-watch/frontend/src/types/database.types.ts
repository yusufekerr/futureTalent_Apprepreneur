export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "Hisse" | "Kripto" | "Emtia" | "Fon" | "Döviz"
          quantity: number
          buy_price: number
          current_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          type: "Hisse" | "Kripto" | "Emtia" | "Fon" | "Döviz"
          quantity: number
          buy_price: number
          current_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: "Hisse" | "Kripto" | "Emtia" | "Fon" | "Döviz"
          quantity?: number
          buy_price?: number
          current_price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          id: string
          user_id: string
          total_value: number
          total_cost: number
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          total_value: number
          total_cost: number
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_value?: number
          total_cost?: number
          recorded_at?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          id: string
          user_id: string
          asset_name: string
          target_price: number
          condition: "above" | "below"
          is_triggered: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          asset_name: string
          target_price: number
          condition: "above" | "below"
          is_triggered?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_name?: string
          target_price?: number
          condition?: "above" | "below"
          is_triggered?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
