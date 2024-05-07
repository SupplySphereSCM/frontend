import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import ServiceDetails from "src/sections/supplychain/supplychain-new-edit-form/checkout-select-services/service-details";
// import ServiceDetailsPage from "../../service/details";

// ----------------------------------------------------------------------

export default function ServicesShopDetailsPage() {
  const params = useParams();

  const { id } = params;
  console.log("This is service details page.");

  return (
    <>
      <Helmet>
        <title> Dashboard: Logistics Details</title>
      </Helmet>
      {/* <ServiceDetailsPage id={`${id}`} /> */}
      <ServiceDetails id={`${id}`} />
    </>
  );
}
