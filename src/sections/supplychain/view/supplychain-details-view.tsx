import { useEffect, useCallback, useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
// _mock
import { PRODUCT_PUBLISH_OPTIONS } from "src/_mock";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// api
import { useGetProduct } from "src/api/product";
// components
import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
//

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}></Container>
  );
}
