import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Sequence, AlertList } from '@edx/frontend-app-learning';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { currentCourseHomeMetaSelector } from '../../header/data/selectors';
import ResourceLinkGenerator from '../../resource-links/ResourceLinkGenerator';

const SequenceContainer = ({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
}) => {
  // Show resources if user is an administrator or course staff
  const { administrator } = getAuthenticatedUser();
  const course = useSelector(currentCourseHomeMetaSelector);
  const isStaff = course ? course.isStaff : false;
  return (
    <>
      { (administrator || isStaff)
      && (
      <ResourceLinkGenerator
        courseId={courseId}
        sequenceId={sequenceId}
        unitId={unitId}
      />
      )}
      <AlertList topic="sequence" />
      <Sequence
        unitId={unitId}
        sequenceId={sequenceId}
        courseId={courseId}
        unitNavigationHandler={unitNavigationHandler}
        nextSequenceHandler={nextSequenceHandler}
        previousSequenceHandler={previousSequenceHandler}
      />
    </>
  );
};

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
