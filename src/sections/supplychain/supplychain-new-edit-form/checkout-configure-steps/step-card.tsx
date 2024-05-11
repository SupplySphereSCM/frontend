// @mui
import Table from "@mui/material/Table";
import Avatar from "@mui/material/Avatar";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";
// utils
import { fCurrency } from "src/utils/format-number";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";
import {
  ISupplyChainSchema,
  ISupplyChainStepItem,
} from "src/types/supplychain";

// ----------------------------------------------------------------------

type RowProps = {
  from: string;
  to: string;
  transport: string;
  stepType: string;
  rawMaterial: string;
  service: string;
  product: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: ISupplyChainStepItem[];
  tableLabels: any;
}

export default function SupplychainStepsTable({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row: ISupplyChainStepItem) => (
                <SupplychainStepsTableRow key={row.from} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type SupplychainStepsTableRowProps = {
  row: RowProps;
};

function SupplychainStepsTableRow({ row }: SupplychainStepsTableRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        {row.from}
      </TableCell>

      <TableCell>{row.to}</TableCell>

      <TableCell align="center">{row.transport}</TableCell>

      <TableCell align="right">{row.rawMaterial}</TableCell>
      <TableCell align="right">{row.service}</TableCell>
      <TableCell align="right">{row.stepType}</TableCell>
    </TableRow>
  );
}