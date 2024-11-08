import { AppContext } from '@edx/frontend-platform/react';
import { ensureConfig } from '@edx/frontend-platform/config';
import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

const Footer = ({ className, links }) => {
  const { config } = useContext(AppContext);

  const adaUrl = getConfig().ADA_URL;
  const copyRight = getConfig().COPYRIGHT_STRING;
  const logo = getConfig().LOGO_TRADEMARK_URL;
  const logoAltText = `${getConfig().SITE_OPERATOR} logo`;
  let footerlinks = [];
  if (links == null) {
    footerlinks = [
      { label: 'Privacy Policy', url: getConfig().PRIVACY_POLICY_URL, id: 1 },
      { label: 'Terms of Service', url: getConfig().TERMS_OF_SERVICE_URL, id: 2 },
      { label: 'Honor Code', url: getConfig().HONOR_CODE_URL, id: 3 },
    ];
  } else {
    footerlinks = links;
  }

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
      className={classNames('footer', className)}
    >
      <div className="footer-section-container">
        <img
          src={logo || config.LOGO_TRADEMARK_URL}
          alt={logoAltText}
        />
        <a
          className="d-block branded-link aria-tooltip-link"
          href={adaUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="ADA Accommodation (opens in new tab)"
          onClick={externalLinkClickHandler}
        >
          ADA Accommodation
          <span className="aria-tooltip">Opens in new tab</span>
        </a>
      </div>
      <div className="footer-section-container footer-bottom-container">
        <div className="footer-copy">
          <span>
            {COPY_SYMBOL} {copyRight}
          </span>
        </div>
        <div className="footer-links-container divide-x">
          {footerlinks.map((link) => (
            <a
              key={link.id}
              className="info-link aria-tooltip-link"
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${link.label} (opens in new tab)`}
              onClick={externalLinkClickHandler}
            >
              {link.label}
              <span className="aria-tooltip">Opens in new tab</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))),
};

Footer.defaultProps = {
  className: '',
  links: null,
};

export default Footer;
