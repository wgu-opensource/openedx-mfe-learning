import { defaultMemoize as memoize } from 'reselect';
import { history } from '@edx/frontend-platform';
import {
  getResumeBlock,
  getSequenceForUnitDeprecated,
} from '@edx/frontend-app-learning';

// Look at where this is called in CoursePlayer for more info about its usage
export const checkResumeRedirect = memoize((courseStatus, courseId, sequenceId, firstSequenceId) => {
  if (courseStatus === 'loaded' && !sequenceId) {
    // Note that getResumeBlock is just an API call, not a redux thunk.
    getResumeBlock(courseId).then((data) => {
      // This is a replace because we don't want this change saved in the browser's history.
      if (data.sectionId && data.unitId) {
        history.replace(`/course/${courseId}/${data.sectionId}/${data.unitId}`);
      } else if (firstSequenceId) {
        history.replace(`/course/${courseId}/${firstSequenceId}`);
      }
    });
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSectionUnitToUnitRedirect = memoize((courseStatus, courseId, sequenceStatus, section, unitId) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && unitId) {
    history.replace(`/course/${courseId}/${unitId}`);
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSectionToSequenceRedirect = memoize((courseStatus, courseId, sequenceStatus, section, unitId) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && !unitId) {
    // If the section is non-empty, redirect to its first sequence.
    if (section.sequenceIds && section.sequenceIds[0]) {
      history.replace(`/course/${courseId}/${section.sequenceIds[0]}`);
      // Otherwise, just go to the course root, letting the resume redirect take care of things.
    } else {
      history.replace(`/course/${courseId}`);
    }
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkUnitToSequenceUnitRedirect = memoize((
  courseStatus,
  courseId,
  sequenceStatus,
  sequenceMightBeUnit,
  sequenceId,
  section,
  routeUnitId,
) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && !section && !routeUnitId) {
    if (sequenceMightBeUnit) {
      // If the sequence failed to load as a sequence, but it is marked as a possible unit, then we need to look up the
      // correct parent sequence for it, and redirect there.
      const unitId = sequenceId; // just for clarity during the rest of this method
      getSequenceForUnitDeprecated(courseId, unitId).then(
        parentId => {
          if (parentId) {
            history.replace(`/course/${courseId}/${parentId}/${unitId}`);
          } else {
            history.replace(`/course/${courseId}`);
          }
        },
        () => { // error case
          history.replace(`/course/${courseId}`);
        },
      );
    } else {
      // Invalid sequence that isn't a unit either. Redirect up to main course.
      history.replace(`/course/${courseId}`);
    }
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSequenceToSequenceUnitRedirect = memoize((courseId, sequenceStatus, sequence, unitId) => {
  if (sequenceStatus === 'loaded' && sequence.id && !unitId) {
    if (sequence.unitIds !== undefined && sequence.unitIds.length > 0) {
      const nextUnitId = sequence.unitIds[sequence.activeUnitIndex];
      // This is a replace because we don't want this change saved in the browser's history.
      history.replace(`/course/${courseId}/${sequence.id}/${nextUnitId}`);
    }
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSequenceUnitMarkerToSequenceUnitRedirect = memoize((courseId, sequenceStatus, sequence, unitId) => {
  if (sequenceStatus !== 'loaded' || !sequence.id) {
    return;
  }

  const hasUnits = sequence.unitIds?.length > 0;

  if (unitId === 'first') {
    if (hasUnits) {
      const firstUnitId = sequence.unitIds[0];
      history.replace(`/course/${courseId}/${sequence.id}/${firstUnitId}`);
    } else {
      // No units... go to general sequence page
      history.replace(`/course/${courseId}/${sequence.id}`);
    }
  } else if (unitId === 'last') {
    if (hasUnits) {
      const lastUnitId = sequence.unitIds[sequence.unitIds.length - 1];
      history.replace(`/course/${courseId}/${sequence.id}/${lastUnitId}`);
    } else {
      // No units... go to general sequence page
      history.replace(`/course/${courseId}/${sequence.id}`);
    }
  }
});
