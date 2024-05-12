import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import { useState, useCallback } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

// types
import {
  ISupplyChainItem,
  ISupplyChainFilters,
  ISupplyChainFilterValue,
  SUPPLYCHAIN_SORT_OPTIONS,
} from "src/types/supplychain";

import SupplyChainList from "../supplychain-list";
import SupplyChainSort from "../supplychain-sort";
import SupplyChainSearch from "../supplychain-search";
import { useGetSupplyChains } from "src/api/supplychain";

// ----------------------------------------------------------------------

const defaultFilters: ISupplyChainFilters = {};

// ----------------------------------------------------------------------

export default function SupplyChainListView() {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const { supplyChains } = useGetSupplyChains();
  

  const [sortBy, setSortBy] = useState("latest");

  const [search, setSearch] = useState<{
    query: string;
    results: ISupplyChainItem[];
  }>({
    query: "",
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: supplyChains,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback(
    (name: string, value: ISupplyChainFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [],
  );

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = supplyChains.filter(
          (supplychain) =>
            supplychain.name
              .toLowerCase()
              .indexOf(search.query.toLowerCase()) !== -1,
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
    >
      <SupplyChainSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id: string) => paths.dashboard.supplychain.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <SupplyChainSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={SUPPLYCHAIN_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "SupplyChain",
            href: paths.dashboard.supplychain.root,
          },
          { name: "List" },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.supplychain.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New SupplyChain
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}
      </Stack>

      {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

      <SupplyChainList supplyChains={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
  sortBy,
}: {
  inputData: ISupplyChainItem[];
  filters: ISupplyChainFilters;
  sortBy: string;
}) => {
  const {} = filters;

  // // SORT BY
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
  // }

  // // FILTERS
  // if (employmentTypes.length) {
  //   inputData = inputData.filter((job) =>
  //     job.employmentTypes.some((item) => employmentTypes.includes(item))
  //   );
  // }

  // if (experience !== 'all') {
  //   inputData = inputData.filter((job) => job.experience === experience);
  // }

  // if (roles.length) {
  //   inputData = inputData.filter((job) => roles.includes(job.role));
  // }

  // if (locations.length) {
  //   inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
  // }

  // if (benefits.length) {
  //   inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
  // }

  return inputData;
};
