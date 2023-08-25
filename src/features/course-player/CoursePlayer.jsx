import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history } from '@edx/frontend-platform';
import {
  fetchCourse as fetchCourseAction,
  fetchSequence as fetchSequenceAction,
  checkBlockCompletion,
  saveSequencePosition as saveSequencePositionAction,
} from '@edx/frontend-app-learning';
import { useEffect } from 'react';
import SequenceContainer from './sequence-container/SequenceContainer';
import {
  currentCourseSelector,
  currentSequenceSelector,
  previousSequenceSelector,
  nextSequenceSelector,
  firstSequenceIdSelector,
  sectionViaSequenceIdSelector,
} from './data/selectors';
import {
  checkResumeRedirect,
  checkSectionUnitToUnitRedirect,
  checkSectionToSequenceRedirect,
  checkUnitToSequenceUnitRedirect,
  checkSequenceToSequenceUnitRedirect,
  checkSequenceUnitMarkerToSequenceUnitRedirect,
} from './data/utils';

const CoursePlayer = (props) => {
  const {
    courseId,
    sequenceId,
    nextSequence,
    previousSequence,
    sequenceStatus,
    sequence,
    fetchCourse,
    fetchSequence,
    saveSequencePosition,
    courseStatus,
    firstSequenceId,
    sectionViaSequenceId,
    sequenceMightBeUnit,
    match: {
      params: {
        courseId: routeCourseId,
        sequenceId: routeSequenceId,
        unitId: routeUnitId,
      },
    },
  } = props;

  // checkSaveSequencePosition
  useEffect(() => {
    if (!sequence) {
      return;
    }

    if (sequenceStatus === 'loaded' && sequence.saveUnitPosition && routeUnitId) {
      const activeUnitIndex = sequence.unitIds.indexOf(routeUnitId);
      saveSequencePosition(courseId, sequenceId, activeUnitIndex);
    }
  }, [routeUnitId]);

  // checkFetchCourse
  useEffect(() => {
    fetchCourse(routeCourseId);
  }, [fetchCourse, routeCourseId]);

  // checkFetchSequence
  useEffect(() => {
    fetchSequence(routeSequenceId);
  }, [fetchSequence, routeSequenceId]);

  useEffect(() => {
    // Coerce the route ids into null here because they can be undefined, but the redux ids would be null instead.
    if (courseId !== (routeCourseId || null) || sequenceId !== (routeSequenceId || null)) {
    // The non-route ids are pulled from redux state - they are changed at the same time as the status variables.
    // But the route ids are pulled directly from the route. So if the route changes, and we start a fetch above,
    // there's a race condition where the route ids are for one course, but the status and the other ids are for a
    // different course. Since all the logic below depends on the status variables and the route unit id, we'll wait
    // until the ids match and thus the redux states got updated. So just bail for now.
      return;
    }

    // All courseware URLs should normalize to the format /course/:courseId/:sequenceId/:unitId
    // via the series of redirection rules below.
    // See docs/decisions/0008-liberal-courseware-path-handling.md for more context.
    // (It would be ideal to move this logic into the thunks layer and perform
    //  all URL-changing checks at once. See TNL-8182.)

    // Check resume redirect:
    //   /course/:courseId -> /course/:courseId/:sequenceId/:unitId
    // based on sequence/unit where user was last active.
    checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId);

    // Check section-unit to unit redirect:
    //    /course/:courseId/:sectionId/:unitId -> /course/:courseId/:unitId
    // by simply ignoring the :sectionId.
    // (It may be desirable at some point to be smarter here; for example, we could replace
    //  :sectionId with the parent sequence of :unitId and/or check whether the :unitId
    //  is actually within :sectionId. However, the way our Redux store is currently factored,
    //  the unit's metadata is not available to us if the section isn't loadable.)
    // Before performing this redirect, we *do* still check that a section is loadable;
    // otherwise, we could get stuck in a redirect loop, since a sequence that failed to load
    // would endlessly redirect to itself through `checkSectionUnitToUnitRedirect`
    // and `checkUnitToSequenceUnitRedirect`.
    checkSectionUnitToUnitRedirect(courseStatus, courseId, sequenceStatus, sectionViaSequenceId, routeUnitId);

    // Check section to sequence redirect:
    //    /course/:courseId/:sectionId         -> /course/:courseId/:sequenceId
    // by redirecting to the first sequence within the section.
    checkSectionToSequenceRedirect(courseStatus, courseId, sequenceStatus, sectionViaSequenceId, routeUnitId);

    // Check unit to sequence-unit redirect:
    //    /course/:courseId/:unitId -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID of the parent sequence of :unitId.
    checkUnitToSequenceUnitRedirect(
      courseStatus,
      courseId,
      sequenceStatus,
      sequenceMightBeUnit,
      sequenceId,
      sectionViaSequenceId,
      routeUnitId,
    );

    // Check sequence to sequence-unit redirect:
    //    /course/:courseId/:sequenceId -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID the most-recently-active unit in the sequence, OR
    // the ID of the first unit the sequence if none is active.
    checkSequenceToSequenceUnitRedirect(courseId, sequenceStatus, sequence, routeUnitId);

    // Check sequence-unit marker to sequence-unit redirect:
    //    /course/:courseId/:sequenceId/first -> /course/:courseId/:sequenceId/:unitId
    //    /course/:courseId/:sequenceId/last -> /course/:courseId/:sequenceId/:unitId
    // by filling in the ID the first or last unit in the sequence.
    // "Sequence unit marker" is an invented term used only in this component.
    checkSequenceUnitMarkerToSequenceUnitRedirect(courseId, sequenceStatus, sequence, routeUnitId);
  }, [courseId,
    courseStatus,
    firstSequenceId,
    routeCourseId,
    routeSequenceId,
    routeUnitId,
    sectionViaSequenceId,
    sequence,
    sequenceId,
    sequenceMightBeUnit,
    sequenceStatus]);

  const handleUnitNavigationClick = (nextUnitId) => {
    props.checkBlockCompletion(courseId, sequenceId, routeUnitId);
    history.push(`/course/${routeCourseId}/${routeSequenceId}/${nextUnitId}`);
  };

  const handleNextSequenceClick = () => {
    if (nextSequence !== null) {
      history.push(`/course/${routeCourseId}/${nextSequence.id}/first`);
    }
  };

  const handlePreviousSequenceClick = () => {
    if (previousSequence !== null) {
      history.push(`/course/${routeCourseId}/${previousSequence.id}/last`);
    }
  };

  return (
    <div className="course-player-main-content">
      {/* Avoud crashes with invalid course or sequence states */}
      {!(courseId !== (routeCourseId || null) || sequenceId !== (routeSequenceId || null)) && (
      <div className="course-player-sequence-container">
        <SequenceContainer
          courseId={routeCourseId}
          sequenceId={routeSequenceId}
          unitId={routeUnitId}
          unitNavigationHandler={handleUnitNavigationClick}
          nextSequenceHandler={handleNextSequenceClick}
          previousSequenceHandler={handlePreviousSequenceClick}
        />
      </div>
      )}
    </div>
  );
};

const sequenceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unitIds: PropTypes.arrayOf(PropTypes.string),
  sectionId: PropTypes.string.isRequired,
});

const sectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sequenceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
});

const courseShape = PropTypes.shape({
  celebrations: PropTypes.shape({
    firstSection: PropTypes.bool,
  }),
});

CoursePlayer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      sequenceId: PropTypes.string,
      unitId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  firstSequenceId: PropTypes.string,
  courseStatus: PropTypes.oneOf(['loaded', 'loading', 'failed', 'denied']).isRequired,
  sequenceStatus: PropTypes.oneOf(['loaded', 'loading', 'failed']).isRequired,
  sequenceMightBeUnit: PropTypes.bool.isRequired,
  nextSequence: sequenceShape,
  previousSequence: sequenceShape,
  sectionViaSequenceId: sectionShape,
  course: courseShape,
  sequence: sequenceShape,
  saveSequencePosition: PropTypes.func.isRequired,
  checkBlockCompletion: PropTypes.func.isRequired,
  fetchCourse: PropTypes.func.isRequired,
  fetchSequence: PropTypes.func.isRequired,
};

CoursePlayer.defaultProps = {
  courseId: null,
  sequenceId: null,
  firstSequenceId: null,
  nextSequence: null,
  previousSequence: null,
  sectionViaSequenceId: null,
  course: null,
  sequence: null,
};

const mapStateToProps = (state) => {
  const {
    courseId,
    sequenceId,
    courseStatus,
    sequenceStatus,
    sequenceMightBeUnit,
  } = state.courseware;

  return {
    courseId,
    sequenceId,
    courseStatus,
    sequenceStatus,
    sequenceMightBeUnit,
    course: currentCourseSelector(state),
    sequence: currentSequenceSelector(state),
    previousSequence: previousSequenceSelector(state),
    nextSequence: nextSequenceSelector(state),
    firstSequenceId: firstSequenceIdSelector(state),
    sectionViaSequenceId: sectionViaSequenceIdSelector(state),
  };
};

export default connect(mapStateToProps, {
  checkBlockCompletion,
  saveSequencePosition: saveSequencePositionAction,
  fetchCourse: fetchCourseAction,
  fetchSequence: fetchSequenceAction,
})(CoursePlayer);
