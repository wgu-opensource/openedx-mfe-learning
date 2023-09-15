import React from 'react';
import Responsive from 'react-responsive';
import { getConfig } from '@edx/frontend-platform';
import { ensureConfig } from '@edx/frontend-platform/config';

// Local Components
import DesktopFooter from './DesktopFooter';
import MobileFooter from './MobileFooter';

ensureConfig([
  'ADA_URL',
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
  'PRIVACY_POLICY_URL',
  'TERMS_OF_SERVICE_URL',
  'COPYRIGHT_STRING',
  'SITE_NAME',
], 'Footer component');

const Footer = () => {
  const props = {
    logo: getConfig().LOGO_TRADEMARK_URL,
    logoAltText: getConfig().SITE_NAME,
    adaUrl: getConfig().ADA_URL,
    copyRight: getConfig().COPYRIGHT_STRING,
    links: [
      { label: 'Honor Code', url: getConfig().HONOR_CODE_URL },
      { label: 'Terms of Service', url: getConfig().TERMS_OF_SERVICE_URL },
      { label: 'Privacy Policy', url: getConfig().PRIVACY_POLICY_URL },
    ],
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
