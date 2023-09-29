import React from 'react';
import { Factory } from 'rosie';
import { breakpoints } from '@edx/paragon';
import { Context as ResponsiveContext } from 'react-responsive';

// Local Components
import Header from './Header';
import { initializeTestStore, render, screen } from '../../setupTest';

describe('Header', () => {
  let courseHomeMetadata;

  beforeAll(async () => {
    courseHomeMetadata = Factory.build('courseHomeMetadata');
    await initializeTestStore({ courseHomeMetadata });
  });

  it('Renders with course title from store', () => {
    render(
      <ResponsiveContext.Provider value={{ width: breakpoints.extraLarge.minWidth }}>
        <Header />
      </ResponsiveContext.Provider>,
    );
    expect(screen.getByText(courseHomeMetadata.title, { exact: false }));
  });
});
