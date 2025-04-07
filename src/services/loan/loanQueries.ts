
import { supabase } from "@/lib/supabase";
import { Loan } from "@/lib/types";
import { transformLoanData } from "./loanTransformers";

/**
 * Fetches loans for a specific member or all loans if no memberId is provided
 */
export const fetchLoans = async (memberId?: string): Promise<Loan[]> => {
  try {
    console.log("Fetching loans", memberId ? `for member: ${memberId}` : "for all members");
    
    let query = supabase
      .from('loans')
      .select(`
        *,
        book:books(*),
        member:users(*)
      `);
    
    if (memberId) {
      query = query.eq('member_id', memberId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching loans:", error);
      throw new Error(`Error fetching loans: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No loans found");
      return [];
    }
    
    console.log(`Found ${data.length} loans`);
    
    // Transform the Supabase response to match our Loan type
    return data.map(loan => transformLoanData(loan));
  } catch (error) {
    console.error("Error in fetchLoans:", error);
    return [];
  }
};
