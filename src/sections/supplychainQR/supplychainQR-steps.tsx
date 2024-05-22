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
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// routes
import { paths } from "src/routes/paths";
// components
import Iconify from "src/components/iconify";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ComponentBlock from "./component-block";
import { useParams } from "react-router";
import { useGetSupplyChain } from "src/api/supplychain";
import { fDate } from "src/utils/format-time";

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
  const params = useParams();

  const { id } = params;

  console.log(id);

  const { supplyChain, supplyChainLoading, supplyChainError } =
    useGetSupplyChain(id as string);

  // const { steps } = supplyChain;
  // supplyChain?.steps.reverse();
  console.log("supplychain-QR:", supplyChain);
  // console.log("steps:", steps);

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
            // moreLink={["https://mui.com/components/timeline"]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <ComponentBlock title="Customized">
          <Timeline position="alternate">
            {supplyChain?.steps?.map((item, index) => (
              <>
                <TimelineItem key={index}>
                  <TimelineOppositeContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {fDate(supplyChain.createdAt)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={"primary"}>
                      <Iconify icon="eva:cube-fill" width={24} />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey[500], 0.12),
                      }}
                    >
                      <Typography variant="subtitle2">
                        {item.from.firstName}
                      </Typography>
                      {/* <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      >
                      {item.to.firstName}
                    </Typography> */}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem key={index}>
                  <TimelineOppositeContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {fDate(supplyChain.createdAt)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={"primary"}>
                      <Iconify icon="eva:cube-fill" width={24} />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: (theme) =>
                          alpha(theme.palette.grey[500], 0.12),
                      }}
                    >
                      <Typography variant="subtitle2">
                        {item.to.firstName}
                      </Typography>
                      {/* <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.to.firstName}
                    </Typography> */}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              </>
            ))}
          </Timeline>
        </ComponentBlock>
      </Container>
    </>
  );
}
