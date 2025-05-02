import React from 'react';
import { Factory } from 'rosie';
import { breakpoints } from '@openedx/paragon';
import {
  loadUnit, render, screen, waitFor, initializeTestStore, appendStyles,
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
      unitNavigationHandler: () => { },
      nextSequenceHandler: () => { },
      previousSequenceHandler: () => { },
      toggleNotificationTray: () => { },
      setNotificationStatus: () => { },
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

  it('handles loading unit', async () => {
    render(<SequenceContainer {...mockData} />);
    expect(await screen.findByText('Loading learning sequence...')).toBeInTheDocument();
    // Renders navigation buttons (2 bookmark, notificaitons tray).
    expect(screen.getAllByRole('button')).toHaveLength(2);

    loadUnit();
    await waitFor(() => expect(screen.queryByText('Loading learning sequence...')).not.toBeInTheDocument());
    // At this point there will be 1 `Previous` and 1 `Next` buttons.
    expect(screen.getAllByRole('button', { name: /previous|next/i }).length).toEqual(2);
  });

  it('has top navigation hidden', async () => {
    // Top navigation is part of the Sequence component, but we don't want to show it
    const { container } = render(<SequenceContainer {...mockData} />);
    appendStyles(container);

    let nav;
    await waitFor(() => {
      nav = container.querySelector('#courseware-sequence-navigation');
      if (!nav) {
        throw new Error('Top Navigation not found in the DOM');
      }
    });

    expect(nav).not.toBeVisible();
  });

  it('has bookmark button hidden', async () => {
    // Bookmark button is part of the Sequence component, but we don't want to show it
    const { container } = render(<SequenceContainer {...mockData} />);
    appendStyles(container);

    const bookmarkButton = await screen.findByText('Bookmark this page');

    expect(bookmarkButton).not.toBeVisible();
  });
});
