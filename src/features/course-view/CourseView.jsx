import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Redirect } from 'react-router';
import { fetchCourse } from '@edx/frontend-app-learning';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import CoursePlayer from '../course-player/CoursePlayer';
import {
  isDesktopSidebarExtendedSelector,
  isMobileSidebarOpenSelector,
  sectionSequenceIdsSelector,
  currentCourseStatusSelector,
} from './data/selectors';
import { sequenceIdsSelector } from '../course-player/data/selectors';
import Sidebar from '../sidebar/Sidebar';
import fetchUnits from '../sidebar/data/thunks';
import { updateCollapsibleMenuState } from '../sidebar/data/slice';
import { setLayoutHasSidebar } from './data/slice';

ensureConfig([
  'DISABLE_APP_HEADER',
  'DISABLE_APP_FOOTER',
], 'CourseView component');

const CourseView = (props) => {
  const disableAppHeader = getConfig().DISABLE_APP_HEADER === true;
  const disableAppFooter = getConfig().DISABLE_APP_FOOTER === true;

  const courseStatus = useSelector(currentCourseStatusSelector);

  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);
  const isMobileSidebarClosed = !useSelector(isMobileSidebarOpenSelector);
  const sequenceIds = useSelector(sequenceIdsSelector);
  const sectionSequenceIds = useSelector(sectionSequenceIdsSelector);

  const dispatch = useDispatch();
  const {
    match: {
      params: {
        unitId: routeUnitId,
        courseId: routeCourseId,
        sequenceId: routeSequenceId,
      },
    },
  } = props;

  useEffect(() => {
    dispatch(setLayoutHasSidebar(true));
  });

  useEffect(() => {
    dispatch(fetchCourse(routeCourseId));
  }, [routeCourseId, dispatch]);

  useEffect(() => {
    if (sequenceIds.length > 0) {
      dispatch(fetchUnits(sequenceIds));
    }
  }, [sequenceIds, dispatch]);

  useEffect(() => {
    dispatch(updateCollapsibleMenuState(sectionSequenceIds));
  }, [dispatch, sectionSequenceIds]);

  // Handle access denied errors
  if (courseStatus === 'denied') {
    const redirectUrl = `/course/${routeCourseId}/access-denied`;
    return (<Redirect to={redirectUrl} />);
  }

  return (
    <>
      <div className={classNames(
        'cv-course-content',
        { 'cv-course-content-sidebar-extended': isSidebarExtended },
      )}
      >
        <CoursePlayer {...props} />
      </div>
      <div className={classNames(
        'cv-course-sidebar',
        { 'cv-course-sidebar-extended': isSidebarExtended },
        { 'cv-course-sidebar-mobile-closed': isMobileSidebarClosed },
        { 'disable-app-header': disableAppHeader },
        { 'disable-app-footer': disableAppFooter },
      )}
      >
        <Sidebar
          currentUnitId={routeUnitId}
          courseId={routeCourseId}
          sequenceId={routeSequenceId}
          isSidebarExtended={isSidebarExtended}
        />
      </div>
    </>
  );
};

CourseView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      sequenceId: PropTypes.string,
      unitId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CourseView;
