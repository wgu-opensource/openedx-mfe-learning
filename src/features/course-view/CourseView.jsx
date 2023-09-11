/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCourse, fetchSequence } from '@edx/frontend-app-learning';
import CoursePlayer from '../course-player/CoursePlayer';
import {
  isDesktopSidebarExtendedSelector, isMobileSidebarOpenSelector,
} from './data/selectors';
import { sequenceIdsSelector } from '../course-player/data/selectors';
import Sidebar from '../../components/Sidebar/Sidebar';

const CourseView = (props) => {
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);
  const isMobileSidebarClosed = !useSelector(isMobileSidebarOpenSelector);
  const sequenceIds = useSelector(sequenceIdsSelector);
  const dispatch = useDispatch();
  const {
    match: {
      params: {
        unitId: routeUnitId,
        courseId: routeCourseId,
      },
    },
  } = props;

  useEffect(() => {
    dispatch(fetchCourse(routeCourseId));
  }, [routeCourseId, dispatch]);

  useEffect(() => {
    // Descomente una condicional en CoursePlayer que envolvia a Sequence
    if (sequenceIds.length > 0) {
      sequenceIds.forEach(sequenceId => dispatch(fetchSequence(sequenceId)));
    }
  }, [sequenceIds, dispatch]);

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
      )}
      >
        <Sidebar currentUnitId={routeUnitId} courseId={routeCourseId} />
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
