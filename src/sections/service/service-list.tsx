// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// types
import { IServiceItem } from "src/types/service";
//
import ServiceItem from "./service-item";
import { ServiceItemSkeleton } from "./service-skeleton";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  services: IServiceItem[];
  loading?: boolean;
};

export default function ServiceList({ services, loading, ...other }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <ServiceItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {services.map((service) => (
        // <ServiceItem key={service.id} service={service} />
        <ServiceItem key={service.id} service={service} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        {...other}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {services.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: "center",
            },
          }}
        />
      )}
    </>
  );
}
