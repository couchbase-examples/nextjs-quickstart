FROM deniswsrosa/couchbase7-5868-gitpod

#Simple example on how to extend the image to install Java and maven
RUN apt-get -qq update && \
    apt-get install -yq nodejs npm
