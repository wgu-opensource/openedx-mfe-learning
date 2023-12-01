import PropTypes from 'prop-types';
import { Sequence } from '@edx/frontend-app-learning';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import ResourceLinkGenerator from '../../resource-links/ResourceLinkGenerator';

const SequenceContainer = ({
  courseId,
  sequenceId,
  unitId,
  nextSequenceHandler,
  previousSequenceHandler,
  unitNavigationHandler,
}) => {
  const { administrator, roles } = getAuthenticatedUser();
  const staff = roles.includes('staff');
  console.log(roles);
  return (
    <>
      { (administrator || staff)
      && (
      <ResourceLinkGenerator
        courseId={courseId}
        sequenceId={sequenceId}
        unitId={unitId}
      />
      )}
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
