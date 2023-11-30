# Sidebar Component Documentation

The `Sidebar` component is an essential part of the user interface, allowing for hierarchical navigation within the app's sections, sequences, and units.

## Structure

The sidebar mainly consists of:
- Sections: The top-most hierarchical level, with each section containing multiple sequences.
- Sequences: The middle hierarchical level, which contains multiple units.
- Units: The individual units inside each sequence.

The hierarchy follows the structure: `Section > Sequence > Unit`.

## Components

1. **Sidebar:** The main sidebar container. Its main functionalities include:
    - Toggling the sidebar's state (expanded or collapsed).
    - Scroll to the current unit.
    - Collapse all items.
    - Expand all items.

2. **Section:** Represents the top-level sections. Each section can be expanded or collapsed to show or hide its child sequences.

3. **Sequence:** Represents the sequences inside a section. Each sequence can also be expanded or collapsed to show or hide its child units.

4. **Unit:** Represents the individual units. Clicking on a unit will navigate the user to the appropriate unit page.

## Code Implementation

### Logic

- **useDispatch & useSelector Hooks**: These hooks from `react-redux` are used to dispatch actions and select parts of the Redux state, respectively.
  
- **toggleDesktopSidebar**: Toggles the state of the sidebar (expanded or collapsed).

- **toggleOpenCollapseSidebarItem**: Toggles the collapsible state of a sidebar item, whether it's a section, sequence, or unit.

- **collapseAllSidebarItems & expandAllSidebarItems**: Collapse or expand all sidebar items respectively.

- **scrollToCurrentUnit**: Ensures the current unit is visible in the viewport, using the smooth scrolling effect.

- **handleKeydownEvent**: Allows the user to navigate the sidebar using the ArrowUp and ArrowDown keys, improving accessibility.

### Props

The `Sidebar` component expects three props:

- `currentUnitId`: The ID of the current unit.
- `sequenceId`: The ID of the sequence currently being viewed.
- `isSidebarExtended`: A boolean indicating whether the sidebar is expanded or collapsed.

To use the Sidebar component in your application, you need to import and render it within your React component. Here's an example of how to use it:

```javascript
import Sidebar from 'sidebar-component';

// Inside your component's render method
render() {
  return (
    <Sidebar
      currentUnitId={currentUnitId}
      sequenceId={sequenceId}
      isSidebarExtended={isSidebarExtended}
    />
  );
}
```

Make sure to pass the required props as shown in the example above.

### CSS Classes

- **sidebar-container**: The main container of the sidebar.
- **sidebar-header**: The top bar of the sidebar, containing action buttons.
- **sidebar-content**: The main content area of the sidebar, housing the sections, sequences, and units.

## Redux Integration

### Selectors

- **collapsibleMenuStateSelector**: Returns the state of each collapsible menu item in the sidebar. Each item (section, sequence, unit) will have a corresponding boolean indicating its expanded/collapsed state.

### Slice

The Redux slice for the sidebar is named 'sidebar' and has the following structure:

- `collapsibleMenuState`: An object where keys are item IDs and values are booleans indicating if the item is expanded or collapsed.

**Actions**:
- `updateCollapsibleMenuState`: Updates the state of multiple sidebar items.
- `toggleOpenCollapseSidebarItem`: Toggles the state of a single sidebar item.
- `collapseAllSidebarItems`: Collapses all sidebar items.
- `expandAllSidebarItems`: Expands all sidebar items.

## Keyboard Navigation

The Sidebar component includes keyboard navigation features to enhance accessibility for users who rely on keyboard inputs. Users can navigate through focusable elements using the Arrow Up and Arrow Down keys within the sidebar.

- When the sidebar is focused, pressing the Arrow Up key navigates to the previous focusable element.
- When the sidebar is focused, pressing the Arrow Down key navigates to the next focusable element.
- These navigation features improve the user experience for keyboard users, ensuring that they can interact with the sidebar easily.


## What is `collapsibleMenuState`?

`collapsibleMenuState` is an essential component of our application that manages the expand and collapse state of specific elements within the Sidebar, it is an object designed to store information about the expand/collapse state of elements within the Sidebar. Its structure is as follows:

```javascript
collapsibleMenuState: {
  [elementId]: isExpanded,
  // Additional elementId: isExpanded pairs...
}
```

- `elementId`: This represents a unique identifier, typically an ID or key, assigned to each element in the Sidebar, such as a section or sequence. Each element that can be expanded or collapsed is associated with a unique `elementId`.

- `isExpanded`: This is a boolean value that indicates whether the element with the specified `elementId` is currently expanded (`true`) or collapsed (`false`).

## Analytics Events
- The sidebar uses the edx.ui.lms.outline.selected event
- When a user navigates via the sidebar this event is generated from Unit.jsx
- The event payload contains the target unit title, target unit url, and current url
- For more information on this event see https://edx.readthedocs.io/projects/devdata/en/latest/internal_data_formats/tracking_logs/student_event_types.html#edx-ui-lms-sequence-next-selected

## Additional Notes

- The `SimpleLoader` component is displayed when section data is being fetched.
- The sidebar includes arrow icons (`CarrotIcon`) to indicate collapsible items.
- The `statusIcons` dictionary maps status strings ('in-progress', 'pending', 'completed') to their corresponding icon components.
- All components make use of `PropTypes` to validate the props being passed in.
---
