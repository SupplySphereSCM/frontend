import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import { useCallback, useState } from "react";
// @mui
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
import { useDebounce } from "src/hooks/use-debounce";
// routes
import { paths } from "src/routes/paths";
import EmptyContent from "src/components/empty-content";
//types
import {
  IProductFilterValue,
  IProductFilters,
  IProductItem,
} from "src/types/product";
//apis
import { useGetRawMaterials, useSearchProducts } from "src/api/product";
//
import {
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_COLOR_OPTIONS,
  PRODUCT_RATING_OPTIONS,
  PRODUCT_SORT_OPTIONS,
  ROLE_OPTIONS,
} from "src/_mock";

import MaterialSearch from "./material-search";
import MaterialList from "./material-list";
import MaterialSort from "./material-sort";
import MaterialFilters from "./material-filters";
import MaterialFiltersResult from "./material-filter-results";

// ----------------------------------------------------------------------

const defaultFilters: IProductFilters = {
  gender: [],
  colors: [],
  rating: "",
  category: "all",
  priceRange: [0, 200],
};

// ----------------------------------------------------------------------

export default function CheckoutSelectMaterials() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState("featured");

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery);

  const [filters, setFilters] = useState(defaultFilters);

  const { materials, materialsLoading, materialsEmpty } = useGetRawMaterials();

  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  const handleFilters = useCallback(
    (name: string, value: IProductFilterValue) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [],
  );

  const dataFiltered = applyFilter({
    inputData: materials,
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
      <MaterialSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        loading={searchLoading}
        hrefItem={(id: string) => paths.product.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <MaterialFilters
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

        <MaterialSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <MaterialFiltersResult
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
    <Container maxWidth="lg">
      <Stack
        spacing={2.5}
        sx={{
          mt: 3,
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {(notFound || materialsEmpty) && renderNotFound}

      <MaterialList products={dataFiltered} loading={materialsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
  sortBy,
}: {
  inputData: IProductItem[];
  filters: IProductFilters;
  sortBy: string;
}) {
  const { gender, category, priceRange, rating } = filters;

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
  //   inputData = inputData.filter((product) => gender.includes(product.gender));
  // }

  // if (category !== "all") {
  //   inputData = inputData.filter((product) => product.category === category);
  // }

  // if (colors.length) {
  //   inputData = inputData.filter((product) =>
  //     product.colors.some((color) => colors.includes(color)),
  //   );
  // }

  if (min !== 0 || max !== 200) {
    inputData = inputData.filter(
      (product) => product.price >= min && product.price <= max,
    );
  }

  // if (rating) {
  //   inputData = inputData.filter((product) => {
  //     const convertRating = (value: string) => {
  //       if (value === "up4Star") return 4;
  //       if (value === "up3Star") return 3;
  //       if (value === "up2Star") return 2;
  //       return 1;
  //     };
  //     return product.totalRatings > convertRating(rating);
  //   });
  // }

  return inputData;
}
