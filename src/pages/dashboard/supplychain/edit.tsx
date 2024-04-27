import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import { SupplyChainEditView } from "src/sections/supplychain/view";

// ----------------------------------------------------------------------

export default function SupplyChainEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: SupplyChain Edit</title>
      </Helmet>

      <SupplyChainEditView id={`${id}`} />
    </>
  );
}
