// @mui
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// utils
import { fCurrency } from "src/utils/format-number";
// components
import Image from "src/components/image";
import Iconify from "src/components/iconify";
// types
import { IRawMaterialItem } from "src/types/raw-materials";

// ----------------------------------------------------------------------

type Props = {
  product: IRawMaterialItem;
};

export default function MaterialItem({ product }: Props) {
  const { id, name, price, available, images } = product;

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      available,
      price,
      quantity: 1,
    };
    try {
      console.log("ADD TO CART: ", newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderImg = (
    <Box sx={{ position: "relative", p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: "absolute",
            transition: (theme) =>
              theme.transitions.create("all", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && "Out of stock"} placement="bottom-end">
        <Image
          alt={name}
          src={images[0] || "/assets/icons/files/ic_file.svg"}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: "grayscale(1)",
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
      >
        {name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span">{fCurrency(price)}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        "&:hover .add-cart-btn": {
          opacity: 1,
        },
      }}
    >
      {renderImg}

      {renderContent}
    </Card>
  );
}
