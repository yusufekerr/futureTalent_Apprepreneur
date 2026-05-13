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
