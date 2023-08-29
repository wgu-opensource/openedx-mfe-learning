import Footer from '@edx/frontend-component-footer';
import PropTypes from 'prop-types';
import Header from '../header/Header';

const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
