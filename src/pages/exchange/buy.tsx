import { Helmet } from "react-helmet-async";
// sections
import { ExchangeBuyView } from "src/sections/bank-exchange/views";

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Exchange | Buy</title>
      </Helmet>

      <ExchangeBuyView />
    </>
  );
}
