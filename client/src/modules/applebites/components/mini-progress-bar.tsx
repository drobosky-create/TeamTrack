import { FormStep } from "../../../hooks/use-valuation-form";
import { User, Calculator, Settings, TrendingUp, CheckCircle } from "lucide-react";

interface MiniProgressBarProps {
  currentStep: FormStep;
}

const steps = [
  { id: "contact", label: "Contact", number: 1, icon: User },
  { id: "ebitda", label: "EBITDA", number: 2, icon: Calculator },
  { id: "adjustments", label: "Adjustments", number: 3, icon: Settings },
  { id: "valueDrivers", label: "Value Drivers", number: 4, icon: TrendingUp },
  { id: "followUp", label: "Follow-up", number: 5, icon: CheckCircle },
];

export default function MiniProgressBar({ currentStep }: MiniProgressBarProps) {
  const currentStepNumber = steps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <div >
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        const isCurrent = step.number === currentStepNumber;
        const isCompleted = step.number < currentStepNumber;

        return (
          <div key={step.id} >
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 flex-shrink-0 ${
                isCurrent
                  ? "bg-gradient-to-br from-[#0b2147] to-[#1a365d] text-white scale-110 shadow-md"
                  : isCompleted
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {isCompleted ? (
                <CheckCircle  />
              ) : (
                <IconComponent  />
              )}
            </div>
            
            {/* Step Label */}
            <div >
              <p
                className={`text-xs font-semibold truncate ${
                  isCurrent ? "text-[#0b2147]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p >Current</p>
              )}
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-full mx-2 transition-colors duration-300 ${
                  isCompleted ? "bg-emerald-300" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}