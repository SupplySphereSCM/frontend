import { Helmet } from "react-helmet-async";
// sections
import { ServiceCreateView } from "src/sections/service/view";

// ----------------------------------------------------------------------

export default function ServiceCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Service</title>
      </Helmet>

      <ServiceCreateView />
    </>
  );
}
