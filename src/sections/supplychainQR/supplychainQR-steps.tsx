import React from "react";
// @mui
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";

import Step from "@mui/material/Step";
import Stepper, { StepperProps } from "@mui/material/Stepper";
import StepLabel, { stepLabelClasses } from "@mui/material/StepLabel";
import MuiStepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

// routes
import { paths } from "src/routes/paths";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

// ----------------------------------------------------------------------

export const STEPS = [
  "Basic Info",
  "Select Items",
  "Configure Steps",
  "Preview",
];

// const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
//   top: 10,
//   left: "calc(-50% + 20px)",
//   right: "calc(50% + 20px)",
//   [`& .${stepConnectorClasses.line}`]: {
//     borderTopWidth: 2,
//     borderColor: theme.palette.divider,
//   },
//   [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

// ----------------------------------------------------------------------
// export default function SupplychainQRSteps() {
//   return (
//     <>
//       <div>supplychain-steps</div>
//     </>
//   );
// }

// interface Props extends StepperProps {
//   steps: string[];
//   activeStep: number;
// }

// export default function SupplychainQRSteps({
//   // steps,
//   // activeStep,
//   sx,
//   ...other
// }: Props) {
//   const settings = useSettingsContext();
//   return (
//     // <Container sx={{ mt: 10 }} maxWidth={settings.themeStretch ? false : "lg"}>
//     //   <CustomBreadcrumbs
//     //     heading="Create a new SupplyChain"
//     //     links={[
//     //       {
//     //         name: "Dashboard",
//     //         href: paths.dashboard.root,
//     //       },
//     //       {
//     //         name: "SupplyChain",
//     //         href: paths.dashboard.supplychain.root,
//     //       },
//     //       { name: "New SupplyChain" },
//     //     ]}
//     //     sx={{
//     //       mb: 2,
//     //     }}
//     //   />
//     //   <Stepper
//     //     alternativeLabel
//     //     // activeStep={activeStep}
//     //     connector={<StepConnector />}
//     //     sx={{
//     //       mb: { xs: 3, md: 5 },
//     //       ...sx,
//     //     }}
//     //     {...other}
//     //   >
//     //     {STEPS.map((label) => (
//     //       <Step key={label}>
//     //         <StepLabel
//     //           sx={{
//     //             [`& .${stepLabelClasses.label}`]: {
//     //               fontWeight: "fontWeightSemiBold",
//     //             },
//     //           }}
//     //         >
//     //           {label}
//     //         </StepLabel>
//     //       </Step>
//     //     ))}
//     //   </Stepper>
//     // </Container>
//   );
// }

// @mui
// import Timeline from "@mui/lab/Timeline";
// import TimelineDot from "@mui/lab/TimelineDot";
// import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineSeparator from "@mui/lab/TimelineSeparator";
// import TimelineConnector from "@mui/lab/TimelineConnector";
// import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import Paper from "@mui/material/Paper";
// import Stack from "@mui/material/Stack";
// import CardHeader from "@mui/material/CardHeader";
// import Typography from "@mui/material/Typography";
// // utils
// import { fDateTime } from "src/utils/format-time";
// // types
// import { IOrderHistory } from "src/types/order";

// ----------------------------------------------------------------------

// type Props = {
//   history: IOrderHistory;
// };

// export default function SupplychainQRSteps() {
//   // { history }: Props
//   const renderSummary = (
//     <Stack
//       spacing={2}
//       component={Paper}
//       variant="outlined"
//       sx={{
//         p: 2.5,
//         minWidth: 260,
//         flexShrink: 0,
//         borderRadius: 2,
//         typography: "body2",
//         borderStyle: "dashed",
//       }}
//     >
//       <Stack spacing={0.5}>
//         <Box sx={{ color: "text.disabled" }}>Order time</Box>
//         {/* {fDateTime(history.orderTime)} */}
//       </Stack>
//       <Stack spacing={0.5}>
//         <Box sx={{ color: "text.disabled" }}>Payment time</Box>
//         {/* {fDateTime(history.orderTime)} */}
//       </Stack>
//       <Stack spacing={0.5}>
//         <Box sx={{ color: "text.disabled" }}>Delivery time for the carrier</Box>
//         {/* {fDateTime(history.orderTime)} */}
//       </Stack>
//       <Stack spacing={0.5}>
//         <Box sx={{ color: "text.disabled" }}>Completion time</Box>
//         {/* {fDateTime(history.orderTime)} */}
//       </Stack>
//     </Stack>
//   );

//   const renderTimeline = (
//     <Timeline
//       sx={{
//         p: 0,
//         m: 0,
//         [`& .${timelineItemClasses.root}:before`]: {
//           flex: 0,
//           padding: 0,
//         },
//       }}
//     >
//       return ({/* {history.timeline.map((item, index) => { */}
//       {/* {STEPS.map((item, index) => {
//         const firstTimeline = index === 0;

//         const lastTimeline = "18 May 2024 9:24"
//         const lastTimeline = index === history.timeline.length - 1; */}
//       <TimelineItem>
//         <TimelineSeparator>
//           <TimelineDot color={"primary"} />
//           {/* <TimelineDot color={(firstTimeline && "primary") || "grey"} /> */}
//           <TimelineConnector />
//           {/* {lastTimeline ? null : <TimelineConnector />} */}
//         </TimelineSeparator>

//         <TimelineContent>
//           <Typography variant="subtitle2">item</Typography>

//           <Box sx={{ color: "text.disabled", typography: "caption", mt: 0.5 }}>
//             19th May
//             {/* {fDateTime(item)} */}
//           </Box>
//         </TimelineContent>
//       </TimelineItem>
//       );
//       {/* })} */}
//     </Timeline>
//   );

//   return (
//     <Card>
//       <CardHeader title="History" />
//       <Stack
//         spacing={3}
//         alignItems={{ md: "flex-start" }}
//         direction={{ xs: "column-reverse", md: "row" }}
//         sx={{ p: 3 }}
//       >
//         {renderTimeline}

//         {renderSummary}
//       </Stack>
//     </Card>
//   );
// }

// @mui
import Masonry from "@mui/lab/Masonry";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
// import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// routes
// import { paths } from "src/routes/paths";
// components
import Iconify from "src/components/iconify";
// import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ComponentBlock from "./component-block";

// ----------------------------------------------------------------------

type TimelineType = {
  key: number;
  title: string;
  des: string;
  time: string;
  color?:
    | "primary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "inherit"
    | "grey"
    | "secondary";
  icon: React.ReactElement;
};

const TIMELINES: TimelineType[] = [
  {
    key: 1,
    title: "Default",
    des: "Morbi mattis ullamcorper",
    time: "09:30 am",
    icon: <Iconify icon="eva:folder-add-fill" width={24} />,
  },
  {
    key: 2,
    title: "Primary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "primary",
    icon: <Iconify icon="eva:image-2-fill" width={24} />,
  },
  {
    key: 3,
    title: "Secondary",
    des: "Morbi mattis ullamcorper",
    time: "10:00 am",
    color: "secondary",
    icon: <Iconify icon="eva:pantone-fill" width={24} />,
  },
  {
    key: 4,
    title: "Info",
    des: "Morbi mattis ullamcorper",
    time: "10:30 am",
    color: "info",
    icon: <Iconify icon="eva:tv-fill" width={24} />,
  },
  {
    key: 5,
    title: "Success",
    des: "Morbi mattis ullamcorper",
    time: "11:00 am",
    color: "success",
    icon: <Iconify icon="eva:activity-fill" width={24} />,
  },
  {
    key: 6,
    title: "Warning",
    des: "Morbi mattis ullamcorper",
    time: "11:30 am",
    color: "warning",
    icon: <Iconify icon="eva:cube-fill" width={24} />,
  },
  {
    key: 7,
    title: "Error",
    des: "Morbi mattis ullamcorper",
    time: "12:00 am",
    color: "error",
    icon: <Iconify icon="eva:film-fill" width={24} />,
  },
];

export default function SupplychainQRSteps() {
  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "grey.200" : "grey.800",
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Timeline"
            links={[
              {
                name: "Components",
                href: paths.components,
              },
              { name: "Timeline" },
            ]}
            moreLink={["https://mui.com/components/timeline"]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <ComponentBlock title="Customized">
          <Timeline position="alternate">
            {TIMELINES.map((item) => (
              <TimelineItem key={item.key}>
                <TimelineOppositeContent>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={item.color}>{item.icon}</TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                    }}
                  >
                    <Typography variant="subtitle2">{item.title}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.des}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </ComponentBlock>
      </Container>
    </>
  );
}
