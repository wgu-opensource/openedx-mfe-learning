import { createSelector } from 'reselect';

const collapsibleMenuStateSelector = createSelector(
  state => state.sidebar,
  (sidebar) => sidebar.collapsibleMenuState,
);

export default collapsibleMenuStateSelector;
