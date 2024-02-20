import classNames from 'classnames';
import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMobileSidebar } from '../course-view/data/slice';

import { currentCourseHomeMetaSelector } from './data/selectors';
import Logo from '../../assets/Logo';
import MenuIcon from '../../assets/MenuIcon';
import { layoutHasSidebarSelector } from '../course-view/data';

const Header = () => {
  const disableHeaderLogo = getConfig().DISABLE_HEADER_LOGO === true;
  const course = useSelector(currentCourseHomeMetaSelector);
  const layoutHasSidebar = useSelector(layoutHasSidebarSelector);

  const logo = getConfig().LOGO_WHITE_URL;
  const logoAltText = `${getConfig().SITE_OPERATOR} logo`;
  const courseTitle = course?.title || '';

  const dispatch = useDispatch();

  const toggleMenu = () => {
    dispatch(toggleMobileSidebar());
  };

  return (
    <header className={classNames('header', { 'disable-header-logo': disableHeaderLogo })}>
      { !disableHeaderLogo
      && (
      <Logo
        className="logo"
        src={logo}
        alt={logoAltText}
      />
      ) }
      <span className="course-title">
        {`${courseTitle}`}
      </span>
      {layoutHasSidebar && (
      <button className="menu-trigger" type="button" onClick={toggleMenu}>
        <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
      </button>
      )}
    </header>
  );
};

export default Header;
