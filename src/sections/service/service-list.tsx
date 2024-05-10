import { useCallback } from "react";

// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// routes
import { paths } from "src/routes/paths";
// types
import { IServiceItem, ITransporterServiceItem } from "src/types/service";
//
import ServiceItem from "./service-item";
import { ServiceItemSkeleton } from "./service-skeleton";
import { useRouter } from "src/routes/hooks";
import { useAuthContext } from "src/auth/hooks";
import TransporterItem from "./transporter-item";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  services: (IServiceItem | ITransporterServiceItem)[];
  loading?: boolean;
};

export default function ServiceList({ services, loading, ...other }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.details(id));
    },
    [router],
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router],
  );

  const handleDelete = useCallback((id: string) => {
    console.info("DELETE", id);
  }, []);

  // const renderSkeleton = (
  //   <>
  //     {[...Array(16)].map((_, index) => (
  //       <ServiceItemSkeleton key={index} />
  //     ))}
  //   </>
  // );

  // const renderList = (
  //   <>
  //     {services.map((service) => (
  //       // <ServiceItem key={service.id} service={service} />
  //       <ServiceItem
  //         key={service.id}
  //         service={service}
  //         onView={handleView}
  //         onEdit={handleEdit}
  //         onDelete={handleDelete}
  //       />
  //     ))}
  //   </>
  // );

  const isTransporter = user?.roles.includes("TRANSPORTER");
  const isService = user?.roles.includes("SELLER");
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
        {services.map((service) =>
          isService ? (
            <ServiceItem
              key={service.id}
              service={service as IServiceItem}
              onView={() => handleView(service?.id as string)}
              onEdit={() => handleEdit(service?.id as string)}
              onDelete={() => handleDelete(service?.id as string)}
            />
          ) : (
            <TransporterItem
              key={service.id}
              service={service as ITransporterServiceItem}
              onView={() => handleView(service?.id as string)}
              onEdit={() => handleEdit(service?.id as string)}
              onDelete={() => handleDelete(service?.id as string)}
            />
          ),
        )}

        {/* {loading ? renderSkeleton : renderList} */}
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
