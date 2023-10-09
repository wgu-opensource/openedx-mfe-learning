import React from 'react';

import CourseAccessErrorPage from './CourseAccessErrorPage';
import {
  initializeTestStore, render, screen, waitFor,
} from '../../setupTest';

describe('CourseAccessErrorPage', () => {
  beforeAll(async () => {
    await initializeTestStore();
  });

  it('renders', async () => {
    render(
      <CourseAccessErrorPage />,
    );
    await waitFor(() => expect(
      screen.queryByText(
        "Sorry! You don't have permission to access this page.",
        { exact: false },
      ),
    ).toBeInTheDocument());
  });
});
