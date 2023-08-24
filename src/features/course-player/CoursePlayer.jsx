import PropTypes from 'prop-types';
import SequenceContainer from './sequence-container/SequenceContainer';

const CoursePlayer = ({
  match: {
    params: {
      courseId: routeCourseId,
      sequenceId: routeSequenceId,
      unitId: routeUnitId,
    },
  },
}) => (
  <div className="course-player-main-content">
    <div className="course-player-sequence-container">
      <SequenceContainer courseId={routeCourseId} sequenceId={routeSequenceId} unitId={routeUnitId} />
    </div>
  </div>

);

CoursePlayer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
      sequenceId: PropTypes.string,
      unitId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CoursePlayer;
