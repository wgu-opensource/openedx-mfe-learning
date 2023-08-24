import React from 'react';
import PropTypes from 'prop-types';

// Local Components
import Logo from './Logo';
import {
  MobileMenu, MobileMenuTrigger, MobileMenuContent, MenuIcon,
} from './MobileMenu';

function renderMainMenu() {
  // Add menu items here
  const { mainMenu } = [];

  // Nodes are accepted as a prop
  if (!Array.isArray(mainMenu)) {
    return mainMenu;
  }

  return mainMenu.map((menuItem) => {
    const {
      type,
      href,
      content,
      submenuContent,
    } = menuItem;

    if (type === 'item') {
      return (
        <a key={`${type}-${content}`} className="nav-link" href={href}>
          {content}
        </a>
      );
    }

    return (
      <MobileMenu key={`${type}-${content}`} tag="div" className="nav-item">
        <MobileMenuTrigger tag="a" role="button" tabIndex="0" className="nav-link">
          {content}
        </MobileMenuTrigger>
        <MobileMenuContent className="position-static pin-left pin-right py-2">
          {submenuContent}
        </MobileMenuContent>
      </MobileMenu>
    );
  });
}

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

  return (
    <header className="mobile-header sticky-top">
      <div className="w-100 d-flex justify-content-start align-items-center">
        {headerLogo}
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
          <MobileMenu className="position-static">
            <MobileMenuTrigger
              tag="button"
              className="icon-button"
              title="Navigation Menu"
            >
              <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
            </MobileMenuTrigger>
            <MobileMenuContent
              tag="nav"
              className="nav flex-column pin-left pin-right border-top shadow py-2"
            >
              {renderMainMenu()}
            </MobileMenuContent>
          </MobileMenu>
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
