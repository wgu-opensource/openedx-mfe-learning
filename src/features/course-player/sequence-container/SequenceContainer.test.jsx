import React from 'react';
import { Factory } from 'rosie';
import { breakpoints } from '@edx/paragon';
import {
  courseMetadataFactory,
  sequenceMetadataFactory,
  learningSequencesOutlineFactory,
} from '@edx/frontend-app-learning';
import {
  loadUnit, render, screen, fireEvent, waitFor, initializeTestStore,
} from '../../../setupTest';
import SequenceContainer from './SequenceContainer';

describe('SequenceContainer', () => {
  let mockData;
  const courseMetadata = Factory.build('courseMetadata');
  const unitBlocks = Array.from({ length: 3 }).map(() => Factory.build(
    'block',
    { type: 'vertical' },
    { courseId: courseMetadata.id },
  ));

  beforeAll(async () => {
    const store = await initializeTestStore({ courseMetadata, unitBlocks });
    const { courseware } = store.getState();
    mockData = {
      unitId: unitBlocks[0].id,
      sequenceId: courseware.sequenceId,
      courseId: courseware.courseId,
      unitNavigationHandler: () => {},
      nextSequenceHandler: () => {},
      previousSequenceHandler: () => {},
      toggleNotificationTray: () => {},
      setNotificationStatus: () => {},
    };
  });

  beforeEach(() => {
    global.innerWidth = breakpoints.extraLarge.minWidth;
  });

  it('renders correctly without data', async () => {
    const testStore = await initializeTestStore({ excludeFetchCourse: true, excludeFetchSequence: true }, false);
    render(<SequenceContainer {...mockData} {...{ unitId: undefined, sequenceId: undefined }} />, { store: testStore });

    expect(screen.getByText('There is no content here.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
