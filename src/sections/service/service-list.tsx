import { useCallback } from "react";

// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// routes
import { paths } from "src/routes/paths";
// types
import { IServiceItem } from "src/types/service";
//
import ServiceItem from "./service-item";
import { ServiceItemSkeleton } from "./service-skeleton";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  services: IServiceItem[];
  loading?: boolean;
};

export default function ServiceList({ services, loading, ...other }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
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
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            onView={() => handleView(service.id)}
            onEdit={() => handleEdit(service.id)}
            onDelete={() => handleDelete(service.id)}
          />
        ))}

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
