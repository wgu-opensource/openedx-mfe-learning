import React from 'react';
import { breakpoints } from '@edx/paragon';
import {
  render, screen, waitFor, initializeTestStore,
} from '../../setupTest';
import CourseView from './CourseView';

describe('CourseView', () => {
  let mockData;

  beforeAll(async () => {
    const store = await initializeTestStore();
    const { courseware } = store.getState();
    mockData = {
      match: {
        params: {
          courseId: courseware.courseId,
          sequenceId: courseware.sequenceId,
          unitId: 'test',
        },
      },
    };
  });

  beforeEach(() => {
    global.innerWidth = breakpoints.extraLarge.minWidth;
  });

  it('renders', async () => {
    render(<CourseView {...mockData} />);
    await waitFor(() => expect(screen.queryByText('Loading learning sequence...')).toBeInTheDocument());
  });
});
