# @teamprodevs/appsmith-custom-table

[![npm version](https://img.shields.io/npm/v/%40teamprodevs/appsmith-custom-table.svg)](https://www.npmjs.com/package/@teamprodevs/appsmith-custom-table)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785.svg)](https://custom-appsmith-table.netlify.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

A highly configurable table component built for Appsmith custom widgets. It combines React 18, TanStack Table v8, and TailwindCSS to deliver a powerful client-side table that integrates seamlessly with Appsmith's data sources including PostgreSQL, MongoDB, Elasticsearch, and REST APIs.

> ⚠️ **Maintenance Notice**: This project was developed as a job task and is **not actively maintained**. If you need additional features or bug fixes, please [fork this repository](https://github.com/smarts-uz/appsmith-custom-table/fork) and maintain your own version.

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| 📚 **Storybook Demo** | [custom-appsmith-table.netlify.app](https://custom-appsmith-table.netlify.app/?path=/story/appsmith-table--translated-table) |
| 📦 **NPM Package** | [npmjs.com/package/@teamprodevs/appsmith-custom-table](https://www.npmjs.com/package/@teamprodevs/appsmith-custom-table) |
| 🎯 **Appsmith Example** | [Live Appsmith Demo](https://custom-table.appsmith.com/app/appsmith-custom-table/basic-example-695f8fe01bbc1832a1e36e11?environment=production) |
| 💻 **GitHub Repository** | [github.com/smarts-uz/appsmith-custom-table](https://github.com/smarts-uz/appsmith-custom-table) |

## Features

- Full Appsmith custom component support (bundled + CDN).
- Client-side pagination with infinite scroll support.
- Tight integration with Appsmith's data models (PostgreSQL, MongoDB, Elasticsearch, REST APIs).
- Typed configuration powered by Zod schemas for validation.
- Rich styling hooks with Tailwind-first tokenization.
- Action hooks, event callbacks, and controlled `updateModel` APIs.
- Conditional row styling based on cell values.
- Multi-language support (i18n) for column headers and action labels.
- Built-in formatters for phone, date, datetime, and currency.
- Compatible with pgrest/dbtorest pagination patterns.

## Table of Contents

1. [Quick Links](#-quick-links)
2. [Installation](#installation)
3. [CDN Usage](#cdn-usage)
4. [Quick Start](#quick-start)
5. [Usage](#usage)
6. [API Reference](#api-reference)
   - [TableModel Props](#tablemodel-props)
   - [Column Schema](#column-schema)
   - [Column Types](#column-types)
7. [Row Actions](#row-actions)
8. [Conditional Styling](#conditional-styling)
9. [Translations (i18n)](#translations-i18n)
10. [Customization](#customization)
    - [Styles](#styles)
    - [CSS Variables](#css-variables)
11. [Events](#events)
12. [Development](#development)
13. [Contributing](#contributing)
14. [License](#license)
15. [Acknowledgements](#acknowledgements)

## Demo

Explore the live Storybook playground: https://custom-appsmith-table.netlify.app/

## Installation

```bash
npm install @teamprodevs/appsmith-custom-table
# or
yarn add @teamprodevs/appsmith-custom-table
```

## CDN Usage

Ideal for Appsmith widgets where bundling is not available.

```html
<script src="https://unpkg.com/@teamprodevs/appsmith-custom-table/dist/app.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@teamprodevs/appsmith-custom-table/dist/styles.css" />
```

## Quick Start

1. Define a schema describing each column's type and display options.
2. Pass your Appsmith query data to the `ClientTable` component.
3. Wire up `triggerEvent` and `updateModel` callbacks to Appsmith's APIs.
4. Optionally add custom styles, actions, and conditional formatting.

## Usage

### Client-side Table

```tsx
import { ClientTable } from "@teamprodevs/appsmith-custom-table";
import "@teamprodevs/appsmith-custom-table/dist/styles.css";

const data = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
];

const schema = {
  id: { type: "text", title: { en: "ID", uz: "ID" } },
  name: { type: "text", title: { en: "Name", uz: "Ism" } },
  age: { type: "text", title: { en: "Age", uz: "Yosh" } },
};

const MyTable = () => (
  <ClientTable
    tableData={data}
    schema={schema}
    locale="en"
    triggerEvent={(event, payload) => console.log(event, payload)}
    updateModel={(model) => console.log(model)}
    onModelChange={(model) => console.log(model)}
  />
);
```

### Infinite Scroll with Appsmith

The table triggers `onLoadMore` events for pagination. Wire this to your Appsmith query:

```tsx
import { ClientTable } from "@teamprodevs/appsmith-custom-table";

// In your Appsmith custom widget
const tableModel = {
  tableData: appsmith.model.queryData, // Data from your Appsmith query
  schema,
  locale: "en",
  limit: 20,
  max_count: appsmith.model.totalCount, // Total rows from your API
  triggerEvent: (event, payload) => appsmith.triggerEvent(event, payload),
  updateModel: (model) => appsmith.updateModel(model),
  onModelChange: (model) => console.log("table state", model),
};

const UsersTable = () => <ClientTable {...tableModel} />;
```

## API Reference

### TableModel Props

The `ClientTable` component accepts the following props (all validated via Zod schemas):

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tableData` | `any[]` | Yes | `[]` | Array of row data objects |
| `schema` | `Schema` | Yes | - | Column definitions (see [Column Schema](#column-schema)) |
| `locale` | `string` | Yes | - | Active language code for translations (e.g., `"en"`, `"uz"`, `"ru"`) |
| `triggerEvent` | `TriggerEvent` | Yes | - | Callback to trigger Appsmith events |
| `updateModel` | `UpdateModel` | Yes | - | Callback to update Appsmith model state |
| `onModelChange` | `OnModelChange` | Yes | - | Callback fired when table model changes |
| `limit` | `number` | No | `20` | Number of rows per page |
| `max_count` | `number` | No | `20` | Maximum total rows (for pagination) |
| `indexColumn` | `IndexColumn` | No | - | Configuration for row index column |
| `actionColumn` | `ActionColumn` | No | - | Configuration for action buttons column |
| `conditionalRowStyles` | `ConditionalRowStyle[]` | No | - | Rules for conditional row styling |
| `styles` | `AppsmithTableStyles` | No | - | Custom styling configuration |
| `rowSelectionAction` | `string` | No | - | Event name triggered on row selection |

### Column Schema

Each column in the `schema` object is defined with these options:

```typescript
const schema = {
  column_key: {
    type: "text",           // Column type (see Column Types)
    size: "md",             // Width: "xs" | "sm" | "md" | "lg"
    title: {                // Localized column headers
      en: "English Title",
      uz: "O'zbek Sarlavha",
      ru: "Русский заголовок"
    },
    className: "custom-class" // Custom CSS classes
  }
};
```

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `type` | `ColumnType` | No | `"text"` | Data type for formatting |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | No | `"md"` | Column width preset |
| `title` | `Record<string, string>` | No | - | Localized headers by language code |
| `className` | `string` | No | - | Custom CSS classes for column |

### Column Types

The table supports 6 column types with automatic formatting:

| Type | Description | Example Output |
|------|-------------|----------------|
| `text` | Plain text display (default) | `"John Doe"` |
| `url` | Clickable link (special format) | `<a href="...">Display Text</a>` |
| `phone` | Phone number formatting | `99 123 45 67` |
| `date` | Date formatting | `15-03-2024` |
| `datetime` | Date and time formatting | `15-03-2024 14:30` |
| `currency` | Currency with thousand separators | `1 234 567` |

#### URL Column Format

For URL columns, use the special format `"Display Text|||https://url.com"`:

```typescript
const data = [
  { 
    link: "Visit Site|||https://example.com",
    // Renders as clickable "Visit Site" link
  }
];

const schema = {
  link: { type: "url", title: { en: "Link" } }
};
```

When clicked, triggers `onRedirect` event with the URL.

## Row Actions

Add interactive action buttons to each row using the `actionColumn` configuration:

```typescript
import { ClientTable } from "@teamprodevs/appsmith-custom-table";

const tableModel = {
  tableData: data,
  schema: schema,
  locale: "en",
  actionColumn: {
    enable: true,
    pin: "right",              // "left" | "right"
    type: "outline",           // Button variant
    icon: "MoreVertical",      // Lucide icon for dropdown trigger
    actions: [
      {
        title: { en: "View", uz: "Ko'rish", ru: "Просмотр" },
        onClick: "onView",     // Event name to trigger
        icon: "Eye",           // Lucide icon name
        className: "text-blue-600"
      },
      {
        title: { en: "Edit", uz: "Tahrirlash", ru: "Редактировать" },
        onClick: "onEdit",
        icon: "Pencil"
      },
      {
        title: { en: "Delete", uz: "O'chirish", ru: "Удалить" },
        onClick: "onDelete",
        icon: "Trash2",
        className: "text-red-600"
      }
    ]
  },
  triggerEvent: (event, payload) => {
    // payload contains { row: <row data> }
    console.log(event, payload);
  },
  // ... other props
};
```

### Action Column Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `enable` | `boolean` | Yes | - | Enable/disable action column |
| `actions` | `RowAction[]` | Yes | - | Array of action definitions |
| `pin` | `"left" \| "right"` | No | `"right"` | Pin column position |
| `type` | `string` | No | `"default"` | Button variant |
| `icon` | `LucideIconName` | No | - | Icon for dropdown trigger |

### Button Variants

Available button variants: `"default"`, `"destructive"`, `"outline"`, `"secondary"`, `"ghost"`, `"link"`

### Supported Icons

All [Lucide React](https://lucide.dev/icons/) icons are supported. Use the icon name as a string (e.g., `"Eye"`, `"Pencil"`, `"Trash2"`, `"Activity"`, `"AlarmClockPlus"`).

## Conditional Styling

Apply dynamic styles to rows based on cell values using `conditionalRowStyles`:

```typescript
const tableModel = {
  // ... other props
  conditionalRowStyles: [
    // Highlight rows where used_days >= 150
    {
      column: "used_days",
      operator: ">=",
      value: 150,
      className: "bg-yellow-200"
    },
    // Red background for used_days >= 300
    {
      column: "used_days",
      operator: ">=",
      value: 300,
      className: "bg-red-400"
    },
    // Compare two columns: highlight when payment < debt
    {
      column: "total_payment",
      operator: "<",
      value: { columnRef: "debt_amount" },
      className: "text-red-800 font-bold"
    },
    // Green when payment >= debt
    {
      column: "total_payment",
      operator: ">=",
      value: { columnRef: "debt_amount" },
      className: "text-green-800 font-bold"
    }
  ]
};
```

### Conditional Style Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `column` | `string` | Yes | Column key to evaluate |
| `operator` | `RowStyleOperator` | Yes | Comparison operator |
| `value` | `string \| number \| boolean \| { columnRef: string }` | Yes | Value to compare against (or another column) |
| `className` | `string` | Yes | Tailwind/CSS classes to apply |

### Supported Operators

| Operator | Description |
|----------|-------------|
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |
| `===` | Strict equality |
| `==` | Loose equality |
| `!==` | Strict inequality |
| `!=` | Loose inequality |
| `contains` | String contains |
| `startsWith` | String starts with |
| `endsWith` | String ends with |
| `isEmpty` | Value is empty |
| `isNotEmpty` | Value is not empty |

### Column-to-Column Comparison

Use `{ columnRef: "column_name" }` to compare against another column's value:

```typescript
{
  column: "actual_amount",
  operator: "<",
  value: { columnRef: "expected_amount" },
  className: "text-red-600"
}
```

## Translations (i18n)

The table supports multi-language column headers and action labels:

### Column Header Translations

```typescript
const schema = {
  customer_name: {
    title: {
      en: "Customer Name",
      uz: "Mijoz Ismi",
      ru: "Имя клиента"
    },
    type: "text"
  },
  phone: {
    title: {
      en: "Phone Number",
      uz: "Telefon Raqam",
      ru: "Телефон номер"
    },
    type: "phone"
  }
};

// Set active language
<ClientTable
  schema={schema}
  locale="uz"  // Shows "Mijoz Ismi", "Telefon Raqam"
  // ...
/>
```

### Action Label Translations

```typescript
const actionColumn = {
  enable: true,
  actions: [
    {
      title: {
        en: "View Details",
        uz: "Batafsil ko'rish",
        ru: "Посмотреть детали"
      },
      onClick: "onView",
      icon: "Eye"
    }
  ]
};
```

## Customization

### Styles

Apply custom styles to different parts of the table:

```tsx
import { ClientTable } from "@teamprodevs/appsmith-custom-table";
import type { AppsmithTableStyles } from "@teamprodevs/appsmith-custom-table";

const styles: AppsmithTableStyles = {
  container: "bg-white shadow-md rounded-lg px-1",
  table: "border border-gray-200",
  head: {
    body: "bg-gray-100",
    row: "hover:bg-gray-200 transition-colors",
    cell: "border-b border-gray-300 font-semibold"
  },
  body: {
    body: "bg-white",
    row: "odd:bg-gray-50 even:bg-white hover:bg-blue-50",
    cell: "border-b border-gray-200 px-3 py-2"
  }
};

const StyledTable = () => (
  <ClientTable
    schema={schema}
    tableData={data}
    locale="en"
    styles={styles}
    // ...other props
  />
);
```

### Style Options

| Option | Type | Description |
|--------|------|-------------|
| `container` | `string` | Wrapper container classes |
| `table` | `string` | Table element classes |
| `head.body` | `string` | Table header body classes |
| `head.row` | `string` | Header row classes |
| `head.cell` | `string` | Header cell classes |
| `body.body` | `string` | Table body classes |
| `body.row` | `string` | Body row classes |
| `body.cell` | `string` | Body cell classes |
| `variables` | `Record<string, string>` | CSS custom properties |

### CSS Variables

Use CSS variables for theming with design tokens:

```typescript
const styles: AppsmithTableStyles = {
  head: {
    body: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    row: "hover:bg-[var(--primary-foreground)] hover:text-[var(--primary)]",
    cell: "border-b border-[var(--border)]"
  },
  body: {
    body: "bg-[var(--card)] text-[var(--card-foreground)]",
    row: "odd:bg-[var(--accent)] even:bg-[var(--card)] hover:bg-[var(--muted)]",
    cell: "border-b border-[var(--border)]"
  },
  container: "bg-[var(--card)] shadow-md rounded-lg px-1",
  variables: {
    "--primary": "hsl(220 70% 50%)",
    "--primary-foreground": "hsl(0 0% 100%)",
    "--card": "hsl(0 0% 100%)",
    "--card-foreground": "hsl(0 0% 10%)",
    "--border": "hsl(0 0% 90%)",
    "--accent": "hsl(43 74% 66%)",
    "--muted": "hsl(0 0% 96%)"
  }
};
```

### Index Column

Add a row index column:

```typescript
const tableModel = {
  // ...
  indexColumn: {
    enable: true,
    pin: "left",           // "left" | "right"
    className: "bg-gray-100 font-mono"
  }
};
```

## Events

The table triggers events through the `triggerEvent` callback:

| Event | Payload | Description |
|-------|---------|-------------|
| `onLoadMore` | `{ page, limit }` | Infinite scroll pagination request |
| `onRedirect` | `{ url }` | URL column click |
| `rowSelectionAction` | `{ row }` | Row selection (if configured) |
| Custom action events | `{ row }` | Row action button clicks |

### Example Event Handling in Appsmith

```javascript
// In your Appsmith custom widget
triggerEvent: (eventName, payload) => {
  switch(eventName) {
    case 'onView':
      appsmith.triggerEvent('onRowView', { data: payload.row });
      break;
    case 'onEdit':
      appsmith.triggerEvent('onRowEdit', { data: payload.row });
      break;
    case 'onDelete':
      appsmith.triggerEvent('onRowDelete', { data: payload.row });
      break;
    case 'onLoadMore':
      // Fetch next page
      appsmith.triggerEvent('fetchNextPage', { 
        page: payload.page, 
        limit: payload.limit 
      });
      break;
  }
}
```

## Appsmith Integration

This table is designed for tight integration with Appsmith's ecosystem:

- **Data Sources**: Works with any Appsmith-supported data source (PostgreSQL, MongoDB, Elasticsearch, REST APIs, GraphQL)
- **Infinite Scroll**: Triggers `onLoadMore` events that you wire to Appsmith queries for pagination
- **Event System**: All actions flow through Appsmith's `triggerEvent` and `updateModel` APIs
- **Client-Side Rendering**: All rendering happens in the browser; Appsmith handles data fetching
- **pgrest/dbtorest Compatible**: Pagination parameters match common REST patterns

### How It Works

1. Your Appsmith query fetches data from any supported source
2. Data is passed to `ClientTable` via the `tableData` prop
3. User interactions trigger events (row clicks, actions, load more)
4. You handle events in Appsmith to update queries or trigger workflows
5. Updated data flows back to the table

## Development

1. Clone and install dependencies.
2. Run `npm run storybook` for live component development.
3. Add stories, ensure lint/tests pass, then open a PR.

```bash
git clone https://github.com/smarts-uz/appsmith-custom-table.git
cd appsmith-custom-table
npm install
npm run storybook
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run storybook` | Start Storybook dev server on port 6006 |
| `npm run build` | Build the library for production |
| `npm run build-storybook` | Build static Storybook site |
| `npm run lint` | Run ESLint |

## Contributing

> ⚠️ **Note**: This project is not actively maintained. It was created as a job task to solve a specific problem. If you need new features or extended functionality, **please fork this repository** and develop your own version.

### Forking This Project (Recommended)

Since this project is not actively maintained, forking is the recommended approach:

1. **Fork the repository** — Click the ["Fork" button](https://github.com/smarts-uz/appsmith-custom-table/fork) on GitHub
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/appsmith-custom-table.git
   cd appsmith-custom-table
   ```
3. **Make it your own** — Add features, fix bugs, customize as needed
4. **Publish your fork** — You can publish to npm under your own package name

### Contributing Back (Critical Fixes Only)

For critical bug fixes that benefit everyone:

1. Create a feature branch from your fork
2. Make minimal, focused changes
3. Run checks: `npm run lint && npm run build`
4. Submit a PR with clear description

> **Note**: Response times may be slow and PRs may not be reviewed promptly.

### Attribution

If you fork and extend this project, please:
- Keep the MIT license
- Credit the original `tablecn` project for inspiration
- Link back to this repository

## License

MIT © Ramz001

## Acknowledgements

- Thanks to the Appsmith community for the platform that inspired this widget
- Thanks to the `tablecn` project for foundational inspiration
- This project was created as a job task at [Smarts](https://github.com/smarts-uz) to demonstrate Appsmith custom widget capabilities
 
