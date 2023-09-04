/* eslint-disable no-import-assign */
import * as edxFAL from '@edx/frontend-app-learning';
import { history } from '@edx/frontend-platform';

import {
  checkResumeRedirect,
  checkSectionToSequenceRedirect,
  checkSectionUnitToUnitRedirect,
  checkSequenceToSequenceUnitRedirect,
  checkSequenceUnitMarkerToSequenceUnitRedirect,
  checkUnitToSequenceUnitRedirect,
} from './utils';

jest.mock('@edx/frontend-app-learning');

describe('Utils library', () => {
  let courseStatus;
  let courseId;
  let sequenceStatus;
  let sequenceId;
  let section;
  let unitId;
  let sequenceMightBeUnit;
  let routeUnitId;

  beforeEach(() => {
    // Mocks and spies
    edxFAL.getResumeBlock = jest.fn().mockResolvedValue(1);
    edxFAL.getSequenceForUnitDeprecated = jest.fn().mockResolvedValue(1);
    history.replace = jest.fn();

    // Setup data
    courseStatus = 'loaded';
    courseId = 'courseId';
    sequenceStatus = 'failed';
    sequenceId = 'sequenceId';
    section = {
      sequenceIds: [],
    };
    unitId = 'unitId';
    sequenceMightBeUnit = true;
    routeUnitId = 'routeUnitId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkResumeRedirect', () => {
    it('', () => {
      sequenceId = null;

      checkResumeRedirect(courseStatus, courseId, sequenceId, 'firstSequenceId');

      expect(edxFAL.getResumeBlock).toHaveBeenCalled();
    });
  });

  describe('checkSectionUnitToUnitRedirect', () => {
    it('', () => {
      checkSectionUnitToUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
      );

      expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
    });
  });

  describe('checkSectionToSequenceRedirect', () => {
    it('', () => {
      unitId = null;

      checkSectionToSequenceRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
    });
  });

  it('', () => {
    unitId = null;
    section.sequenceIds = [1];

    checkSectionToSequenceRedirect(
      courseStatus,
      courseId,
      sequenceStatus,
      section,
      unitId,
    );

    expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${section.sequenceIds[0]}`);
  });

  describe('checkUnitToSequenceUnitRedirect', () => {
    it('', () => {
      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        unitId,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
    });
  });

  describe('checkSequenceToSequenceUnitRedirect', () => {
    it('', () => {
      checkSequenceToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        unitId,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
    });
  });

  describe('checkSequenceUnitMarkerToSequenceUnitRedirect', () => {
    it('', () => {
      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        unitId,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
    });
  });
});
