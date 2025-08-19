import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingModal({ isVisible, message = "Processing your request..." }: LoadingModalProps) {
  if (!isVisible) return null;

  return (
    <div >
      <div >
        <div >
          <Loader2  />
          <h3 >Generating Your Valuation</h3>
          <p >{message}</p>
        </div>
      </div>
    </div>
  );
}
