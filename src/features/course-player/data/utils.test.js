/* eslint-disable import/first */
/* eslint-disable no-import-assign */
import { getResumeBlock, getSequenceForUnitDeprecated } from '@edx/frontend-app-learning';

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
  let mockId = 0;
  let navigate = jest.fn();

  beforeEach(() => {
    mockId++;
    navigate = jest.fn();
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
      courseId = mockId;
      sequenceId = mockId;
      firstSequenceId = mockId;
      sequenceId = null;
    });

    it('it should replace history with "/course/courseId/firstSequenceId" when getResumeBlock does not return the required data', () => {
      getResumeBlock.mockResolvedValueOnce({});

      checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId, navigate).then(() => {
        expect(getResumeBlock).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${firstSequenceId}`, { replace: true });
      });
    });

    it('it should replace history with "/course/courseId/data.sectionId/data.unitId" when getResumeBlock return the required data', () => {
      const data = {
        sectionId: 'sectionId',
        unitId: 'unitId',
      };
      getResumeBlock.mockResolvedValueOnce(data);

      checkResumeRedirect(courseStatus, courseId, sequenceId, firstSequenceId, navigate).then(() => {
        expect(getResumeBlock).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${data.sectionId}/${data.unitId}`, { replace: true });
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
      courseId = mockId;
      sequenceStatus = 'failed';
      section = {
        sequenceIds: [],
      };
      unitId = mockId;
    });

    it('it should replace history with "/course/courseId/unitId"', () => {
      checkSectionUnitToUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${unitId}`, { replace: true });
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
      courseId = mockId;
      sequenceStatus = 'failed';
      section = {
        sequenceIds: [],
      };
      unitId = null;
    });

    it('it should replace history with "/course/courseId/unitId" when there is no sequenceIds[0]', () => {
      checkSectionToSequenceRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}`, { replace: true });
    });

    it('it should replace history with "/course/courseId/section.sequenceIds[0]" when there is sequenceIds[0]', () => {
      section.sequenceIds.push(1);

      checkSectionToSequenceRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        section,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${section.sequenceIds[0]}`, { replace: true });
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
      courseId = mockId;
      sequenceStatus = 'failed';
      sequenceId = mockId;
      section = null;
      unitId = mockId;
      sequenceMightBeUnit = true;
      routeUnitId = null;
      parentId = mockId;
    });

    it('it should replace history with "/course/courseId" when sequenceMightBeUnit = "false"', () => {
      sequenceMightBeUnit = false;

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}`, { replace: true });
    });

    it('it should replace history with "/course/courseId/parentId/unitId" when getSequenceForUnitDeprecated return a valid parentId', () => {
      getSequenceForUnitDeprecated.mockResolvedValueOnce(parentId);

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
        navigate,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${parentId}/${unitId}`, { replace: true });
      });
    });

    it('it should replace history with "/course/courseId" when getSequenceForUnitDeprecated does not return a parentId', () => {
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
        navigate,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(`/course/${courseId}`, { replace: true });
      });
    });

    it('it should replace history with "/course/courseId" when getSequenceForUnitDeprecated call fails', () => {
      getSequenceForUnitDeprecated.mockRejectedValueOnce(new Error('Async error message'));

      checkUnitToSequenceUnitRedirect(
        courseStatus,
        courseId,
        sequenceStatus,
        sequenceMightBeUnit,
        sequenceId,
        section,
        routeUnitId,
        navigate,
      ).then(() => {
        expect(getSequenceForUnitDeprecated).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(`/course/${courseId}`, { replace: true });
      });
    });
  });

  describe('checkSequenceToSequenceUnitRedirect', () => {
    let courseId;
    let sequenceStatus;
    let sequence;
    let unitId;

    beforeEach(() => {
      courseId = mockId;
      sequenceStatus = 'loaded';
      sequence = {
        id: mockId,
        unitIds: [mockId],
        activeUnitIndex: 0,
      };
      unitId = null;
    });

    it('it should replace history with "/course/courseId/sequence.id/sequence.unitIds[0]" when there is a sequence activeUnit', () => {
      checkSequenceToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}/${sequence.unitIds[0]}`, { replace: true });
    });
  });

  describe('checkSequenceUnitMarkerToSequenceUnitRedirect', () => {
    let courseId;
    let sequenceStatus;
    let sequence;
    let unitId;

    beforeEach(() => {
      courseId = mockId;
      sequenceStatus = 'loaded';
      sequence = {
        id: mockId,
        unitIds: [mockId, mockId],
        activeUnitIndex: 0,
      };
      unitId = mockId;
    });

    it('it should not replace history when sequenceStatus != loaded and sequence.id = null', () => {
      sequenceStatus = 'failed';
      sequence = null;

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).not.toHaveBeenCalled();
    });

    it('it should not replace history when unitId is != to "first" or "last"', () => {
      unitId = 'second';

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).not.toHaveBeenCalled();
    });

    it('it should replace history with "/course/courseId/sequence.id/sequence.unitIds[0]" when  unitId = "first" and there are unitIds', () => {
      unitId = 'first';

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}/${sequence.unitIds[0]}`, { replace: true });
    });

    it('it should replace history with "/course/courseId/sequence.id" when  unitId = "first" and there are not unitIds', () => {
      unitId = 'first';
      sequence.unitIds = [];

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}`, { replace: true });
    });

    it('it should replace history with "/course/courseId/sequence.id/sequence.unitIds[0]" when unitId = "last" there are unitIds', () => {
      unitId = 'last';

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}/${sequence.unitIds[1]}`, { replace: true });
    });

    it('it should replace history with "/course/courseId/sequence.id" when unitId = "last" and there are not unitIds', () => {
      unitId = 'last';
      sequence.unitIds = [];

      checkSequenceUnitMarkerToSequenceUnitRedirect(
        courseId,
        sequenceStatus,
        sequence,
        unitId,
        navigate,
      );

      expect(navigate).toHaveBeenCalledWith(`/course/${courseId}/${sequence.id}`, { replace: true });
    });
  });
});
