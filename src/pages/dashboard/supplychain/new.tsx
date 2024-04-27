import { Helmet } from "react-helmet-async";
// sections
import { SupplyChainCreateView } from "src/sections/supplychain/view";

// ----------------------------------------------------------------------

export default function SupplyChainCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new SupplyChain</title>
      </Helmet>

      <SupplyChainCreateView />
    </>
  );
}
