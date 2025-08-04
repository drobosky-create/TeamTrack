import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function RatingInput({ label, value = 0, onChange, disabled = false }: RatingInputProps) {
  const [hoveredValue, setHoveredValue] = useState(0);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoveredValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoveredValue(0);
  };

  const displayValue = hoveredValue || value;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700" data-testid={`label-${label}`}>
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1" onMouseLeave={handleMouseLeave}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              className={cn(
                "w-8 h-8 rounded-full text-sm transition-colors",
                rating <= displayValue
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-600 hover:bg-primary hover:text-white"
              )}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              data-testid={`rating-${label}-${rating}`}
            >
              {rating}
            </Button>
          ))}
        </div>
        <span className="text-sm text-gray-600" data-testid={`score-${label}`}>
          Score: {value}/5
        </span>
      </div>
    </div>
  );
}
