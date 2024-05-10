import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";
// @mui
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";

// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// _mock
import { PRODUCT_STOCK_OPTIONS } from "src/_mock";
import {
  _jobs,
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from "src/_mock";
// api
import { useGetServices, useGetUserServices } from "src/api/service";
// components
import { useSettingsContext } from "src/components/settings";
import EmptyContent from "src/components/empty-content";

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
// types
import {
  IServiceItem,
  IServiceTableFilters,
  IServiceTableFilterValue,
  ITransporterServiceItem,
} from "src/types/service";
//
import ServiceTableRow from "../service-table-row";
import ServiceTableToolbar from "../service-table-toolbar";
import ServiceTableFiltersResult from "../service-table-filters-result";
import ServiceSearch from "../service-search";
import ServiceFiltersResult from "../service-filters-result";
import ServiceList from "../service-list";
import { useAuthContext } from "src/auth/hooks";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Service" },
  { id: "createdAt", label: "Create at", width: 160 },
  { id: "inventoryType", label: "Stock", width: 160 },
  { id: "price", label: "Price", width: 140 },
  // { id: "publish", label: "Publish", width: 110 },
  { id: "", width: 88 },
];

// const PUBLISH_OPTIONS = [
//   { value: "published", label: "Published" },
//   { value: "draft", label: "Draft" },
// ];

const defaultFilters: IServiceTableFilters = {
  name: "",
  // publish: [],
  stock: [],
};

// ----------------------------------------------------------------------

export default function ServiceListView() {
  const router = useRouter();

  const table = useTable();
  const { user } = useAuthContext();

  const settings = useSettingsContext();
  // type ServiceItem = IServiceItem[] | ITransporterServiceItem[];
  const [tableData, setTableData] = useState<
    (IServiceItem | ITransporterServiceItem)[]
  >([]);
  // console.log(tableData);

  const [filters, setFilters] = useState(defaultFilters);
  const [search, setSearch] = useState<{
    query: string;
    results: (IServiceItem | ITransporterServiceItem)[];
  }>({
    query: "",
    results: [],
  });

  // const { services, servicesLoading, servicesEmpty } = useGetServices();
  const { services, servicesLoading, servicesEmpty } = useGetUserServices({
    // userId: user?.id as string,
    role: user?.roles[0] as any,
  });

  const confirm = useBoolean();

  useEffect(() => {
    // console.log("Services", services);
    if (services?.length) {
      // console.log(services);

      // if services is one (if array remove square bracket)
      setTableData(services);
    }
  }, [services]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  // const notFound = (!dataFiltered.length && canReset) || servicesEmpty;
  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback(
    (name: string, value: IServiceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData],
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row?.id as string),
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router],
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.service.details(id));
    },
    [router],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = _jobs.filter(
          (job) =>
            job.title.toLowerCase().indexOf(search.query.toLowerCase()) !== -1,
        );

        // setSearch((prevState) => ({
        //   ...prevState,
        //   results,
        // }));
      }
    },
    [search.query],
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: "flex-end", sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
    >
      <ServiceSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id: string) => paths.dashboard.service.details(id)}
      />

      {/* <Stack direction="row" spacing={1} flexShrink={0}>
        <JobFilters
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
          locationOptions={countries}
          roleOptions={_roles}
          benefitOptions={JOB_BENEFIT_OPTIONS.map((option) => option.label)}
          experienceOptions={[
            "all",
            ...JOB_EXPERIENCE_OPTIONS.map((option) => option.label),
          ]}
          employmentTypeOptions={JOB_EMPLOYMENT_TYPE_OPTIONS.map(
            (option) => option.label
          )}
        />

        <JobSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={JOB_SORT_OPTIONS}
        />
      </Stack> */}
    </Stack>
  );

  const renderResults = (
    <ServiceFiltersResult
      // filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      // onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  const isTransporter = user?.roles.includes("TRANSPORTER");

  const isService = user?.roles.includes("SELLER");

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Service",
              href: paths.dashboard.service.root,
            },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.service.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Service
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {/* CARDS NEED TO BE COMPLETED */}
        <Stack
          spacing={2.5}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

        <ServiceList services={dataFiltered} />
        {/* {isTransporter && <TransporterList services={dataFiltered} />} */}

        {/* THIS IS THE TABLE FORMAT */}
        {/* <Card>
          <ServiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            stockOptions={PRODUCT_STOCK_OPTIONS}
            // publishOptions={PUBLISH_OPTIONS}
          />

          {canReset && (
            <ServiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

        {/* <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {servicesLoading ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <ServiceTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                          />
                        ))}
                    </>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
        {/* </Card> */}
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// const applyFilter = ({
//   inputData,
//   filters,
//   sortBy,
// }: {
//   inputData: IServiceItem[];
//   // comparator: (a: any, b: any) => number;
//   filters: IServiceTableFilters;
//   sortBy: string;
// }) => {
//   const { employmentTypes, experience, roles, locations, benefits } = filters;

//   // SORT BY
//   if (sortBy === 'latest') {
//     inputData = orderBy(inputData, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'oldest') {
//     inputData = orderBy(inputData, ['createdAt'], ['asc']);
//   }

//   if (sortBy === 'popular') {
//     inputData = orderBy(inputData, ['totalViews'], ['desc']);
//   }

//   // FILTERS
//   if (employmentTypes.length) {
//     inputData = inputData.filter((job) =>
//       job.employmentTypes.some((item) => employmentTypes.includes(item))
//     );
//   }

//   if (experience !== 'all') {
//     inputData = inputData.filter((job) => job.experience === experience);
//   }

//   if (roles.length) {
//     inputData = inputData.filter((job) => roles.includes(job.role));
//   }

//   if (locations.length) {
//     inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
//   }

//   if (benefits.length) {
//     inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
//   }

//   return inputData;
// };

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: (IServiceItem | ITransporterServiceItem)[];
  // (user?.roles === "SELLER") ? IServiceItem[] : ITransporterServiceItem[];

  comparator: (a: any, b: any) => number;
  filters: IServiceTableFilters;
}) {
  // const { name, stock, publish } = filters;
  const { name, stock } = filters;
  // console.log("input data", inputData);

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (service) =>
        service.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  // if (stock.length) {
  //   inputData = inputData.filter((service) =>
  //     stock.includes(service.inventoryType)
  //   );
  // }

  // if (publish.length) {
  //   inputData = inputData.filter((service) =>
  //     publish.includes(service.publish)
  //   );
  // }

  return inputData;
}
