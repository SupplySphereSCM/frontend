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
import { IServiceItem, ITransporterServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};
type ServiceProps = {
  currentService: IServiceItem | ITransporterServiceItem;
};

const TransportUI = ({ currentService }: ServiceProps) => {
  return (
    <>
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

      <TransporterServiceNewEditForm
        currentTransportService={currentService as ITransporterServiceItem}
      />
    </>
  );
};

const ServiceUI = ({ currentService }: ServiceProps) => {
  return (
    <>
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

      <ServiceNewEditForm currentService={currentService as IServiceItem} />
    </>
  );
};

export default function ServiceEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { service: currentService } = useGetService({
    serviceId: id,
    role: user?.roles[0] as any,
  });
  // console.log("Service:", currentService);
  const isTransporter = user?.roles.includes("TRANSPORTER");

  const isService = user?.roles.includes("SELLER");

  return (
    // user?.roles.some((role) => ["TRANSPORTER"].includes(role)) ? (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      {isTransporter && <TransportUI currentService={currentService} />}
      {isService && <ServiceUI currentService={currentService} />}
    </Container>
    // ) : (
    //   <Container maxWidth={settings.themeStretch ? false : "lg"}>

    //   </Container>
  );
}
