// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// api
import { useGetService } from "src/api/service";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ServiceNewEditForm from "../service-new-edit-form";
import TransporterServiceNewEditForm from "../transporter-service-new-edit-form";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ServiceEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { service: currentService } = useGetService(id);
  // console.log("Service:", currentService);

  return user?.roles.some((role) => ["TRANSPORTER"].includes(role)) ? (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Transport Service",
            href: paths.dashboard.transporter.root,
          },
          { name: currentService?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TransporterServiceNewEditForm currentTransportService={currentService} />
    </Container>
  ) : (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Service",
            href: paths.dashboard.service.root,
          },
          { name: currentService?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm currentService={currentService} />
    </Container>
  );
}
