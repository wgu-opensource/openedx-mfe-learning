import React from 'react';
import Responsive from 'react-responsive';
import { getConfig } from '@edx/frontend-platform';
import { useSelector } from 'react-redux';

// Local Components
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import { currentCourseHomeMetaSelector } from './data/selectors';

const Header = () => {
  const course = useSelector(currentCourseHomeMetaSelector);

  const props = {
    logo: getConfig().LOGO_WHITE_URL,
    logoAltText: getConfig().SITE_NAME,
    courseTitle: course?.title,
    courseNumber: course?.number,
  };

  return (
    <>
      <Responsive maxWidth={768}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopHeader {...props} />
      </Responsive>
    </>
  );
};

export default Header;
