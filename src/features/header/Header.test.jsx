import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// Local Components
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import initializeStore from '../../app/store';

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
