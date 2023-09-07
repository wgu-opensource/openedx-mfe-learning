import { createSelector } from 'reselect';

export const isMobileSidebarOpenSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isMobileSidebarOpen,
);

export const isDesktopSidebarExtendedSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isDesktopSidebarExtended,
);

export const sectionSequenceUnitsSelector = createSelector(
  state => state.models.sections,
  state => state.models.sequences,
  state => state.models.units,
  (sections = {}, sequences = {}, units = {}) => Object.values(sections)
    .map(({ sequenceIds, ...section }) => ({
      ...section,
      sequences: Object.values(sequences)
        .map(({ unitIds, ...sequence }) => ({
          ...sequence,
          units: Object.values(units)
            .filter(unit => unit.sequenceId === sequence.id),
        }))
        .filter(sequence => sequence.sectionId === section.id),
    })),
);

export const sidebarItemsSelector = createSelector(
  state => state.courseView,
  (courseView) => courseView.sidebarItems,
);
