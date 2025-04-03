
import { createClient } from '@supabase/supabase-js';

// These values are public, so they can be in the client code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be defined in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types for database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          address?: string;
          phone_number?: string;
          membership_start_date: string;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          role?: string;
          address?: string;
          phone_number?: string;
          membership_start_date?: string;
        };
        Update: {
          name?: string;
          email?: string;
          role?: string;
          address?: string;
          phone_number?: string;
          membership_start_date?: string;
        };
      };
      // Add other tables as needed
    };
  };
};
