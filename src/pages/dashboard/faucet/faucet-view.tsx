import { Helmet } from "react-helmet-async";
// sections
import FaucetNewEditForm from "src/sections/faucet/faucet-new-edit-form";

// ----------------------------------------------------------------------

export default function FaucetPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new faucet</title>
      </Helmet>

      <FaucetNewEditForm />
    </>
  );
}
