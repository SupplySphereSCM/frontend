import { Controller, useFormContext } from "react-hook-form";
// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import ListItemText from "@mui/material/ListItemText";
import Paper, { PaperProps } from "@mui/material/Paper";
// components
import Iconify from "src/components/iconify";
// types
import { ICheckoutDeliveryOption } from "src/types/checkout";
import { ITransporterServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

type Props = CardProps & {
  // options: ICheckoutDeliveryOption[];
  options: ITransporterServiceItem[];
  setSelectedTransportId: (id: string) => void;
  onApplyShipping: (shipping: number) => void;
};

export default function CheckoutDelivery({
  options,
  setSelectedTransportId,
  onApplyShipping,
  ...other
}: Props) {
  const { control } = useFormContext();

  console.log("options:", options);

  return (
    <Card {...other}>
      <CardHeader title="Delivery" />

      <Controller
        name="delivery"
        control={control}
        render={({ field }) => (
          <Box
            columnGap={2}
            rowGap={2.5}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            sx={{ p: 3 }}
          >
            {options.map((option) => (
              <OptionItem
                key={option.id}
                option={option}
                selected={field.value === option.priceWithinState}
                onClick={() => {
                  field.onChange(option.priceWithinState);
                  onApplyShipping(option.priceWithinState);
                  setSelectedTransportId(option?.id!);
                }}
              />
            ))}
          </Box>
        )}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type OptionItemProps = PaperProps & {
  option: ITransporterServiceItem;
  selected: boolean;
};

function OptionItem({ option, selected, ...other }: OptionItemProps) {
  const { name, id, priceWithinState, description } = option;

  return (
    <Paper
      variant="outlined"
      key={id}
      sx={{
        p: 2.5,
        cursor: "pointer",
        display: "flex",
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
      {...other}
    >
      {/* {label === "Free" && <Iconify icon="carbon:bicycle" width={32} />}
      {label === "Standard" && <Iconify icon="carbon:delivery" width={32} />}
      {label === "Express" && <Iconify icon="carbon:rocket" width={32} />} */}

      <ListItemText
        sx={{ ml: 2 }}
        primary={
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ flexGrow: 1 }}>
              {name}
            </Box>
            <Box
              component="span"
              sx={{ typography: "h6" }}
            >{`$${priceWithinState}`}</Box>
          </Stack>
        }
        secondary={description}
        primaryTypographyProps={{ typography: "subtitle1", mb: 0.5 }}
        secondaryTypographyProps={{ typography: "body2" }}
      />
    </Paper>
  );
}
