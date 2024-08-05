import {
    Panel,
    Link as StyledLink,
    TableSortDirection,
  } from "@bigcommerce/big-design";
  import Link from "next/link";
  import { useRouter } from "next/router";
  import { useState } from "react";
  import { usecategoryList } from "../../lib/hooks";
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
  
  const Categories = () => {
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
    } = usecategoryList({
      page: String(pagination.pageIndex + 1),
      limit: String(pagination.pageSize),
      ...(columnHash && { sort: columnHash }),
      ...(columnHash && { direction: direction.toLowerCase() }),
    });
    console.log(rowSelection);
    const table = useMaterialReactTable({
      columns: [
        { accessorKey: "name", header: "Category name" },
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
        <Link href={`/categories/${row.id}`}>
          <StyledLink><EditIcon /></StyledLink>
        </Link>,
        
      ],
    });
    async function update_using_gpt(){
      let ids = Object.keys(rowSelection);
      let ids_int = ids.map((id) => parseInt(id));
      let brands_to_be_updated = list.filter((brand) => ids_int.includes(brand.id));
      alert(`Start updating ${brands_to_be_updated.length} categories`);
      generate_details('Category',brands_to_be_updated, encodedContext); 
    }
    return (
      <Panel id="categories">
          <Row>
              <Col align="end">
                  <Button disabled = {Object.keys(rowSelection).length ? false : true}  onClick={update_using_gpt}>Generate Details</Button>     
              </Col>
          </Row>
        <MaterialReactTable table={table} />;
      </Panel>
    );
  };
  
  export default Categories;
  