// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import SupplyChainNewEditForm from "../supplychain-new-edit-form";
//

// ----------------------------------------------------------------------

export default function SupplyChainCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Create a new SupplyChain"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "SupplyChain",
            href: paths.dashboard.supplychain.root,
          },
          { name: "New SupplyChain" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SupplyChainNewEditForm />
    </Container>
  );
}
