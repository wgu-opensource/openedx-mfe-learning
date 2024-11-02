import React from 'react';

import Footer from './Footer';
import {
  initializeTestStore, render, screen, waitFor,
} from '../../setupTest';

describe('Footer', () => {
  beforeAll(async () => {
    await initializeTestStore();
  });

  it('Renders', async () => {
    render(
      <Footer />,
    );
    await waitFor(() => expect(
      screen.queryByText(
        'ADA Accommodation',
        { exact: false },
      ),
    ).toBeInTheDocument());
  });
  it('Renders Links', async () => {
    render(
      <Footer links={[{ label: 'Test Link', url: 'http://test/url', id: 1 }]} />,
    );
    await waitFor(() => expect(
      screen.queryByText(
        'Test Link',
        { exact: true },
      ),
    ).toBeInTheDocument());
  });
});
