import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// Local Components
import Logo from './Logo';
import { toggleMobileSidebar } from '../course-view/data/slice';

const MenuIcon = (props) => (
  <svg
    width="12px"
    height="12px"
    viewBox="0 0 16 16"
    version="1.0"
    {...props}
  >
    <rect fill="white" x="1" y="2.5" width="10" height="1" />
    <rect fill="white" x="1" y="5.5" width="10" height="1" />
    <rect fill="white" x="1" y="8.5" width="10" height="1" />
  </svg>
);

const MobileHeader = ({
  courseNumber, courseTitle, logo, logoAltText,
}) => {
  const headerLogo = (
    <Logo
      className="mobile-logo"
      src={logo}
      alt={logoAltText}
    />
  );

  const dispatch = useDispatch();

  const toggleMenu = () => {
    dispatch(toggleMobileSidebar());
  };

  return (
    <header className="mobile-header sticky-top">
      <div className="d-flex justify-content-start align-items-center">
        <button className="menu-trigger" type="button" onClick={toggleMenu}>
          <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
        <div
          className="flex-grow-1 course-title-lockup align-items-center"
          style={{ lineHeight: 1 }}
        >
          <span className="d-block m-0 course-title">
            {courseNumber}
            {' '}
            {courseTitle}
          </span>
        </div>
        <div className="d-flex align-items-center">
          {headerLogo}
        </div>
      </div>
    </header>
  );
};

MobileHeader.propTypes = {
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
};

MobileHeader.defaultProps = {
  courseNumber: '',
  courseTitle: '',
  logo: '',
  logoAltText: '',
};

export default MobileHeader;
