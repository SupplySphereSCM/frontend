import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import { SupplyChainDetailsView } from "src/sections/supplychain/view";

// ----------------------------------------------------------------------

export default function SupplyChainDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: SupplyChain Details</title>
      </Helmet>

      <SupplyChainDetailsView id={`${id}`} />
    </>
  );
}
