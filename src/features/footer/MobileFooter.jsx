import React from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';
import { EVENT_NAMES, copySymbol } from './constants';

class MobileFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    let eventName = null;
    if (label.toLowerCase.contains('accommodations')) {
      eventName = EVENT_NAMES.ADA_LINK;
    } else if (label.toLowerCase.contains('privacy')) {
      eventName = EVENT_NAMES.PRIVACY_POLICY_LINK;
    } else if (label.toLowerCase.contains('terms')) {
      eventName = EVENT_NAMES.TERMS_OF_SERVICE_LINK;
    }
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {
      logo,
      logoAltText,
      adaUrl,
      privacyPolicyUrl,
      tosUrl,
      copyRight,
    } = this.props;
    const { config } = this.context;

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
          >
            ADA Accommodation
          </a>
        </div>
        <div className="align-items-center container-fluid d-flex">
          <span className="copyright">
            {copySymbol}
            {' '}
            {copyRight}
          </span>
        </div>
        <div className="align-items-center container-fluid d-flex container-bottom">
          <a
            className="d-block info-link left-align"
            href={privacyPolicyUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Opens in new tab"
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
          >
            Terms of Service
          </a>
        </div>
      </footer>
    );
  }
}

MobileFooter.contextType = AppContext;

MobileFooter.propTypes = {
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  adaUrl: PropTypes.string,
  copyRight: PropTypes.string,
  privacyPolicyUrl: PropTypes.string,
  tosUrl: PropTypes.string,
};

MobileFooter.defaultProps = {
  logo: undefined,
  logoAltText: '',
  adaUrl: '',
  copyRight: '',
  privacyPolicyUrl: '',
  tosUrl: '',
};

export default MobileFooter;
export { EVENT_NAMES };
