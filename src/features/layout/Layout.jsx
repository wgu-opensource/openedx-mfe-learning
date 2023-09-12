import Footer from '@edx/frontend-component-footer';
import classNames from 'classnames';
import { ensureConfig, getConfig } from '@edx/frontend-platform/config';
import PropTypes from 'prop-types';
import Header from '../header/Header';

ensureConfig([
  'DISABLE_APP_HEADER',
], 'Layout component');

const Layout = ({ children }) => {
  const disableAppHeader = getConfig().DISABLE_APP_HEADER === true;

  return (
    <>
      {!disableAppHeader && <Header />}
      <div className={classNames('layout-body', { 'disable-app-header': disableAppHeader })}>
        {children}
      </div>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
