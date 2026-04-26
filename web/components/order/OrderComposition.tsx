"use client";

import { useState } from "react";
import { OrderSelection } from "./OrderSelection";
import { PaymentSimulation } from "./PaymentSimulation";
import { OrderSuccess } from "./OrderSuccess";

export type OrderServiceType = {
  id: string;
  title: string;
  price: string;
};

type PricingPlan = {
  id: string;
  title: string;
  price: string;
  features: readonly string[];
  popular: boolean;
};

export function OrderComposition({
  defaultPlanId,
  pricingData,
}: {
  defaultPlanId?: string;
  pricingData: readonly PricingPlan[];
}) {
  const defaultPlan = pricingData.find((p) => p.id === defaultPlanId);

  const [step, setStep] = useState<"selection" | "payment" | "success">(
    defaultPlan ? "payment" : "selection"
  );
  const [selectedService, setSelectedService] = useState<OrderServiceType | null>(
    defaultPlan ? { id: defaultPlan.id, title: defaultPlan.title, price: defaultPlan.price } : null
  );
  const [confirmedOrderNo, setConfirmedOrderNo] = useState<string>("");

  const handleSelectService = (service: OrderServiceType) => {
    setSelectedService(service);
    setStep("payment");
  };

  const handlePaymentSuccess = (orderNo: string) => {
    setConfirmedOrderNo(orderNo);
    setStep("success");
  };

  const goBackToSelection = () => setStep("selection");

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col bg-surface-cream">
      {step === "selection" && (
        <OrderSelection onSelect={handleSelectService} pricingData={pricingData} />
      )}

      {step === "payment" && selectedService && (
        <PaymentSimulation
          service={selectedService}
          onSuccess={handlePaymentSuccess}
          onBack={goBackToSelection}
        />
      )}

      {step === "success" && selectedService && (
        <OrderSuccess service={selectedService} orderNo={confirmedOrderNo} />
      )}
    </main>
  );
}
