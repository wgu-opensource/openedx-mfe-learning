import React from 'react';
import Responsive from 'react-responsive';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const Header = () => {
  const props = {
    logo: getConfig().LOGO_WHITE_URL,
    logoAltText: getConfig().SITE_NAME,
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
