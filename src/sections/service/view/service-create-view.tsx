// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ServiceNewEditForm from "../service-new-edit-form";
import TransporterServiceNewEditForm from "../transporter-service-new-edit-form";

import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

const TransportService = () => (
  <>
    <CustomBreadcrumbs
      heading="Create a new service"
      links={[
        { name: "Dashboard", href: paths.dashboard.root },
        { name: "Transporter Service", href: paths.dashboard.transporter.root },
        { name: "New Transporter service" },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <TransporterServiceNewEditForm />
  </>
);

const SellerService = () => (
  <>
    <CustomBreadcrumbs
      heading="Create a new service"
      links={[
        { name: "Dashboard", href: paths.dashboard.root },
        { name: "Service", href: paths.dashboard.service.root },
        { name: "New service" },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <ServiceNewEditForm />
  </>
);

export default function ServiceCreateView() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();

  const isTransporter = user?.roles.includes("TRANSPORTER");
  const isSeller = user?.roles.includes("SELLER");

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {isTransporter && <TransportService />}

      {isSeller && <SellerService />}
    </Container>
  );
}
