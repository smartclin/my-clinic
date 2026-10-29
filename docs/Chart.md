---

title: Overview
description: Learn what TanStack Charts provides, how its grammar works, and where charting responsibilities belong.
---

These docs follow unreleased `main`. The latest published TanStack Charts
release is `1.1.0`. Releases before 1.0 follow the [Alpha policy](./stability.md)
and may break APIs between minor releases. The
[stable compatibility contract](./compatibility.md) applies starting with 1.0.

TanStack Charts is a small, framework-agnostic chart grammar for TypeScript and
JavaScript. Give each mark its natural data, map fields or accessors to visual
channels, and use compact scales to define common numeric and categorical
axes. TanStack Charts compiles that declaration into a responsive, keyed scene
and renders accessible SVG by default, with Canvas available as an opt-in
surface.

TanStack Charts builds on the grammar-of-graphics tradition established by
[Leland Wilkinson](https://doi.org/10.1007/0-387-28695-0) and developed through
projects such as [ggplot2](https://ggplot2.tidyverse.org/),
[Vega-Lite](https://vega.github.io/vega-lite/), and
[Observable Plot](https://observablehq.com/plot/). Observable Plot is the
closest API influence for mark-local data, channels, and layered composition.
TanStack Charts applies those ideas to typed application infrastructure with
explicit scale and algorithm boundaries, responsive scene compilation, and
framework lifecycle.

The library is designed for two equally important authors:

- People should get polished, responsive charts from a short declaration.
- AI should be able to compose, inspect, and modify charts without learning an application-specific series model or guessing at hidden behavior.

The same definition can feed the vanilla DOM host and framework adapters.
React and Octane also provide optional Canvas entries; the experimental React
Native adapter consumes definitions from the universal entry.

## A chart is a composition

```ts group=overview-composition env=charts file=/src/chart.ts entry
import { defineChart, dot, lineY } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";

const signups = [
	{ month: "Jan", value: 42 },
	{ month: "Feb", value: 58 },
	{ month: "Mar", value: 51 },
	{ month: "Apr", value: 73 },
	{ month: "May", value: 86 }
];

export default defineChart({
	marks: [
		lineY(signups, {
			x: "month",
			y: "value",
			stroke: "#2563eb",
			strokeWidth: 2
		}),
		dot(signups, {
			x: "month",
			y: "value",
			fill: "#2563eb",
			r: 4
		})
	],
	scales: {
		x: {
			scale: () => scaleBand<string>().padding(0.2)
		},
		y: {
			scale: scaleLinear,
			nice: true,
			grid: true,
			axis: { label: "Signups" }
		}
	}
});
```

The line and dots use the same rows and scales. Their array order puts the
points above the line. [Scales](./concepts/scales-and-d3.md) explains when to
replace these compact scales with specialized mappings.

## What TanStack Charts owns

TanStack Charts owns the parts that make a declarative chart reliable inside an application:

- A grammar of typed marks, channels, scales, guides, and layers
- Container-responsive pixel ranges and automatic guide margins
- A renderer-neutral scene with stable keys
- Default SVG rendering, keyed DOM reconciliation, optional Canvas painting,
  and interruptible animation
- Pointer and keyboard focus, selection callbacks, and built-in tooltips
- Framework-agnostic runtime state with thin framework adapters
- Light and dark mode defaults based on inherited color and CSS variables
- Public extension points for custom marks, focus strategies, spatial indexes, and renderers

## Keep ownership explicit

TanStack Charts keeps data preparation explicit and optional algorithms behind
narrow imports.

| Responsibility                                                                                         | Owner                                                            |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Common numeric and categorical scale mappings                                                          | Exact `@tanstack/charts/scales/*` subpaths                       |
| Common group, bin, rollingWindow, normalize, select, and row-stack transforms                          | TanStack's eager data-transform helpers                          |
| Temporal, nonlinear, piecewise, spatial, and other specialized algorithms                              | Exact TanStack entries, granular D3 modules, or application code |
| Fetching, cleaning, profiling, and exploratory analysis                                                | Your data layer, server, or AI workflow                          |
| Mark-channel domain inference, responsive ranges, guide layout, scenes, rendering, and chart lifecycle | TanStack Charts                                                  |
| Page controls, queries, filters, persistence, memoization, and application state                       | Your application                                                 |

Prepared data can come from TanStack transforms, D3, SQL, a server, or
ordinary TypeScript; marks consume it without requiring a special series
container.

## Defaults for the common case

The normal path is intentionally short:

- Omit `width` to follow the chart container.
- Omit `margin` to measure axes, tick labels, rotation, and titles automatically.
- Supply `ariaLabel`; keyboard focus is enabled by default.
- Add the `tooltip` extension when a built-in value tooltip is enough.
- Start with compact linear, band, point, and ordinal scales; upgrade only the
  scale that needs fuller D3 semantics.
- Let built-in marks infer stable identity from IDs or unique positions; supply
  a stable `key` when that identity is unavailable or can change.
- Let field names, datum types, scales, interaction points, and adapters infer without casts.
- Use inherited `currentColor` and the `--ts-chart-*` CSS variables for automatic theme integration.

Every automatic behavior has an explicit escape hatch. The [Guides](./guides/responsive-charts.md) cover those controls by task rather than repeating the API reference.

## Package subpaths

Install only `@tanstack/charts`. Its ESM subpaths expose compact scales,
framework adapters, renderers, and optional capabilities while preserving
their tree-shakeable module boundaries. For example, React uses
`@tanstack/charts/react`, React Native uses
`@tanstack/charts/react-native`, and compact linear scales use
`@tanstack/charts/scales/linear`.

## Where to go next

- [Compare Libraries](./comparison.md) — evaluate Chart.js, Apache ECharts, Recharts, Observable Plot, and TanStack Charts against the pinned evidence.
- [Installation](./installation.md) — install Charts, framework peers, and any D3 modules your source imports directly.
- [Quick Start](./quick-start.md) — define, mount, update, and destroy a responsive chart.
- [Grammar of Graphics](./concepts/grammar-of-graphics.md) — understand how data, marks, channels, scales, and layers fit together.
- [Choosing a Chart](./guides/choosing-a-chart.md) — start from the analytical question.
- [Example Gallery](./examples/index.md) — run and edit complete compositions.
- [Migrating](./guides/migrating.md) — preserve semantics and establish parity before removing an existing renderer.
- [AI Authoring](./guides/ai-authoring.md) — give an agent the smallest reliable path from intent to verified output.

---

title: Compare Libraries
description: Compare TanStack Charts with measured and documentation-reviewed charting libraries.
---

The latest published TanStack Charts release is `1.1.0`, while this page
measures unreleased workspace source against pinned competitor packages. This
comparison records architectural differences and reproducible evidence without
turning untested behavior into a checkmark.

## Tested versions

| Library                                                                                | Package              | Measured source     |
| -------------------------------------------------------------------------------------- | -------------------- | ------------------- |
| [TanStack Charts](./overview.md)                                                       | `@tanstack/charts`   | workspace `69d7096` |
| [Chart.js](https://www.chartjs.org/docs/latest/)                                       | `chart.js`           | npm `4.5.1`         |
| [Apache ECharts](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/) | `echarts`            | npm `6.1.0`         |
| [Recharts](https://recharts.github.io/en-US/)                                          | `recharts`           | npm `3.10.1`        |
| [Observable Plot](https://observablehq.com/plot/features/plots)                        | `@observablehq/plot` | npm `0.6.17`        |

The competitor versions are exact package pins, not latest versions inferred
at page render time. The measured TanStack workspace revision is `69d7096`.

## Capability matrix

- ✅ Documented first-party component or API
- 🟡 Requires application composition, an external package, or explicit lifecycle work
- 🔴 No documented first-party path

“Measured” libraries are installed at the pinned versions above and exercised
by the controlled suite. “Docs” entries are reviewed against the linked
official documentation and carry no bundle or performance claim. Library rows
are sorted by GitHub repository stars read on `2026-07-31`, with TanStack
Charts pinned first. Stars are an ordering key, not an adoption measure.

| Library                                                                                | Axes and grid       | Legend        | Pointer tooltip   | Multi-series            | Selection                | Animation         | Responsive resize        | Evidence |
| -------------------------------------------------------------------------------------- | ------------------- | ------------- | ----------------- | ----------------------- | ------------------------ | ----------------- | ------------------------ | -------- |
| [TanStack Charts](./overview.md)                                                       | ✅ Built in         | ✅ Built in   | ✅ Built in       | ✅ Built in             | ✅ `onSelect`            | ✅ Built in       | ✅ Observed              | Measured |
| [D3](./concepts/scales-and-d3.md)                                                      | ✅ Modules          | 🟡 Authored   | 🟡 Authored       | ✅ Primitives           | ✅ Brush and events      | ✅ Transitions    | 🟡 Host layout           | Docs     |
| [Chart.js](https://www.chartjs.org/docs/latest/)                                       | ✅ Built in         | ✅ Plugin     | ✅ Plugin         | ✅ Datasets             | ✅ Event API             | ✅ Built in       | ✅ Observed              | Measured |
| [Apache ECharts](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/) | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Series               | ✅ Event API             | ✅ Built in       | 🟡 Explicit `resize()`   | Measured |
| [Recharts](https://recharts.github.io/en-US/)                                          | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Components           | ✅ Event props           | ✅ Built in       | ✅ `ResponsiveContainer` | Measured |
| [visx](https://github.com/airbnb/visx)                                                 | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Primitives           | ✅ Brush                 | 🟡 External       | ✅ `ParentSize`          | Docs     |
| [Plotly.js](https://plotly.com/javascript/)                                            | ✅ Built in         | ✅ Built in   | ✅ Built in       | ✅ Traces and subplots  | ✅ Box and lasso         | ✅ Built in       | ✅ Responsive config     | Docs     |
| [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)                | ✅ Built in         | 🟡 Host       | 🟡 Host           | ✅ Series               | 🟡 Events and host       | 🔴 No transitions | ✅ `autoSize`            | Docs     |
| [ApexCharts](https://apexcharts.com/docs/installation/)                                | ✅ Built in         | ✅ Built in   | ✅ Built in       | ✅ Series               | ✅ Point and range       | ✅ Built in       | ✅ Breakpoints           | Docs     |
| [Nivo](https://nivo.rocks/about/)                                                      | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Series               | ✅ Event props           | ✅ React Spring   | ✅ Responsive components | Docs     |
| [Highcharts](https://www.highcharts.com/docs/getting-started/system-requirements)      | ✅ Built in         | ✅ Built in   | ✅ Built in       | ✅ Series               | ✅ Point and range       | ✅ Built in       | ✅ Reflow                | Docs     |
| [Victory](https://commerce.nearform.com/open-source/victory/)                          | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Components           | ✅ Events and containers | ✅ `animate`      | ✅ Responsive container  | Docs     |
| [uPlot](https://github.com/leeoniya/uPlot)                                             | ✅ Built in         | ✅ Built in   | 🟡 Plugin or host | ✅ Series               | ✅ Cursor and select     | 🔴 No transitions | 🟡 `setSize()`           | Docs     |
| [Vega-Lite](https://vega.github.io/vega-lite/)                                         | ✅ Guides           | ✅ Built in   | ✅ Encoding       | ✅ Layers and views     | ✅ Parameters            | 🟡 Vega or host   | ✅ Container sizing      | Docs     |
| [Observable Plot](https://observablehq.com/plot/features/plots)                        | ✅ Marks and scales | ✅ Legend API | ✅ Tip mark       | ✅ Marks and transforms | 🟡 Host composition      | 🟡 Host-owned     | 🟡 Host rerender         | Measured |
| [Bklit UI](https://bklit.com/docs/installation)                                        | ✅ Components       | ✅ Component  | ✅ Component      | ✅ `ComposedChart`      | ✅ Brush                 | ✅ Motion         | ✅ Container measure     | Docs     |
| [AG Charts](https://www.ag-grid.com/charts/javascript/installation/)                   | ✅ Components       | ✅ Component  | ✅ Component      | ✅ Series               | ✅ Enterprise            | ✅ Enterprise     | ✅ Auto-size             | Docs     |

License color:

- 🟢 Permissive open source; commercial use allowed
- 🟡 Open core or mixed open/proprietary offering
- 🟠 Commercial use is conditional or revenue-limited
- 🔴 Paid license required for commercial use

| Library                                                                                | SVG output           | Canvas or WebGL output     | Framework-neutral core | License / paid tier                                                                                 |
| -------------------------------------------------------------------------------------- | -------------------- | -------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| [TanStack Charts](./overview.md)                                                       | ✅ Default           | ✅ Optional renderer       | ✅ Core + adapters     | 🟢 MIT                                                                                              |
| [D3](./concepts/scales-and-d3.md)                                                      | ✅ Yes               | ✅ Yes                     | ✅ Yes                 | 🟢 ISC                                                                                              |
| [Chart.js](https://www.chartjs.org/docs/latest/)                                       | 🔴 Canvas only       | ✅ Default                 | ✅ Yes                 | 🟢 MIT                                                                                              |
| [Apache ECharts](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/) | ✅ Optional renderer | ✅ Default                 | ✅ Yes                 | 🟢 Apache-2.0                                                                                       |
| [Recharts](https://recharts.github.io/en-US/)                                          | ✅ Default           | 🔴 No first-party renderer | 🔴 React only          | 🟢 MIT                                                                                              |
| [visx](https://github.com/airbnb/visx)                                                 | ✅ Default           | 🔴 No renderer             | 🔴 React only          | 🟢 MIT                                                                                              |
| [Plotly.js](https://plotly.com/javascript/)                                            | ✅ Common traces     | ✅ WebGL traces            | ✅ Yes                 | 🟢 MIT                                                                                              |
| [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)                | 🔴 No renderer       | ✅ Default                 | ✅ Yes                 | 🟢 Apache-2.0                                                                                       |
| [ApexCharts](https://apexcharts.com/docs/installation/)                                | ✅ Default           | 🔴 No renderer             | ✅ Yes                 | 🟠 [Free under $2M revenue; commercial or OEM otherwise](https://apexcharts.com/license/community/) |
| [Nivo](https://nivo.rocks/about/)                                                      | ✅ Default           | ✅ Selected charts         | 🔴 React only          | 🟢 MIT                                                                                              |
| [Highcharts](https://www.highcharts.com/docs/getting-started/system-requirements)      | ✅ Default           | ✅ Boost WebGL             | ✅ Yes                 | 🔴 [Commercial; separate non-commercial terms](https://shop.highcharts.com/license-16.0.pdf)        |
| [Victory](https://commerce.nearform.com/open-source/victory/)                          | ✅ Web               | ✅ Native Skia             | 🔴 React only          | 🟢 MIT                                                                                              |
| [uPlot](https://github.com/leeoniya/uPlot)                                             | 🔴 No renderer       | ✅ Default                 | ✅ Yes                 | 🟢 MIT                                                                                              |
| [Vega-Lite](https://vega.github.io/vega-lite/)                                         | ✅ Yes               | ✅ Canvas                  | ✅ Yes                 | 🟢 BSD-3-Clause                                                                                     |
| [Observable Plot](https://observablehq.com/plot/features/plots)                        | ✅ Default           | 🔴 No first-party renderer | ✅ Yes                 | 🟢 ISC                                                                                              |
| [Bklit UI](https://bklit.com/docs/installation)                                        | ✅ Default           | 🔴 No renderer             | 🔴 React only          | 🟡 [MIT components; proprietary Studio](https://github.com/bklit/bklit-ui#license)                  |
| [AG Charts](https://www.ag-grid.com/charts/javascript/installation/)                   | 🔴 No renderer       | ✅ Default                 | ✅ Yes                 | 🟡 [MIT Community; paid Enterprise](https://www.ag-grid.com/charts/javascript/licensing/)           |

A checkmark means the named path exists; it does not claim identical defaults,
accessibility, output, or performance.

The standard suite exercises axes, guides, tooltips, legends, and multi-series
composition. Selection, animation, and resize paths are recorded but excluded
from timing. Renderer and framework rows follow each package's documented
output model.

## Bundle snapshot

Baseline date: `2026-10-14`.

Controlled ranges cover 12 independently built, minified browser consumers:
line, bar, area, and scatter at basic, interactive, and advanced tiers. Only
Recharts has a separate incremental result because that lane externalizes
React and React DOM.

External figures are not comparable to the controlled cold-page ranges. Most
come from a [Bundlephobia main-export snapshot published on July 7,
2026](https://apexcharts.com/blog/state-of-javascript-charting-2026/). The
Vega-Lite, AG Charts, and uPlot main exports were read from Bundlephobia on July
31, 2026. Modular imports can be smaller, especially for
[AG Charts](https://www.ag-grid.com/charts/javascript/module-registry/).

| Library            | Bundle size                            |   React externalized | Evidence                                                   |
| ------------------ | -------------------------------------- | -------------------: | ---------------------------------------------------------- |
| TanStack Charts    | 43.21–49.50 kB gzip                    |       Not applicable | Controlled suite                                           |
| D3                 | 90 KB gzip                             |                    — | External main export                                       |
| Chart.js           | 45.78–59.61 kB gzip                    |                    — | Controlled suite                                           |
| Apache ECharts     | 156.77–177.34 kB gzip                  |                    — | Controlled suite                                           |
| Recharts           | 156.76–172.30 kB gzip                  | 97.24–112.60 kB gzip | Controlled suite                                           |
| visx               | 49 KB gzip                             |                    — | External `@visx/xychart` main export                       |
| Plotly.js          | ~250 kB partial; ~3.6 MB full min+gzip |                    — | [Vendor distribution figures](https://plotly.com/graphs/)  |
| Lightweight Charts | 60 KB gzip                             |                    — | External main export                                       |
| ApexCharts         | 164 KB gzip                            |                    — | External main export                                       |
| Nivo               | 143 KB gzip                            |                    — | External main export                                       |
| Highcharts         | 100 KB gzip                            |                    — | External main export                                       |
| Victory            | 105 KB gzip                            |                    — | External main export                                       |
| uPlot              | 22 KB gzip                             |                    — | External `uplot@1.6.32` main export                        |
| Vega-Lite          | 87 KB gzip                             |                    — | External `vega-lite@6.4.3`; excludes the peer Vega runtime |
| Observable Plot    | 85.34–94.15 kB gzip                    |                    — | Controlled suite                                           |
| Bklit UI           | —                                      |                    — | Registry-installed source; no fixed package bundle         |
| AG Charts          | 367 KB gzip                            |                    — | External `ag-charts-community@14.0.2` main export          |

The tracked baseline distinguishes the TanStack workspace revision from
competitor package versions and records the complete chart/tier matrix; the
deterministic bundle gate rejects either kind of drift.

The table does not report install size or runtime speed. The controlled
comparison builds the current TanStack workspace source and the pinned
competitor packages. Browser timing is meaningful only within one machine and
browser run, so this page does not publish a cross-machine timing leaderboard.

## Broader conformance

The catalog corpus contains 188 TanStack/reference pairs: 79 sourced from
Observable Plot, 98 from Recharts, and 11 from Apache ECharts. Twenty-two pairs
carry executable interaction scenarios. Those counts describe selected
reference coverage, not each library's feature ceiling or a list of built-in
TanStack chart types. Chart.js participates in the standard and stress suites,
not the catalog corpus.

The catalog displays each renderer entry, its transitive support and transform
files, and provenance for imported demo datasets. Its report counts the
complete authored source closure and publishes the source-line ratio for every
pair; moving a transform or layout into a support module does not remove it
from the comparison, while raw snapshot rows are not treated as chart
authoring.

TanStack deliberately keeps several responsibilities outside the default
runtime:

| Responsibility                                      | Owner                                                |
| --------------------------------------------------- | ---------------------------------------------------- |
| Binning, grouping, stacking, and statistics         | Hoistable TanStack transforms or granular D3 modules |
| Spatial layouts                                     | Application code using a suitable layout library     |
| Brush and zoom                                      | Controlled application state plus an exact behavior  |
| Scrubber and editor state                           | Application state and optional direct manipulation   |
| Data fetching, cleaning, filtering, and persistence | The application's data and state layers              |

Choose Chart.js when Canvas-first standard charts and its plugin ecosystem fit
the application. Choose Apache ECharts for a broad built-in controller and
chart catalog with Canvas or SVG output. Choose Recharts for a React-native SVG
component model. Choose Observable Plot for concise exploratory marks and
transforms. Choose TanStack Charts when one typed, framework-independent
definition must grow from standard charts into application-specific SVG or
Canvas composition while keeping D3 and state ownership explicit.

## Evidence and reproduction

- [Standard comparison protocol](https://github.com/TanStack/charts/blob/v1.1.0/benchmarks/comparison/README.md)
- [Current tracked bundle baseline](https://github.com/TanStack/charts/blob/main/benchmarks/comparison/bundle-baseline.json)
- [Pinned release-source bundle baseline](https://github.com/TanStack/charts/blob/v1.1.0/benchmarks/comparison/bundle-baseline.json)
- [Stress protocol](https://github.com/TanStack/charts/blob/v1.1.0/benchmarks/comparison/stress/README.md)
- [Catalog conformance protocol](https://github.com/TanStack/charts/blob/v1.1.0/benchmarks/conformance/README.md)

```sh
pnpm benchmark:size
pnpm benchmark:check
pnpm benchmark:stress:quick
pnpm conformance:quick
```

The browser-backed commands require the pinned Playwright browser. Read the
[bundle and performance guide](./guides/bundle-size-and-performance.md) before
interpreting results, and use the [migration guide](./guides/migrating.md) to
establish application-specific parity before replacing an existing library.
---

title: Installation
description: Install TanStack Charts with compact scales, framework adapters, and optional capabilities behind exact subpaths.
---

These docs follow unreleased `main`. The latest
published release is TanStack Charts `1.1.0`; use its
[release-source docs](https://github.com/TanStack/charts/tree/v1.1.0/docs)
for the exact surface. Releases before 1.0 follow the [Alpha policy](./stability.md)
and may break APIs between minor releases. The
[stable compatibility contract](./compatibility.md) applies starting with 1.0.
Install TanStack Charts in each application that authors chart definitions:

```sh
pnpm add @tanstack/charts
```

Add the selected framework peers when the application uses an adapter subpath:

```sh
# React
pnpm add @tanstack/charts react react-dom

# React Native
pnpm add @tanstack/charts react@^19.2.3 react-native@^0.86.0 react-native-svg@^15.15.4

# Preact
pnpm add @tanstack/charts preact

# Vue
pnpm add @tanstack/charts vue

# Solid
pnpm add @tanstack/charts solid-js

# Svelte
pnpm add @tanstack/charts svelte

# Angular
pnpm add @tanstack/charts @angular/core @angular/platform-browser

# Lit
pnpm add @tanstack/charts lit

# Alpine
pnpm add @tanstack/charts alpinejs

# Octane
pnpm add @tanstack/charts octane
```

Definitions and marks come from the package root. Adapter subpaths connect the
shared runtime to a framework lifecycle while preserving separate module-graph
boundaries for tree shaking.

Optional capabilities use exact subpaths from the same package:

```ts
import { focusGuideX } from "@tanstack/charts/focus/guide";
import { sunburst } from "@tanstack/charts/hierarchy/sunburst";
import { treeLayout } from "@tanstack/charts/hierarchy/tree";
import { treemap } from "@tanstack/charts/hierarchy/treemap";
import { brushX } from "@tanstack/charts/interaction/brush";
import { continuousCursor } from "@tanstack/charts/interaction/cursor";
import { handleX } from "@tanstack/charts/interaction/handle";
import { controlledSignal } from "@tanstack/charts/interaction/signal";
import { zoomX } from "@tanstack/charts/interaction/zoom";
import { interactiveColorLegend } from "@tanstack/charts/legend";
import { forceLayout } from "@tanstack/charts/network/force";
import { sankeyDiagram } from "@tanstack/charts/network/sankey";
import { keyedSelection, whenSelected } from "@tanstack/charts/selection";
import { contour } from "@tanstack/charts/spatial/contour";
```

The algorithm-backed subpaths own their `d3-contour`, `d3-force`,
`d3-sankey`, `d3-hierarchy`, `d3-brush`, `d3-zoom`, and `d3-selection`
implementations. The continuous cursor uses resolved scale inversion and adds
no D3 dependency. The scale handle uses the shared candidate-axis kernel and
also adds no D3 dependency. Install a corresponding D3 module in the
application only when application source imports it directly.

Eager transforms also have exact subpaths when a library needs a narrow import:

```ts
import { fold } from "@tanstack/charts/transform/fold";
```

`fold` is implemented by TanStack Charts and does not require an application
D3 dependency.

## Framework compatibility

| Adapter subpath                 | Framework peers                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `@tanstack/charts/react`        | React and React DOM 18 or 19                                                                 |
| `@tanstack/charts/react-native` | React `^19.2.3`, React Native `^0.86.0` or `^0.88.0`, and `react-native-svg` `>=15.15.4 <16` |
| `@tanstack/charts/preact`       | Preact `>=10`                                                                                |
| `@tanstack/charts/vue`          | Vue `>=3.5`                                                                                  |
| `@tanstack/charts/solid`        | Solid `>=1.8`                                                                                |
| `@tanstack/charts/svelte`       | Svelte `^5.20.0`                                                                             |
| `@tanstack/charts/angular`      | Angular core and platform browser `>=19`                                                     |
| `@tanstack/charts/lit`          | Lit `>=3.1.3`                                                                                |
| `@tanstack/charts/alpine`       | Alpine `>=3.15`                                                                              |
| `@tanstack/charts/octane`       | Octane `^0.1.13`                                                                             |

Framework peers are optional at the package level because package managers
cannot scope peers to individual export subpaths. Install only the peers for
the selected adapter. Use the framework's normal renderer or application
package when the application needs browser mounting or server rendering.

## React Native and Expo

The React Native adapter is experimental and renders through
`react-native-svg`. Expo 57 and 58 applications can install the package and the SVG
version selected by Expo:

```sh
pnpm add @tanstack/charts
pnpm exec expo install react-native-svg
```

Bare React Native 0.86 and 0.88 applications install the renderer directly:

```sh
pnpm add @tanstack/charts react react-native react-native-svg@^15.15.4
```

Run `bundle exec pod install` from `ios/` after adding it to a bare iOS
application. Metro does not reliably remove unused exports from a large barrel,
so import exact chart capabilities and choose the native host explicitly:

```tsx
import { lineY } from "@tanstack/charts/line";
import { Chart } from "@tanstack/charts/react-native";
import { tooltip } from "@tanstack/charts/react-native/tooltip";
import { defineChart } from "@tanstack/charts/scene";
```

Packed tarballs are typechecked and bundled through default bare React Native
and Expo Metro configurations on iOS and Android. The current fixtures cover
bare React Native 0.86.2 and Expo 58 with React Native 0.88.0. The earlier Expo
57 fixture rendered in Expo Go on an iOS simulator; Expo 58 has not yet been
verified on a simulator or device. Native responder and
accessibility cursor behavior has component regression coverage. Bare-native
and Android simulator runs, physical devices, visual parity, and screen-reader
verification are not currently part of the release gate.

## Choose scale capabilities

`@tanstack/charts/scales/*` covers the common numeric linear, band, point, and
ordinal mappings. Import each family from its exact entry:

```ts
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { scalePoint } from "@tanstack/charts/scales/point";
```

There is no aggregate `/scales` export. Each exact scale entry includes its own
TypeScript declarations and no D3 runtime dependency.

Use `d3-scale` when a chart needs time or UTC scales, logarithmic, power,
symlog, square-root, radial, sequential, diverging, quantile, quantize, or
threshold scales, piecewise or nonnumeric interpolation, or full D3 formatting
semantics:

```sh
pnpm add d3-scale
pnpm add -D @types/d3-scale
```

TanStack Charts accepts those D3 factories and configured instances through
the same scale contract. Your application must declare every `d3-*` module
that its source imports. Strict package managers do not expose transitive
dependencies as an application import contract.

The core package declares the `d3-array`, `d3-shape`, `d3-geo`, `d3-delaunay`,
`d3-hexbin`, `d3-contour`, `d3-force`, `d3-sankey`, `d3-hierarchy`, `d3-brush`,
and `d3-selection` implementations owned by its transforms, curve and geo
features, and optional spatial, network, hierarchy, and brush entries. They are
normal dependencies, not peer requirements, and bundlers remove unused
algorithms and geometry from application bundles.

Add direct data transforms or shape interpolation only when application source
imports them:

```sh
pnpm add d3-array d3-shape
pnpm add -D @types/d3-array @types/d3-shape
```

Other capabilities remain equally granular:

```sh
# Examples: install only what the application imports
pnpm add d3-geo d3-quadtree d3-delaunay d3-selection d3-zoom d3-brush d3-time d3-scale-chromatic
pnpm add -D @types/d3-geo @types/d3-quadtree @types/d3-delaunay @types/d3-selection @types/d3-zoom @types/d3-brush @types/d3-time @types/d3-scale-chromatic
```

Do not install the `d3` umbrella package just because a chart uses one D3 capability. Named modules keep ownership visible and make the measured consumer bundle reflect the chart that was actually authored. [Scales](./concepts/scales-and-d3.md) is the single guide to this boundary and links to the corresponding official D3 documentation.

## Package-manager examples

The same package contains the core, compact scales, adapters, and optional
capability subpaths:

```sh
# npm
npm install @tanstack/charts

# yarn
yarn add @tanstack/charts

# pnpm
pnpm add @tanstack/charts

# bun
bun add @tanstack/charts
```

Install the selected adapter's required framework peers. A shared definition
can move between adapter subpaths without changing marks, channels, scales, or
captured data.

## Import boundaries

Use the package root for ordinary application authoring:

```ts
import { defineChart, lineY, mountChart } from "@tanstack/charts";
```

Use subpath exports when an authored library needs a hard capability boundary:

```ts
import { mountChart } from "@tanstack/charts/dom";
import { lineY } from "@tanstack/charts/line";
import { renderChartSvg } from "@tanstack/charts/svg";
```

Use the universal barrel when definitions and scene compilation must not make
the browser host reachable:

```ts
import type { ChartDefinition } from "@tanstack/charts/types";
import {
	createChartRuntime,
	defineChart,
	lineY
} from "@tanstack/charts/universal";
```

The root remains the browser-oriented compatibility entry. Subpaths expose the
same contracts behind explicit capability boundaries.

Optional capabilities have explicit entries:

```ts
import { mountCanvasChart } from "@tanstack/charts/canvas";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { renderChartImage } from "@tanstack/charts/export";
import { focusGroupX } from "@tanstack/charts/focus";
import { geoShape } from "@tanstack/charts/geo";
import { polar, radialArc } from "@tanstack/charts/polar";
import { mountChartRenderer } from "@tanstack/charts/renderer";
import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";
```

Canvas remains optional in framework code too:

```tsx
import { Chart as OctaneCanvasChart } from "@tanstack/charts/octane/canvas";
import { Chart as OctaneRendererChart } from "@tanstack/charts/octane/core";
import { Chart as ReactCanvasChart } from "@tanstack/charts/react/canvas";
import { Chart as ReactRendererChart } from "@tanstack/charts/react/core";
```

The default entries are SVG-based. React and Octane currently provide the
optional `/canvas` and `/core` entries.

Polar and geographic marks are intentionally absent from the package root.
Their subpaths keep `d3-shape` and `d3-geo` unreachable from ordinary
Cartesian consumers.

## TypeScript

TanStack Charts, including its compact scale entries, ships its own
declarations. Install the matching `@types/d3-*` package for each D3 module your
TypeScript source imports.

Normal chart authoring should not require adapter generics or casts:

```ts
import { defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";

const values = [4, 9, 7];

const chart = defineChart({
	marks: [lineY(values)],
	scales: {
		x: { scale: scaleLinear },
		y: { scale: scaleLinear }
	}
});
```

If a channel or scale does not type-check, correct the source type, field, accessor, scale domain, or definition. The [TypeScript guide](./guides/typescript.md) covers inference and advanced custom marks.

## Browser and server requirements

Chart definitions, scene creation, and SVG string rendering do not require a
browser. The vanilla hosts require normal DOM APIs and use `ResizeObserver`
when width is responsive. Canvas rendering additionally requires Canvas 2D;
curved, polar, and geographic path data requires `Path2D`. React and Octane
Canvas entries emit an accessible shell on the server, then paint pixels and
connect the shared host on the client.

Use `initialWidth` for deterministic server and hidden-container output. See [SSR and Hydration](./guides/ssr-and-hydration.md) for adapter-specific setup.

## Verify the installation

Create a small scene without mounting it:

<!-- docs-example: installation-check typecheck -->

```ts
import { createChartScene, defineChart, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";

const chart = defineChart({
	marks: [lineY([2, 5, 3])],
	scales: {
		x: { scale: scaleLinear },
		y: { scale: scaleLinear }
	}
});

const scene = createChartScene(chart, { width: 640, height: 320 });

console.log(scene.chart, scene.points.length);
```

Both positional scales are required. A missing scale is an authoring error rather than a hidden fallback.

Continue with the [Quick Start](./quick-start.md), then open the adapter page
for the framework that owns the chart component.
---

title: Alpha Stability
description: Understand what TanStack Charts Alpha versions promise, what may change, and how releases communicate breaking changes.
---

TanStack Charts releases before 1.0 follow this Alpha policy. Packages use regular `0.x` versions on the normal
`latest` npm tag, without an `-alpha` suffix or separate release channel.

Alpha is ready for evaluation and early application integration. It is not a
stable API promise. Pin an exact version in production applications and test an
upgrade before changing that pin.

## Version contract

All public TanStack Charts packages move together as one fixed release group.

- Patch releases fix defects and do not intentionally remove or rename public
  APIs. A fix may correct rendering or interaction that was observably wrong.
- Minor releases may add features and may contain breaking API changes while
  the package major remains `0`.
- The [stable compatibility contract](./compatibility.md) takes effect with
  `1.0`; published `0.x` releases continue to follow this Alpha policy.

## Public surface

The public surface is the package export map and the APIs documented on this
site. Source files, internal modules, unexported types, generated scene details,
and undocumented behavior may change without a migration path.

Framework adapters share the same chart definition and release version. Their
runtime support and peer ranges are listed in
[Installation](./installation.md#framework-compatibility).

## Breaking changes

A breaking Alpha release must include a changeset, changelog entry, and concrete
migration instructions. We will use a development warning ahead of removal when
that warning is practical and useful, but Alpha does not promise a minimum
deprecation window.

Production bundles do not retain development migration warnings. Removed APIs
fail through TypeScript or an actionable runtime error instead of silently
falling back to an older interpretation.

## Report a regression

[Open a GitHub issue](https://github.com/TanStack/charts/issues/new/choose) with
the exact package version, framework, browser or native runtime, a minimal
reproduction, and the expected and actual result. A regression in a patch
release is treated as a defect against this policy.
---

title: Stable Compatibility
description: The compatibility contract intended for TanStack Charts 1.0 and later.
---

This contract takes effect with TanStack Charts 1.0. Published 0.x releases
continue to follow the [Alpha policy](./stability.md).

## Versions and deprecations

The public Charts packages share one coordinated version. Patch releases fix
defects. Minor releases add compatible capabilities. Removing a supported API,
renaming an option, narrowing supported input, changing a documented default,
or dropping a supported framework or runtime requires a major release.

A deprecated API remains supported throughout its current major version.
Deprecations include a documented replacement and migration instructions.
Production bundles do not need to retain migration warnings to provide this
guarantee. A correctness fix may change an output that contradicted the
documented behavior; its release notes explain the correction.

## Public API

The package export map and documented authoring and extension contracts define
the supported surface. This includes custom marks, scales, interaction indexes,
renderers, and the scene types those extensions are documented to consume or
produce. Consumers can emit portable declarations for inferred chart definitions
and marks from installed packages.

Source paths, private modules, undocumented DOM selectors, incidental scene
nesting, generated keys, and exact serialized formatting are implementation
details. Documented key identity, paint order, datum ownership, interaction,
mount/update/destroy behavior, and SSR adoption are compatibility contracts.

New optional capabilities must preserve existing import boundaries. A consumer
that does not import a capability must not gain its dependencies. Per-entry
bundle gates and published measurements make this verifiable. Performance
regressions are treated as defects and are investigated with equivalent builds
and representative workloads.

## Frameworks, runtimes, and renderers

Supported peer ranges and runtime requirements are listed in
[Installation](./installation.md). A peer range does not promise identical
features across renderers. The SVG, Canvas, and custom renderer contracts and
their differences are documented in
[Rendering and Export](./reference/rendering-and-export.md).

Server-side scene compilation and SVG serialization do not require browser
globals. DOM mounting requires the documented browser APIs. Optional motion,
Canvas paths, image export, and framework hydration each retain their stated
requirements. Unsupported capabilities must fail clearly rather than silently
change their meaning.

Accessibility includes chart names and descriptions, documented keyboard
interaction, focus restoration, and reduced-motion behavior. Applications own
their surrounding controls, meaningful descriptions, and alternative data
presentations. See [Accessibility](./guides/accessibility.md).

## Experimental capabilities

An experimental capability is identified in its reference documentation before
release, with the supported scope and limitations. Its label is not permission
to change unrelated stable APIs. Breaking changes to the experimental surface
must include release notes and migration instructions.

React Native remains experimental until native-device validation proves the
documented interaction, accessibility, and rendering behavior. Its current
Metro, Expo, declaration, and component checks are described in
[Installation](./installation.md#react-native-and-expo).

Unreleased proposals, draft PRs, and feature requests do not form part of this
contract. A capability becomes supported when its implementation, public types,
documentation, and release verification agree.
---

title: Quick Start
description: Build, mount, update, and clean up a responsive TanStack Charts line chart with fully inferred types.
---

This walkthrough uses the framework-agnostic DOM host. The same chart
definition passes unchanged to any supported
[framework adapter](./installation.md#framework-compatibility).

Install TanStack Charts:

```sh
pnpm add @tanstack/charts
```

## 1. Add a chart container

```html
<div id="monthly-revenue-chart"></div>
```

The host follows the container width when `width` is omitted.

## 2. Define the data and chart

<!-- docs-example: core-quick-start typecheck -->

```ts
import { defineChart, lineY, mountChart } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";

interface RevenueMonth {
	month: string;
	revenue: number;
}

const monthlyRevenue: readonly RevenueMonth[] = [
	{ month: "Jan", revenue: 42_000 },
	{ month: "Feb", revenue: 58_000 },
	{ month: "Mar", revenue: 76_000 },
	{ month: "Apr", revenue: 64_000 },
	{ month: "May", revenue: 81_000 }
];

const monthlyRevenueChart = defineChart({
	marks: [
		lineY(monthlyRevenue, {
			id: "monthly-revenue",
			x: "month",
			y: "revenue",
			points: true,
			stroke: "#2563eb"
		})
	],
	scales: {
		x: {
			scale: () => scalePoint<string>().padding(0.2),
			axis: { label: "Month" }
		},
		y: {
			scale: scaleLinear,
			nice: true,
			grid: true,
			axis: { label: "Revenue (USD)" }
		}
	},

	tooltip
});
```

The compact point and linear scales cover this categorical and numeric chart
without a D3 dependency. The original revenue row flows through the mark and
into interaction callbacks; no cast or manual chart generic is needed.

## 3. Mount it

```ts
const container = document.querySelector<HTMLElement>("#monthly-revenue-chart");

if (!container) {
	throw new Error("Missing #monthly-revenue-chart container");
}

const options = {
	definition: monthlyRevenueChart,
	height: 360,
	initialWidth: 640,
	ariaLabel: "Monthly revenue"
};

const host = mountChart(container, options);
```

`initialWidth` is the deterministic fallback for server output, hidden containers, and the first frame before measurement. Once visible, the host uses `ResizeObserver` to follow the container.

## 4. Update the chart

Host options only cover mounting concerns such as size and accessibility:

```ts
host.update({
	...options,
	height: 420
});
```

When data, visual options, focus, tooltips, keyboard policy, or animation
change, create a new definition and pass it to `host.update`. In a framework
component, memoize the complete definition against the values it captures. See
[Chart definitions](./concepts/chart-definitions.md).

## 5. Clean up

```ts
host.destroy();
```

Destroying the host removes observers, event listeners, animations, tooltips, and chart markup. Framework adapters do this automatically during unmount.

## What the declaration means

- `lineY(monthlyRevenue, ...)` chooses a line mark and keeps each source row as
  the interaction datum.
- `x: 'month'` and `y: 'revenue'` map existing source fields.
- The unique month gives each observation stable positional identity across updates.
- Compact scale factories infer domains from mark channels and own mapping behavior.
- TanStack Charts copies those scales and assigns responsive pixel ranges.
- `label`, `format`, and `grid` configure the axis guide without changing the scale.
- Omitted margins are measured automatically from the rendered labels and titles.
- `ariaLabel` names the chart; pointer and keyboard focus use the same inferred points.

## Read [Grammar of Graphics](./concepts/grammar-of-graphics.md) for the full model, then browse the [Example Gallery](./examples/index.md) for complete compositions.

title: React Quick Start
description: Install the React adapter, define a typed chart, render responsive SVG, and add native interaction.
---

Install TanStack Charts and its React peers:

```sh
pnpm add @tanstack/charts react react-dom
pnpm add -D @types/react @types/react-dom
```

The shared [Scales](../../concepts/scales-and-d3.md) page explains the
compact scale families and when a chart needs D3 instead.

## Define a chart

Definitions are ordinary framework-independent TypeScript:

```tsx group=react-quick-start env=charts-react file=/src/App.tsx entry
import { barY, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";

import { alphabet } from "./data";

const percent = new Intl.NumberFormat("en-US", {
	style: "percent",
	maximumFractionDigits: 1
});

const letterFrequencyChart = defineChart({
	marks: [
		barY(alphabet, {
			x: "letter",
			y: "frequency"
		})
	],
	scales: {
		x: {
			scale: () => scaleBand().padding(0.18)
		},
		y: {
			scale: scaleLinear,
			nice: true,
			grid: true,
			axis: {
				label: "Frequency",
				ticks: { format: value => percent.format(value) }
			}
		}
	},

	tooltip
});

export default function App() {
	return (
		<Chart
			definition={letterFrequencyChart}
			height={320}
			ariaLabel='English letter frequencies'
		/>
	);
}
```

```ts group=react-quick-start file=/src/data.ts collapsed
export interface AlphabetRow {
	letter: string;
	frequency: number;
}

export const alphabet: readonly AlphabetRow[] = [
	{ letter: "E", frequency: 0.12702 },
	{ letter: "T", frequency: 0.09056 },
	{ letter: "A", frequency: 0.08167 },
	{ letter: "O", frequency: 0.07507 },
	{ letter: "I", frequency: 0.06966 }
];
```

The definition infers the original row and semantic x/y types. Do not add
component generics or cast the definition.

## Responsive sizing

Use a fixed height with responsive width:

```tsx
<Chart
	definition={letterFrequencyChart}
	height={320}
	ariaLabel='English letter frequencies'
/>;
```

Or give the host a proportional box:

```tsx
<Chart
	definition={letterFrequencyChart}
	aspectRatio={16 / 9}
	initialWidth={720}
	ariaLabel='English letter frequencies'
/>;
```

The outer element fills its available width when `width` is absent. The
adapter server-renders with `initialWidth`, then the shared DOM host measures
the actual container after hydration. See
[React adapter](./adapter.md#sizing-and-layout).

## Memoize live definitions

When a chart captures component values, memoize the complete definition:

```tsx
import { useMemo } from "react";

interface LetterFrequencyInput {
	rows: readonly AlphabetRow[];
	accent: string;
}

export function LiveLetterFrequency({ rows, accent }: LetterFrequencyInput) {
	const definition = useMemo(() => {
		return defineChart({
			marks: [
				barY(rows, {
					x: "letter",
					y: "frequency",
					fill: accent
				})
			],
			scales: {
				x: {
					scale: () => scaleBand().padding(0.18)
				},
				y: {
					scale: scaleLinear,
					nice: true
				}
			},

			svgAnimation: true,
			tooltip
		});
	}, [rows, accent]);

	return (
		<Chart
			definition={definition}
			height={320}
			ariaLabel='Filtered English letter frequencies'
		/>
	);
}
```

The application controls definition updates through the dependency list. A new
definition identity tells TanStack Charts to rebuild the scene. See
[Chart Definition API](../../reference/chart-definitions.md).

## Interaction callbacks

Callback types flow from the marks:

```tsx
<Chart
	definition={letterFrequencyChart}
	height={320}
	ariaLabel='English letter frequencies'
	onFocusChange={point => {
		if (point) {
			console.log(point.datum.letter, point.yValue);
		}
	}}
	onSelect={point => {
		if (point) openLetter(point.datum.letter);
	}}
/>;
```

The built-in tooltip is optional. Grouped focus, formatting, keyboard behavior,
and application-owned interaction are documented in
[Focus and interaction](../../reference/focus-and-interaction.md).

## Render React tooltip content

Keep `Chart` from `@tanstack/charts/react` when the built-in tooltip is enough.
To pass `renderTooltipBody`, switch the component import to the optional React
tooltip entry:

```tsx
import { Chart } from "@tanstack/charts/react/tooltip";

export function ChartWithCustomTooltip() {
	return (
		<Chart
			definition={letterFrequencyChart}
			height={320}
			ariaLabel='English letter frequencies'
			renderTooltipBody={({ defaultBody, pinned, dismiss }) => (
				<>
					{defaultBody}
					{pinned ? <button onClick={dismiss}>Close</button> : null}
				</>
			)}
		/>
	);
}
```

Existing `renderTooltipBody` users should migrate the component import from
`@tanstack/charts/react` to `@tanstack/charts/react/tooltip`. The definition
still uses `tooltip` from `@tanstack/charts/tooltip`.

Continue with the [React adapter](./adapter.md) for lifecycle and SSR, the
[`Chart` reference](./reference/chart.md) for every prop, or the
[core API reference](../../reference/index.md) for definitions, marks, scales,
and rendering.
---

title: React Adapter
description: Understand the thin React lifecycle, SSR, hydration, update, sizing, class, and style behavior around the shared chart host.
---

`@tanstack/charts/react` is a thin lifecycle and SSR adapter around
`@tanstack/charts`. Chart definitions, scale resolution, guide layout, scenes,
rendering, animation, and interaction remain in the framework-neutral core.

## Public exports

```ts
export { Chart } from "@tanstack/charts/react";

export type {
	ChartCommonProps,
	ChartProps,
	ChartDefinition,
	ChartPoint
} from "@tanstack/charts/react";
```

Choose Canvas or an application-supplied renderer through an explicit
subpath:

```tsx
import { Chart as CanvasChart } from "@tanstack/charts/react/canvas";
import { Chart as RendererChart } from "@tanstack/charts/react/core";
```

`CanvasChart` selects the optional built-in renderer. `RendererChart` requires
a `renderer` prop. The default `Chart` remains SVG-based, so importing the
default adapter does not pull Canvas into its module graph. A definition can
still import `canvasChartRenderer` and assign it to selected marks, which makes
the default component render an ordered mixed surface.

The base entries render the built-in tooltip without the React tooltip-body
bridge. Import from the optional tooltip entry when passing
`renderTooltipBody`:

```tsx
import {
	Chart,
	CanvasChart,
	RendererChart,
	type ChartTooltipBodyRenderContext
} from "@tanstack/charts/react/tooltip";
```

Existing `renderTooltipBody` users should move the default component import
from `@tanstack/charts/react` to `@tanstack/charts/react/tooltip`. For Canvas
or an application renderer, replace the aliased `Chart` import from `/canvas`
or `/core` with `CanvasChart` or `RendererChart` from `/tooltip`.

Use the re-exported definition and point types only when an application API
needs an explicit annotation. Ordinary component use is inferred.

## Render lifecycle

The adapter creates one `ChartRuntime` per mounted component and asks the
selected renderer for its initial markup during React render. After commit:

1. a layout effect mounts the shared DOM host into the existing chart surface
2. the same runtime is passed to the host
3. a second layout effect forwards the latest complete host options
4. later React commits call `host.update`; a new definition identity rebuilds
   the scene
5. effect cleanup destroys the host and runtime-owned browser behavior

The chart surface is memoized after its first render. Scene changes are painted
by the shared host rather than by rebuilding the surface through React.
Memoize definitions that capture component values with `useMemo`; module-scope
definitions need no component memoization.

React batching may omit intermediate application states. Every committed prop
set forwarded to the host remains declarative and complete.

## SSR and hydration

### Next.js App Router

React chart entries include `'use client'`. This identifies the React Server
Component boundary, it does not disable server-rendered SVG.

Put the chart definition, configured scales, renderers, and callbacks inside
your application's client component. Pass data from a Server Component, not a
`defineChart()` result. Definitions contain functions and scale instances that
cannot cross that boundary as serializable props.

```tsx
"use client";

import { defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { useMemo } from "react";

export function TrafficChart({
	rows
}: {
	rows: { hour: number; visits: number }[];
}) {
	const definition = useMemo(
		() =>
			defineChart({
				marks: [lineY(rows, { x: "hour", y: "visits" })],
				scales: { x: { scale: scaleLinear }, y: { scale: scaleLinear } }
			}),
		[rows]
	);

	return (
		<Chart
			definition={definition}
			ariaLabel='Hourly traffic'
			initialWidth={720}
			height={260}
		/>
	);
}
```

The same boundary applies to `/react/core`, `/react/canvas`, `/react/tooltip`,
and the corresponding `@tanstack/react-charts` entries. See Next.js's
[Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
for prop serialization and server rendering.

### Default server output

The default SVG entry emits:

- the outer `.ts-chart-host` div
- a `.ts-chart-surface` div
- the complete accessible shared SVG at `initialWidth`

The client renders the same initial structure, then the layout effect adopts
and reconciles that SVG. There is no placeholder-only server mode.

If you want to skip server chart rendering, use the application-owned
[client-only chart](../../guides/ssr-and-hydration.md#client-only-react-charts)
pattern. It preserves the same placeholder during the first browser render.

The Canvas entry emits the same outer structure with a named Canvas root and
five `aria-hidden` canvases: one hidden stable base bitmap and four live paint
layers. It does not paint pixels on the server. The client adopts those
elements, paints after mount, and attaches the same focus, keyboard, tooltip,
and selection host.

A default chart with selected Canvas marks emits one mixed root containing
ordered SVG markup and Canvas shells. SVG marks are visible in the server
response, Canvas pixels appear after mount, and the client adopts every child
surface.

Use deterministic data, scale domains, definitions, dimensions, and custom
renderers on server and client. The adapter generates a sanitized `idPrefix`
from `React.useId()` when one is not supplied, keeping document resources
stable through hydration.

`tabIndex` defaults to `0` on both server and client. `keyboard: false` forces
it to `-1`.

The default SVG renderer emits gradients and clipping on both server and
client. Custom serializers must preserve the same resources. See
[Rendering and export](../../reference/rendering-and-export.md#svg-resources).

## Sizing and layout

The adapter renders two nested containers:

```text
.ts-chart-host
  .ts-chart-surface
    svg.ts-chart | div.ts-chart-canvas | div.ts-chart-layers
```

The outer host has `position: relative`.

| Props                               | Outer host behavior             | Scene behavior                  |
| ----------------------------------- | ------------------------------- | ------------------------------- |
| no `width`, fixed `height`          | `width: 100%`; fixed height     | container width × fixed height  |
| fixed `width` and `height`          | fixed CSS width and height      | same fixed scene dimensions     |
| fixed `width` and `aspectRatio`     | fixed width and CSS ratio       | fixed width divided by ratio    |
| positive `aspectRatio`, no `height` | `width: 100%`; CSS aspect ratio | measured width divided by ratio |
| neither `height` nor `aspectRatio`  | `width: 100%`; `height: 320px`  | measured width × 320            |

`initialWidth` defaults to `640` and controls the initial/server scene when
`width` is absent. A fixed `height` takes precedence over `aspectRatio`.
Nonpositive and nonfinite ratios fall back to the default height.

The DOM host observes responsive dimensions and measures the inherited
container font. Its exact fallback and relayout behavior is documented in
[DOM host](../../reference/dom-host.md#responsive-sizing).

## `className` and `style`

React-specific presentation props apply to the outer `.ts-chart-host`:

```tsx
<Chart
	definition={definition}
	ariaLabel='Revenue'
	className='dashboard-chart'
	style={{ minHeight: 240, color: "var(--foreground)" }}
/>;
```

- `className` is appended after `ts-chart-host`.
- `style` is `React.CSSProperties`.
- custom style fields override the adapter's computed position, width, height,
  and aspect ratio because they are spread last.

Do not give `style.width` a value that conflicts with a fixed `width` prop. The
style controls the outer CSS box, while the prop continues to lock the scene
width. A custom `style.height` remains live when both `height` and
`aspectRatio` are absent. Either sizing prop stays authoritative over CSS
height when supplied.

Core renderer `className` options apply to a surface when calling it directly.
The React adapter's `className` intentionally owns the outer element instead.

## Tooltip body composition

The components from `@tanstack/charts/react/tooltip` accept
`renderTooltipBody`, which mounts React content into the built-in tooltip
surface. Its context provides `points`, `content`, `defaultBody`, `pinned`,
and `dismiss`. Composing `defaultBody` keeps the core title, rows, formatting,
and swatches; arbitrary React content can sit beside it.

The shared host owns a stable body mount target and releases it when the
tooltip is hidden, custom rendering is disabled, or the chart is destroyed.
React owns the rendered component lifecycle. A custom body is inert while
transient, so display-only content can remain visible but controls should
render only while `pinned` is true. Adding the `portal` extension to the
tooltip options promotes the whole surface above clipped ancestors without
changing this React API.

For pin-only detail, set `visibility: 'pinned'` in the definition. The shared
host then mounts the native surface and React body only after activation.

## Definition identity

Define a fixed chart outside component render:

```tsx
import { defineChart } from "@tanstack/charts";

const definition = defineChart({
	marks: [],
	scales: {
		x: null,
		y: null
	}
});
```

For live state, memoize the complete definition against the values it captures.
Definition identity is the application update boundary; see
[Chart Definition API](../../reference/chart-definitions.md).

## Callback freshness

Every committed prop set is forwarded to the host. Focus, grouped focus,
selection, and render callbacks therefore use the latest committed functions.
Callback types are inferred from the definition's marks.

## Core boundary

The adapter does not redefine:

- marks or chart specs
- scale selection and data-preparation ownership
- tooltip and focus semantics
- animation and reconciliation
- custom marks or renderers

Use [Scales](../../concepts/scales-and-d3.md) for the injected primitive
boundary and the [core reference](../../reference/index.md) for those APIs.
