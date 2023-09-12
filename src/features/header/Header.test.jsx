import React from 'react';
import { Factory } from 'rosie';
import { Provider } from 'react-redux';
import { breakpoints } from '@edx/paragon';
import { Context as ResponsiveContext } from 'react-responsive';

// Local Components
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import initializeStore from '../../app/store';
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
    expect(screen.getByText(courseHomeMetadata.number, { exact: false }));
    expect(screen.getByText(courseHomeMetadata.title, { exact: false }));
  });
});

describe('DesktopHeader', () => {
  it('displays course data', () => {
    const courseData = {
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };

    render(<DesktopHeader {...courseData} />);

    expect(screen.getByText(courseData.courseNumber, { exact: false }));
    expect(screen.getByText(courseData.courseTitle, { exact: false }));
  });
});

describe('MobileHeader', () => {
  let store;

  beforeEach(() => {
    store = initializeStore();
  });

  it('displays course data', () => {
    const courseData = {
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };

    render(
      <Provider store={store}><MobileHeader {...courseData} /></Provider>,
    );

    expect(screen.getByText(courseData.courseNumber, { exact: false }));
    expect(screen.getByText(courseData.courseTitle, { exact: false }));
  });
});
