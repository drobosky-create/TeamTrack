import { FormStep } from "../../../hooks/use-valuation-form";

interface FreeProgressIndicatorProps {
  currentStep: FormStep;
}

const freeSteps = [
  { id: "contact", label: "Contact Information", number: 1 },
  { id: "ebitda", label: "EBITDA Calculation", number: 2 },
  { id: "adjustments", label: "EBITDA Adjustments", number: 3 },
  { id: "valueDrivers", label: "Value Drivers", number: 4 },
  { id: "followUp", label: "Follow-up", number: 5 },
];

export default function FreeProgressIndicator({ currentStep }: FreeProgressIndicatorProps) {
  const currentStepNumber = freeSteps.find((step) => step.id === currentStep)?.number || 1;

  return (
    <div >
      <div >
        <h2 >Basic Business Assessment</h2>
        <div >
          <div ></div>
          <span >Step {currentStepNumber} of 5</span>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div >
        <div >
          {freeSteps.map((step) => (
            <div key={step.id} >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.number <= currentStepNumber
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {step.number}
              </div>
              <div >
                <span
                  className={`block text-sm font-medium transition-colors duration-300 ${
                    step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                {step.number === currentStepNumber && (
                  <div >
                    <div  style={{ width: "70%" }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div >
        <div >
          {freeSteps.map((step, index) => (
            <div key={step.id} >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step.number <= currentStepNumber
                    ? "bg-blue-600 text-white shadow-lg scale-110"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {step.number}
              </div>
              {index < freeSteps.length - 1 && (
                <div >
                  <div >
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        step.number < currentStepNumber ? "bg-blue-600 w-full" : "bg-slate-200 w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div >
          {freeSteps.map((step) => (
            <div key={step.id}  style={{ width: "120px" }}>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  step.number <= currentStepNumber ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}