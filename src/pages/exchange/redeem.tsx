import { Helmet } from "react-helmet-async";
// sections
import { ExchangeRedeemView } from "src/sections/bank-exchange/views";

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Exchange | Redeem</title>
      </Helmet>

      <ExchangeRedeemView />
    </>
  );
}
