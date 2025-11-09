import React from "https://cdn.skypack.dev/react@18.2.0";
import ReactDOM from "https://cdn.skypack.dev/react-dom@18.2.0";
import useSWRInfinite from "https://cdn.skypack.dev/swr/infinite";
import { SWRConfig } from "https://cdn.skypack.dev/swr";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel,
  createColumnHelper,
} from "https://cdn.skypack.dev/@tanstack/react-table";

const getNestedValue = (obj, path, defaultValue = []) => {
  if (!path || typeof path !== "string" || !obj) {
    return defaultValue;
  }
  const pathArray = path
    .replace(/\[/g, ".")
    .replace(/\]/g, "")
    .split(".")
    .filter(Boolean);
  const result = pathArray.reduce((acc, key) => acc?.[key], obj);
  return result === undefined ? defaultValue : result;
};

const columnHelper = createColumnHelper();

export const formatDateString = (inputDate, displayStyle = "dayMonthYear") => {
  const dateObj = new Date(inputDate);
  if (isNaN(dateObj.getTime())) {
    return String(inputDate);
  }
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const hour = dateObj.getHours().toString().padStart(2, "0");
  const minute = dateObj.getMinutes().toString().padStart(2, "0");

  switch (displayStyle) {
    case "dayMonthTime":
      // Example: 07.06. 14:30
      return `${day}.${month}. ${hour}:${minute}`;
    case "dayMonthYear":
      // Example: 07.06.2024
      return `${day}.${month}.${year}`;
    case "dayMonthYearTime":
      // Example: 07.06.2024 14:30
      return `${day}.${month}.${year} ${hour}:${minute}`;
    case "timeOnly":
      // Example: 14:30
      return `${hour}:${minute}`;
    case "isoDate":
      // Example: 2024-06-07
      return `${year}-${month}-${day}`;
    case "fullDateTime":
    default:
      // Example: 07.06.2024 14:30
      return `${day}.${month}.${year} ${hour}:${minute}`;
  }
};

const getT =
  (translations, defaultTranslations) =>
  (key, replacements = {}) => {
    const template = translations?.[key] ?? defaultTranslations[key];
    if (!template) {
      return key;
    }
    return Object.entries(replacements).reduce(
      (acc, [placeholder, value]) =>
        acc.replace(`{${placeholder}}`, String(value)),
      template
    );
  };

const getCommonPinningStyles = (column) => {
  const isPinned = column.getIsPinned();
  const borderColor = "var(--border-color, #E5E7EB)";

  const styles = {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    backgroundColor: isPinned ? "inherit" : "transparent",
    position: isPinned ? "sticky" : "relative",
    zIndex: isPinned ? 10 : 0,
  };

  if (isPinned === "left") {
    styles.borderRight = `1px solid ${borderColor}`;
  }

  if (isPinned === "right") {
    styles.borderLeft = `1px solid ${borderColor}`;
  }

  return styles;
};

const SortingIcon = ({ sorting }) => {
  switch (sorting) {
    case "asc":
      return (
        <span
          style={{ fontSize: "16px", color: "#000" }}
          className="icon icon-arrow-up "
        />
      );
    case "desc":
      return (
        <span
          style={{ fontSize: "16px", color: "#000" }}
          className="icon icon-arrow-down "
        />
      );
    default:
      return (
        <span
          style={{ fontSize: "16px", color: "#000" }}
          className="icon icon-arrow-up-down "
        />
      );
  }
};

const TableFilters = ({ column, t }) => {
  const { filterVariant, headerText: metaHeaderText } =
    column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();
  const header = column.columnDef.header;
  const headerText =
    metaHeaderText || (typeof header === "string" ? header : column.id);

  if (!filterVariant) return null;

  // Generate a unique ID for linking label and input
  const filterId = `filter-${column.id}`;

  const renderFilter = () => {
    switch (filterVariant) {
      case "text":
        return (
          <TableFilterText
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "number":
        return (
          <TableFilterNumber
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "enum":
        return (
          <TableFilterEnum
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "bool":
        return (
          <TableFilterBoolean
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "id":
        return (
          <TableFilterText
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "date":
        return (
          <TableFilterDate
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      case "currency":
        return (
          <TableFilterNumber
            column={column}
            columnFilterValue={columnFilterValue}
            filterId={filterId}
            headerText={headerText}
            t={t}
          />
        );
      default:
        return null;
    }
  };

  return <div className="form-control">{renderFilter()}</div>;
};

const TableFilterDate = ({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}) => {
  const fromId = `${filterId}-from`;
  const toId = `${filterId}-to`;
  const fromValue =
    typeof columnFilterValue === "object" && columnFilterValue !== null
      ? columnFilterValue.from
      : "";
  const toValue =
    typeof columnFilterValue === "object" && columnFilterValue !== null
      ? columnFilterValue.to
      : "";

  return (
    <div className="flex items-center gap-2">
      <input
        id={fromId}
        type="date"
        value={fromValue ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => {
            const newFrom = e.target.value || undefined;
            if (typeof old === "object" && old !== null) {
              return { ...old, from: newFrom };
            }
            return { from: newFrom };
          })
        }
        aria-label={t("dateFromAriaLabel", { headerText })}
        className="input input-bordered w-full max-w-xs"
      />
      <span>-</span>
      <input
        id={toId}
        type="date"
        value={toValue ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => {
            const newTo = e.target.value || undefined;
            if (typeof old === "object" && old !== null) {
              return { ...old, to: newTo };
            }
            return { to: newTo };
          })
        }
        aria-label={t("dateToAriaLabel", { headerText })}
        className="input input-bordered w-full max-w-xs"
      />
    </div>
  );
};

const TableFilterBoolean = ({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}) => {
  return (
    <select
      id={filterId}
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={t("filterPlaceholder", { headerText })}
      aria-label={t("filterAriaLabel", { headerText })}
      className="select select-bordered w-full max-w-xs"
    >
      <option value="">{t("all")}</option>
      <option value={true}>{t("true")}</option>
      <option value={false}>{t("false")}</option>
    </select>
  );
};

const TableFilterText = ({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}) => {
  return (
    <input
      id={filterId}
      type="text"
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={t("filterPlaceholder", { headerText })}
      aria-label={t("filterAriaLabel", { headerText })}
      className="input input-bordered w-full max-w-xs"
    />
  );
};

const TableFilterEnum = ({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}) => {
  const options = column.columnDef.meta?.options || [];
  const currentValue =
    typeof columnFilterValue === "object" && columnFilterValue !== null
      ? columnFilterValue.eq
      : columnFilterValue;

  return (
    <select
      id={filterId}
      value={currentValue ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        column.setFilterValue(val || undefined);
      }}
      aria-label={t("filterAriaLabel", { headerText })}
      className="select select-bordered w-full max-w-xs"
    >
      <option value="">{t("all")}</option>
      {options.map((option) => (
        <option key={option?.value} value={option?.value}>
          {option?.title}
        </option>
      ))}
    </select>
  );
};

const TableFilterNumber = ({
  column,
  columnFilterValue,
  filterId,
  headerText,
  t,
}) => {
  const minId = `${filterId}-min`;
  const maxId = `${filterId}-max`;
  const { minOptions = [], maxOptions = [] } = column.columnDef.meta ?? {};

  return (
    <div className="flex items-center gap-2">
      <select
        id={minId}
        placeholder={t("min")}
        onChange={(e) =>
          column.setFilterValue((old = {}) => ({
            ...old,
            min: e.target.value ? Number(e.target.value) : undefined,
          }))
        }
        value={columnFilterValue?.min ?? ""}
        aria-label={t("numberMinAriaLabel", { headerText })}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="">{t("all")}</option>
        {minOptions.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <span>-</span>
      <select
        id={maxId}
        placeholder={t("max")}
        onChange={(e) =>
          column.setFilterValue((old = {}) => ({
            ...old,
            max: e.target.value ? Number(e.target.value) : undefined,
          }))
        }
        value={columnFilterValue?.max ?? ""}
        aria-label={t("numberMaxAriaLabel", { headerText })}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="">{t("all")}</option>
        {maxOptions.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

const Pagination = ({ table, t }) => (
  <div className="flex items-center justify-center flex-wrap gap-4 py-2 px-4 bg-base-100 rounded-b-lg border-t border-base-300 w-full">
    <div className="join rounded-md overflow-hidden">
      <button
        className="join-item btn btn-sm btn-ghost disabled:opacity-50"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        aria-label={t("goToFirstPage")}
      >
        <span className="icon icon-chevron-first"></span>
      </button>
      <button
        className="join-item btn btn-sm btn-ghost disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label={t("goToPreviousPage")}
      >
        <span className="icon icon-chevron-left"></span>
      </button>
      <div className="flex text-sm items-center gap-1 px-2">
        <span>{table.getState().pagination.pageIndex + 1}</span>
        <span>/ {table.getPageCount()}</span>
      </div>
      <button
        className="join-item btn btn-sm btn-ghost disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label={t("goToNextPage")}
      >
        <span className="icon icon-chevron-right"></span>
      </button>
      <button
        className="join-item btn btn-sm btn-ghost disabled:opacity-50"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        aria-label={t("goToLastPage")}
      >
        <span className="icon icon-chevron-last"></span>
      </button>
    </div>
  </div>
);

function App() {
  const stableEmptyObject = React.useMemo(() => ({}), []);
  const stableEmptyArray = React.useMemo(() => [], []);
  const model = appsmith.model || stableEmptyObject;

  const {
    pagination: paginationProps = stableEmptyObject,
    dataKey,
    schema = stableEmptyObject,
    rowActions = stableEmptyArray,
    rowSelectionAction = "",
    actionColumn = stableEmptyObject,
    rowIndexColumn = stableEmptyObject,
    colors = stableEmptyObject,
    showBorder = true,
    rowStyleRules = stableEmptyArray,
    translations = stableEmptyObject,
    url,
    method,
    headers,
    bodyData,
  } = model;

  const { enable: enablePagination = false, pageSize = 20 } = paginationProps;
  const { pin: actionPin, size: actionSize } = actionColumn;
  const { pin: rowIndexPin = null, size: rowIndexSize = "xs" } = rowIndexColumn;

  const [isErrored, setIsErrored] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowPinning, setRowPinning] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openDropdownRowId, setOpenDropdownRowId] = React.useState(null);

  const defaultTranslations = {
    all: "All",
    min: "Min",
    max: "Max",
    filterPlaceholder: "Filter {headerText}...",
    filterAriaLabel: "Filter by {headerText}",
    true: "True",
    false: "False",
    dateFromAriaLabel: "From {headerText}",
    dateToAriaLabel: "To {headerText}",
    numberMinAriaLabel: "Minimum {headerText}",
    numberMaxAriaLabel: "Maximum {headerText}",
    goToFirstPage: "Go to first page",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    goToLastPage: "Go to last page",
    error: "Error:",
    noData: "No data to display",
    pinRow: "Pin row",
    unpinRow: "Unpin row",
    pinToTop: "Pin to top",
    pinToBottom: "Pin to bottom",
  };

  const t = React.useCallback(getT(translations, defaultTranslations), [
    translations,
  ]);

  const themeStyles = React.useMemo(
    () => ({
      "--even-row-bg": colors.evenRowColor || "#FFFFFF",
      "--odd-row-bg": colors.oddRowColor || "#F3F4F6",
      "--row-hover-bg": colors.rowHoverColor || "#E5E7EB",
      "--border-color": colors.borderColor || "#E5E7EB",
    }),
    [colors]
  );

  const borderStyle = showBorder
    ? {
        borderBottom: "1px solid var(--border-color)",
        borderRight: "1px solid var(--border-color)",
      }
    : {};

  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const getConditionalRowStyle = React.useCallback(
    (row) => {
      if (!rowStyleRules || rowStyleRules.length === 0) {
        return {};
      }

      const rowData = row.original;

      for (const rule of rowStyleRules) {
        const { column, operator, value, color } = rule;
        if (!column || !operator || !color) continue;

        const cellValue = getNestedValue(rowData, column);
        if (cellValue === undefined) continue;

        let conditionMet = false;
        const numCellValue = parseFloat(cellValue);
        const numValue = parseFloat(value);

        switch (operator) {
          case ">":
            conditionMet =
              !isNaN(numCellValue) &&
              !isNaN(numValue) &&
              numCellValue > numValue;
            break;
          case "<":
            conditionMet =
              !isNaN(numCellValue) &&
              !isNaN(numValue) &&
              numCellValue < numValue;
            break;
          case ">=":
            conditionMet =
              !isNaN(numCellValue) &&
              !isNaN(numValue) &&
              numCellValue >= numValue;
            break;
          case "<=":
            conditionMet =
              !isNaN(numCellValue) &&
              !isNaN(numValue) &&
              numCellValue <= numValue;
            break;
          case "===":
            conditionMet = cellValue === value;
            break;
          case "==":
            conditionMet = cellValue == value;
            break;
          case "!==":
            conditionMet = cellValue !== value;
            break;
          case "!=":
            conditionMet = cellValue != value;
            break;
          case "contains":
            conditionMet = String(cellValue)
              .toLowerCase()
              .includes(String(value).toLowerCase());
            break;
          case "startsWith":
            conditionMet = String(cellValue)
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
            break;
          case "endsWith":
            conditionMet = String(cellValue)
              .toLowerCase()
              .endsWith(String(value).toLowerCase());
            break;
          case "isEmpty":
            conditionMet =
              cellValue === null || cellValue === undefined || cellValue === "";
            break;
          case "isNotEmpty":
            conditionMet =
              cellValue !== null && cellValue !== undefined && cellValue !== "";
            break;
        }

        if (conditionMet) {
          return { backgroundColor: color };
        }
      }

      return {};
    },
    [rowStyleRules]
  );

  const getInitialPinning = React.useCallback(() => {
    const left = [];
    const right = [];

    if (schema && typeof schema === "object") {
      for (const colKey in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, colKey)) {
          const colSchema = schema[colKey];
          if (colSchema && colSchema.pin === "left") {
            left.push(colKey);
          } else if (colSchema && colSchema.pin === "right") {
            right.push(colKey);
          }
        }
      }
    }
    if (rowActions.length > 0) {
      if (actionPin === "left") {
        left.push("actions");
      } else if (actionPin === "right") {
        right.push("actions");
      }
    }
    return { left, right };
  }, [schema, rowActions, actionPin]);

  const [columnPinning, setColumnPinning] = React.useState(getInitialPinning());
  React.useEffect(() => {
    setColumnPinning(getInitialPinning());
  }, [getInitialPinning]);

  const { enable: enableRowPinning = true } = model.rowPinning || {};

  // data for pagination
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (!enablePagination || !url) return;
    const fetchData = async () => {
      console.log("fetching data", isErrored);
      if (isErrored) return;
      try {
        const response = await fetch(url, {
          method: method,
          headers: headers,
          body:
            method === "GET"
              ? undefined
              : JSON.stringify(bodyData) || undefined,
        });

        const json = await response.json();
        // Optional safety check
        const resultSet = getNestedValue(json, dataKey, []);
        console.log("resultSet", resultSet);
        setData(resultSet); // Set only the array you need for your table
      } catch (error) {
        setIsErrored(true);
        console.error(error);
      }
    };
    fetchData();
  }, [url, enablePagination, dataKey, method, headers, bodyData, isErrored]);

  const getKey = (pageIndex, previousPageData) => {
    if (enablePagination || !url) return null;
    if (previousPageData && !previousPageData.length) return null;

    const offset = pageIndex * pageSize;
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.set("offset", offset);
    urlWithParams.searchParams.set("limit", pageSize);

    // Apply filters for server-side filtering when infinite scroll is enabled
    columnFilters.forEach((filter) => {
      const { id, value } = filter;
      if (value !== undefined && value !== null && value !== "") {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // For range filters (date, number)
          Object.entries(value).forEach(([key, val]) => {
            if (val !== undefined && val !== "") {
              // Creates query params like: `amount[min]=10&amount[max]=100`
              urlWithParams.searchParams.set(`${id}[${key}]`, String(val));
            }
          });
        } else {
          // This block IS executed because 'female' is a string
          urlWithParams.searchParams.set(id, String(value));
        }
      }
    });

    return urlWithParams.toString();
  };

  const fetcher = async (fetchUrl) => {
    if (isErrored) return [];

    try {
      const response = await fetch(fetchUrl, {
        method: method,
        headers: headers,
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        const error = new Error(
          errorData.message || "An unknown error occurred"
        );
        setIsErrored(true);
        throw error;
      }
      const json = await response.json();
      console.log("API full response:", json);

      // ✅ Directly access result set
      const resultSet = getNestedValue(json, dataKey, []);
      console.log("Extracted resultSet:", resultSet);

      return resultSet;
    } catch (error) {
      setIsErrored(true);
      console.error(error);
      return [];
    }
  };

  const {
    data: infiniteQueryData,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher);

  const isError = !!error;

  const tableData = React.useMemo(
    () => (enablePagination ? data : infiniteQueryData?.flat() ?? []),
    [enablePagination, data, infiniteQueryData]
  );

  React.useEffect(() => {
    appsmith.updateModel({ data: tableData });
  }, [tableData]);

  const isFetchingNextPage = isValidating;
  const hasNextPage = infiniteQueryData
    ? infiniteQueryData[infiniteQueryData.length - 1]?.length ===
      pagination.pageSize
    : false;

  const handleAction = (e, eventName, row) => {
    e.stopPropagation();
    appsmith.triggerEvent(eventName, { row });
    setOpenDropdownRowId(null);
    console.log("Action clicked for row id:", row.id);
  };

  const columns = React.useMemo(() => {
    if (!tableData.length) return [];
    console.log("data", tableData);

    const indexColumns = [];
    if (rowIndexColumn?.enable) {
      indexColumns.push(
        columnHelper.display({
          id: "#",
          header: "#",
          pin: rowIndexPin,
          size:
            {
              xs: 40,
              sm: 80,
              md: 120,
              lg: 200,
            }[rowIndexSize] || 40,
          cell: ({ row, table }) => {
            const { pageIndex, pageSize } = table.getState().pagination;
            const index = enablePagination
              ? pageIndex * pageSize + row.index + 1
              : row.index + 1;
            return index;
          },
          meta: {
            textAlign: "center",
          },
        })
      );
    }

    const pinColumn = [];
    if (enableRowPinning) {
      pinColumn.push(
        columnHelper.display({
          id: "pin",
          header: t("pinRow"),
          size: 60,
          cell: ({ row }) => (
            <div
              style={{ display: "flex", gap: "4px", justifyContent: "center" }}
            >
              {row.getIsPinned() ? (
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => row.pin(false)}
                  title={t("unpinRow")}
                >
                  <span className="icon icon-close"></span>
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => row.pin("top")}
                    title={t("pinToTop")}
                  >
                    <span className="icon icon-arrow-up-thick"></span>
                  </button>
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => row.pin("bottom")}
                    title={t("pinToBottom")}
                  >
                    <span className="icon icon-arrow-down-thick"></span>
                  </button>
                </>
              )}
            </div>
          ),
          meta: {
            textAlign: "center",
          },
        })
      );
    }

    const autoCols = Object.keys(tableData[0])
      .map((colKey) => {
        if (!schema[colKey]) {
          console.warn(`Column "${colKey}" not found in schema, skipping.`);
          return null;
        }
        const {
          type,
          options,
          sort = false,
          filter = false,
          pin = null,
          size = "md",
          textAlign = "left",
          cellPadding = 8,
          title,
          dateFormat = "dayMonthYear",
        } = schema[colKey];
        const headerString =
          title || colKey.charAt(0).toUpperCase() + colKey.slice(1);

        const colDef = {
          accessorKey: colKey,
          header: headerString,
          cell: (info) => String(info.getValue()),
          meta: {
            filterVariant: filter ? type : null,
            headerText: headerString,
            size: size,
            textAlign,
            cellPadding,
          },
          enableSorting: sort,
          enableColumnFilter: filter,
          size:
            {
              xs: 40,
              sm: 80,
              md: 120,
              lg: 200,
            }[size] || 120,
        };

        // Add pinning if specified
        if (pin === "left" || pin === "right") {
          colDef.pin = pin;
        }

        if (type === "text" || type === "id" || type === "phone") {
          colDef.filterFn = (row, id, value) => {
            const rowValue = row.getValue(id);
            return (
              rowValue != null &&
              String(rowValue)
                .toLowerCase()
                .includes(String(value).toLowerCase())
            );
          };
        }

        if (type === "date") {
          colDef.cell = (info) => {
            const value = info.getValue();
            if (!value) return "";
            return formatDateString(value, dateFormat);
          };

          colDef.filterFn = (row, id, value) => {
            const { from, to } = value || {};
            if (!from && !to) return true;

            const rowValue = row.getValue(id);
            if (!rowValue) return false;

            const date = new Date(rowValue);
            if (isNaN(date.getTime())) return false;

            // Normalize row date to start of day to compare with YYYY-MM-DD
            const rowDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );

            if (from) {
              const fromDateParts = from.split("-").map(Number);
              const fromDate = new Date(
                fromDateParts[0],
                fromDateParts[1] - 1,
                fromDateParts[2]
              );
              if (rowDate < fromDate) {
                return false;
              }
            }

            if (to) {
              const toDateParts = to.split("-").map(Number);
              const toDate = new Date(
                toDateParts[0],
                toDateParts[1] - 1,
                toDateParts[2]
              );
              if (rowDate > toDate) {
                return false;
              }
            }

            return true;
          };
        }

        if (type === "number" || type === "currency") {
          const columnValues = tableData
            .map((row) => row[colKey])
            .filter((v) => typeof v === "number" && isFinite(v));

          if (columnValues.length > 0) {
            const minVal = Math.min(...columnValues);
            const maxVal = Math.max(...columnValues);

            const numSteps = 10;
            const range = maxVal - minVal;

            let minOptions;
            if (range === 0) {
              minOptions = [minVal];
            } else {
              const step = range / (numSteps - 1);
              minOptions = Array.from({ length: numSteps }, (_, i) => {
                const val = minVal + i * step;
                return Math.round(val);
              });
            }
            minOptions = [...new Set(minOptions)];
            const maxOptions = [...minOptions].reverse();
            colDef.meta.minOptions = minOptions;
            colDef.meta.maxOptions = maxOptions;
          }

          colDef.filterFn = (row, id, { min, max }) => {
            const v = row.getValue(id);
            const value = parseFloat(v);
            if (isNaN(value)) return false;
            if (min != null && value < min) return false;
            if (max != null && value > max) return false;
            return true;
          };

          if (type === "currency") {
            colDef.cell = (info) => {
              const value = info.getValue();
              if (typeof value !== "number") {
                return String(value ?? "");
              }
              return new Intl.NumberFormat("en-US").format(value);
            };
          }
        }
        if (type === "enum") {
          colDef.meta.options = options;
          colDef.filterFn = (row, id, val) => {
            if (!val) {
              return true;
            }
            const value =
              typeof val === "object" && val !== null ? val.eq : val;
            return row.getValue(id) === value;
          };
        }
        if (type === "boolean") {
          colDef.filterFn = (row, id, val) => {
            if (val === "true") return row.getValue(id) === true;
            if (val === "false") return row.getValue(id) === false;
            return true;
          };
        }
        if (type === "phone") {
          colDef.cell = (info) => {
            const value = info.getValue();
            if (!value) return "";
            const cleaned = ("" + value).replace(/\D/g, "");

            // +998 99 999 99 99
            if (cleaned.length === 12 && cleaned.startsWith("998")) {
              return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(
                5,
                8
              )} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
            }
            // 99 999 99 99
            if (cleaned.length === 9) {
              return `${cleaned.slice(0, 2)} ${cleaned.slice(
                2,
                5
              )} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
            }
            // fallback: just return as is
            return value;
          };
        }
        if (sort) {
          colDef.header = ({ column }) => {
            return (
              <button
                className="flex items-center gap-2"
                onClick={() => column.toggleSorting()}
              >
                {headerString}
                <SortingIcon sorting={column.getIsSorted()} />
              </button>
            );
          };
        }
        return columnHelper.accessor(colKey, colDef);
      })
      .filter(Boolean);
    console.log("autoCols", autoCols);

    const actionColumns = [];
    if (rowIndexColumn?.enable && rowActions.length > 0) {
      actionColumns.push(
        columnHelper.display({
          id: "actions",
          header: "",
          meta: {
            size: actionSize,
          },
          pin: actionPin,
          size:
            {
              xs: 40,
              sm: 80,
              md: 120,
              lg: 200,
            }[actionSize] || 80,
          cell: ({ row, table, column }) => {
            const rowData = row.original;
            const totalRows = table.getRowModel().rows.length;
            const rowIndex = row.index;
            const isPinnedLeft = column.getIsPinned() === "left";
            const isDropdownOpen = openDropdownRowId === row.id;

            const toggleDropdown = (e) => {
              e.stopPropagation();
              setOpenDropdownRowId(isDropdownOpen ? null : row.id);
            };

            let dropdownPositionClass;
            const horizontalDir = isPinnedLeft
              ? "dropdown-right"
              : "dropdown-left";
            const contentMargin = isPinnedLeft ? "ml-3" : "mr-3";

            // Calculate thirds for more even distribution
            const topThreshold = Math.floor(totalRows / 3);
            const bottomThreshold = Math.floor((2 * totalRows) / 3);

            if (rowIndex < topThreshold) {
              dropdownPositionClass = horizontalDir;
            } else if (rowIndex < bottomThreshold) {
              dropdownPositionClass = `dropdown-center ${horizontalDir}`;
            } else {
              dropdownPositionClass = `dropdown-top ${horizontalDir}`;
            }
            return (
              <div
                className={`dropdown ${
                  isDropdownOpen ? "dropdown-open" : ""
                } ${dropdownPositionClass} w-full h-full`}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="btn w-full h-full btn-ghost hover:bg-transparent"
                  onClick={toggleDropdown}
                >
                  <span className="icon icon-circle-ellipsis"></span>
                </div>
                <ul
                  tabIndex={0}
                  className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 z-50 flex flex-col gap-2 ${contentMargin}`}
                >
                  {rowActions.map((action, index) => (
                    <li key={index}>
                      <button
                        className="btn btn-ghost text-start"
                        onClick={(e) =>
                          handleAction(e, action.onClick, rowData)
                        }
                      >
                        {action.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        })
      );
    }

    console.log("Cols", [
      ...pinColumn,
      ...indexColumns,
      ...autoCols,
      ...actionColumns,
    ]);

    return [...pinColumn, ...indexColumns, ...autoCols, ...actionColumns];
  }, [
    tableData,
    schema,
    rowActions,
    actionSize,
    openDropdownRowId,
    rowIndexPin,
    rowIndexSize,
    enablePagination,
    t,
    enableRowPinning,
  ]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    onRowPinningChange: setRowPinning,
    getRowId: (row) => row.id,
    state: {
      sorting,
      rowSelection,
      columnPinning,
      columnFilters,
      globalFilter,
      rowPinning,
      ...(enablePagination ? { pagination } : {}),
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    ...(enablePagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: setPagination,
        }
      : {}),
  });

  const RowRenderer = React.useCallback(
    ({ row, index }) => {
      const isPinned = row.getIsPinned();
      const conditionalStyle = getConditionalRowStyle(row);

      const trProps = {
        key: row.id,
        className: `border-b border-base-200 ${
          row.getIsSelected() ? "bg-primary/10" : ""
        }`,
        style: { ...conditionalStyle },
      };

      if (isPinned) {
        // A row's height is assumed to be 41px and header is 49px. This might need adjustment if row styles change.
        const top =
          isPinned === "top"
            ? `${49 + row.getPinnedIndex() * 41}px`
            : undefined;
        const bottom =
          isPinned === "bottom"
            ? `${
                (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 41
              }px`
            : undefined;

        trProps.style = {
          ...trProps.style,
          position: "sticky",
          top,
          bottom,
          zIndex: 15,
          backgroundColor: "var(--row-hover-bg, #E5E7EB)",
        };
      } else {
        trProps.className += ` ${
          index % 2 === 0 ? "even-row" : "odd-row"
        } cursor-pointer`;
        trProps.onClick = () => row.toggleSelected();
      }

      const cells = row.getVisibleCells().map((cell, cellIndex) => {
        const sizeClass = `col-size-${
          cell.column.columnDef.meta?.size || "md"
        }`;
        const baseStyle = getCommonPinningStyles(cell.column);
        const isLastCell = cellIndex === row.getVisibleCells().length - 1;

        const { textAlign = "left", cellPadding = 8 } =
          cell.column.columnDef.meta || {};
        const isPinnedColumn = cell.column.getIsPinned();
        const paddingX = isPinnedColumn ? 0 : cellPadding;
        const isActionsCell = cell.column.id === "actions";
        const isDropdownOpen = isActionsCell && openDropdownRowId === row.id;

        const style = {
          ...baseStyle,
          ...borderStyle,
          borderRight:
            isLastCell && !isPinnedColumn ? "none" : borderStyle.borderRight,
          textAlign,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
          width: cell.column.getSize(),
          backgroundColor: isPinned ? "inherit" : undefined,
        };

        if (isDropdownOpen) {
          style.zIndex = 51;
          style.overflow = "visible";
        }
        // Use box-shadow to create a visible separator for pinned columns
        if (isPinnedColumn === "left") {
          style.boxShadow = "inset -1px 0 0 0 rgba(0, 0, 0, 0.1)";
          style.borderRight = "none";
        }
        if (isPinnedColumn === "right") {
          style.boxShadow = "inset 1px 0 0 0 rgba(0, 0, 0, 0.1)";
          style.borderLeft = "none";
        }

        const tdProps = {
          key: cell.id,
          style: style,
          className: `py-2 text-sm ${sizeClass}`,
        };

        if (isPinnedColumn) {
          tdProps.onClick = (e) => e.stopPropagation();
        }

        const cellContent = flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        );

        return (
          <td {...tdProps}>
            {isActionsCell ? (
              cellContent
            ) : (
              <div
                className={`dropdown dropdown-hover ${
                  index > 0 ? "dropdown-top" : "dropdown-bottom"
                }`}
                style={{ width: "100%" }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="truncate"
                  style={{
                    maxWidth: cell.column.getSize(),
                    width: "100%",
                    display: "block",
                  }}
                >
                  {cellContent}
                </div>
                <div
                  tabIndex={0}
                  className="dropdown-content z-60 p-2 shadow bg-base-300 text-base-content rounded-box w-auto"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    maxWidth: "320px",
                    pointerEvents: "auto",
                    minWidth: "120px",
                    width: "max-content",
                    left: 0,
                    right: "auto",
                  }}
                >
                  {String(cell.getValue() ?? "")}
                </div>
              </div>
            )}
          </td>
        );
      });

      return <tr {...trProps}>{cells}</tr>;
    },
    [table, getConditionalRowStyle, openDropdownRowId, borderStyle]
  );

  React.useEffect(() => {
    const selectedRowId = Object.keys(rowSelection)[0];

    if (!selectedRowId) {
      appsmith.updateModel({ selectedRow: {} });
      return;
    }

    const selectedRow = table.getRow(selectedRowId);

    if (selectedRow) {
      appsmith.updateModel({ selectedRow: selectedRow.original });
      if (rowSelectionAction) {
        appsmith.triggerEvent(rowSelectionAction, {
          row: selectedRow.original,
        });
      }
    }
  }, [rowSelection, rowSelectionAction, table]);

  const loadMoreRef = React.useRef(null);
  console.log(columnFilters);

  React.useEffect(() => {
    if (enablePagination || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSize(size + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [enablePagination, hasNextPage, isFetchingNextPage, size, setSize]);

  if (isError) {
    return (
      <div className="text-center p-8 text-lg text-red-600">
        {t("error")} {error.code} {error.message}{" "}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center flex justify-center h-full p-8 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-circle-icon lucide-loader-circle animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  if (tableData.length === 0) {
    return <div className="text-center p-8 text-lg">{t("noData")}</div>;
  }

  return (
    <div
      data-theme="white"
      className="font-sans flex flex-col h-full"
      style={themeStyles}
    >
      <div className="p-2 bg-base-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {table
            .getHeaderGroups()
            .map((headerGroup) =>
              headerGroup.headers.map((header) =>
                !header.isPlaceholder && header.column.getCanFilter() ? (
                  <TableFilters key={header.id} column={header.column} t={t} />
                ) : null
              )
            )}
        </div>
      </div>

      <div className="flex-grow p-2 overflow-hidden">
        <div
          className="h-full overflow-auto shadow-sm rounded-lg"
          style={showBorder ? { border: `1px solid var(--border-color)` } : {}}
        >
          <table
            className="table table-fixed table-pin-rows table-pin-cols w-full"
            style={{ minWidth: table.getTotalSize() }}
          >
            <thead
              className="bg-base-200 text-base-content sticky"
              style={{ top: 0, zIndex: 20 }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    const sizeClass = `col-size-${
                      header.column.columnDef.meta?.size || "md"
                    }`;
                    const baseStyle = getCommonPinningStyles(header.column);
                    const isLastHeader =
                      index === headerGroup.headers.length - 1;

                    const { textAlign = "left", cellPadding = 8 } =
                      header.column.columnDef.meta || {};
                    const isPinned = header.column.getIsPinned();
                    const paddingX = isPinned ? 0 : cellPadding;

                    const style = {
                      ...baseStyle,
                      ...borderStyle,
                      borderRight:
                        isLastHeader && !isPinned
                          ? "none"
                          : borderStyle.borderRight,
                      textAlign,
                      paddingLeft: `${paddingX}px`,
                      paddingRight: `${paddingX}px`,
                      width: header.getSize(),
                    };

                    if (isPinned === "left") {
                      style.boxShadow = "inset -1px 0 0 0 rgba(0, 0, 0, 0.1)";
                      style.borderRight = "none";
                    }
                    if (isPinned === "right") {
                      style.boxShadow = "inset 1px 0 0 0 rgba(0, 0, 0, 0.1)";
                      style.borderLeft = "none";
                    }

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...style,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                          maxWidth: header.getSize(),
                        }}
                        className={`py-3 text-xs font-bold ${sizeClass}`}
                      >
                        <div
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getTopRows().map((row, index) => (
                <RowRenderer key={row.id} row={row} index={index} />
              ))}
              {table.getCenterRows().map((row, index) => (
                <RowRenderer key={row.id} row={row} index={index} />
              ))}
              {table.getBottomRows().map((row, index) => (
                <RowRenderer key={row.id} row={row} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-2">
        {enablePagination ? (
          <Pagination table={table} t={t} />
        ) : (
          <div
            ref={loadMoreRef}
            className="text-center p-4 flex flex-col items-center gap-2"
          >
            {isFetchingNextPage ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-loader-circle-icon lucide-loader-circle animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : hasNextPage ? (
              <svg
                className="text-gray-400 w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <span className="icon icon-check text-gray-300 text-2xl" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

appsmith.onReady(() => {
  ReactDOM.render(
    <SWRConfig>
      <App />
    </SWRConfig>,
    document.getElementById("root")
  );
});
