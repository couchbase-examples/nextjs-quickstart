FROM deniswsrosa/couchbase7.0.beta-gitpod

#Simple example on how to extend the image to install Java and maven
RUN apt-get -qq update && \
    apt-get install -yq nodejs npm