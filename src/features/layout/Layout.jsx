import classNames from 'classnames';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import {
  isDesktopSidebarExtendedSelector,
} from '../course-view/data/selectors';

ensureConfig([
  'DISABLE_APP_HEADER',
], 'Layout component');

const Layout = ({ children }) => {
  const disableAppHeader = getConfig().DISABLE_APP_HEADER === true;
  const isSidebarExtended = useSelector(isDesktopSidebarExtendedSelector);

  return (
    <>
      {!disableAppHeader && <Header />}
      <div className={classNames('layout-body', { 'disable-app-header': disableAppHeader })}>
        {children}
      </div>
      <Footer className={classNames({ 'footer-sidebar-extended': isSidebarExtended })} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
