// @mui
import Box, { BoxProps } from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
// types
import { IProductItem } from "src/types/product";
//
import MaterialItem from "./material-item";
import { MaterialItemSkeleton } from "./material-skeleton";

type Props = BoxProps & {
  products: IProductItem[];
  loading?: boolean;
};

export default function MaterialList({ products, loading, ...other }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <MaterialItemSkeleton key={index} />
      ))}
    </>
  );

  const renderList = (
    <>
      {products.map((product) => (
        // <ProductItem key={product.id} product={product} />
        <MaterialItem key={product.id} product={product} />
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

      {products.length > 8 && (
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
