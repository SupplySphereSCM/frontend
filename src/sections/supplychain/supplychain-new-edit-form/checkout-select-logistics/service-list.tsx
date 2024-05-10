// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// types
import { IServiceItem, ITransporterServiceItem } from "src/types/service";
//
import ServiceItem from "./service-item";
import { ServiceItemSkeleton } from "./service-skeleton";
import { useRouter } from "src/routes/hooks";
import { useCallback } from "react";
import { paths } from "src/routes/paths";
import { useAuthContext } from "src/auth/hooks";

type Props = BoxProps & {
  services: ITransporterServiceItem[];
  loading?: boolean;
};

export default function ServiceList({ services, loading, ...other }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleView = useCallback(
    (id: string) => {
      console.log("Go to details");

      router.push(paths.dashboard.transporter.details(id));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.transporter.edit(id));
    },
    [router],
  );

  const handleDelete = useCallback((id: string) => {
    console.info("DELETE", id);
  }, []);

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
          <ServiceItem
            key={service.id}
            service={service}
            // onView={() => handleView(service?.id as string)}
          />
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
