import { useCallback, useState } from "react";
//@mui
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// components
import Iconify from "src/components/iconify";
//hooks
import { useCheckoutContext } from "./context";
//
import CheckoutSelectMaterials from "./checkout-select-materials";
import CheckoutSelectServices from "./checkout-select-services";
import CheckoutSelectLogistics from "./checkout-select-logistics";

// ----------------------------------------------------------------------

const TABS = [
  {
    value: "materials",
    icon: <Iconify icon="lets-icons:materials" width={24} />,
    label: "Materials",
  },
  {
    value: "services",
    icon: <Iconify icon="eos-icons:service" width={24} />,
    label: "Services",
  },
  {
    value: "logistics",
    icon: <Iconify icon="mdi:truck" width={24} />,
    label: "Logistics",
  },
];

// ----------------------------------------------------------------------

export default function CheckoutSelectItems() {
  const checkout = useCheckoutContext();

  const [currentTab, setCurrentTab] = useState("materials");

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [],
  );

  return (
    <>
      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 1 }}>
        {TABS.slice(0, 3).map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </Tabs>

      {currentTab === "materials" && <CheckoutSelectMaterials />}

      {currentTab === "services" && <CheckoutSelectServices />}

      {currentTab === "logistics" && <CheckoutSelectLogistics />}

      <Stack direction="row" justifyContent="space-between" mt={3}>
        <Button
          size="small"
          color="inherit"
          onClick={checkout.onBackStep}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>

        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={checkout.onNextStep}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Continue
        </Button>
      </Stack>
    </>
  );
}
