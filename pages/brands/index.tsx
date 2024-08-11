import {
  Panel,
  Link as StyledLink,
  TableSortDirection,
} from "@bigcommerce/big-design";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useBrandList } from "../../lib/hooks";
import { Edit as EditIcon } from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import gpt_module from "../../lib/generate_details";
import { useSession } from "../../context/session";
import { ToastContainer, toast } from "react-toastify";
import { getUser } from "../../lib/hooks";
import Alert from "@mui/material/Alert";
import "react-toastify/dist/ReactToastify.css";

const Brands = () => {
  const encodedContext = useSession()?.context;
  const user = getUser();
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [columnHash, setColumnHash] = useState("");
  const [direction, setDirection] = useState<TableSortDirection>("ASC");
  const router = useRouter();
  const {
    error,
    list = [],
    meta = {},
  } = useBrandList({
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    ...(columnHash && { sort: columnHash }),
    ...(columnHash && { direction: direction.toLowerCase() }),
  });
  console.log(rowSelection);
  const table = useMaterialReactTable({
    columns: [
      { accessorKey: "name", header: "Brand name" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "id", header: "ID" },
    ],
    data: list,
    // enableRowSelection: true,
    getRowId: (row) => row.id, //give each row a more useful id
    onRowSelectionChange: setRowSelection, //connect internal row selection state to your own
    state: { rowSelection, pagination, sorting }, //pass our managed row selection state to the table to use
    rowCount: meta?.pagination?.total ?? 0,
    manualPagination: true,
    enableRowActions: true,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    renderRowActions: ({ row }) => [
      <Link href={`/brands/${row.id}`}>
        <StyledLink>
          <EditIcon />
        </StyledLink>
      </Link>,
    ],
  });
  async function update_using_gpt() {
    let ids = Object.keys(rowSelection);
    let ids_int = ids.map((id) => parseInt(id));
    let brands_to_be_updated = list.filter((brand) =>
      ids_int.includes(brand.id)
    );
    toast(`Starting to update ${brands_to_be_updated.length} brands`);
    gpt_module.generate_details("Brand", brands_to_be_updated, encodedContext);
  }
  return (
    <Panel id="brands">
      <ToastContainer />
      <Row>
        <Col></Col>
        <Col align="end">
          <Button
            disabled={
              Object.keys(rowSelection).length && user?.charCount > 0
                ? false
                : true
            }
            onClick={update_using_gpt}
          >
            Generate Details
          </Button>
        </Col>
      </Row>
      <Row>
        <Col align="start">
          {user?.charCount > 0 ? (
            <Alert severity="info">
              Remaining balace is ${user.charCount / 1000000}
            </Alert>
          ) : (
            <Alert severity="error">
              No balance remaining!!! Please recharge to genrate details
            </Alert>
          )}
        </Col>
      </Row>
      <MaterialReactTable table={table} />;
    </Panel>
  );
};

export default Brands;
