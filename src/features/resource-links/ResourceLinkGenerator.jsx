import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, ModalDialog, useToggle } from '@edx/paragon';
import { currentSequenceSelector } from '../course-player/data/selectors';

const generateResource = (currentSectionId, sequenceId, courseId) => {
  try {
    // Get only the section Identifier
    const sectionString = currentSectionId ? currentSectionId.slice(currentSectionId.lastIndexOf('@') + 1) : '';

    if (!sectionString) {
      throw new Error('Unable to obtain sectionString');
    }

    // Get only the sequence Identifier
    const sequenceString = sequenceId ? sequenceId.slice(sequenceId.lastIndexOf('@') + 1) : '';

    if (!sequenceString) {
      throw new Error('Unable to obtain sequenceString');
    }

    // Generate resource string
    const courseResource = `/courses/${courseId}/courseware/${sectionString}/${sequenceString}`;
    return courseResource;
  } catch (error) {
    console.error(`Error in generateResource: ${error.message}`);
    return ('The courseResource cannot be created without both the sectionString and sequenceString.');
  }
};

const generateDeepLink = (currentSectionId, sequenceId, courseId, unitId) => {
  try {
    // Obtain course resource
    const resourceString = generateResource(currentSectionId, sequenceId, courseId);

    if (!resourceString.includes('/')) {
      throw new Error('Invalid resourceString format');
    }

    // Check if unitId is null or undefined
    if (unitId === null || unitId === undefined) {
      throw new Error('There was an issue obtaining a valid unitId');
    }

    // Append the activate block and vertical block (unit)
    const deepLinkString = `${resourceString}/1?activate_block_id=${unitId}`;

    if (!deepLinkString) {
      throw new Error('Unable to obtain deepLinkString');
    }

    return deepLinkString;
  } catch (error) {
    console.error(`Error in generateDeepLink: ${error.message}`);
    return `Error generating deep link: ${error.message}`;
  }
};

// Used to generate resource identifiers for OEX as a LTI consumer
const ResourceLinkGenerator = ({
  sequenceId,
  courseId,
  unitId,
}) => {
  const currentSequence = useSelector(currentSequenceSelector);
  const currentSectionId = currentSequence ? currentSequence.sectionId : null;
  // Call the functions to generate resource and deep link
  const resourceStringCourse = generateResource(currentSectionId, sequenceId, courseId);
  const resourceStringDeep = generateDeepLink(currentSectionId, sequenceId, courseId, unitId);

  const [isOpen, open, close] = useToggle(false);
  const [modalSize] = useState('xl');
  const [modalVariant] = useState('default');

  return (
    <>
      <div className="unit-container">
        <Button variant="primary" className="btn-mentor" onClick={open}>
          Get Resource IDs
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

ResourceLinkGenerator.propTypes = {
  unitId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default ResourceLinkGenerator;
