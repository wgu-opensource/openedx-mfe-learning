import React from 'react';
import PropTypes from 'prop-types';

// Local Component
import Logo from './Logo';

const DesktopHeader = ({
  courseNumber, courseTitle, logo, logoAltText,
}) => {
  const headerLogo = (
    <Logo
      className="desktop-logo"
      src={logo}
      alt={logoAltText}
    />
  );

  return (
    <header className="desktop-header">
      <div className="d-flex py-2 align-items-center">
        {headerLogo}
        <div
          className="flex-grow-1 course-title-lockup"
          style={{ lineHeight: 1 }}
        >
          <span className="d-block m-0 course-title">
            {courseNumber}
            {' '}
            {courseTitle}
          </span>
        </div>
      </div>
    </header>
  );
};

DesktopHeader.propTypes = {
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
};

DesktopHeader.defaultProps = {
  courseNumber: '',
  courseTitle: '',
  logo: '',
  logoAltText: '',
};

export default DesktopHeader;
