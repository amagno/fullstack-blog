import React from 'react'
import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo'
import App from './App'

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:4000/graphql'
})
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
        }
        // get the authentication token from local storage if it exists
        const token = sessionStorage.getItem('token');
        console.log(token)
        req.options.headers['x-access-token'] = token ? token : null;
        next()
    }
}])
const client = new ApolloClient({
    networkInterface
})

export default () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)