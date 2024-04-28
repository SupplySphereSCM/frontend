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

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ServiceEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { service: currentService } = useGetService(id);

  return (
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
