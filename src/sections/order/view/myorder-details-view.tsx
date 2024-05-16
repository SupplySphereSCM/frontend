import { useState, useCallback } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
// routes
import { paths } from "src/routes/paths";
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
//
import OrderDetailsInfo from "../order-details-info";
import OrderDetailsItems from "../order-details-item";
import OrderDetailsToolbar from "../order-details-toolbar";
import OrderDetailsHistory from "../order-details-history";
import { useGetOrder } from "src/api/orders";
import { IOrderItem, IOrderProductItem } from "src/types/order";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function MyOrderDetailsView({ id }: Props) {
  const settings = useSettingsContext();
  // console.log(id);

  const { order, orderLoading, orderError } = useGetOrder(id);
  console.log("my-orders-details-viwe", order);

  // const currentOrder = order.filter((order) => order.id === id)[0];
  // const currentOrder = order;

  const [status, setStatus] = useState(order?.orderStatus);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  const renderOrderDetails = order && (
    <>
      {order && (
        <OrderDetailsToolbar
          order={order}
          backLink={paths.dashboard.myOrder.root}
          status={status}
          onChangeStatus={handleChangeStatus}
          statusOptions={ORDER_STATUS_OPTIONS}
        />
      )}

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: "column-reverse", md: "column" }}>
            <OrderDetailsItems
              item={
                order?.rawMaterial == null ? order?.service : order?.rawMaterial
              }
              taxes={order?.tax}
              shipping={order?.deliveryCharges}
              quantity={order?.quantity}
              // discount={currentOrder.discount}
              // subTotal={currentOrder.subTotal}
              totalAmount={order?.total}
            />

            {/* <OrderDetailsHistory history={order.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={order?.from}
            delivery={order?.transport}
            // payment={currentOrder.payment}
            shippingTo={order?.from}
          />
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {order && renderOrderDetails}
    </Container>
  );
}
