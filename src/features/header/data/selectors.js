import { createSelector } from 'reselect';

// eslint-disable-next-line import/prefer-default-export
export const currentCourseHomeMetaSelector = createSelector(
  (state) => state.models.courseHomeMeta || {},
  (state) => state.courseware.courseId,
  (coursesById, courseId) => (coursesById[courseId] ? coursesById[courseId] : null),
);
