import { Helmet } from "react-helmet-async";
// sections

import { SupplyChainCreateView } from "src/sections/supplychain/view";

// ----------------------------------------------------------------------

export default function ShopPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new shop</title>
      </Helmet>

      <SupplyChainCreateView />
    </>
  );
}
