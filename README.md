# Jolokia Stats JS Client

This JS client provides basic statistics from [Jolokia server](https://jolokia.org/) as back-end

## Features

1. Memory usage
2. List of cluster nodes
3. Thread dump
4. Run Garbage collection

## How to use it

You can run the client `metrics.html` from:

1. Filesystem (clonned git repo)
2. Upload all files to your web server
3. From github at https://rawgit.com/lkrzyzanek/jolokia-stats-jsclient/master/metrics.html

Once you have loaded the page put to the field `url` the full path to Jolokia servlet.

### Secured Jolokia servlet via CORS

In case you have deployed Jolokia servlet on different domain than the client lives then
you need to have correctly configured CORS headers including `withCredentials` headers.
