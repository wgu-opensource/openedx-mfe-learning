import PropTypes from 'prop-types';
import { Sequence } from '@edx/frontend-app-learning';

const SequenceContainer = ({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
}) => (
  <Sequence
    unitId={unitId}
    sequenceId={sequenceId}
    courseId={courseId}
    unitNavigationHandler={unitNavigationHandler}
    nextSequenceHandler={nextSequenceHandler}
    previousSequenceHandler={previousSequenceHandler}
  />
);

SequenceContainer.propTypes = {
  courseId: PropTypes.string,
  sequenceId: PropTypes.string,
  unitId: PropTypes.string,
  nextSequenceHandler: PropTypes.func.isRequired,
  previousSequenceHandler: PropTypes.func.isRequired,
  unitNavigationHandler: PropTypes.func.isRequired,
};

SequenceContainer.defaultProps = {
  courseId: null,
  sequenceId: null,
  unitId: null,
};

export default SequenceContainer;
