// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// _mock
import { _invoices } from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import InvoiceDetails from "../invoice-details";
import { useGetInvoice, useGetUserInvoices } from "src/api/invoice";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceDetailsView({ id }: Props) {
  const settings = useSettingsContext();
  const { invoice, invoiceLoading, invoiceError } = useGetInvoice(id);
  console.log("invoice-details-view:", invoice);

  // const currentInvoice = invoice.filter((invoice) => invoice.id === id)[0];

  const renderInvoiceDetails = invoice && (
    <>
      <CustomBreadcrumbs
        heading={invoice?.id?.slice(0, 5)}
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Invoice",
            href: paths.dashboard.invoice.root,
          },
          { name: `INV-${invoice?.id.slice(0, 5)}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetails invoice={invoice} />
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {invoice && renderInvoiceDetails}
    </Container>
  );
}
