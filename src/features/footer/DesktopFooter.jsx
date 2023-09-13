import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { EVENT_NAMES, COPY_SYMBOL } from './constants';

const DesktopFooter = ({
  logo,
  logoAltText,
  adaUrl,
  privacyPolicyUrl,
  tosUrl,
  copyRight,
}) => {
  const { config } = useContext(AppContext);

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
      className="desktop-footer d-flex flex-column px-4"
    >
      <div className="align-items-center container-fluid d-flex justify-content-between container-top">
        <img
          style={{ maxHeight: 24 }}
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
      <div className="d-flex justify-content-between container-bottom">
        <div className="container-fluid d-flex">
          <span>
            {COPY_SYMBOL}
            {' '}
            {copyRight}
          </span>
        </div>
        <div className="container-fluid d-flex flex-row-reverse">
          <a
            className="d-block info-link"
            href={privacyPolicyUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Opens in new tab"
            onClick={externalLinkClickHandler}
          >
            Privacy Policy
          </a>
          <span className="link-divider">
            |
          </span>
          <a
            className="d-block info-link"
            href={tosUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Opens in new tab"
            onClick={externalLinkClickHandler}
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

DesktopFooter.propTypes = {
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  adaUrl: PropTypes.string,
  copyRight: PropTypes.string,
  privacyPolicyUrl: PropTypes.string,
  tosUrl: PropTypes.string,
};

DesktopFooter.defaultProps = {
  logo: undefined,
  logoAltText: '',
  adaUrl: '',
  copyRight: '',
  privacyPolicyUrl: '',
  tosUrl: '',
};

export default DesktopFooter;
