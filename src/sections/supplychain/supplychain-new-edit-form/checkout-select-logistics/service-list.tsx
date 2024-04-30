// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// types
import { IServiceItem } from "src/types/service";
//
import ServiceItem from "./service-item";
import { ServiceItemSkeleton } from "./service-skeleton";
import { useRouter } from "src/routes/hooks";
import { useCallback } from "react";
import { paths } from "src/routes/paths";

type Props = BoxProps & {
  services: IServiceItem[];
  loading?: boolean;
};

export default function ServiceList({ services, loading, ...other }: Props) {
  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        {...other}
      >
        {services.map((service) => (
          // <ServiceItem key={service.id} service={service} />
          <ServiceItem key={service.id} service={service} />
        ))}
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
