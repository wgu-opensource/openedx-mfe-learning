import React from 'react';
import { breakpoints } from '@edx/paragon';
import {
  render, screen, initializeTestStore,
} from '../../setupTest';
import Layout from './Layout';

describe('Layout', () => {
  beforeAll(async () => {
    await initializeTestStore();
  });

  beforeEach(() => {
    global.innerWidth = breakpoints.extraLarge.minWidth;
  });

  it('renders', async () => {
    render(<Layout><p>Test</p></Layout>);
    expect(screen.queryByText('Test')).toBeInTheDocument();
  });
});
