import { Helmet } from "react-helmet-async";
// routes
import { useParams } from "src/routes/hooks";
// sections
import { ServiceEditView } from "src/sections/service/view";

// ----------------------------------------------------------------------

export default function ServiceEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Service Edit</title>
      </Helmet>

      <ServiceEditView id={`${id}`} />
    </>
  );
}
