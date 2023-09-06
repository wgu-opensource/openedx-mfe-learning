import PropTypes from 'prop-types';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Layout = ({ children }) => (
  <>
    <Header />
    <div className="layout-body">
      {children}
    </div>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
