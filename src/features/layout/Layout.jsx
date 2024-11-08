import classNames from 'classnames';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import {
  isDesktopSidebarExtendedSelector, layoutHasSidebarSelector,
} from '../course-view/data/selectors';

ensureConfig([
  'DISABLE_DESKTOP_HEADER',
  'DISABLE_APP_FOOTER',
], 'Layout component');

const Layout = ({ children }) => {
  const disableDesktopHeader = getConfig().DISABLE_DESKTOP_HEADER === true;
  const disableAppFooter = getConfig().DISABLE_APP_FOOTER === true;
  const isMobileDevice = useMediaQuery({ query: '(max-width: 1200px)' });
  const layoutHasSidebar = useSelector(layoutHasSidebarSelector);
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);
  const customLinks = getConfig().FOOTER_LINK_MAP ? JSON.parse(getConfig().FOOTER_LINK_MAP) : undefined;

  return (
    <>
      {(!disableDesktopHeader || isMobileDevice) && <Header />}
      <div className={classNames('layout-body', { 'disable-desktop-header': disableDesktopHeader })}>
        {children}
      </div>
      {!disableAppFooter && (
        <Footer
          className={classNames({
            'footer-no-sidebar': !layoutHasSidebar,
            'footer-sidebar-extended': layoutHasSidebar && isSidebarExtended,
          })}
          links={customLinks}
        />
      )}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
