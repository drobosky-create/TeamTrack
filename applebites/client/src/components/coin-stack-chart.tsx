import { useState } from 'react';

interface CoinStackChartProps {
  currentGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  onGradeSelect: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => void;
  selectedGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  getValuation: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
  getMultiple: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => number;
}

export default function CoinStackChart({ 
  currentGrade, 
  onGradeSelect, 
  selectedGrade, 
  getValuation, 
  getMultiple 
}: CoinStackChartProps) {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  const grades = [
    { grade: 'F', multiplier: 2.0, label: 'Poor', color: '#ef4444', coins: 2 },
    { grade: 'D', multiplier: 3.0, label: 'Below Avg', color: '#f97316', coins: 3 },
    { grade: 'C', multiplier: 4.2, label: 'Average', color: '#f59e0b', coins: 4.2 },
    { grade: 'B', multiplier: 5.7, label: 'Good', color: '#3b82f6', coins: 5.7 },
    { grade: 'A', multiplier: 7.5, label: 'Excellent', color: '#10b981', coins: 7.5 }
  ] as const;

  const renderCoinStack = (gradeData: typeof grades[number], index: number) => {
    const isCurrent = gradeData.grade === currentGrade;
    const isSelected = gradeData.grade === selectedGrade;
    const isHovered = hoveredGrade === gradeData.grade;
    const valuation = getValuation(gradeData.grade as any);
    
    // Calculate stack height based on multiplier (max 7.5)
    const stackHeight = Math.max(60, (gradeData.multiplier / 7.5) * 120);
    const coinCount = Math.ceil(gradeData.coins);
    
    return (
      <div
        key={gradeData.grade}
        
        onClick={() => onGradeSelect(gradeData.grade as any)}
        onMouseEnter={() => setHoveredGrade(gradeData.grade)}
        onMouseLeave={() => setHoveredGrade(null)}
      >
        {/* Value Display Above Stack */}
        <div className={`mb-3 text-center transition-all duration-300 ${
          isSelected || isHovered ? 'scale-110' : 'scale-100'
        }`}>
          <div className={`text-lg font-bold ${
            isSelected ? 'text-blue-600' : isCurrent ? 'text-orange-600' : 'text-gray-700'
          }`}>
            ${(valuation / 1000000).toFixed(1)}M
          </div>
          <div >
            {gradeData.multiplier.toFixed(1)}x EBITDA
          </div>
        </div>

        {/* Coin Stack */}
        <div 
          className={`relative flex flex-col-reverse items-center transition-all duration-300 ${
            isSelected || isHovered ? 'scale-110' : 'scale-100'
          }`}
          style={{ height: `${stackHeight}px` }}
        >
          {Array.from({ length: coinCount }, (_, coinIndex) => (
            <div
              key={coinIndex}
              className={`w-12 h-4 rounded-full border-2 transition-all duration-300 ${
                isCurrent 
                  ? 'border-orange-400 shadow-lg shadow-orange-200' 
                  : isSelected 
                  ? 'border-blue-400 shadow-lg shadow-blue-200'
                  : 'border-gray-300'
              }`}
              style={{
                backgroundColor: gradeData.color,
                marginTop: coinIndex > 0 ? '-6px' : '0',
                opacity: isSelected || isCurrent || isHovered ? 1 : 0.8,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          ))}
          
          {/* Glow Effect for Current Grade */}
          {isCurrent && (
            <div 
              
              style={{
                boxShadow: `0 0 20px ${gradeData.color}40`,
                zIndex: -1
              }}
            />
          )}
          
          {/* Selection Ring */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div 
              
              style={{
                width: '120%',
                height: '120%',
                left: '-10%',
                top: '-10%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
        </div>

        {/* Grade Label */}
        <div >
          <div className={`text-2xl font-bold ${
            isSelected ? 'text-blue-600' : isCurrent ? 'text-orange-600' : 'text-gray-700'
          }`}>
            {gradeData.grade}
          </div>
          <div >
            {gradeData.label}
          </div>
          
          {/* Current Badge */}
          {isCurrent && (
            <div >
              <span >
                You are here
              </span>
            </div>
          )}
          
          {/* Selected Badge */}
          {isSelected && gradeData.grade !== currentGrade && (
            <div >
              <span >
                Selected
              </span>
            </div>
          )}
        </div>

        {/* Hover Tooltip */}
        {isHovered && (
          <div >
            <div >{gradeData.label} Operations</div>
            <div >
              Valuation: ${(valuation / 1000000).toFixed(2)}M
            </div>
            <div >
              {gradeData.multiplier.toFixed(1)}x EBITDA Multiple
            </div>
            <div ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div >
      {/* Chart Title */}
      <div >
        <h3 >
          Valuation Growth Stack
        </h3>
        <p >
          Click any grade to see how operational improvements impact your business value
        </p>
      </div>

      {/* Coin Stacks */}
      <div >
        {grades.map((gradeData, index) => renderCoinStack(gradeData, index))}
      </div>

      {/* Legend */}
      <div >
        <p >
          <span ></span>
          Current Grade
          <span ></span>
          Selected Target
        </p>
        <p >
          Stack height represents EBITDA multiple • Hover for detailed valuations
        </p>
      </div>
    </div>
  );
}