import { FormStep } from "../../../hooks/use-valuation-form";
import { Calculator, Settings, TrendingUp, CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { id: "ebitda", label: "EBITDA", number: 1, icon: Calculator },
  { id: "adjustments", label: "Adjustments", number: 2, icon: Settings },
  { id: "valueDrivers", label: "Value Drivers", number: 3, icon: TrendingUp },
  { id: "followUp", label: "Follow-up", number: 4, icon: CheckCircle },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepNumber = steps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <>
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        const isCurrent = step.number === currentStepNumber;
        const isCompleted = step.number < currentStepNumber;
        const isUpcoming = step.number > currentStepNumber;
        
        return (
          <div key={step.id} >
            {/* Vertical Progress Line */}
            {index < steps.length - 1 && (
              <div  />
            )}
            
            {/* Step Item - Professional SaaS Style */}
            <div
              className={`flex items-center gap-4 py-4 px-4 rounded-lg transition-all duration-300 relative border-l-4 ${
                isCurrent
                  ? "bg-white text-[#0b2147] shadow-md border-[#1a365d] transform scale-[1.02]"
                  : isCompleted
                  ? "text-white hover:bg-[#1a365d]/70 hover:pl-5 border-transparent hover:border-[#1a365d] cursor-pointer"
                  : "text-white/70 hover:bg-[#1a365d]/50 hover:pl-5 border-transparent hover:border-[#1a365d]/50 cursor-pointer"
              }`}
            >
              {/* Icon Circle - Larger */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-br from-[#0b2147] to-[#1a365d] text-white shadow-lg"
                    : isCompleted
                    ? "bg-white text-[#0b2147] shadow-sm"
                    : "bg-white/20 text-white backdrop-blur-sm"
                }`}
              >
                <IconComponent  />
              </div>
              
              {/* Step Content - Larger Text */}
              <div >
                <div className={`text-lg font-semibold ${
                  isCurrent ? "text-[#0b2147]" : "text-current"
                }`}>
                  {step.label}
                </div>
                <div className={`text-sm tracking-wide flex items-center ${
                  isCurrent ? "text-[#0b2147]/70" : "text-current opacity-75"
                }`}>
                  Step {step.number}
                  {isCurrent && (
                    <span >
                      Current
                    </span>
                  )}
                  {isCompleted && (
                    <CheckCircle  />
                  )}
                </div>
              </div>
              
              {/* Subtle pulse animation for current step */}
              {isCurrent && (
                <div  />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
