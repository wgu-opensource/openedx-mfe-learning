import { createSelector } from 'reselect';

export const isMobileSidebarOpenSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isMobileSidebarOpen,
);

export const isDesktopSidebarExtendedSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.isDesktopSidebarExtended,
);

export const layoutHasSidebarSelector = createSelector(
  (state) => state.courseView,
  (courseView) => courseView.layoutHasSidebar,
);

const getSequenceStatus = (units) => {
  if (units.length === 0) {
    return 'pending';
  }
  if (units.every(unit => unit.complete)) {
    return 'completed';
  }
  if (units.some(unit => unit.complete)) {
    return 'in-progress';
  }

  return 'pending';
};

const getSectionStatus = (sequences) => {
  if (sequences.length === 0) {
    return 'pending';
  }

  if (sequences.every(sequence => sequence.status === 'completed')) {
    return 'completed';
  }
  if (sequences.some(sequence => sequence.status === 'in-progress')) {
    return 'in-progress';
  }

  return 'pending';
};

export const sectionSequenceUnitsSelector = createSelector(
  state => state.models.sections,
  state => state.models.sequences,
  state => state.models.units,
  (sections, sequences, units) => {
    if (!sections || !sequences || !units) {
      return [];
    }

    return Object.values(sections).map(({ sequenceIds, ...section }) => {
      const sequencesOfSection = sequenceIds
        .map(sequenceId => sequences[sequenceId])
        .filter(sequence => sequence && sequence.unitIds)
        .map((sequence) => {
          const unitsOfSequence = sequence.unitIds
            .map(unitId => units[unitId])
            .filter(unit => unit);
          return ({
            ...sequence,
            status: getSequenceStatus(unitsOfSequence),
            units: unitsOfSequence,
          });
        });
      return {
        ...section,
        status: getSectionStatus(sequencesOfSection),
        sequences: sequencesOfSection,
      };
    });
  },
);

export const sectionSequenceIdsSelector = createSelector(
  state => state.models.sections,
  state => state.models.sequences,
  (sections = {}, sequences = {}) => ([...Object.keys(sections), ...Object.keys(sequences)]),
);

export const currentCourseIdSelector = createSelector(
  (state) => state.courseware,
  (courseware) => courseware?.courseId,
);

export const currentCourseStatusSelector = createSelector(
  (state) => state.courseware,
  (courseware) => courseware?.courseStatus,
);
