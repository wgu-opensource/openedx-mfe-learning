import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { history } from '@edx/frontend-platform';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import {
  fetchSequence as fetchSequenceAction,
  checkBlockCompletion,
  saveSequencePosition as saveSequencePositionAction,
} from '@edx/frontend-app-learning';
import { useEffect, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';
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

ensureConfig([
  'DISABLE_APP_HEADER',
], 'CoursePlayer component');

/**
 * Workaround for an error in Firefox, it exists on the original frontend-app-learning, but needs to be
 * re-applied here due to the conditional rendering of SequenceContainer.
 *
 * Description from https://github.com/openedx/frontend-app-learning/blob/open-release/olive.4/src/courseware/course/sequence/Unit.jsx#L38:
 *
 * We discovered an error in Firefox where - upon iframe load - React would cease to call any
 * useEffect hooks until the user interacts with the page again.  This is particularly confusing
 * when navigating between sequences, as the UI partially updates leaving the user in a nebulous
 * state.
 *
 * We were able to solve this error by using a layout effect to update some component state, which
 * executes synchronously on render.  Somehow this forces React to continue it's lifecycle
 * immediately, rather than waiting for user interaction.  This layout effect could be anywhere in
 * the parent tree, as far as we can tell - we chose to add a conspicuously 'load bearing' (that's
 * a joke) one here so it wouldn't be accidentally removed elsewhere.
 *
 * If we remove this hook when one of these happens:
 * 1. React figures out that there's an issue here and fixes a bug.
 * 2. We cease to use an iframe for unit rendering.
 * 3. Firefox figures out that there's an issue in their iframe loading and fixes a bug.
 * 4. We stop supporting Firefox.
 * 5. An enterprising engineer decides to create a repo that reproduces the problem, submits it to
 *    Firefox/React for review, and they kindly help us figure out what in the world is happening
 *    so  we can fix it.
 *
 * This hook depends on the unit id just to make sure it re-evaluates whenever the ID changes.  If
 * we change whether or not the Unit component is re-mounted when the unit ID changes, this may
 * become important, as this hook will otherwise only evaluate the useLayoutEffect once.
 */
function useLoadBearingHook(id) {
  const setValue = useState(0)[1];
  useLayoutEffect(() => {
    setValue(currentValue => currentValue + 1);
  }, [id, setValue]);
}

const CoursePlayer = (props) => {
  const {
    courseId,
    sequenceId,
    nextSequence,
    previousSequence,
    sequenceStatus,
    sequence,
    saveSequencePosition,
    courseStatus,
    firstSequenceId,
    sectionViaSequenceId,
    sequenceMightBeUnit,
    course,
    fetchSequence,
    match: {
      params: {
        courseId: routeCourseId,
        sequenceId: routeSequenceId,
        unitId: routeUnitId,
      },
    },
  } = props;

  const disableAppHeader = getConfig().DISABLE_APP_HEADER === true;

  const saveUnitPosition = sequence?.saveUnitPosition;
  const unitIds = sequence?.unitIds;

  // Do not remove this hook. See function description.
  useLoadBearingHook(routeUnitId);

  // checkSaveSequencePosition
  useEffect(() => {
    if (sequenceStatus === 'loaded' && saveUnitPosition && routeUnitId && unitIds) {
      const activeUnitIndex = unitIds.indexOf(routeUnitId);
      saveSequencePosition(courseId, sequenceId, activeUnitIndex);
    }
  }, [courseId, routeUnitId, saveSequencePosition, saveUnitPosition, sequenceId, sequenceStatus, unitIds]);

  // // checkFetchSequence
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
    <div className={classNames('course-player-main-content', { 'disable-app-header': disableAppHeader })}>
      <Helmet>
        <title>{`${course?.title || 'Course'} | ${getConfig().SITE_NAME}`}</title>
      </Helmet>
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
  saveUnitPosition: PropTypes.any, // eslint-disable-line
});

const sectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sequenceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
});

const courseShape = PropTypes.shape({
  celebrations: PropTypes.shape({
    firstSection: PropTypes.bool,
  }),
  title: PropTypes.string,
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
  fetchSequence: fetchSequenceAction,
})(CoursePlayer);
