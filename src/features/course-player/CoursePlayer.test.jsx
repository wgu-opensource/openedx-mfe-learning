import React from 'react';
import { Factory } from 'rosie';
import { breakpoints } from '@edx/paragon';
import {
  loadUnit, render, screen, waitFor, initializeTestStore,
} from '../../setupTest';
import CoursePlayer from './CoursePlayer';

describe('CoursePlayer', () => {
  let mockData;
  let store;
  const courseMetadata = Factory.build('courseMetadata');
  const unitBlocks = Array.from({ length: 3 }).map(() => Factory.build(
    'block',
    { type: 'vertical' },
    { courseId: courseMetadata.id },
  ));

  beforeAll(async () => {
    store = await initializeTestStore({ courseMetadata, unitBlocks });
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

  describe('when the content is not ready to show', () => {
    it('shows loading spinner when sequenceId and unitId are not set in the url', async () => {
      const { courseware } = store.getState();
      const incompleteMockData = {
        match: {
          params: {
            courseId: courseware.courseId,
            sequenceId: null,
            unitId: null,
          },
        },
      };
      render(<CoursePlayer {...incompleteMockData} />);
      await waitFor(() => expect(screen.queryByTestId('simple-loader')).toBeInTheDocument());
    });

    it('shows loading spinner when courseId is not set in the url', async () => {
      const { courseware } = store.getState();
      const incompleteMockData = {
        match: {
          params: {
            courseId: null,
            sequenceId: courseware.sequenceId,
            unitId: unitBlocks[0].id,
          },
        },
      };
      render(<CoursePlayer {...incompleteMockData} />);
      await waitFor(() => expect(screen.queryByTestId('simple-loader')).toBeInTheDocument());
    });

    it('shows loading spinner when sequenceId is not set in the url', async () => {
      const { courseware } = store.getState();
      const incompleteMockData = {
        match: {
          params: {
            courseId: courseware.courseId,
            sequenceId: null,
            unitId: unitBlocks[0].id,
          },
        },
      };
      render(<CoursePlayer {...incompleteMockData} />);
      await waitFor(() => expect(screen.queryByTestId('simple-loader')).toBeInTheDocument());
    });

    it('shows loading spinner when unitId is not set in the url', async () => {
      const { courseware } = store.getState();
      const incompleteMockData = {
        match: {
          params: {
            courseId: courseware.courseId,
            sequenceId: courseware.sequenceId,
            unitId: null,
          },
        },
      };
      render(<CoursePlayer {...incompleteMockData} />);
      await waitFor(() => expect(screen.queryByTestId('simple-loader')).toBeInTheDocument());
    });
  });
});
