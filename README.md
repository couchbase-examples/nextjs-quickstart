# Quickstart for using Couchbase with Next.js


[![Try it now!](https://da-demo-images.s3.amazonaws.com/runItNow_outline.png?couchbase-example=nextjs-quickstart-repo&source=github)](https://gitpod.io/#https://github.com/couchbase-examples/nextjs-quickstart)

This is a companion repository to the tutorial: "[Quickstart for using Couchbase with Next.js](https://developer.couchbase.com/tutorial-quickstart-nextjs/)" at [developer.couchbase.com](https://developer.couchbase.com), which aims to get you up and running with Couchbase on [NextJS](https://nextjs.org/), connect to a Couchbase cluster, create, read, update, and delete documents, and how to write simple parameterized N1QL queries. It also covers creating a basic front-end using Next.js.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections.

## Prerequisites

To run this prebuilt project, you will need:

- A Couchbase Capella cluster or Couchbase 7 installed locally
- NodeJS & NPM (v12+)
- NextJS
- Code Editor

## Update environment variables appropriately

We've included a `.env.local.example` file with blank values for you to copy into a file called `.env.local` and fill in the values. We've also included a `.env.default` file for testing and running in GitPod. In most cases, you can ignore the default config file. 
- `CB_USERNAME` - The username of an authorized user on your cluster. Follow [these instructions](https://docs.couchbase.com/cloud/clusters/manage-database-users.html#create-database-credentials) to create database credentials on Capella
- `CB_PASSWORD` - The password that corresponds to the user specified above
- `CB_CONNECT_STRING` - The Couchbase connection string. Use `couchbase://localhost` for a local/Docker cluster, connection string specified on the 'Connect' tab within Capella (formatted like `couchbases://cb.<xxxxxx>.cloud.couchbase.com`)
- `CB_BUCKET` - The bucket you'd like to connect to. Set this to `user_profiles` for this tutorial.

**NOTE on TLS:** The connection logic in this sample app (`util/couchbase.js`) ignores mismatched certificates with the parameter `tls_verify=none`. While this is great for streamlining the connection process for development purposes, it's not very secure and should **not** be used in production. To learn how to secure your connection with proper certificates, see [the Node.js TLS connection tutorial](https://developer.couchbase.com/tutorial-nodejs-tls-connection).

## Set up and Run The Application
The [main tutorial](https://developer.couchbase.com/tutorial-quickstart-nextjs/) will walk you through the process of bootstrapping a new Next.js project using our 'with-couchbase' example, but here we'll focus on just cloning and running this example repo.

Clone the source code:

```sh
git clone https://github.com/couchbase-examples/nextjs-quickstart.git
```

Install required dependencies:
```sh
npm install
```

**If you are using Capella**, you'll have to manually create a bucket named `user_profile` and a collection named `profile`. See the documentation on [managing buckets](https://docs.couchbase.com/cloud/clusters/data-service/manage-buckets.html) and [creating a collection](https://docs.couchbase.com/cloud/clusters/data-service/scopes-collections.html#create-a-collection) for more information. Note that this collection should be created on the `_default` scope.


If you have Couchbase running locally, we can the bucket and collection by running the following command:
```sh
npm run init-db:local
```

**Extra Step for Capella Clusters**: if you've manually set up your bucket and collection, you'll need to create the necessary indices as well. To accomplish this, run:
```sh
npm run build-indexes
```
This is because the index creation code is contained within the database initialization script, which we don't use for Capella clusters.


Now we're ready to run our application:
```sh
npm run dev
```

If everything is configured properly, you should be able to navigate to localhost:3000 to see the example application. For troubleshooting and additional setup instructions please refer to the `NextJS_README.md` included in the with-couchbase starter.

## Notes About the Quickstart Code
- We've included a `.env.default` file which is used for testing and gitpod instances of the project to ensure smooth setup in these environments.

- In the completed quickstart code, fetch URLs use a dynamic `origin` variable instead of hard coding `http://localhost:3000` to ensure requests work when running in other environments. We use [next-absolute-url](https://www.npmjs.com/package/next-absolute-url) for this.

- _**NOTE FOR CAPELLA CLUSTERS:**_ The database initialization code currently only works with local clusters. If you are using Capella, you'll need to manually create a bucket called `user_profile` and then within that buckets default scope, a collection called `profile`. [See here for more info on managing buckets in Capella.](https://docs.couchbase.com/cloud/clusters/data-service/manage-buckets.html). After bucket and collection creation, you can use the index creation command: `npm run build-indexes`. Running `npm run init-db:local` will also work to create the required indices. The bucket and collection creation steps will fail with `ECONNREFUSED` but it will still be able to create the index on your Capella cluster.

## Running The Tests
A suite of integration tests has been included, and can be run by first setting up the database:
```
npm run init-db:default
```
and then using the `npm test` command.
