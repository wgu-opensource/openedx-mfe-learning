import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

/**
 * Inline component that mirrors the keepalive injection logic in index.jsx.
 * Keeping it here (rather than importing from index.jsx) avoids pulling in the
 * full app bootstrap. If this logic is ever extracted into its own component,
 * update this to import from there instead.
 */
const KeepaliveScript = ({ src }) => (
  <Helmet>
    {src && <script src={src} type="text/javascript" defer />}
  </Helmet>
);

KeepaliveScript.propTypes = {
  src: PropTypes.string,
};

KeepaliveScript.defaultProps = {
  src: null,
};

/**
 * Render the component into a detached div, read the Helmet state immediately
 * (before unmount clears it), then tear down. This lets each test see a clean
 * snapshot without relying on Helmet.rewind() (server-only).
 */
function renderAndPeek(jsx) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => { render(jsx, container); });
  const helmetState = Helmet.peek();
  act(() => { unmountComponentAtNode(container); });
  container.remove();
  return helmetState;
}

describe('Keepalive script injection (index.jsx Helmet logic)', () => {
  it('injects a deferred script tag when SESSION_KEEPALIVE_SCRIPT_URL is set', () => {
    const url = 'https://lms.example.com/wgu/keepalive.js';
    const { scriptTags } = renderAndPeek(<KeepaliveScript src={url} />);

    expect(scriptTags).toHaveLength(1);

    const [tag] = scriptTags;
    expect(tag.src).toBe(url);
    expect(tag.type).toBe('text/javascript');
    // Must be defer, NOT async — the script reads localStorage and mounts a
    // modal into document.body so it needs a fully parsed document.
    expect(tag.defer).toBe(true);
    expect(tag.async).toBeFalsy();
  });

  it('does not inject a script tag when SESSION_KEEPALIVE_SCRIPT_URL is an empty string', () => {
    const { scriptTags } = renderAndPeek(<KeepaliveScript src="" />);
    expect(scriptTags ?? []).toHaveLength(0);
  });

  it('does not inject a script tag when SESSION_KEEPALIVE_SCRIPT_URL is null', () => {
    const { scriptTags } = renderAndPeek(<KeepaliveScript src={null} />);
    expect(scriptTags ?? []).toHaveLength(0);
  });

  it('does not inject a script tag when SESSION_KEEPALIVE_SCRIPT_URL is undefined', () => {
    const { scriptTags } = renderAndPeek(<KeepaliveScript src={undefined} />);
    expect(scriptTags ?? []).toHaveLength(0);
  });

  it('uses the exact URL provided without modification', () => {
    const url = 'https://lms.example.com/wgu/keepalive.js?v=2';
    const { scriptTags } = renderAndPeek(<KeepaliveScript src={url} />);

    expect(scriptTags).toHaveLength(1);
    expect(scriptTags[0].src).toBe(url);
  });
});
