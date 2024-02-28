import StandardTable from "./StandardTable";
import GridTable from "./GridTable";
import TreeTable from "./TreeTable";

/**
 * @param {TableProps} props
 */
function Table(props) {
  const { type, ...rest } = props;
  if (!props.instance) return null;

  if (type === "grid") {
    return <GridTable {...rest} />;
  }

  if (type === "tree") {
    return <TreeTable {...rest} />;
  }

  return <StandardTable {...rest} />;
}

/**
 * @type {TableProps}
 */
Table.defaultProps = {
  type: "standard",
};

export default Table;

/**
 * @typedef {import("./StandardTable").StandardTableProps | import("./GridTable").GridTableProps | import("./TreeTable").TreeTableProps} TableProps
 */
