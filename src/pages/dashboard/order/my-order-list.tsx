import { Helmet } from "react-helmet-async";
// sections
import { MyOrderListView, OrderListView } from "src/sections/order/view";

// ----------------------------------------------------------------------

export default function MyOrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

      <MyOrderListView />
    </>
  );
}
