import { UseFormReturn } from "react-hook-form";
import { ValueDriversData } from "@shared/schema";
import { Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ArrowLeft, ArrowRight, TrendingUp } from "lucide-react";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";


interface ValueDriversFormProps {
  form: UseFormReturn<ValueDriversData>;
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: ValueDriversData) => void;

}

type Grade = "A" | "B" | "C" | "D" | "F";

const valueDrivers = [
  {
    name: "financialPerformance",
    title: "Financial Performance",
    description: "Revenue growth, profitability trends, and financial stability",
  },
  {
    name: "customerConcentration",
    title: "Customer Concentration",
    description: "Diversification of customer base and revenue concentration risk",
  },
  {
    name: "managementTeam",
    title: "Management Team Strength",
    description: "Quality and depth of management team, succession planning",
  },
  {
    name: "competitivePosition",
    title: "Competitive Position",
    description: "Market share, competitive advantages, and barriers to entry",
  },
  {
    name: "growthProspects",
    title: "Growth Prospects",
    description: "Market growth potential and expansion opportunities",
  },
  {
    name: "systemsProcesses",
    title: "Systems & Processes",
    description: "Operational systems and documentation",
  },
  {
    name: "assetQuality",
    title: "Asset Quality",
    description: "Condition and value of business assets",
  },
  {
    name: "industryOutlook",
    title: "Industry Outlook",
    description: "Industry trends and future prospects",
  },
  {
    name: "riskFactors",
    title: "Risk Factors",
    description: "Overall business risk assessment",
  },
  {
    name: "ownerDependency",
    title: "Owner Dependency",
    description: "Business dependence on current owner",
  },
];

const grades: Grade[] = ["A", "B", "C", "D", "F"];

const getGradeColor = (grade: Grade): string => {
  switch (grade) {
    case "A": return "#00718d";
    case "B": return "#66BB6A";
    case "C": return "#FFA726";
    case "D": return "#FF7043";
    case "F": return "#EF5350";
    default: return "#9E9E9E";
  }
};

interface GradeRadioGroupProps {
  name: string;
  value: Grade;
  onChange: (value: Grade) => void;
}

function GradeRadioGroup({ name, value, onChange }: GradeRadioGroupProps) {
  return (
    <MDBox display="flex" gap={1} justifyContent="flex-end">
      {grades.map((grade) => (
        <MDBox
          key={grade}
          onClick={() => onChange(grade)}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            border: value === grade ? '2px solid #0A1F44' : '2px solid #E0E0E0',
            backgroundColor: value === grade ? getGradeColor(grade) : '#ffffff',
            color: value === grade ? '#ffffff' : '#666666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: '#0A1F44',
            },
          }}
        >
          {grade}
        </MDBox>
      ))}
    </MDBox>
  );
}

export default function ValueDriversForm({ form, onNext, onPrev, onDataChange }: ValueDriversFormProps) {



  const watchedValues = form.watch();

  const onSubmit = (data: ValueDriversData) => {
    onDataChange(data);
    onNext();
  };

  const handleGradeChange = (fieldName: keyof ValueDriversData, grade: Grade) => {
    form.setValue(fieldName, grade);
    onDataChange(form.getValues());
  };

  const calculateAverageGrade = (): number => {
    const gradeValues = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const grades = valueDrivers.map(driver => 
      gradeValues[watchedValues[driver.name as keyof ValueDriversData] as Grade] || 0
    );
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return sum / grades.length;
  };

  const getOverallGrade = (): Grade => {
    const avg = calculateAverageGrade();
    if (avg >= 3.5) return "A";
    if (avg >= 2.5) return "B";
    if (avg >= 1.5) return "C";
    if (avg >= 0.5) return "D";
    return "F";
  };

  return (
    <MDBox>
      {/* Executive Header Section */}
      <MDBox mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <MDBox display="flex" alignItems="center">
          <MDBox
            sx={{
              backgroundColor: '#1B2C4F',
              borderRadius: '8px',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
            }}
          >
            <TrendingUp style={{ color: '#ffffff', fontSize: 28 }} />
          </MDBox>

          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
              Value Drivers Assessment
            </MDTypography>
            <MDTypography variant="body1" color="text">
              Rate each factor that impacts your business value from A (excellent) to F (poor).
            </MDTypography>
          </MDBox>
        </MDBox>


      </MDBox>

      {/* Form Container */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Value Drivers Section */}
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
                Business Value Drivers
              </MDTypography>
              
              {valueDrivers.map((driver, index) => (
                <MDBox key={driver.name} mb={2}>
                  <Card sx={{ backgroundColor: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                        <MDBox flex={1} mr={2}>
                          <MDTypography variant="h6" fontWeight="medium" color="dark" mb={0.5}>
                            {driver.title}
                          </MDTypography>
                          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                            {driver.description}
                          </Typography>
                        </MDBox>
                        
                        <MDBox flexShrink={0}>
                          <GradeRadioGroup
                            name={driver.name}
                            value={watchedValues[driver.name as keyof ValueDriversData] as Grade || "C"}
                            onChange={(grade) => handleGradeChange(driver.name as keyof ValueDriversData, grade)}
                          />
                        </MDBox>
                      </MDBox>
                    </CardContent>
                  </Card>
                </MDBox>
              ))}
            </MDBox>



            {/* Navigation Buttons */}
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="outlined"
                color="dark"
                onClick={onPrev}
                sx={{
                  color: '#0b2147',
                  borderColor: '#0b2147',
                  '&:hover': {
                    backgroundColor: '#0b2147',
                    color: '#ffffff',
                  },
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                Previous
              </MDButton>

              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                sx={{
                  background: 'linear-gradient(135deg, #0b2147 0%, #1a365d 100%)',
                  color: '#ffffff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a365d 0%, #2d4a75 100%)',
                  },
                }}
              >
                Continue
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </MDButton>
            </MDBox>
          </form>
        </CardContent>
      </Card>
    </MDBox>
  );
}