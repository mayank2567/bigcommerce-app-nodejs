import {
  Panel,
  Link as StyledLink,
  TableSortDirection,
} from "@bigcommerce/big-design";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useProductList } from "../../lib/hooks";
import {
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import generate_details from "../../lib/generate_details";
import { useSession } from "../../context/session";

const Products = () => {
    const encodedContext = useSession()?.context;

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
  } = useProductList({
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    ...(columnHash && { sort: columnHash }),
    ...(columnHash && { direction: direction.toLowerCase() }),
  });
  console.log(rowSelection);
  const table = useMaterialReactTable({
    columns: [
      { accessorKey: "name", header: "Product name" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "id", header: "ID" },
    ],
    data: list,
    // enableRowSelection: true,
    getRowId: (row) => row.id, //give each row a more useful id
    onRowSelectionChange: setRowSelection, //connect internal row selection state to your own
    state: { rowSelection,pagination,sorting }, //pass our managed row selection state to the table to use
    rowCount: meta?.pagination?.total ?? 0,
    manualPagination: true,
    enableRowActions: true,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    renderRowActions: ({ row }) => [
      <Link href={`/products/${row.id}`}>
        <StyledLink><EditIcon /></StyledLink>
      </Link>,
      
    ],
  });
  async function update_using_gpt(){
    let ids = Object.keys(rowSelection);
    let ids_int = ids.map((id) => parseInt(id));
    let products_to_be_updated = list.filter((product) => ids_int.includes(product.id));
    alert(`Start updating ${products_to_be_updated.length} products`);
    generate_details('Product',products_to_be_updated, encodedContext); 
  }
  return (
    <Panel id="products">
        <Row>
            <Col align="end">
                <Button disabled = {Object.keys(rowSelection).length ? false : true}  onClick={update_using_gpt}>Generate Details</Button>     
            </Col>
        </Row>
      <MaterialReactTable table={table} />;
    </Panel>
  );
};

export default Products;
