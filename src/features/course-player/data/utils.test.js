/* eslint-disable import/first */
/* eslint-disable no-import-assign */
import { getResumeBlock, getSequenceForUnitDeprecated } from '@edx/frontend-app-learning';
import { history } from '@edx/frontend-platform';

import {
  checkResumeRedirect,
  checkSectionToSequenceRedirect,
  checkSectionUnitToUnitRedirect,
  checkSequenceToSequenceUnitRedirect,
  checkSequenceUnitMarkerToSequenceUnitRedirect,
  checkUnitToSequenceUnitRedirect,
} from './utils';

jest.mock('@edx/frontend-app-learning', () => ({
  getResumeBlock: jest.fn(),
  getSequenceForUnitDeprecated: jest.fn(),
}));

describe('Utils library', () => {
  beforeEach(() => {
    history.replace = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkResumeRedirect', () => {
    let courseStatus;
    let courseId;
    let sequenceId;
    let firstSequenceId;

    beforeEach(() => {
      courseStatus = 'loaded';
      courseId = Date.now();
      sequenceId = Date.now();
      firstSequenceId = Date.now();
    });

    it('', () => {
      getResumeBlock.mockResolvedValueOnce({});

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
    let courseStatus;
    let courseId;
    let sequenceStatus;
    let section;
    let unitId;

    beforeEach(() => {
      courseStatus = 'loaded';
      courseId = Date.now();
      sequenceStatus = 'failed';
      section = {
        sequenceIds: [],
      };
      unitId = Date.now();
    });

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
    let courseStatus;
    let courseId;
    let sequenceStatus;
    let section;
    let unitId;
    beforeEach(() => {
      courseStatus = 'loaded';
      courseId = Date.now();
      sequenceStatus = 'failed';
      section = {
        sequenceIds: [],
      };
      unitId = Date.now();
    });

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

    it('', () => {
      unitId = null;
      section.sequenceIds.push(1);

      checkSectionToSequenceRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${section.sequenceIds[0]}`);
    });
  });

  describe('checkUnitToSequenceUnitRedirect', () => {
    let courseStatus;
    let courseId;
    let sequenceStatus;
    let sequenceId;
    let section;
    let unitId;
    let sequenceMightBeUnit;
    let routeUnitId;
    let parentId;

    beforeEach(() => {
      courseStatus = 'loaded';
      courseId = Date.now();
      sequenceStatus = 'failed';
      sequenceId = Date.now();
      section = {
        sequenceIds: [],
      };
      unitId = Date.now();
      sequenceMightBeUnit = true;
      routeUnitId = Date.now();
      parentId = Date.now();
    });

    it('', () => {
      section = null;
      routeUnitId = null;
      sequenceMightBeUnit = false;

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
      getSequenceForUnitDeprecated.mockResolvedValueOnce(parentId);

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${parentId}/${unitId}`);
      });
    });

    it('', () => {
      section = null;
      routeUnitId = null;
      parentId = null;
      getSequenceForUnitDeprecated.mockResolvedValueOnce(parentId);

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
      });
    });

    it('', () => {
      section = null;
      routeUnitId = null;
      getSequenceForUnitDeprecated.mockRejectedValueOnce(new Error('Async error message'));

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}`);
      });
    });
  });

  describe('checkSequenceToSequenceUnitRedirect', () => {
    let courseId;
    let sequenceStatus;
    let sequence;
    let unitId;

    beforeEach(() => {
      courseId = Date.now();
      sequenceStatus = 'loaded';
      sequence = {
        id: Date.now(),
        unitIds: [Date.now()],
        activeUnitIndex: 0,
      };
      unitId = null;
    });

    it('', () => {
      checkSequenceToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
      );

      expect(history.replace).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}/${sequence.unitIds[0]}`);
    });
  });

  describe('checkSequenceUnitMarkerToSequenceUnitRedirect', () => {
    let courseId;
    let sequenceStatus;
    let sequence;
    let unitId;

    beforeEach(() => {
      courseId = Date.now();
      sequenceStatus = 'loaded';
      sequence = {
        id: Date.now(),
        unitIds: [Date.now()],
        activeUnitIndex: 0,
      };
      unitId = Date.now();
    });
    it('', () => {
      sequenceStatus = 'failed';
      sequence = null;

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
      );

      expect(history.replace).not.toHaveBeenCalled();
    });
  });
});
