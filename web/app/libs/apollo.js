import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';

export default (GRAPHQL_URI = 'http://localhost:8080/graphql') => {
  const networkInterface = createNetworkInterface(GRAPHQL_URI, {
    credentials: 'cross-origin',
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.token) {
        req.options.headers.authorization = 'Bearer ' + user.token;
      }
      next();
    },
  }]);

  return new ApolloClient({
    networkInterface,
    queryTransformer: addTypename,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
        return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
      }
      return null;
    },
    shouldBatch: true,
  });
};
