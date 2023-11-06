import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

const LtiResources = () => {
  const buttonTextCourse = 'Course Resource';
  const buttonTextDeep = 'Deep Link';
  return (
    <>
      <Button variant="primary" className="btn-mentor course-resource">
        { buttonTextCourse }
      </Button>
      <Button variant="primary" className="btn-mentor">
        { buttonTextDeep }
      </Button>
    </>
  );
};

// eslint-disable-next-line react/no-typos
LtiResources.PropTypes = {
  unitId: PropTypes.string,
  sequenceId: PropTypes.string.isRequired,
};

export default LtiResources;
