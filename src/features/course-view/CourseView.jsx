import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import CoursePlayer from '../course-player/CoursePlayer';
import { toggleDesktopSidebar } from './data/slice';
import { isDesktopSidebarExtendedSelector, isMobileSidebarOpenSelector } from './data/selectors';

// TODO: Remove DummySidebar in favor of real Sidebar
const DummySidebar = () => {
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleDesktopSidebar());
  };

  return (
    <>
      <span>Sidebar</span>
      <button type="button" onClick={toggle}>Toggle</button>
    </>
  );
};

const CourseView = (props) => {
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);
  const isMobileSidebarClosed = !useSelector(isMobileSidebarOpenSelector);

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
        <DummySidebar />
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
