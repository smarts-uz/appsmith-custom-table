# Table Configuration Documentation

This document describes the configuration options for the table system, including column definitions, table-level settings, and advanced features. All types and options are based on the implementation in `script.js` and related files.

---

## ColumnOption Type

Describes the configuration for each column in the table schema.

```typescript
/**
 * @typedef {Object} ColumnOption
 * @property {'id' | 'text' | 'number' | 'date' | 'bool' | 'enum'} type - Column data type
 * @property {boolean} [filter] - Enable filtering (default: false)
 * @property {boolean} [sort] - Enable sorting (default: false)
 * @property {string} [title] - Column display name (default: field name)
 * @property {'sm' | 'md' | 'lg'} [size] - Column width (default: 'md')
 * @property {'start' | 'center' | 'end'} [textAlign] - Text alignment (default: 'start')
 * @property {number} [cellPadding] - Cell padding in px (default: 8)
 * @property {'left' | 'right'} [pin] - Pin column to left or right (default: undefined)
 * @property {Array<{ title: string, value: string }>} [options] - Enum options (required for 'enum')
 * @property {'dayMonthTime' | 'dayMonthYear' | 'dayMonthYearTime' | 'timeOnly' | 'isoDate' | 'fullDateTime' | string} [dateFormat] - Date display format (for 'date' type)
 */
```

### ColumnOption Properties

| Property     | Type                                                                 | Default    | Description                                                      |
|--------------|----------------------------------------------------------------------|------------|------------------------------------------------------------------|
| type         | 'id' \| 'text' \| 'number' \| 'date' \| 'bool' \| 'enum'         | —          | Column data type                                                 |
| filter       | boolean                                                              | false      | Enable filtering for this column                                 |
| sort         | boolean                                                              | false      | Enable sorting for this column                                   |
| title        | string                                                               | field name | Column display name                                             |
| size         | 'sm' \| 'md' \| 'lg'                                              | 'md'       | Column width                                                    |
| textAlign    | 'start' \| 'center' \| 'end'                                       | 'start'    | Text alignment                                                  |
| cellPadding  | number                                                               | 8          | Cell padding in pixels                                          |
| pin          | 'left' \| 'right'                                                   | undefined  | Pin column to left or right                                     |
| options      | Array<{ title: string, value: string }>                              | —          | Enum options (required for 'enum' type)                         |
| dateFormat   | 'dayMonthTime' \| 'dayMonthYear' \| ... \| string                 | —          | Date display format (for 'date' type)                           |

---

## TableConfig Type

Describes the overall table configuration and features.

```typescript
/**
 * @typedef {Object} TableConfig
 * @property {Object.<string, ColumnOption>} schema - Column definitions
 * @property {any[]} data - Table data
 * @property {Array<{ title: string, onClick: string }>} [rowActions] - Row action buttons
 * @property {string} [rowSelectionAction] - Event triggered on row selection
 * @property {{ pin?: 'left' | 'right', size?: 'sm' | 'md' | 'lg' }} [actionColumn] - Action column config
 * @property {Array<{ column: string, operator: string, value: any, color: string }>} [rowStyleRules] - Conditional row styling
 * @property {{ oddRowColor?: string, evenRowColor?: string, rowHoverColor?: string, borderColor?: string }} [colors] - Table colors
 * @property {boolean} [showBorder] - Show table border (default: true)
 * @property {{ enable: boolean, pageSize: number }} [pagination] - Pagination config
 * @property {any} [selectedRow] - Currently selected row
 * @property {Object.<string, string>} [translations] - Custom translations
 */
```

### TableConfig Properties

| Property            | Type                                                                                                   | Default    | Description                                                      |
|---------------------|------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------|
| schema              | Object.<string, ColumnOption>                                                                         | —          | Column definitions                                               |
| data                | any[]                                                                                                 | —          | Table data                                                      |
| rowActions          | Array<{ title: string, onClick: string }>                                                             | —          | Row action buttons                                              |
| rowSelectionAction  | string                                                                                                | —          | Event triggered on row selection                                |
| actionColumn        | { pin?: 'left' \| 'right', size?: 'sm' \| 'md' \| 'lg' }                                            | —          | Action column configuration                                     |
| rowStyleRules       | Array<{ column: string, operator: string, value: any, color: string }>                                | —          | Conditional row styling rules                                   |
| colors              | { oddRowColor?: string, evenRowColor?: string, rowHoverColor?: string, borderColor?: string }         | —          | Table color customization                                       |
| showBorder          | boolean                                                                                                | true       | Show table border                                               |
| pagination          | { enable: boolean, pageSize: number }                                                                 | —          | Pagination configuration                                        |
| selectedRow         | any                                                                                                   | —          | Currently selected row                                          |
| translations        | Object.<string, string>                                                                               | —          | Custom translations for UI text                                 |

---

## Table Features

- **Filtering:** Enable per column with `filter: true`. Filter UI adapts to column type (text, number, enum, date, bool, id).
- **Sorting:** Enable per column with `sort: true`. Click header to sort.
- **Pinning:** Use `pin: 'left' | 'right'` to fix columns. Action column can also be pinned.
- **Formatting:** Dates use `dateFormat`. Numbers can be formatted as currency. Enum columns use `options`.
- **Row Actions:** Add buttons per row via `rowActions`. Action column is auto-added if actions exist.
- **Row Selection:** Clicking a row selects it. Triggers `rowSelectionAction` if set.
- **Conditional Row Styling:** Use `rowStyleRules` to color rows based on cell values and operators (e.g., '===', '>', 'contains').
- **Pagination:** Enable with `pagination.enable`. Infinite scroll if disabled.
- **Colors:** Customize row, hover, and border colors via `colors`.
- **Translations:** Override UI text (e.g., 'ALL') via `translations`.

---

## Example: Column Schema

```js
const schema = {
  id: { type: 'id', sort: true, textAlign: 'start', cellPadding: 8, size: 'sm', pin: 'left' },
  role: { type: 'enum', sort: true, options: [ { title: 'User', value: 'user' }, { title: 'Admin', value: 'admin' } ] },
  name: { type: 'text', filter: true },
  gender: { type: 'enum', options: [ { title: 'Male', value: 'male' }, { title: 'Female', value: 'female' } ], filter: true, sort: true },
  created_at: { type: 'date', filter: true, dateFormat: 'YYYY-MM-DD HH:MM' },
  deleted_at: { type: 'date' },
  is_admin: { type: 'bool', filter: true },
  // ...
};
```

---

## Example: TableConfig

```js
const tableConfig = {
  schema,
  data: [...],
  rowActions: [
    { title: 'Edit', onClick: 'onEdit' },
    { title: 'Delete', onClick: 'onDelete' }
  ],
  rowSelectionAction: 'onRowSelect',
  actionColumn: { pin: 'right', size: 'sm' },
  rowStyleRules: [
    { column: 'is_admin', operator: '===', value: true, color: '#ffeedd' }
  ],
  colors: {
    oddRowColor: '#F0F4FF',
    evenRowColor: '#FAFAFA',
    rowHoverColor: '#DCEBFF',
    borderColor: '#CBD5E1'
  },
  showBorder: true,
  pagination: { enable: true, pageSize: 25 },
  translations: { ALL: 'All' }
};
```

---

## Notes

- If a column is not defined in schema, it is skipped.
- Filtering, sorting, and pinning are opt-in per column.
- Action column is only shown if rowActions are provided.
- Row selection triggers an event and updates selectedRow in the model.
- Infinite scroll is used if pagination is disabled.
- See `script.js` for implementation details and advanced behaviors. 

