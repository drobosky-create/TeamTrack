import React, { useEffect, useState } from 'react';

interface OperationalGradeGaugeProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  title?: string;
  animated?: boolean;
  onGradeClick?: (grade: 'A' | 'B' | 'C' | 'D' | 'F') => void;
}

const OperationalGradeGauge: React.FC<OperationalGradeGaugeProps> = ({ 
  grade, 
  title = "Operational Grade",
  animated = true,
  onGradeClick
}) => {
  const [animatedAngle, setAnimatedAngle] = useState(0);
  
  // Define grade segments with colors and angles (semi-circle from 0 to 180 degrees)
  const gradeSegments = [
    { grade: 'F', color: 'bg-red-500', angle: 0, label: 'Poor' },
    { grade: 'D', color: 'bg-orange-400', angle: 36, label: 'Below Average' },
    { grade: 'C', color: 'bg-yellow-300', angle: 72, label: 'Average' },
    { grade: 'B', color: 'bg-sky-400', angle: 108, label: 'Good' },
    { grade: 'A', color: 'bg-emerald-500', angle: 144, label: 'Excellent' },
  ];

  // Get target angle for current grade (semi-circle from 0 to 180 degrees)
  const getTargetAngle = (currentGrade: string) => {
    const segment = gradeSegments.find(s => s.grade === currentGrade);
    return segment ? segment.angle + 18 : 18; // Add 18 to center needle in segment (180/5 = 36, so half is 18)
  };

  const targetAngle = getTargetAngle(grade);

  // Animate needle on mount and grade change
  useEffect(() => {
    if (animated) {
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      const startAngle = animatedAngle;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
        
        setAnimatedAngle(currentAngle);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedAngle(targetAngle);
    }
  }, [grade, targetAngle, animated]);

  // Create SVG path for arc segments (semi-circle from left to right)
  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const centerX = 300;
    const centerY = 240;
    
    // Convert to semi-circle: 0° = left (180° in normal coords), 180° = right (0° in normal coords)
    const startAngleRad = (startAngle + 180) * (Math.PI / 180);
    const endAngleRad = (endAngle + 180) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Get needle position (semi-circle coordinates)
  const needleAngle = animatedAngle;
  const needleAngleRad = (needleAngle + 180) * (Math.PI / 180);
  const needleLength = 150;
  const centerX = 300;
  const centerY = 240;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  // Get current grade info
  const currentSegment = gradeSegments.find(s => s.grade === grade);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Glass card */}
        <div style={{ width: '100%' }}>

          {/* Gauge */}
          <div >
            <svg width="100%" height="400" viewBox="0 0 600 360" >
          {/* Material Dashboard Gradient Definitions */}
          <defs>
            {/* F Grade - Deep Red Material Gradient */}
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5722" />
              <stop offset="100%" stopColor="#d32f2f" />
            </linearGradient>
            {/* D Grade - Orange Material Gradient */}
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9800" />
              <stop offset="100%" stopColor="#f57c00" />
            </linearGradient>
            {/* C Grade - Amber Material Gradient */}
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc107" />
              <stop offset="100%" stopColor="#ff8f00" />
            </linearGradient>
            {/* B Grade - Blue Material Gradient */}
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2196f3" />
              <stop offset="100%" stopColor="#1976d2" />
            </linearGradient>
            {/* A Grade - Green Material Gradient */}
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4caf50" />
              <stop offset="100%" stopColor="#388e3c" />
            </linearGradient>
            {/* Background with subtle Material gradient */}
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f5f5f5" />
            </linearGradient>
            {/* Card background gradient */}
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d={createArcPath(0, 180, 160)}
            fill="url(#backgroundGradient)"
            stroke="rgb(226, 232, 240)"
            strokeWidth="2"
          />
          
          {/* Grade segments */}
          {gradeSegments.map((segment, index) => {
            const startAngle = segment.angle;
            const endAngle = index < gradeSegments.length - 1 ? gradeSegments[index + 1].angle : 180;
            const isActive = segment.grade === grade;
            
            const gradientId = 
              segment.grade === 'F' ? 'redGradient' :
              segment.grade === 'D' ? 'orangeGradient' :
              segment.grade === 'C' ? 'yellowGradient' :
              segment.grade === 'B' ? 'blueGradient' :
              'greenGradient';
            
            return (
              <g key={segment.grade}>
                <path
                  d={createArcPath(startAngle, endAngle, 160)}
                  fill={isActive ? `url(#${gradientId})` : 'rgb(248, 250, 252)'}
                  stroke="white"
                  strokeWidth="6"
                  style={{
                    filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
                    opacity: isActive ? 1 : 0.3,
                    cursor: onGradeClick ? 'pointer' : 'default'
                  }}
                  onClick={() => onGradeClick && onGradeClick(segment.grade as 'A' | 'B' | 'C' | 'D' | 'F')}
                />
                
                {/* Grade labels */}
                <text
                  x={centerX + 190 * Math.cos((segment.angle + 18 + 180) * (Math.PI / 180))}
                  y={centerY + 190 * Math.sin((segment.angle + 18 + 180) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-3xl font-black ${isActive ? 'fill-white' : 'fill-gray-700'}`}
                  style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    textShadow: isActive ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
                    cursor: onGradeClick ? 'pointer' : 'default'
                  }}
                  onClick={() => onGradeClick && onGradeClick(segment.grade as 'A' | 'B' | 'C' | 'D' | 'F')}
                >
                  {segment.grade}
                </text>
              </g>
            );
          })}
          
          {/* Needle with Material Design gradient */}
          <g >
            <defs>
              <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#37474f" />
                <stop offset="50%" stopColor="#546e7a" />
                <stop offset="100%" stopColor="#263238" />
              </linearGradient>
            </defs>
            <line
              x1={centerX}
              y1={centerY}
              x2={needleX}
              y2={needleY}
              stroke="url(#needleGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Needle center dot with gradient */}
            <circle
              cx={centerX}
              cy={centerY}
              r="16"
              fill="url(#needleGradient)"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="white"
            />
          </g>
          
          {/* Tick marks */}
          {gradeSegments.map((segment) => {
            const tickAngle = segment.angle;
            const tickAngleRad = (tickAngle + 180) * (Math.PI / 180);
            const innerRadius = 130;
            const outerRadius = 150;
            
            const x1 = centerX + innerRadius * Math.cos(tickAngleRad);
            const y1 = centerY + innerRadius * Math.sin(tickAngleRad);
            const x2 = centerX + outerRadius * Math.cos(tickAngleRad);
            const y2 = centerY + outerRadius * Math.sin(tickAngleRad);
            
            return (
              <line
                key={`tick-${segment.grade}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgb(107, 114, 128)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
            </svg>
        </div>
        
        {/* Title positioned below the gauge */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#0A1F44', 
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>{title}</h3>
          <p style={{ 
            fontSize: '1rem', 
            color: '#6B7280', 
            margin: '0',
            lineHeight: '1.4'
          }}>Current Performance Level</p>
        </div>
      </div>
    </div>
  );
};

export default OperationalGradeGauge;