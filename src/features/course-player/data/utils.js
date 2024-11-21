import { defaultMemoize as memoize } from 'reselect';
import {
  getResumeBlock,
  getSequenceForUnitDeprecated,
} from '@edx/frontend-app-learning';

// Look at where this is called in CoursePlayer for more info about its usage
export const checkResumeRedirect = memoize((courseStatus, courseId, sequenceId, firstSequenceId, navigate) => {
  if (courseStatus === 'loaded' && !sequenceId) {
    // Note that getResumeBlock is just an API call, not a redux thunk.
    return getResumeBlock(courseId).then((data) => {
      // This is a replace because we don't want this change saved in the browser's history.
      if (data.sectionId && data.unitId) {
        navigate(`/course/${courseId}/${data.sectionId}/${data.unitId}`, { replace: true });
      } else if (firstSequenceId) {
        navigate(`/course/${courseId}/${firstSequenceId}`, { replace: true });
      }
    });
  }
  return null;
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSectionUnitToUnitRedirect = memoize(
  (courseStatus, courseId, sequenceStatus, section, unitId, navigate) => {
    if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && unitId) {
      navigate(`/course/${courseId}/${unitId}`, { replace: true });
    }
  },
);

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSectionToSequenceRedirect = memoize(
  (courseStatus, courseId, sequenceStatus, section, unitId, navigate) => {
    if (courseStatus === 'loaded' && sequenceStatus === 'failed' && section && !unitId) {
    // If the section is non-empty, redirect to its first sequence.
      if (section.sequenceIds && section.sequenceIds[0]) {
        navigate(`/course/${courseId}/${section.sequenceIds[0]}`, { replace: true });
      // Otherwise, just go to the course root, letting the resume redirect take care of things.
      } else {
        navigate(`/course/${courseId}`, { replace: true });
      }
    }
  },
);

// Look at where this is called in CoursePlayer for more info about its usage
export const checkUnitToSequenceUnitRedirect = memoize((
  courseStatus,
  courseId,
  sequenceStatus,
  sequenceMightBeUnit,
  sequenceId,
  section,
  routeUnitId,
  navigate,
) => {
  if (courseStatus === 'loaded' && sequenceStatus === 'failed' && !section && !routeUnitId) {
    if (sequenceMightBeUnit) {
      // If the sequence failed to load as a sequence, but it is marked as a possible unit, then we need to look up the
      // correct parent sequence for it, and redirect there.
      const unitId = sequenceId; // just for clarity during the rest of this method
      return getSequenceForUnitDeprecated(courseId, unitId).then(
        parentId => {
          if (parentId) {
            navigate(`/course/${courseId}/${parentId}/${unitId}`, { replace: true });
          } else {
            navigate(`/course/${courseId}`, { replace: true });
          }
        },
        () => { // error case
          navigate(`/course/${courseId}`, { replace: true });
        },
      );
    }
    // Invalid sequence that isn't a unit either. Redirect up to main course.
    navigate(`/course/${courseId}`, { replace: true });
  }
  return null;
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSequenceToSequenceUnitRedirect = memoize((courseId, sequenceStatus, sequence, unitId, navigate) => {
  if (sequenceStatus === 'loaded' && sequence.id && !unitId) {
    if (sequence.unitIds !== undefined && sequence.unitIds.length > 0) {
      const nextUnitId = sequence.unitIds[sequence.activeUnitIndex];
      // This is a replace because we don't want this change saved in the browser's history.
      navigate(`/course/${courseId}/${sequence.id}/${nextUnitId}`, { replace: true });
    }
  }
});

// Look at where this is called in CoursePlayer for more info about its usage
export const checkSequenceUnitMarkerToSequenceUnitRedirect = memoize(
  (courseId, sequenceStatus, sequence, unitId, navigate) => {
    if (sequenceStatus !== 'loaded' || !sequence.id) {
      return;
    }

    const hasUnits = sequence.unitIds?.length > 0;

    if (unitId === 'first') {
      if (hasUnits) {
        const firstUnitId = sequence.unitIds[0];
        navigate(`/course/${courseId}/${sequence.id}/${firstUnitId}`, { replace: true });
      } else {
      // No units... go to general sequence page
        navigate(`/course/${courseId}/${sequence.id}`, { replace: true });
      }
    } else if (unitId === 'last') {
      if (hasUnits) {
        const lastUnitId = sequence.unitIds[sequence.unitIds.length - 1];
        navigate(`/course/${courseId}/${sequence.id}/${lastUnitId}`, { replace: true });
      } else {
      // No units... go to general sequence page
        navigate(`/course/${courseId}/${sequence.id}`, { replace: true });
      }
    }
  },
);
