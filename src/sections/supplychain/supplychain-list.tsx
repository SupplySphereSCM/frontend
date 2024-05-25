import { useCallback } from "react";
// @mui
import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// types
import { ISupplyChainItem } from "src/types/supplychain";
import SupplyChainItem from "./supplychain-item";
import { deleteSupplychain } from "src/api/supplychain";

type Props = {
  supplyChains: ISupplyChainItem[];
};

export default function SupplyChainList({ supplyChains }: Props) {
  const router = useRouter();
  console.log(supplyChains);

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.supplychain.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.supplychain.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    console.info("DELETE", id);
    deleteSupplychain(id);
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
      >
        {supplyChains.map((supplyChain) => (
          <SupplyChainItem
            key={supplyChain.id}
            supplyChain={supplyChain}
            onView={() => handleView(supplyChain.id as string)}
            onEdit={() => handleEdit(supplyChain.id as string)}
            onDelete={() => handleDelete(supplyChain.id as string)}
          />
        ))}
      </Box>

      {supplyChains.length > 8 && (
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
