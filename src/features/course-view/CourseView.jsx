import PropTypes from 'prop-types';
import classNames from 'classnames';
import CoursePlayer from '../course-player/CoursePlayer';

const CourseView = (props) => (
  <>
    <div className={classNames('cv-course-content')}>
      <CoursePlayer {...props} />
    </div>
    <div className={classNames('cv-course-sidebar')}>
      <span>Sidebar</span>
    </div>
  </>
);

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
