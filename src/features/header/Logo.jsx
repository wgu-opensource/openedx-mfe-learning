import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ src, alt, ...attributes }) => <img src={src} alt={alt} {...attributes} />;

Logo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Logo;
