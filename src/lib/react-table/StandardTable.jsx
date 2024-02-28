import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import EmptyContent from "common/EmptyContent";
import ErrorContent from "common/ErrorContent";
import LoadingIndicator from "common/LoadingIndicator";
import TablePagination from "./Pagination";
import "./StandardTable.css";

/**
 *
 * @param {StandardTableProps} props
 */
function StandardTable(props) {
  return props.renderRoot(props.instance, props);
}

/**
 * @type {StandardTableProps}
 */
StandardTable.defaultProps = {
  variant: "default",
  header: true,
  footer: false,
  pagination: true,
  flexRender,
  renderRoot,
  renderTable,
  renderHeader,
  renderHeaderRow,
  renderHeaderCell,
  renderBody,
  renderBodyRow,
  renderBodyCell,
  renderFooter,
  renderFooterRow,
  renderFooterCell,
  renderPagination,
  renderLoading,
  renderError,
  renderEmpty,
};

export default StandardTable;

/**
 * @type {StandardTableProps['renderRoot']}
 */
function renderRoot(instance, props) {
  const {
    classes,
    loading,
    renderLoading,
    error,
    renderError,
    empty = !instance.getPaginationRowModel().rows?.length,
    renderEmpty,
    renderTable,
    pagination,
    renderPagination,
  } = props;

  // const isDefault = props.variant === "default";
  // const isAbsolute = props.variant === "absolute";
  // const isRelative = props.variant === "relative";
  const Root = props.Root || "div";

  return (
    <Root
      {...{
        ...props.RootProps,
        className: clsx(
          "StandardTable",
          props.RootProps?.className,
          classes?.root
        ),
      }}
    >
      {renderTable?.(instance, props)}
      {loading
        ? renderLoading?.(instance, props)
        : error
        ? renderError?.(instance, props)
        : empty
        ? renderEmpty?.(instance, props)
        : null}
      {pagination && renderPagination?.(instance, props)}
    </Root>
  );
}

/**
 * @type {StandardTableProps['renderTable']}
 */
function renderTable(instance, props) {
  const {
    classes,
    header,
    footer,
    loading,
    error,
    empty = !instance.getPaginationRowModel().rows?.length,
    renderHeader,
    renderBody,
    renderFooter,
  } = props;

  const isDefault = props.variant === "default";
  const Table = props.Table || (isDefault ? "table" : "div");

  const TableProps = props.TableProps?.(instance, props);

  return (
    <Table
      {...{
        ...TableProps,
        className: clsx(
          "StandardTable__table",
          TableProps?.className,
          classes?.table
        ),
        style: {
          width: instance.getTotalSize(),
          ...TableProps?.style,
        },
      }}
    >
      {TableProps?.children || (
        <>
          {header && renderHeader?.(instance, props)}
          {!(loading || error || empty) && (
            <>
              {renderBody?.(instance, props)}
              {footer && renderFooter?.(instance, props)}
            </>
          )}
        </>
      )}
    </Table>
  );
}

/**
 * @type {StandardTableProps['renderHeader']}
 */
function renderHeader(instance, props) {
  const isDefault = props.variant === "default";
  // const isAbsolute = props.variant === "absolute";
  // const isRelative = props.variant === "relative";
  const Header = props.Header || (isDefault ? "thead" : "div");
  const HeaderProps = props.HeaderProps?.(instance, props);

  return (
    <Header
      {...{
        ...HeaderProps,
        className: clsx(
          "StandardTable__table__header",
          HeaderProps?.className,
          props.classes?.header
        ),
      }}
    >
      {HeaderProps?.children ||
        instance
          .getHeaderGroups()
          .map((headerRow) =>
            props.renderHeaderRow(headerRow, instance, props)
          )}
    </Header>
  );
}

/**
 * @type {StandardTableProps['renderHeaderRow']}
 */
function renderHeaderRow(headerRow, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const HeaderRow = props.HeaderRow || (isDefault ? "tr" : "div");
  const HeaderRowProps = props.HeaderRowProps?.(headerRow, instance, props);

  return (
    <HeaderRow
      {...{
        key: headerRow.id,
        ...HeaderRowProps,
        className: clsx(
          "StandardTable__table__header__row",
          props.classes?.headerRow,
          HeaderRowProps?.className,
          isRelative && "StandardTable__table__header__row--relative",
          isAbsolute && "StandardTable__table__header__row--absolute"
        ),
      }}
    >
      {HeaderRowProps?.children ||
        headerRow.headers.map((headerCell) =>
          props.renderHeaderCell(headerCell, instance, props)
        )}
    </HeaderRow>
  );
}

/**
 * @type {StandardTableProps['renderHeaderCell']}
 */
function renderHeaderCell(headerCell, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const HeaderCell = props.HeaderCell || (isDefault ? "th" : "div");
  const HeaderCellProps = props.HeaderCellProps?.(headerCell, instance, props);

  return (
    <HeaderCell
      {...{
        key: headerCell.id,
        colSpan: headerCell.colSpan,
        ...HeaderCellProps,
        className: clsx(
          "StandardTable__table__header__row__cell",
          props.classes?.headerCell,
          HeaderCellProps?.className,
          isRelative && "StandardTable__table__header__row__cell--relative",
          isAbsolute && "StandardTable__table__header__row__cell--absolute"
        ),
        style: {
          width: headerCell.getSize(),
          ...(isAbsolute ? { left: headerCell.getStart() } : {}),
          ...HeaderCellProps?.style,
        },
      }}
    >
      {HeaderCellProps?.children || (
        <>
          {headerCell.isPlaceholder
            ? null
            : props.flexRender(
                headerCell.column.columnDef.header,
                headerCell.getContext()
              )}
          <div
            {...{
              onMouseDown: headerCell.getResizeHandler(),
              onTouchStart: headerCell.getResizeHandler(),
              className: `StandardTable__resizer ${
                headerCell.column.getIsResizing()
                  ? "StandardTable__resizing"
                  : ""
              }`,
              style: {
                transform:
                  instance.options.columnResizeMode === "onEnd" &&
                  headerCell.column.getIsResizing()
                    ? `translateX(${
                        instance.getState().columnSizingInfo.deltaOffset
                      }px)`
                    : "",
              },
            }}
          />
        </>
      )}
    </HeaderCell>
  );
}

/**
 * @type {StandardTableProps['renderBody']}
 */
function renderBody(instance, props) {
  const isDefault = props.variant === "default";
  // const isAbsolute = props.variant === "absolute";
  // const isRelative = props.variant === "relative";
  const Body = props.Body || (isDefault ? "tbody" : "div");
  const BodyProps = props.BodyProps?.(instance, props);

  return (
    <Body
      {...{
        ...BodyProps,
        className: clsx(
          "StandardTable__table__body",
          BodyProps?.className,
          props.classes?.body
        ),
      }}
    >
      {BodyProps?.children ||
        instance
          .getPaginationRowModel()
          .rows.map((bodyRow) => props.renderBodyRow(bodyRow, instance, props))}
    </Body>
  );
}

/**
 * @type {StandardTableProps['renderBodyRow']}
 */
function renderBodyRow(bodyRow, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const BodyRow = props.BodyRow || (isDefault ? "tr" : "div");
  const BodyRowProps = props.BodyRowProps?.(bodyRow, instance, props);

  return (
    <BodyRow
      {...{
        key: bodyRow.id,
        ...BodyRowProps,
        className: clsx(
          "StandardTable__table__body__row w-full",
          BodyRowProps?.className,
          props.classes?.row,
          isRelative && "StandardTable__table__body__row--relative",
          isAbsolute && "StandardTable__table__body__row--absolute"
        ),
      }}
    >
      {BodyRowProps?.children ||
        bodyRow
          .getVisibleCells()
          .map((bodyCell) => props.renderBodyCell(bodyCell, instance, props))}
    </BodyRow>
  );
}

/**
 * @type {StandardTableProps['renderBodyCell']}
 */
function renderBodyCell(bodyCell, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const Cell = props.Cell || (isDefault ? "td" : "div");
  const BodyCellProps = props.BodyCellProps?.(bodyCell, instance, props);

  return (
    <Cell
      {...{
        key: bodyCell.id,
        ...BodyCellProps,
        style: {
          width: bodyCell.column.getSize(),
          ...(isAbsolute ? { left: bodyCell.column.getStart() } : {}),
          ...BodyCellProps?.style,
        },
        className: clsx(
          "StandardTable__table__body__row__cell",
          BodyCellProps?.className,
          props.classes?.cell,
          isRelative && "StandardTable__table__body__row__cell--relative",
          isAbsolute && "StandardTable__table__body__row__cell--absolute"
        ),
      }}
    >
      {BodyCellProps?.children ||
        props.flexRender(bodyCell.column.columnDef.cell, bodyCell.getContext())}
    </Cell>
  );
}

/**
 * @type {StandardTableProps['renderFooter']}
 */
function renderFooter(instance, props) {
  const isDefault = props.variant === "default";
  // const isAbsolute = props.variant === "absolute";
  // const isRelative = props.variant === "relative";
  const Footer = props.Footer || (isDefault ? "tfoot" : "div");
  const FooterProps = props.FooterProps?.(instance, props);

  return (
    <Footer
      {...{
        ...FooterProps,
        className: clsx(
          "StandardTable__table__footer",
          FooterProps?.className,
          props.classes?.footer
        ),
      }}
    >
      {FooterProps?.children ||
        instance
          .getFooterGroups()
          .map((footerRow) =>
            props.renderFooterRow(footerRow, instance, props)
          )}
    </Footer>
  );
}

/**
 * @type {StandardTableProps['renderFooterRow']}
 */
function renderFooterRow(footerRow, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const FooterRow = props.FooterRow || (isDefault ? "tr" : "div");
  const FooterRowProps = props.FooterRowProps?.(footerRow, instance, props);

  return (
    <FooterRow
      {...{
        key: footerRow.id,
        ...FooterRowProps,
        className: clsx(
          "StandardTable__table__footer__row",
          FooterRowProps?.className,
          props.classes?.footerRow,
          isRelative && "StandardTable__table__footer__row--relative",
          isAbsolute && "StandardTable__table__footer__row--absolute"
        ),
      }}
    >
      {FooterRowProps?.children ||
        footerRow.headers.map((footerCell) =>
          props.renderFooterCell(footerCell, instance, props)
        )}
    </FooterRow>
  );
}

/**
 * @type {StandardTableProps['renderFooterCell']}
 */
function renderFooterCell(footerCell, instance, props) {
  const isDefault = props.variant === "default";
  const isAbsolute = props.variant === "absolute";
  const isRelative = props.variant === "relative";
  const FooterCell = props.FooterCell || (isDefault ? "th" : "div");
  const FooterCellProps = props.FooterCellProps?.(footerCell, instance, props);

  return (
    <FooterCell
      {...{
        key: footerCell.id,
        colSpan: footerCell.colSpan,
        ...FooterCellProps,
        className: clsx(
          "StandardTable__table__footer__row__cell",
          FooterCellProps?.className,
          props.classes?.footerCell,
          isRelative && "StandardTable__table__footer__row__cell--relative",
          isAbsolute && "StandardTable__table__footer__row__cell--absolute"
        ),
        style: {
          width: footerCell.getSize(),
          ...(isAbsolute ? { left: footerCell.getStart() } : {}),
          ...FooterCellProps?.style,
        },
      }}
    >
      {FooterCellProps?.children || (
        <>
          {footerCell.isPlaceholder
            ? null
            : props.flexRender(
                footerCell.column.columnDef.footer,
                footerCell.getContext()
              )}
        </>
      )}
    </FooterCell>
  );
}

/**
 * @type {StandardTableProps['renderPagination']}
 */
function renderPagination(instance, props) {
  const Pagination = props.Pagination || "div";
  const PaginationProps = props.PaginationProps?.(instance, props);

  return (
    <Pagination
      {...{
        ...PaginationProps,
        className: clsx(
          "StandardTable__pagination",
          PaginationProps?.className,
          props.classes?.pagination
        ),
      }}
    >
      {PaginationProps?.children || <TablePagination instance={instance} />}
    </Pagination>
  );
}

/**
 * @type {StandardTableProps['renderLoading']}
 */
function renderLoading(instance, props) {
  const Loading = props.Loading || "div";
  const LoadingProps = props.LoadingProps?.(instance, props);

  return (
    <Loading
      {...{
        ...LoadingProps,
        className: clsx(
          "StandardTable__loading",
          LoadingProps?.className,
          props.classes?.loading
        ),
      }}
    >
      {LoadingProps?.children || <LoadingIndicator />}
    </Loading>
  );
}

/**
 * @type {StandardTableProps['renderError']}
 */
function renderError(instance, props) {
  const Error = props.Error || "div";
  const ErrorProps = props.ErrorProps?.(instance, props);

  return (
    <Error
      {...{
        ...ErrorProps,
        className: clsx(
          "StandardTable__error",
          ErrorProps?.className,
          props.classes?.error
        ),
      }}
    >
      {ErrorProps?.children || <ErrorContent onTryAgain={props.onReload} />}
    </Error>
  );
}

/**
 * @type {StandardTableProps['renderEmpty']}
 */
function renderEmpty(instance, props) {
  const Empty = props.Empty || "div";
  const EmptyProps = props.EmptyProps?.(instance, props);

  return (
    <Empty
      {...{
        ...EmptyProps,
        className: clsx(
          "StandardTable__empty",
          EmptyProps?.className,
          props.classes?.empty
        ),
      }}
    >
      {EmptyProps?.children || <EmptyContent />}
    </Empty>
  );
}

/**
 * @typedef {import("@tanstack/react-table").Table<any>} Table
 */

/**
 * @typedef {import("react").ReactNode} ReactNode
 */

/**
 * @typedef  {{
 * type: "standard",
 * variant: "default" | "absolute" | "relative"
 * instance: Table
 * classes: {[P in 'root' | 'table' | 'header' | 'headerRow' | 'headerCell' | 'body' | 'footer']: string};
 * flexRender: Function;
 * onReload: Function;
 * Root: any;
 * RootProps: (instance: Table, props: StandardTableProps) => any;
 * renderRoot: (instance: Table, props: StandardTableProps) => ReactNode;
 * Table: any;
 * TableProps: (instance: Table, props: StandardTableProps) => any;
 * renderTable: (instance: Table, props: StandardTableProps) => ReactNode;
 * header: boolean;
 * Header: any;
 * HeaderProps: (instance: Table, props: StandardTableProps) => any;
 * renderHeader: (instance: Table, props: StandardTableProps) => ReactNode;
 * HeaderRow: any;
 * HeaderRowProps: (headerRow: import("@tanstack/react-table").HeaderGroup, instance: Table, props: StandardTableProps) => any;
 * renderHeaderRow: (headerRow: import("@tanstack/react-table").HeaderGroup, instance: Table, props: StandardTableProps) => ReactNode;
 * HeaderCell: any;
 * HeaderCellProps: (headerCell: import("@tanstack/react-table").Header<any, any>, instance: Table, props: StandardTableProps) => any;
 * renderHeaderCell: (headerCell: import("@tanstack/react-table").Header<any, any>, instance: Table, props: StandardTableProps) => ReactNode;
 * Body: any;
 * BodyProps: (instance: Table, props: StandardTableProps) => any;
 * renderBody: (instance: Table, props: StandardTableProps) => ReactNode;
 * BodyRow: any;
 * BodyRowProps: (bodyRow: import("@tanstack/react-table").Row, instance: Table, props: StandardTableProps) => any;
 * renderBodyRow: (bodyRow: import("@tanstack/react-table").Row, instance: Table, props: StandardTableProps) => ReactNode;
 * BodyCell: any;
 * BodyCellProps: (bodyCell: import("@tanstack/react-table").Cell, instance: Table, props: StandardTableProps) => any;
 * renderBodyCell: (bodyCell: import("@tanstack/react-table").Cell, instance: Table, props: StandardTableProps) => ReactNode;
 * footer: boolean;
 * Footer: any;
 * FooterProps: (instance: Table, props: StandardTableProps) => any;
 * renderFooter: (instance: Table, props: StandardTableProps) => ReactNode;
 * FooterRow: any;
 * FooterRowProps: (footerRow: import("@tanstack/react-table").HeaderGroup, instance: Table, props: StandardTableProps) => any;
 * renderFooterRow: (footerRow: import("@tanstack/react-table").HeaderGroup, instance: Table, props: StandardTableProps) => ReactNode;
 * FooterCell: any;
 * FooterCellProps: (footerCell: import("@tanstack/react-table").Header<any, any>, instance: Table, props: StandardTableProps) => any;
 * renderFooterCell: (footerCell: import("@tanstack/react-table").Header<any, any>, instance: Table, props: StandardTableProps) => ReactNode;
 * pagination: boolean;
 * Pagination: any;
 * PaginationProps: (instance: Table, props: StandardTableProps)  => any;
 * renderPagination: (instance: Table, props: StandardTableProps)  => ReactNode;
 * loading: boolean;
 * Loading: any;
 * LoadingProps: (instance: Table, props: StandardTableProps)  => any;
 * renderLoading: (instance: Table, props: StandardTableProps)  => ReactNode;
 * error: boolean;
 * Error: any;
 * ErrorProps: (instance: Table, props: StandardTableProps)  => any;
 * renderError: (instance: Table, props: StandardTableProps)  => ReactNode;
 * empty: boolean;
 * Empty: any;
 * EmptyProps: (instance: Table, props: StandardTableProps)  => any;
 * renderEmpty: (instance: Table, props: StandardTableProps)  => ReactNode;
 * }} StandardTableProps
 */
