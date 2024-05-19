import { Helmet } from "react-helmet-async";
// sections
import SupplychainQRSteps from "src/sections/supplychainQR/supplychainQR-steps";

// ----------------------------------------------------------------------

export default function supplychainQR() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new invoice</title>
      </Helmet>

      <SupplychainQRSteps />
    </>
  );
}
