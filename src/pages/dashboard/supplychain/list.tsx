import { Helmet } from "react-helmet-async";
// sections
import { SupplyChainListView } from "src/sections/supplychain/view";

// ----------------------------------------------------------------------

export default function SupplyChainListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: SupplyChain List</title>
      </Helmet>

      <SupplyChainListView />
    </>
  );
}
