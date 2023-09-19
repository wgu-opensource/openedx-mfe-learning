import { AppContext } from '@edx/frontend-platform/react';
import { ensureConfig } from '@edx/frontend-platform/config';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import React, { useContext } from 'react';
import { EVENT_NAMES, COPY_SYMBOL } from './constants';

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
  const { config } = useContext(AppContext);

  const adaUrl = getConfig().ADA_URL;
  const copyRight = getConfig().COPYRIGHT_STRING;
  const links = [
    { label: 'Privacy Policy', url: getConfig().PRIVACY_POLICY_URL },
    { label: 'Terms of Service', url: getConfig().TERMS_OF_SERVICE_URL },
    { label: 'Honor Code', url: getConfig().HONOR_CODE_URL },

  ];
  const logo = getConfig().LOGO_TRADEMARK_URL;
  const logoAltText = getConfig().SITE_NAME;

  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute('href');
    let eventName = null;
    if (label.toLowerCase().includes('accommodations')) {
      eventName = EVENT_NAMES.ADA_LINK;
    } else if (label.toLowerCase().includes('privacy')) {
      eventName = EVENT_NAMES.PRIVACY_POLICY_LINK;
    } else if (label.toLowerCase().includes('terms')) {
      eventName = EVENT_NAMES.TERMS_OF_SERVICE_LINK;
    }
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  return (
    <footer
      role="contentinfo"
      className="footer"
    >
      <div className="footer-section-container">
        <img
          src={logo || config.LOGO_TRADEMARK_URL}
          alt={logoAltText}
        />
        <a
          className="d-block branded-link"
          href={adaUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Opens in new tab"
          onClick={externalLinkClickHandler}
        >
          ADA Accommodation
        </a>
      </div>
      <div className="footer-section-container footer-bottom-container">
        <div className="">
          <span>
            {COPY_SYMBOL}
            {' '}
            {copyRight}
          </span>
        </div>
        <div className="footer-links-container">
          {links.map((link, index) => (
            <>
              <a
                className="info-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Opens in new tab"
                onClick={externalLinkClickHandler}
              >
                {link.label}
              </a>
              {links.length !== (index + 1) && (
              <span className="link-divider">
                |
              </span>
              )}
            </>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
