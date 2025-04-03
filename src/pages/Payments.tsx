import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { supabaseExtended } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";

const membershipPlans = [
  {
    id: "standard",
    name: "Standard",
    price: 9.99,
    perks: [
      "Borrow up to 3 books at a time",
      "Access to standard collection",
      "7 day loans",
      "Online reservations"
    ],
    isPopular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    perks: [
      "Borrow up to 5 books at a time",
      "Access to premium collection",
      "14 day loans",
      "Priority reservations",
      "Early access to new releases"
    ],
    isPopular: true,
  },
  {
    id: "family",
    name: "Family",
    price: 29.99,
    perks: [
      "Up to 4 family members",
      "Borrow up to 10 books at a time",
      "Access to all collections",
      "21 day loans",
      "Special family events",
      "Exclusive children's book club"
    ],
    isPopular: false,
  }
];

const Payments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const handlePayment = async (plan: typeof membershipPlans[0]) => {
    if (!user) {
      toast.error("You must be logged in to purchase a membership");
      return;
    }

    try {
      setIsProcessing(plan.id);
      
      // Simulate payment process
      // Instead of actually creating payment records in a non-existent table,
      // we'll just simulate success and update the user's membership type
      
      // 1. Simulate payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 2. Update the user's membership type
      const { error: updateError } = await supabase
        .from('users')
        .update({ membership_type: plan.id })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Show success UI
      setSuccessPlan(plan.id);
      toast.success(`Successfully purchased ${plan.name} plan!`);
      
      // In a production app, we would redirect to a payment processor here
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Choose Your Membership Plan</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Unlock the full potential of our library with a membership plan that suits your reading habits.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {membershipPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight">${plan.price}</span>
                    <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.perks.map((perk, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                {successPlan === plan.id ? (
                  <Button className="w-full" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Purchased Successfully
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handlePayment(plan)}
                    disabled={isProcessing !== null}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {isProcessing === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Get {plan.name}
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-muted-foreground">
          <p>All plans include a 14-day money-back guarantee. No contracts, cancel anytime.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Payments;
