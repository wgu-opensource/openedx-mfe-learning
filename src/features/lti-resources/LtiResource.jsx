import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ModalDialog, useToggle } from '@edx/paragon';

// Used to generate resource identifiers for OEX as a LTI consumer
const LtiResource = ({
  courseId,
  sequenceId,
  unitId,
}) => {
  const generateResource = () => {
    // Get only the sequence Identifier
    let atIndex = sequenceId.lastIndexOf('@');
    const sequenceString = sequenceId.slice(atIndex + 1);

    // Get only the unit Identifier
    atIndex = unitId.lastIndexOf('@');
    const unitString = unitId.slice(atIndex + 1);

    // Generate resource string
    const courseResource = `/courses/${courseId}/courseware/${sequenceString}/${unitString}`;
    return courseResource;
  };

  const generateDeepLink = () => {
    const resourceString = generateResource();

    // Append the activate block and vertical block (unit)
    const newString = `${resourceString}/activate_block/unit`;
    return newString;
  };

  const [isOpen, open, close] = useToggle(false);
  const [modalSize] = useState('xl');
  const [modalVariant] = useState('default');
  const resourceStringCourse = generateResource();
  const resourceStringDeep = generateDeepLink();

  return (
    <>
      <div className="d-flex">
        <Button variant="primary" className="btn-mentor" onClick={open}>
          Resource
        </Button>
      </div>
      <ModalDialog
        title="Resource"
        isOpen={isOpen}
        onClose={close}
        size={modalSize}
        variant={modalVariant}
        hasCloseButton
        isFullscreenOnMobile
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Course Link
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p className="resource-display">
            { resourceStringCourse }
          </p>
        </ModalDialog.Body>
        <ModalDialog.Header>
          <ModalDialog.Title>
            Deep Link
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p className="resource-display">
            { resourceStringDeep }
          </p>
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

LtiResource.propTypes = {
  unitId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default LtiResource;
