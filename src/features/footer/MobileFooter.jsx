import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { EVENT_NAMES, COPY_SYMBOL } from './constants';

const MobileFooter = ({
  logo,
  logoAltText,
  adaUrl,
  copyRight,
  links,
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
      className="mobile-footer d-flex flex-column px-4"
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
      <div className="align-items-center container-fluid d-flex">
        <span className="copyright">
          {COPY_SYMBOL}
          {' '}
          {copyRight}
        </span>
      </div>
      <div className="align-items-center container-fluid d-flex container-bottom">
        {links.map((link, index) => (
          <>
            <a
              className="d-block info-link"
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
    </footer>
  );
};

MobileFooter.contextType = AppContext;

MobileFooter.propTypes = {
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  adaUrl: PropTypes.string,
  copyRight: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.objectOf({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })),
};

MobileFooter.defaultProps = {
  logo: undefined,
  logoAltText: '',
  adaUrl: '',
  copyRight: '',
  links: [],
};

export default MobileFooter;
