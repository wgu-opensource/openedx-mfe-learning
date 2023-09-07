/* eslint-disable import/first */
/* eslint-disable no-import-assign */
import { getResumeBlock, getSequenceForUnitDeprecated } from '@edx/frontend-app-learning';
import { history } from '@edx/frontend-platform';

import {
  checkResumeRedirect,
  checkSectionToSequenceRedirect,
  checkSectionUnitToUnitRedirect,
  // checkSequenceToSequenceUnitRedirect,
  // checkSequenceUnitMarkerToSequenceUnitRedirect,
  checkUnitToSequenceUnitRedirect,
} from './utils';

jest.mock('@edx/frontend-app-learning', () => ({
  getResumeBlock: jest.fn(),
  getSequenceForUnitDeprecated: jest.fn(),
}));

fdescribe('Utils library', () => {
  let courseStatus;
  let courseId;
  let sequenceStatus;
  let sequenceId;
  let section;
  let unitId;
  let sequenceMightBeUnit;
  let routeUnitId;
  let firstSequenceId;
  let parentId;

  history.replace = jest.fn();

  beforeEach(() => {
    courseStatus = 'loaded';
    courseId = Date.now();
    sequenceStatus = 'failed';
    sequenceId = 'sequenceId';
    section = {
      sequenceIds: [],
    };
    unitId = 'unitId';
    sequenceMightBeUnit = true;
    routeUnitId = 'routeUnitId';
    firstSequenceId = 'firstSequenceId';
    parentId = 'parentId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkResumeRedirect', () => {
    it('', () => {
      getResumeBlock.mockResolvedValueOnce(1);

      sequenceId = null;
      checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId).then(() => {
        expect(getResumeBlock).toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${firstSequenceId}`);
      });
    });

    it('', () => {
      const data = {
        sectionId: 'sectionId',
        unitId: 'unitId',
      };
      sequenceId = null;
      getResumeBlock.mockResolvedValueOnce(data);

      checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId).then(() => {
        expect(getResumeBlock).toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${data.sectionId}/${data.unitId}`);
      });
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

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${unitId}`);
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

  describe('checkUnitToSequenceUnitRedirect', () => {
    it('', () => {
      sequenceMightBeUnit = false;
      section = null;
      routeUnitId = null;

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
    });

    it('', () => {
      section = null;
      routeUnitId = null;
      getSequenceForUnitDeprecated.mockResolvedValue(parentId);

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${parentId}/${unitId}`);
    });

    it('', () => {
      section = null;
      routeUnitId = null;
      getSequenceForUnitDeprecated.mockResolvedValue(null);

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
    });
  });

  // describe('checkSequenceToSequenceUnitRedirect', () => {
  //   it('', () => {
  //     checkSequenceToSequenceUnitRedirect(
  //       courseStatus,
  //       courseId,
  //       sequenceStatus,
  //       sequenceMightBeUnit,
  //       sequenceId,
  //       section,
  //       unitId,
  //       routeUnitId,
  //     );

  //     expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
  //   });
  // });

  // describe('checkSequenceUnitMarkerToSequenceUnitRedirect', () => {
  //   it('', () => {
  //     checkSequenceUnitMarkerToSequenceUnitRedirect(
  //       courseStatus,
  //       courseId,
  //       sequenceStatus,
  //       sequenceMightBeUnit,
  //       sequenceId,
  //       section,
  //       unitId,
  //       routeUnitId,
  //     );

  //     expect(history.replace).toHaveBeenCalledWith('/course/courseId/unitId');
  //   });
  // });
  // describe('checkSequenceToSequenceUnitRedirect', () => {
  //   it('', () => {
  //     unitId = null;

  //     checkSequenceToSequenceUnitRedirect(
  //       courseStatus,
  //       courseId,
  //       sequenceStatus,
  //       section,
  //       unitId,
  //     );

  //     expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
  //   });
  // });
});
