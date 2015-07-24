# Jolokia Stats JS Client

This JS client provides basic statistics from Jolokia server as back-end

## Features

1. Memory usage
2. List of cluster nodes
3. Thread dump
4. Run Garbage collection

## How to use it

Run metrics.html in browser directly from your filesystem or upload it to server all files.
Put to the field `url` the full path to Jolokia servlet.

### Secured Jolokia servlet via CORS

In case you have deployed Jolokia servlet on different domain than the client lives then
you need to have correctly configured CORS headers including `withCredentials` headers.
