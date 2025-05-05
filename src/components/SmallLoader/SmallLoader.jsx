import React from 'react';
import { Spinner } from '@openedx/paragon';

const SmallLoader = () => (
  <div className="small-loader" data-testid="small-loader">
    <span className="small-loader-container">
      <Spinner
        animation="border"
        className="spinner-border-sm text-primary small-loader-spinner"
        screenReaderText="loading"
      />
    </span>
  </div>
);

export default SmallLoader;
