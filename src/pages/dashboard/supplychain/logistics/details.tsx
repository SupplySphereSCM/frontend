import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import { ServiceDetailsView } from "src/sections/service/view";
import TransportServiceDetails from "src/sections/supplychain/supplychain-new-edit-form/checkout-select-logistics/service-details";

// ----------------------------------------------------------------------

export default function LogisticsDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Logistics Details</title>
      </Helmet>

      <TransportServiceDetails id={`${id}`} />
    </>
  );
}
