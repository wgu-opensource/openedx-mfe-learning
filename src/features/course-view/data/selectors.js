import { createSelector } from 'reselect';

export const isMobileSidebarOpenSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isMobileSidebarOpen,
);

export const isDesktopSidebarExtendedSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isDesktopSidebarExtended,
);
