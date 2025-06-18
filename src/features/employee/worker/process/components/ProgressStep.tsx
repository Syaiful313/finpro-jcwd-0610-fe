import { CheckCircle } from "lucide-react";

interface ProgressStepsProps {
  currentStep: string;
  isVerificationCompleted: boolean;
  isProcessingCompleted: boolean;
}

const Step = ({ number, label, isActive, isCompleted }: any) => (
  <div
    className={`flex items-center gap-2 ${isActive || isCompleted ? "text-blue-600" : "text-gray-400"}`}
  >
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive || isCompleted ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    >
      {isCompleted ? <CheckCircle className="h-4 w-4" /> : number}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const Connector = ({ isCompleted }: any) => (
  <div
    className={`mx-4 h-1 flex-1 ${isCompleted ? "bg-blue-600" : "bg-gray-200"}`}
  ></div>
);

export default function ProgressSteps({
  currentStep,
  isVerificationCompleted,
  isProcessingCompleted,
}: ProgressStepsProps) {
  const isVerifyActive = currentStep === "verify" || isVerificationCompleted;
  const isProcessActive = currentStep === "process" || isProcessingCompleted;

  return (
    <div className="mb-6 flex items-center justify-between">
      <Step
        number="1"
        label="Verify"
        isActive={isVerifyActive}
        isCompleted={isVerificationCompleted}
      />
      <Connector isCompleted={isProcessActive} />
      <Step
        number="2"
        label="Process"
        isActive={isProcessActive}
        isCompleted={isProcessingCompleted}
      />
      <Connector isCompleted={isProcessingCompleted} />
      <Step
        number="3"
        label="Complete"
        isActive={isProcessingCompleted}
        isCompleted={isProcessingCompleted}
      />
    </div>
  );
}
