// ColumnOption describes the configuration for each column in the table schema.
type ColumnOption = {
  type: 'id' | 'text' | 'number' | 'date' | 'bool' | 'enum'; // Column data type
  filter?: boolean; // Enable filtering (default: false)
  sort?: boolean; // Enable sorting (default: false)
  title?: string; // Column display name (default: field name)
  size?: 'sm' | 'md' | 'lg'; // Column width (default: 'md')
  textAlign?: 'start' | 'center' | 'end'; // Text alignment (default: 'start')
  cellPadding?: number; // Cell padding in px (default: 8)
  pin?: 'left' | 'right'; // Pin column to left or right (default: undefined)
  // Only for 'enum' type:
  options?: { title: string, value: string }[]; // Enum options (required for 'enum')
  // Only for 'date' type:
  dateFormat?: 'dayMonthTime' | 'dayMonthYear' | 'dayMonthYearTime' | 'timeOnly' | 'isoDate' | 'fullDateTime' | string; // Date display format
};

// TableConfig describes the overall table configuration and features.
type TableConfig = {
  schema: { [columnKey: string]: ColumnOption }, // Column definitions
  data: any[], // Table data
  rowActions?: { title: string, onClick: string }[]; // Row action buttons
  rowSelectionAction?: string; // Event triggered on row selection
  actionColumn?: { pin?: 'left' | 'right', size?: 'sm' | 'md' | 'lg' }; // Action column config
  rowStyleRules?: { column: string, operator: string, value: any, color: string }[]; // Conditional row styling
  colors?: {
    oddRowColor?: string,
    evenRowColor?: string,
    rowHoverColor?: string,
    borderColor?: string
  };
  showBorder?: boolean; // Show table border (default: true)
  pagination?: { enable: boolean, pageSize: number }; // Pagination config
  selectedRow?: any; // Currently selected row
  translations?: { [key: string]: string }; // Custom translations
};

// ---
// Table Features (from script.js)
// ---
// - Filtering: Enable per column with `filter: true`. Filter UI adapts to column type (text, number, enum, date, bool, id).
// - Sorting: Enable per column with `sort: true`. Click header to sort.
// - Pinning: Use `pin: 'left' | 'right'` to fix columns. Action column can also be pinned.
// - Formatting: Dates use `dateFormat`. Numbers can be formatted as currency. Enum columns use `options`.
// - Row Actions: Add buttons per row via `rowActions`. Action column is auto-added if actions exist.
// - Row Selection: Clicking a row selects it. Triggers `rowSelectionAction` if set.
// - Conditional Row Styling: Use `rowStyleRules` to color rows based on cell values and operators (e.g., '===', '>', 'contains').
// - Pagination: Enable with `pagination.enable`. Infinite scroll if disabled.
// - Colors: Customize row, hover, and border colors via `colors`.
// - Translations: Override UI text (e.g., 'ALL') via `translations`.

// ---
// Example Column Schema
// ---
// {
//   id: { type: 'id', sort: true, textAlign: 'start', cellPadding: 8, size: 'sm', pin: 'left' },
//   role: { type: 'enum', sort: true, options: [{ title: 'User', value: 'user' }, { title: 'Admin', value: 'admin' }] },
//   name: { type: 'text', filter: true },
//   gender: { type: 'enum', options: [{ title: 'Male', value: 'male' }, { title: 'Female', value: 'female' }], filter: true, sort: true },
//   created_at: { type: 'date', filter: true, dateFormat: 'YYYY-MM-DD HH:MM' },
//   deleted_at: { type: 'date' },
//   is_admin: { type: 'bool', filter: true },
//   ...
// }

// ---
// Example TableConfig
// ---
// const tableConfig = {
//   schema: { ... },
//   data: [...],
//   rowActions: [
//     { title: 'Edit', onClick: 'onEdit' },
//     { title: 'Delete', onClick: 'onDelete' }
//   ],
//   rowSelectionAction: 'onRowSelect',
//   actionColumn: { pin: 'right', size: 'sm' },
//   rowStyleRules: [
//     { column: 'is_admin', operator: '===', value: true, color: '#ffeedd' }
//   ],
//   colors: {
//     oddRowColor: '#F0F4FF',
//     evenRowColor: '#FAFAFA',
//     rowHoverColor: '#DCEBFF',
//     borderColor: '#CBD5E1'
//   },
//   showBorder: true,
//   pagination: { enable: true, pageSize: 25 },
//   translations: { ALL: 'All' }
// }

// ---
// Notes
// ---
// - If a column is not defined in schema, it is skipped.
// - Filtering, sorting, and pinning are opt-in per column.
// - Action column is only shown if rowActions are provided.
// - Row selection triggers an event and updates selectedRow in the model.
// - Infinite scroll is used if pagination is disabled.
// - See script.js for implementation details and advanced behaviors. 

