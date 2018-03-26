import React from 'react';

// StaticRouter changes "context" to "staticContext", only available on server
const NotFound = ({ staticContext = {} }) => {
  staticContext.notFound = true;
  return (
    <div className="center-align" style={ { marginTop: '200px' } }>
      <h3>Sorry, Page Not Found</h3>
    </div>
  );
};

export default { component: NotFound };
