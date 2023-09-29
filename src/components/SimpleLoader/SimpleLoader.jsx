import React from 'react';
import { Spinner } from '@edx/paragon';

const SimpleLoader = () => (
  <div className="simple-loader text-center m-4">
    <span className="simple-loader-container">
      <Spinner animation="border" className="spinner-border text-primary" screenReaderText="loading" />
    </span>
  </div>
);

export default SimpleLoader;
