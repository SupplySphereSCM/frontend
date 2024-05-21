// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// api
import { useGetSupplyChain } from "src/api/supplychain";
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import SupplyChainNewEditForm from "../supplychain-new-edit-form";
//

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function SupplyChainEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { supplyChain: currentSupplyChain } = useGetSupplyChain(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Product",
            href: paths.dashboard.product.root,
          },
          { name: currentSupplyChain.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SupplyChainNewEditForm currentSupplyChain={currentSupplyChain} />
    </Container>
  );
}
