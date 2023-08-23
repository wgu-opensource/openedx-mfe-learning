import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Sequence, fetchCourse, fetchSequence } from "@edx/frontend-app-learning";
import { useEffect } from "react";

const currentCourseSelector = createSelector(
  (state) => state.models.coursewareMeta || {},
  (state) => state.courseware.courseId,
  (coursesById, courseId) => (coursesById[courseId] ? coursesById[courseId] : null),
);

const currentSequenceSelector = createSelector(
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequencesById, sequenceId) => (sequencesById[sequenceId] ? sequencesById[sequenceId] : null),
);

const sequenceIdsSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections,
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return [];
    }
    const { sectionIds = [] } = course;
    return sectionIds.flatMap(sectionId => sectionsById[sectionId].sequenceIds);
  },
);

const previousSequenceSelector = createSelector(
  sequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const previousSequenceId = sequenceIndex > 0 ? sequenceIds[sequenceIndex - 1] : null;
    return previousSequenceId !== null ? sequencesById[previousSequenceId] : null;
  },
);

const nextSequenceSelector = createSelector(
  sequenceIdsSelector,
  (state) => state.models.sequences || {},
  (state) => state.courseware.sequenceId,
  (sequenceIds, sequencesById, sequenceId) => {
    if (!sequenceId || sequenceIds.length === 0) {
      return null;
    }
    const sequenceIndex = sequenceIds.indexOf(sequenceId);
    const nextSequenceId = sequenceIndex < sequenceIds.length - 1 ? sequenceIds[sequenceIndex + 1] : null;
    return nextSequenceId !== null ? sequencesById[nextSequenceId] : null;
  },
);

const firstSequenceIdSelector = createSelector(
  (state) => state.courseware.courseStatus,
  currentCourseSelector,
  (state) => state.models.sections || {},
  (courseStatus, course, sectionsById) => {
    if (courseStatus !== 'loaded') {
      return null;
    }
    const { sectionIds = [] } = course;

    if (sectionIds.length === 0) {
      return null;
    }

    return sectionsById[sectionIds[0]].sequenceIds[0];
  },
);

const sectionViaSequenceIdSelector = createSelector(
  (state) => state.models.sections || {},
  (state) => state.courseware.sequenceId,
  (sectionsById, sequenceId) => (sectionsById[sequenceId] ? sectionsById[sequenceId] : null),
);

const MMP2P = {
  "access": {
    "isAudit": false,
    "accessExpirationDate": null,
    "upgradeUrl": null,
    "price": null
  },
  "flyover": {
    "isVisible": true
  },
  "meta": {
    "blockContent": false,
    "gradedLock": false,
    "modalLock": false,
    "showLock": false,
    "verifiedLock": false
  },
  "state": {
    "isEnabled": false,
    "upgradeDeadline": null,
    "afterUpgradeDeadline": false,
    "subSections": [],
    "isWhitelisted": false
  }
};
const unitNavigationHandler = () => { }
const nextSequenceHandler = () => { }
const previousSequenceHandler = () => { }

const ReduxTest = ({
  match: {
    params: {
      courseId: routeCourseId,
      sequenceId: routeSequenceId,
      unitId:routeUnitId
    },
  },
}) => {
  const dispatch = useDispatch();
  const course = useSelector(state => currentCourseSelector(state));
  const sequence = useSelector(state => currentSequenceSelector(state));
  const previousSequence = useSelector(state => previousSequenceSelector(state));
  const nextSequence = useSelector(state => nextSequenceSelector(state));

  useEffect(() => {
    dispatch(fetchCourse(routeCourseId))
    dispatch(fetchSequence(routeSequenceId))
  }, [])
  return <div>
    <Sequence
      unitId={routeUnitId}
      sequenceId={routeSequenceId}
      courseId={routeCourseId}
      unitNavigationHandler={unitNavigationHandler}
      nextSequenceHandler={nextSequenceHandler}
      previousSequenceHandler={previousSequenceHandler}
      mmp2p={MMP2P}
    />
  </div>
}

export default ReduxTest