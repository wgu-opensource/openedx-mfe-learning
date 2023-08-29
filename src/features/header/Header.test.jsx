import React from 'react';
import { render, screen } from '@testing-library/react';

// Local Components
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

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
  it('displays course data', () => {
    const courseData = {
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };

    render(<MobileHeader {...courseData} />);

    expect(screen.getByText(courseData.courseNumber, { exact: false }));
    expect(screen.getByText(courseData.courseTitle, { exact: false }));
  });
});
