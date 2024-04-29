// @mui
import { styled } from "@mui/material/styles";
import Step from "@mui/material/Step";
import Stepper, { StepperProps } from "@mui/material/Stepper";
import StepLabel, { stepLabelClasses } from "@mui/material/StepLabel";
import MuiStepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

// ----------------------------------------------------------------------

const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  top: 10,
  left: "calc(-50% + 20px)",
  right: "calc(50% + 20px)",
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

interface Props extends StepperProps {
  steps: string[];
  activeStep: number;
}

export default function CheckoutSteps({
  steps,
  activeStep,
  sx,
  ...other
}: Props) {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<StepConnector />}
      sx={{
        mb: { xs: 3, md: 5 },
        ...sx,
      }}
      {...other}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            sx={{
              [`& .${stepLabelClasses.label}`]: {
                fontWeight: "fontWeightSemiBold",
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
