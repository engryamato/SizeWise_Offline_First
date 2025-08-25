# UI Component Catalog (Documentation only)

Purpose: Translate wireframes into composable React components and props, without full implementations.

## Core Components
- AppShell: header, sidebar, content, results panel
- JobsList: list of jobs with counts; reorderable
- SegmentCard: inputs (shape/dimensions/airflow/material/fittings/location); header summarizing; collapse/expand
- ResultsPanel: primary/secondary metrics + warnings
- SettingsModal: tabs (General, Locations & Endpoints, Rules & About, Account)
- Toast: ephemeral notifications

## Props (examples)
```ts
type SegmentCardProps = {
  segment: Segment;
  onChange: (patch: Partial<Segment>) => void;
  onMerge: () => void; onSplit: () => void; onDelete: () => void;
};
```

## Styling Tokens
- Colors: blueprint-blue, neutrals, semantic colors (as spec)
- Spacing: 8px grid
- Radius: 8–12px
- Typography: Inter/Roboto scale

## Accessibility
- Keyboard navigation order; ARIA labels for complex controls; focus rings; high-contrast mode

