import classNames from 'classnames';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import {
  isDesktopSidebarExtendedSelector, layoutHasSidebarSelector,
} from '../course-view/data/selectors';

ensureConfig([
  'DISABLE_APP_HEADER',
], 'Layout component');

const Layout = ({ children }) => {
  const disableAppHeader = getConfig().DISABLE_APP_HEADER === true;
  const disableAppFooter = getConfig().DISABLE_APP_FOOTER === true;
  const layoutHasSidebar = useSelector(layoutHasSidebarSelector);
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);

  return (
    <>
      {!disableAppHeader && <Header />}
      <div className={classNames('layout-body', { 'disable-app-header': disableAppHeader })}>
        {children}
      </div>
      {!disableAppFooter && (
        <Footer
          className={classNames({
            'footer-no-sidebar': !layoutHasSidebar,
            'footer-sidebar-extended': layoutHasSidebar && isSidebarExtended,
            'disable-app-footer': disableAppFooter,
          })}
        />
      )}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
