import React from 'react';
import Responsive from 'react-responsive';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import DesktopFooter from './DesktopFooter';
import MobileFooter from './MobileFooter';

const Footer = () => {
  const props = {
    logo: getConfig().LOGO_TRADEMARK_URL,
    logoAltText: getConfig().SITE_NAME,
    adaUrl: getConfig().ADA_URL,
    copyRight: getConfig().COPYRIGHT_STRING,
    tosUrl: getConfig().TERMS_OF_SERVICE_URL,
    privacyPolicyUrl: getConfig().PRIVACY_POLICY_URL,
  };

  return (
    <>
      <Responsive maxWidth={768}>
        <MobileFooter {...props} />
      </Responsive>
      <Responsive minWidth={769}>
        <DesktopFooter {...props} />
      </Responsive>
    </>
  );
};

export default Footer;
