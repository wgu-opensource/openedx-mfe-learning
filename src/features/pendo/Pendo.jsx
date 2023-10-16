import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useEffect } from 'react';
import { getConfig, ensureConfig } from '@edx/frontend-platform';

ensureConfig([
  'CUSTOM_PENDO',
  'PENDO_VISITOR_KEY',
], 'Pendo');

// Use this function if OEX username is Pendo visitor ID
function pendoHelperUser(pendoKey) {
  const pendoVisitor = getConfig().PENDO_VISITOR_TYPE;
  const { username } = getAuthenticatedUser();

  // Check if token is in local storage, if so replace
  if (localStorage.getItem(pendoVisitor === null)) {
    localStorage.setItem(pendoVisitor, JSON.stringify({
      [pendoKey]: username,
    }));
  } else {
    localStorage.removeItem(pendoVisitor);
    localStorage.setItem(pendoVisitor, JSON.stringify({
      [pendoKey]: username,
    }));
  }
}

// Use this function for a custom visitor ID
function pendoHelperCustom(pendoKey) {
  // eslint-disable-next-line prefer-const
  let visitor = null;

  // Iife should retreive custom visitor ID and assign to visitor
  // eslint-disable-next-line no-unused-expressions
  function customVisitorIife() { getConfig().PENDO_VISITOR_IIFE; }
  customVisitorIife();

  if (localStorage.getItem(pendoKey === null)) {
    localStorage.setItem(pendoKey, visitor);
  } else {
    localStorage.removeItem(pendoKey);
    localStorage.setItem(pendoKey, visitor);
  }
}

const Pendo = () => {
  const customPendo = getConfig().CUSTOM_PENDO === 'true';
  const pendoKey = getConfig().PENDO_VISITOR_KEY;

  useEffect(() => {
    if (customPendo) {
      pendoHelperCustom(pendoKey);
    } else {
      pendoHelperUser(pendoKey);
    }
  }, [customPendo, pendoKey]);

  return (
    <>
    </>
  );
};

export default Pendo;
