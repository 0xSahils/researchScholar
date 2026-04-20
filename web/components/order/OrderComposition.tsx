"use client";

import { useState } from "react";
import { pricingData } from "@/lib/data/site-content";
import { OrderSelection } from "./OrderSelection";
import { PaymentSimulation } from "./PaymentSimulation";
import { OrderSuccess } from "./OrderSuccess";

export type OrderServiceType = {
  id: string;
  title: string;
  price: string;
};

export function OrderComposition({ defaultPlanId }: { defaultPlanId?: string }) {
  // If a valid ID is passed, start directly in payment mapping to that plan.
  const defaultPlan = pricingData.find((p) => p.id === defaultPlanId);

  const [step, setStep] = useState<"selection" | "payment" | "success">(
    defaultPlan ? "payment" : "selection"
  );
  
  const [selectedService, setSelectedService] = useState<OrderServiceType | null>(
    defaultPlan ? { id: defaultPlan.id, title: defaultPlan.title, price: defaultPlan.price } : null
  );

  const handleSelectService = (service: OrderServiceType) => {
    setSelectedService(service);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const goBackToSelection = () => {
    setStep("selection");
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col bg-surface-cream">
      {step === "selection" && (
        <OrderSelection onSelect={handleSelectService} />
      )}
      
      {step === "payment" && selectedService && (
        <PaymentSimulation 
          service={selectedService} 
          onSuccess={handlePaymentSuccess} 
          onBack={goBackToSelection} 
        />
      )}

      {step === "success" && selectedService && (
        <OrderSuccess service={selectedService} />
      )}
    </main>
  );
}
