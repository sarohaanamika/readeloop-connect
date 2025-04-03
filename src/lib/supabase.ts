
import { createClient } from '@supabase/supabase-js';

// Provide default values for development, but use environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log a warning if using default values
if (supabaseUrl === 'https://your-supabase-url.supabase.co' || 
    supabaseAnonKey === 'your-anon-key') {
  console.warn('Using default Supabase credentials. For production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
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
