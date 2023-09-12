import React from 'react';
import { Factory } from 'rosie';
import { breakpoints } from '@edx/paragon';
import {
  loadUnit, render, screen, waitFor, initializeTestStore,
} from '../../setupTest';
import CoursePlayer from './CoursePlayer';

describe('CoursePlayer', () => {
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
      match: {
        params: {
          courseId: courseware.courseId,
          sequenceId: courseware.sequenceId,
          unitId: unitBlocks[0].id,
        },
      },
    };
  });

  beforeEach(() => {
    global.innerWidth = breakpoints.extraLarge.minWidth;
  });

  it('renders and connects to redux store to load course content', async () => {
    render(<CoursePlayer {...mockData} />);
    await waitFor(() => expect(screen.queryByText('Loading learning sequence...')).toBeInTheDocument());
    loadUnit();
    await waitFor(() => expect(screen.queryByText('Loading learning sequence...')).not.toBeInTheDocument());
  });
});
