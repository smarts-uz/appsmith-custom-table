import React from 'https://cdn.skypack.dev/react@18.2.0';
import ReactDOM from 'https://cdn.skypack.dev/react-dom@18.2.0';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    getSortedRowModel,
    createColumnHelper,
} from 'https://cdn.skypack.dev/@tanstack/react-table';

const getNestedValue = (obj, path, defaultValue = []) => {
    if (path === '') {
        return obj
    }
    if (!path || typeof path !== 'string' || !obj) {
        return defaultValue;
    }
    const pathArray = path.replace(/\[/g, '.').replace(/\]/g, '').split('.').filter(Boolean);
    const result = pathArray.reduce((acc, key) => acc?.[key], obj);
    return result === undefined ? defaultValue : result;
};

const columnHelper = createColumnHelper();

export const formatDateString = (inputDate, displayStyle = 'dayMonthYear') => {
    const dateObj = new Date(inputDate);
    if (isNaN(dateObj.getTime())) {
        return String(inputDate);
    }
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hour = dateObj.getHours().toString().padStart(2, '0');
    const minute = dateObj.getMinutes().toString().padStart(2, '0');

    switch (displayStyle) {
        case 'dayMonthTime':
            return `${day}.${month}. ${hour}:${minute}`;
        case 'dayMonthYear':
            return `${day}.${month}.${year}`;
        case 'dayMonthYearTime':
            return `${day}.${month}.${year} ${hour}:${minute}`;
        case 'timeOnly':
            return `${hour}:${minute}`;
        case 'isoDate':
            return `${year}-${month}-${day}`;
        case 'fullDateTime':
        default:
            return `${day}.${month}.${year} ${hour}:${minute}`;
    }
}

const getT = (translations, defaultTranslations) => (key, replacements = {}) => {
    const template = translations?.[key] ?? defaultTranslations[key];
    if (!template) {
        return key;
    }
    return Object.entries(replacements).reduce(
        (acc, [placeholder, value]) => acc.replace(`{${placeholder}}`, String(value)),
        template
    );
};

const getCommonPinningStyles = (column) => {
    const isPinned = column.getIsPinned();
    const borderColor = 'var(--border-color, #E5E7EB)';

    const styles = {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        backgroundColor: isPinned ? 'inherit' : 'transparent',
        position: isPinned ? 'sticky' : 'static',
        zIndex: isPinned ? 10 : 0,
    };

    if (isPinned === 'left') {
        styles.borderRight = `1px solid ${borderColor}`;
    }

    if (isPinned === 'right') {
        styles.borderLeft = `1px solid ${borderColor}`;
    }

    return styles;
}

const SortingIcon = ({ sorting }) => {
    switch (sorting) {
        case "asc":
            return <span style={{ fontSize: '16px', color: '#000' }} className="icon icon-arrow-up " />;
        case "desc":
            return <span style={{ fontSize: '16px', color: '#000' }} className="icon icon-arrow-down " />;
        default:
            return <span style={{ fontSize: '16px', color: '#000' }} className="icon icon-arrow-up-down " />;
    }
}

const TableFilters = ({ column, t }) => {
    const { filterVariant, headerText: metaHeaderText } = column.columnDef.meta ?? {};
    const columnFilterValue = column.getFilterValue();
    const header = column.columnDef.header;
    const headerText = metaHeaderText || (typeof header === 'string' ? header : column.id);

    if (!filterVariant) return null;

    const filterId = `filter-${column.id}`;

    const renderFilter = () => {
        switch (filterVariant) {
            case 'text':
                return (
                    <TableFilterText column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'number':
                return (
                    <TableFilterNumber column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'enum':
                return (
                    <TableFilterEnum column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'bool':
                return (
                    <TableFilterBoolean column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'id':
                return (
                    <TableFilterText column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'date':
                return (
                    <TableFilterDate column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            case 'currency':
                return (
                    <TableFilterNumber column={column} columnFilterValue={columnFilterValue} filterId={filterId} headerText={headerText} t={t} />
                );
            default:
                return null;
        }
    }

    return (
        <div className="form-control">
            {renderFilter()}
        </div>
    );
};

const TableFilterDate = ({ column, columnFilterValue, filterId, headerText, t }) => {
    const fromId = `${filterId}-from`;
    const toId = `${filterId}-to`;
    const fromValue = (typeof columnFilterValue === 'object' && columnFilterValue !== null) ? columnFilterValue.from : '';
    const toValue = (typeof columnFilterValue === 'object' && columnFilterValue !== null) ? columnFilterValue.to : '';

    return (
        <div className="flex items-center gap-2">
            <input
                id={fromId}
                type="date"
                value={fromValue ?? ''}
                onChange={(e) => column.setFilterValue((old) => {
                    const newFrom = e.target.value || undefined;
                    if (typeof old === 'object' && old !== null) {
                        return { ...old, from: newFrom };
                    }
                    return { from: newFrom };
                })}
                aria-label={t('dateFromAriaLabel', { headerText })}
                className="input input-bordered w-full max-w-xs"
            />
            <span>-</span>
            <input
                id={toId}
                type="date"
                value={toValue ?? ''}
                onChange={(e) => column.setFilterValue((old) => {
                    const newTo = e.target.value || undefined;
                    if (typeof old === 'object' && old !== null) {
                        return { ...old, to: newTo };
                    }
                    return { to: newTo };
                })}
                aria-label={t('dateToAriaLabel', { headerText })}
                className="input input-bordered w-full max-w-xs"
            />
        </div>
    );
};

const TableFilterBoolean = ({ column, columnFilterValue, filterId, headerText, t }) => {
    return (
        <select
            id={filterId}
            value={(columnFilterValue ?? '')}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={t('filterPlaceholder', { headerText })}
            aria-label={t('filterAriaLabel', { headerText })}
            className="select select-bordered w-full max-w-xs"
        >
            <option value="">{t('all')}</option>
            <option value={true}>{t('true')}</option>
            <option value={false}>{t('false')}</option>
        </select>
    );
};

const TableFilterText = ({ column, columnFilterValue, filterId, headerText, t }) => {
    return (
        <input
            id={filterId}
            type="text"
            value={(columnFilterValue ?? '')}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={t('filterPlaceholder', { headerText })}
            aria-label={t('filterAriaLabel', { headerText })}
            className="input input-bordered w-full max-w-xs"
        />
    );
};

const TableFilterEnum = ({ column, columnFilterValue, filterId, headerText, t }) => {
    const options = column.columnDef.meta?.options || [];
    const currentValue = (typeof columnFilterValue === 'object' && columnFilterValue !== null) ? columnFilterValue.eq : columnFilterValue;

    return (
        <select
            id={filterId}
            value={currentValue ?? ''}
            onChange={e => {
                const val = e.target.value;
                column.setFilterValue(val || undefined);
            }}
            aria-label={t('filterAriaLabel', { headerText })}
            className="select select-bordered w-full max-w-xs"
        >
            <option value="">{t('all')}</option>
            {options.map(option => (
                <option key={option?.value} value={option?.value}>{option?.title}</option>
            ))}
        </select>
    );
};

const TableFilterNumber = ({ column, columnFilterValue, filterId, headerText, t }) => {
    const minId = `${filterId}-min`;
    const maxId = `${filterId}-max`;
    const { minOptions = [], maxOptions = [] } = column.columnDef.meta ?? {};

    return (
        <div className="flex items-center gap-2">
            <select
                id={minId}
                placeholder={t('min')}
                onChange={(e) => column.setFilterValue((old = {}) => ({
                    ...old,
                    min: e.target.value ? Number(e.target.value) : undefined,
                }))}
                value={columnFilterValue?.min ?? ''}
                aria-label={t('numberMinAriaLabel', { headerText })}
                className="select select-bordered w-full max-w-xs"
            >
                <option value="">{t('all')}</option>
                {minOptions.map((item, index) => (
                    <option key={index} value={item}>
                        {item}
                    </option>
                ))}
            </select>
            <span>-</span>
            <select
                id={maxId}
                placeholder={t('max')}
                onChange={(e) => column.setFilterValue((old = {}) => ({
                    ...old,
                    max: e.target.value ? Number(e.target.value) : undefined,
                }))}
                value={columnFilterValue?.max ?? ''}
                aria-label={t('numberMaxAriaLabel', { headerText })}
                className="select select-bordered w-full max-w-xs"
            >
                <option value="">{t('all')}</option>
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
                aria-label={t('goToFirstPage')}
            >
                <span className="icon icon-chevron-first"></span>
            </button>
            <button
                className="join-item btn btn-sm btn-ghost disabled:opacity-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label={t('goToPreviousPage')}
            >
                <span className="icon icon-chevron-left"></span>
            </button>
            <div className="flex text-sm items-center gap-1 px-2">
                <span >
                    {table.getState().pagination.pageIndex + 1}
                </span>
                <span>
                    / {table.getPageCount()}
                </span>
            </div>
            <button
                className="join-item btn btn-sm btn-ghost disabled:opacity-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label={t('goToNextPage')}
            >
                <span className="icon icon-chevron-right"></span>
            </button>
            <button
                className="join-item btn btn-sm btn-ghost disabled:opacity-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                aria-label={t('goToLastPage')}
            >
                <span className="icon icon-chevron-last"></span>
            </button>
        </div>
    </div>
);

function App() {
    const stableEmptyObject = React.useMemo(() => ({}), []);
    const stableEmptyArray = React.useMemo(() => ([]), []);
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
        bodyData
    } = model;

    const { enable: enablePagination = false, pageSize = 20 } = paginationProps;
    const { pin: actionPin, size: actionSize, enable: actionEnable = true } = actionColumn;
    const { pin: rowIndexPin = null, size: rowIndexSize = 'xs' } = rowIndexColumn;

    const [isErrored, setIsErrored] = React.useState(false);
    const [rowSelection, setRowSelection] = React.useState({})
    const [rowPinning, setRowPinning] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')

    const defaultTranslations = {
        all: 'All',
        min: 'Min',
        max: 'Max',
        filterPlaceholder: 'Filter {headerText}...',
        filterAriaLabel: 'Filter by {headerText}',
        true: 'True',
        false: 'False',
        dateFromAriaLabel: 'From {headerText}',
        dateToAriaLabel: 'To {headerText}',
        numberMinAriaLabel: 'Minimum {headerText}',
        numberMaxAriaLabel: 'Maximum {headerText}',
        goToFirstPage: 'Go to first page',
        goToPreviousPage: 'Go to previous page',
        goToNextPage: 'Go to next page',
        goToLastPage: 'Go to last page',
        error: 'Error:',
        noData: 'No data to display',
        pinRow: 'Pin row',
        unpinRow: 'Unpin row',
        pinToTop: 'Pin to top',
        pinToBottom: 'Pin to bottom',
    };

    const t = React.useCallback(getT(translations, defaultTranslations), [translations]);

    const themeStyles = React.useMemo(() => ({
        '--even-row-bg': colors.evenRowColor || '#FFFFFF',
        '--odd-row-bg': colors.oddRowColor || '#F3F4F6',
        '--row-hover-bg': colors.rowHoverColor || '#E5E7EB',
        '--border-color': colors.borderColor || '#E5E7EB'
    }), [colors]);

    const borderStyle = showBorder ? {
        borderBottom: '1px solid var(--border-color)',
        borderRight: '1px solid var(--border-color)',
    } : {};

    const [sorting, setSorting] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const getConditionalRowStyle = React.useCallback((row) => {
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
                case '>': conditionMet = !isNaN(numCellValue) && !isNaN(numValue) && numCellValue > numValue; break;
                case '<': conditionMet = !isNaN(numCellValue) && !isNaN(numValue) && numCellValue < numValue; break;
                case '>=': conditionMet = !isNaN(numCellValue) && !isNaN(numValue) && numCellValue >= numValue; break;
                case '<=': conditionMet = !isNaN(numCellValue) && !isNaN(numValue) && numCellValue <= numValue; break;
                case '===': conditionMet = cellValue === value; break;
                case '==': conditionMet = cellValue == value; break;
                case '!==': conditionMet = cellValue !== value; break;
                case '!=': conditionMet = cellValue != value; break;
                case 'contains': conditionMet = String(cellValue).toLowerCase().includes(String(value).toLowerCase()); break;
                case 'startsWith': conditionMet = String(cellValue).toLowerCase().startsWith(String(value).toLowerCase()); break;
                case 'endsWith': conditionMet = String(cellValue).toLowerCase().endsWith(String(value).toLowerCase()); break;
                case 'isEmpty': conditionMet = cellValue === null || cellValue === undefined || cellValue === ''; break;
                case 'isNotEmpty': conditionMet = cellValue !== null && cellValue !== undefined && cellValue !== ''; break;
            }

            if (conditionMet) {
                return { backgroundColor: color };
            }
        }

        return {};
    }, [rowStyleRules]);

    const getInitialPinning = React.useCallback(() => {
        const left = [];
        const right = [];

        if (schema && typeof schema === 'object') {
            for (const colKey in schema) {
                if (Object.prototype.hasOwnProperty.call(schema, colKey)) {
                    const colSchema = schema[colKey];
                    if (colSchema && colSchema.pin === 'left') {
                        left.push(colKey);
                    } else if (colSchema && colSchema.pin === 'right') {
                        right.push(colKey);
                    }
                }
            }
        }
        if (rowActions.length > 0) {
            if (actionPin === 'left') {
                left.push('actions');
            } else if (actionPin === 'right') {
                right.push('actions');
            }
        }
        return { left, right };
    }, [schema, rowActions, actionPin]);

    const [columnPinning, setColumnPinning] = React.useState(getInitialPinning());

    const { enable: enableRowPinning = true } = model.rowPinning || {};

    const [data, setData] = React.useState([]);

    const requestOptions = React.useMemo(
        () => ({
            method,
            headers,
            body: method === 'GET' ? undefined : JSON.stringify(bodyData) || undefined,
        }),
        [method, headers, bodyData]
    );

    React.useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            try {
                const response = await fetch(url, requestOptions);
                const json = await response.json();
                setData(getNestedValue(json, dataKey, []));
                appsmith.updateModel({ data: getNestedValue(json, dataKey, []) });
            } catch (err) {
                setIsErrored(err.message);
            }
        };

        fetchData();
    }, []);

    const handleAction = (e, eventName, row) => {
        e.stopPropagation();
        appsmith.triggerEvent(eventName, { row });
        console.log('Action clicked for row id:', row.id)
    }

    const columns = React.useMemo(() => {
        if (!data.length) return []
        const indexColumns = [];
        if (rowIndexColumn?.enable) {
            indexColumns.push(columnHelper.display({
                id: '#',
                header: '#',
                pin: rowIndexPin,
                size: {
                    xs: 40,
                    sm: 80,
                    md: 120,
                    lg: 200,
                }[rowIndexSize] || 40,
                cell: ({ row, table }) => {
                    const { pageIndex, pageSize } = table.getState().pagination;
                    const index = enablePagination ? (pageIndex * pageSize) + row.index + 1 : row.index + 1;
                    return index;
                },
                meta: {
                    textAlign: 'center',
                }
            }))
        }


        const autoCols = Object.keys(data[0]).map((colKey) => {
            if (!schema[colKey]) {
                console.warn(`Column "${colKey}" not found in schema, skipping.`);
                return null;
            }
            const { type, options, sort = false, filter = false, pin = null, size = 'md', textAlign = 'left', cellPadding = 8, title, dateFormat = 'dayMonthYear' } = schema[colKey]
            const headerString = title || colKey.charAt(0).toUpperCase() + colKey.slice(1);

            const colDef = {
                accessorKey: colKey,
                header: headerString,
                cell: info => String(info.getValue()),
                meta: {
                    filterVariant: filter ? type : null,
                    headerText: headerString,
                    size: size,
                    textAlign,
                    cellPadding,
                },
                enableSorting: sort,
                enableColumnFilter: filter,
                size: {
                    xs: 40,
                    sm: 80,
                    md: 120,
                    lg: 200
                }[size] || 120
            }

            if (pin === 'left' || pin === 'right') {
                colDef.pin = pin;
            }

            if (type === 'text' || type === 'id' || type === 'phone') {
                colDef.filterFn = (row, id, value) => {
                    const rowValue = row.getValue(id);
                    return rowValue != null && String(rowValue).toLowerCase().includes(String(value).toLowerCase());
                };
            }

            if (type === 'date') {
                colDef.cell = info => {
                    const value = info.getValue();
                    if (!value) return '';
                    return formatDateString(value, dateFormat);
                };

                colDef.filterFn = (row, id, value) => {
                    const { from, to } = value || {};
                    if (!from && !to) return true;

                    const rowValue = row.getValue(id);
                    if (!rowValue) return false;

                    const date = new Date(rowValue);
                    if (isNaN(date.getTime())) return false;

                    const rowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                    if (from) {
                        const fromDateParts = from.split('-').map(Number);
                        const fromDate = new Date(fromDateParts[0], fromDateParts[1] - 1, fromDateParts[2]);
                        if (rowDate < fromDate) {
                            return false;
                        }
                    }

                    if (to) {
                        const toDateParts = to.split('-').map(Number);
                        const toDate = new Date(toDateParts[0], toDateParts[1] - 1, toDateParts[2]);
                        if (rowDate > toDate) {
                            return false;
                        }
                    }

                    return true;
                };
            }

            if (type === 'number' || type === 'currency') {
                const columnValues = data.map(row => row[colKey]).filter(v => typeof v === 'number' && isFinite(v));

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
                    const v = row.getValue(id)
                    const value = parseFloat(v);
                    if (isNaN(value)) return false;
                    if (min != null && value < min) return false
                    if (max != null && value > max) return false
                    return true
                }

                if (type === 'currency') {
                    colDef.cell = info => {
                        const value = info.getValue();
                        if (typeof value !== 'number') {
                            return String(value ?? '');
                        }
                        return new Intl.NumberFormat('en-US').format(value);
                    }
                }
            }
            if (type === 'enum') {
                colDef.meta.options = options
                colDef.filterFn = (row, id, val) => {
                    if (!val) {
                        return true;
                    }
                    const value = (typeof val === 'object' && val !== null) ? val.eq : val;
                    return row.getValue(id) === value;
                }
            }
            if (type === 'boolean') {
                colDef.filterFn = (row, id, val) => {
                    if (val === 'true') return row.getValue(id) === true;
                    if (val === 'false') return row.getValue(id) === false;
                    return true;
                }
            }
            if (type === 'phone') {
                colDef.cell = info => {
                    const value = info.getValue();
                    if (!value) return '';
                    const cleaned = ('' + value).replace(/\D/g, '');

                    if (cleaned.length === 12 && cleaned.startsWith('998')) {
                        return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
                    }
                    if (cleaned.length === 9) {
                        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
                    }
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
                    )
                }
            }
            return columnHelper.accessor(colKey, colDef)
        }).filter(Boolean);

        const actionColumns = [];
        if (actionEnable && rowActions.length > 0) {
            actionColumns.push(columnHelper.display({
                id: 'actions',
                header: '',
                meta: {
                    size: actionSize,
                },
                pin: actionPin,
                size: {
                    xs: 40,
                    sm: 80,
                    md: 120,
                    lg: 200,
                }[actionSize] || 80,
                cell: ({ row, table, column }) => {
                    const rowData = row.original;
                    const totalRows = table.getRowModel().rows.length;
                    const rowIndex = row.index;
                    const isPinnedLeft = column.getIsPinned() === 'left';

                    let dropdownPositionClass;
                    const horizontalDir = isPinnedLeft ? 'dropdown-right' : 'dropdown-left';
                    const contentMargin = isPinnedLeft ? 'ml-3' : 'mr-3';

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
                        <div className={`dropdown ${dropdownPositionClass} w-full h-full`}>
                            <div tabIndex={0} role="button" className="btn w-full h-full btn-ghost hover:bg-transparent">
                                <span className="icon icon-circle-ellipsis"></span>
                            </div>
                            <ul tabIndex={0} className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-56 z-50 flex flex-col gap-2 ${contentMargin}`}>
                                {rowActions.map((action, index) => (
                                    <li key={index}>
                                        <button className="btn btn-ghost text-start" onClick={(e) => handleAction(e, action.onClick, rowData)}>
                                            {action.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                },
            }))
        }

        return [...indexColumns, ...autoCols, ...actionColumns]
    }, [data, schema, rowActions, actionSize, rowIndexPin, rowIndexSize, enablePagination, t, enableRowPinning])

    const table = useReactTable({
        data,
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

    const RowRenderer = React.useCallback(({ row, index }) => {
        const conditionalStyle = getConditionalRowStyle(row);

        // Compose tr props
        const trClassNames = [
            'border-b',
            'border-base-200',
            row.getIsSelected() ? 'bg-primary/10' : '',
            index % 2 === 0 ? 'even-row' : 'odd-row',
            'cursor-pointer'
        ].join(' ');

        const trProps = {
            key: row.id,
            className: trClassNames,
            style: { ...conditionalStyle },
            onClick: () => row.toggleSelected(),
        };

        const cells = row.getVisibleCells().map((cell, cellIndex) => {
            const { column } = cell;
            const meta = column.columnDef.meta || {};
            const sizeClass = `col-size-${meta.size || 'md'}`;
            const baseStyle = getCommonPinningStyles(column);
            const isLastCell = cellIndex === row.getVisibleCells().length - 1;
            const { textAlign = 'left', cellPadding = 8 } = meta;
            const isPinnedColumn = column.getIsPinned();
            const paddingX = isPinnedColumn ? 0 : cellPadding;
            const isActionsCell = column.id === 'actions';

            // Compose cell style
            const style = {
                ...baseStyle,
                ...borderStyle,
                borderRight: isLastCell && !isPinnedColumn ? 'none' : borderStyle.borderRight,
                textAlign,
                paddingLeft: `${paddingX}px`,
                paddingRight: `${paddingX}px`,
                width: column.getSize(),
            };

            if (isPinnedColumn === 'left') {
                style.boxShadow = 'inset -1px 0 0 0 rgba(0, 0, 0, 0.1)';
                style.backgroundColor = 'inherit';
                style.borderRight = 'none';
            }
            if (isPinnedColumn === 'right') {
                style.backgroundColor = 'inherit';
                style.boxShadow = 'inset 1px 0 0 0 rgba(0, 0, 0, 0.1)';
                style.borderLeft = 'none';
            }

            const tdProps = {
                key: cell.id,
                style,
                className: `py-2 text-sm ${sizeClass}`,
                ...(isPinnedColumn && { onClick: e => e.stopPropagation() }),
            };

            const cellContent = flexRender(column.columnDef.cell, cell.getContext());

            return (
                <td {...tdProps}>
                    {isActionsCell ? (
                        cellContent
                    ) : (
                        <div className={`dropdown dropdown-hover ${index > 0 ? 'dropdown-top' : 'dropdown-bottom'}`} style={{ width: '100%' }}>
                            <div
                                tabIndex={0}
                                role="button"
                                className="truncate"
                                style={{
                                    maxWidth: cell.column.getSize(),
                                    width: '100%',
                                    display: 'block',
                                }}
                            >
                                {cellContent}
                            </div>
                            <div
                                tabIndex={0}
                                className="dropdown-content z-[60] p-2 shadow bg-base-300 text-base-content rounded-box w-auto"
                                style={{
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    maxWidth: '320px',
                                    pointerEvents: 'auto',
                                    minWidth: '120px',
                                    width: 'max-content',
                                    left: 0,
                                    right: 'auto',
                                }}
                            >
                                {cellContent}
                            </div>
                        </div>
                    )}
                </td>
            );
        });

        return <tr {...trProps}>{cells}</tr>;
    }, [table, getConditionalRowStyle, borderStyle]);

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
                appsmith.triggerEvent(rowSelectionAction, { row: selectedRow.original });
            }
        }
    }, [rowSelection, rowSelectionAction, table]);

    if (isErrored) {
        return <div className="text-center p-8 text-lg text-red-600">{isErrored}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center p-8 text-lg">{t('noData')}</div>;
    }

    return (
        <main data-theme="white" className="font-sans flex flex-col gap-2 h-full p-2" style={themeStyles}>
            <div className="bg-base-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {table
                    .getHeaderGroups()
                    .map((headerGroup) =>
                        headerGroup.headers.map((header) => (
                            !header.isPlaceholder && header.column.getCanFilter() ? (
                                <TableFilters key={header.id} column={header.column} t={t} />
                            ) : null
                        ))
                    )}
            </div>

            <div className="h-full overflow-auto shadow-sm rounded-lg" style={{ height: appsmith?.model?.tableHeight || '700px' }}>
                <table className="w-full" style={{ minWidth: table.getTotalSize() }}>
                    <thead style={{ backgroundColor: 'var(--even-row-bg)' }} className="text-base-content z-20">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    const sizeClass = `col-size-${header.column.columnDef.meta?.size || 'md'}`;
                                    const baseStyle = getCommonPinningStyles(header.column);
                                    const isLastHeader = index === headerGroup.headers.length - 1;

                                    const { textAlign = 'left', cellPadding = 8 } = header.column.columnDef.meta || {};
                                    const isPinned = header.column.getIsPinned();
                                    const paddingX = isPinned ? 0 : cellPadding;

                                    const style = {
                                        ...baseStyle,
                                        ...borderStyle,
                                        borderRight: isLastHeader && !isPinned ? 'none' : borderStyle.borderRight,
                                        textAlign,
                                        paddingLeft: `${paddingX}px`,
                                        paddingRight: `${paddingX}px`,
                                        width: header.getSize(),
                                    };

                                    if (isPinned === 'left') {
                                        style.backgroundColor = 'var(--even-row-bg)';
                                        style.boxShadow = 'inset -1px 0 0 0 rgba(0, 0, 0, 0.1)';
                                        style.borderRight = 'none';
                                    }
                                    if (isPinned === 'right') {
                                        style.backgroundColor = 'var(--even-row-bg)';
                                        style.boxShadow = 'inset 1px 0 0 0 rgba(0, 0, 0, 0.1)';
                                        style.borderLeft = 'none';
                                    }

                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...style,
                                                wordBreak: 'break-word',
                                                whiteSpace: 'normal',
                                                maxWidth: header.getSize(),
                                            }}
                                            className={`py-3 text-xs font-bold ${sizeClass}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <RowRenderer key={row.id} row={row} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
            {enablePagination ? (
                <Pagination table={table} t={t} />
            ) : null}
        </main>
    );
}

appsmith.onReady(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
});