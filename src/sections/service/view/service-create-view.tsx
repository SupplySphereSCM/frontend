// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ServiceNewEditForm from "../service-new-edit-form";

// ----------------------------------------------------------------------

export default function ServiceCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Create a new service"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Service",
            href: paths.dashboard.service.root,
          },
          { name: "New service" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm />
    </Container>
  );
}
