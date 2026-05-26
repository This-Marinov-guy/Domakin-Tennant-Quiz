import { useState } from "react";

export function useMultiStep(steps: any[]) {
  const [currentStep, setCurrentStep] = useState(0);

  function next() {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function back() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  function goTo(index: number) {
    if (index >= 0 && index < steps.length) setCurrentStep(index);
  }

  return {
    currentStep,
    step: steps[currentStep],
    next,
    back,
    goTo,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
    totalSteps: steps.length,
  };
}
