import { useMemo, useState } from 'react';

type Step = string | number;

export function useStep(steps: Step[], onSubmit?: () => void) {
  const [step, setStep] = useState<Step>(steps[0]);

  const isFirstStep = useMemo(() => step === steps[0], [step, steps]);

  const isLastStep = useMemo(
    () => step === steps[steps.length - 1],
    [step, steps]
  );

  function handlePrev() {
    const idx = steps.indexOf(step);
    if (idx > 0) {
      setStep(steps[idx - 1]);
    }
  }

  function handleNext() {
    const idx = steps.indexOf(step);
    if (idx >= 0) {
      if (idx !== steps.length - 1) {
        setStep(steps[idx + 1]);
      } else {
        onSubmit?.();
      }
    }
  }

  return {
    step,
    isFirstStep,
    isLastStep,
    handlePrev,
    handleNext,
  };
}
