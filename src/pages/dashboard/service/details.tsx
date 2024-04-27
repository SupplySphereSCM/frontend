import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import { ServiceDetailsView } from "src/sections/service/view";

// ----------------------------------------------------------------------

export default function ServiceDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Service Details</title>
      </Helmet>

      <ServiceDetailsView id={`${id}`} />
    </>
  );
}
