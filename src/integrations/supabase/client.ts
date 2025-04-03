
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sfaaeqbuylsqlmcyjota.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYWFlcWJ1eWxzcWxtY3lqb3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NTAzNjYsImV4cCI6MjA1OTIyNjM2Nn0.sywEhVhqpDByp2ef4YcPBACTUXTBxUX-lP9YlN40Hy0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Extended Database Types for the entire application
export type DatabaseExtended = Database & {
  public: {
    Tables: {
      payments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          payment_status: string;
          payment_method: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          amount: number;
          description: string;
          payment_status: string;
          payment_method: string;
        };
        Update: {
          user_id?: string;
          amount?: number;
          description?: string;
          payment_status?: string;
          payment_method?: string;
        };
      };
    };
  };
};

// Use this type-safe client for tables that are not in the generated types
export const supabaseExtended = createClient<DatabaseExtended>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
