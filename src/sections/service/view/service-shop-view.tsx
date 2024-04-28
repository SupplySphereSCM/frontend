import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import { useCallback, useState } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
import { useDebounce } from "src/hooks/use-debounce";
// routes
import { paths } from "src/routes/paths";
// _mock
import {
  PRODUCT_SORT_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
  ROLE_OPTIONS,
} from "src/_mock";
// api
import { useGetShopServices, useSearchServices } from "src/api/service";
// components
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
// types
import {
  IServiceItem,
  IServiceFilters,
  IServiceFilterValue,
} from "src/types/service";
//
import { useCheckoutContext } from "../../checkout/context";
import CartIcon from "../common/cart-icon";
import ServiceList from "../service-list";
import ServiceSort from "../service-sort";
import ServiceSearch from "../service-search";
import ServiceFilters from "../service-filters";
import ServiceFiltersResult from "../service-filters-result";

// ----------------------------------------------------------------------

const defaultFilters: IServiceFilters = {
  gender: [],
  colors: [],
  rating: "",
  category: "all",
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function ServiceShopView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState("featured");

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const { services, servicesLoading, servicesEmpty } = useGetShopServices();

  const { searchResults, searchLoading } = useSearchServices(debouncedQuery);

  const handleFilters = useCallback(
    (name: string, value: IServiceFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [],
  );

  const dataFiltered = applyFilter({
    inputData: services,
    filters,
    sortBy,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

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
      <ServiceSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id: string) => paths.service.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ServiceFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          colorOptions={PRODUCT_COLOR_OPTIONS}
          ratingOptions={PRODUCT_RATING_OPTIONS}
          genderOptions={ROLE_OPTIONS}
          categoryOptions={["all", ...PRODUCT_CATEGORY_OPTIONS]}
        />

        <ServiceSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ServiceFiltersResult
      filters={filters}
      onFilters={handleFilters}
      //
      canReset={canReset}
      onResetFilters={handleResetFilters}
      //
      results={dataFiltered.length}
    />
  );

  const renderNotFound = (
    <EmptyContent filled title="No Data" sx={{ py: 10 }} />
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : "lg"}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.totalItems} />

      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Shop
      </Typography>

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || servicesEmpty) && renderNotFound}

      <ServiceList services={dataFiltered} loading={servicesLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  sortBy,
}: {
  inputData: IServiceItem[];
  filters: IServiceFilters;
  sortBy: string;
}) {
  const { gender, category, colors, priceRange, rating } = filters;

  const min = priceRange[0];

  const max = priceRange[1];

  // SORT BY
  if (sortBy === "featured") {
    inputData = orderBy(inputData, ["totalSold"], ["desc"]);
  }

  if (sortBy === "newest") {
    inputData = orderBy(inputData, ["createdAt"], ["desc"]);
  }

  if (sortBy === "priceDesc") {
    inputData = orderBy(inputData, ["price"], ["desc"]);
  }

  if (sortBy === "priceAsc") {
    inputData = orderBy(inputData, ["price"], ["asc"]);
  }

  // FILTERS
  // if (gender.length) {
  //   inputData = inputData.filter((service) => gender.includes(service.gender));
  // }

  // if (category !== "all") {
  //   inputData = inputData.filter((service) => service.category === category);
  // }

  // if (colors.length) {
  //   inputData = inputData.filter((service) =>
  //     service.colors.some((color) => colors.includes(color)),
  //   );
  // }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter(
      (service) => service.price >= min && service.price <= max,
    );
  }

  // if (rating) {
  //   inputData = inputData.filter((service) => {
  //     const convertRating = (value: string) => {
  //       if (value === "up4Star") return 4;
  //       if (value === "up3Star") return 3;
  //       if (value === "up2Star") return 2;
  //       return 1;
  //     };
  //     return service.totalRatings > convertRating(rating);
  //   });
  // }

  return inputData;
}
