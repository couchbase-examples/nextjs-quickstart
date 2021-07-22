# Quickstart for using Couchbase with Next.js

[![Try it now!](https://da-demo-images.s3.amazonaws.com/runItNow_outline.png?couchbase-example=nextjs-quickstart-repo&source=github)](https://gitpod.io/#https://github.com/couchbase-examples/tutorial-nextjs)

This is a companion repository to the tutorial: "[Quickstart for using Couchbase with Next.js](https://developer.couchbase.com/tutorial-quickstart-nodejs/)" at [developer.couchbase.com](https://developer.couchbase.com), which aims to get you up and running with Couchbase on [NextJS](https://nextjs.org/), connect to a Couchbase cluster, create, read, update, and delete documents, and how to write simple parameterized N1QL queries. It also covers creating a basic front-end using Next.js.

We will be using the latest version of Couchbase (version 7) that enables scopes and collections.

## Prerequisites

To run this prebuilt project, you will need:

- Couchbase 7 Installed
- NodeJS & NPM (v12+)
- NextJS
- Code Editor

## Set up and Run The Application
We'll start by bootstrapping a new Next.js project using the 'with-couchbase' example:

```sh
npx create-next-app --example with-couchbase with-couchbase-app

# or

yarn create next-app --example with-couchbase with-couchbase-app
```

Install required dependencies and run:
```sh
npm install
npm run dev

# or

yarn install
yarn dev
```


*After installation of Couchbase 7, and if it is running on localhost (http://127.0.0.1:8091) we can create a bucket named `user_profile` and a collection named `profile`. You can do this manually by accessing the Couchbase console.


If you've cloned the completed project running the following command will handle bucket and collection creation:

```sh
npm run init-db:local
```

To set local environment variables, copy the `env.local.example` file in this directory to `.env.local`:

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `COUCHBASE_USERNAME` - The username of an authorized user on your Couchbase instance
- `COUCHBASE_PASSWORD` - The corresponding password for the user specified above
- `COUCHBASE_ENDPOINT` - The endpoint to connect to. Use `localhost` for a local instance of Couchbase, or Wide Area Network address for a cloud instance (formatted like`<xxxxx>.dp.cloud.couchbase.com`)
- `COUCHBASE_BUCKET` - The bucket you'd like to connect to. Set this to `user_profiles` for this tutorial.
- `IS_CLOUD_INSTANCE` - `true` if you are trying to connect to an instance of Couchbase Cloud, `false` otherwise.

In order to interact with your Couchbase instance, you'll need to set up and configure the database.


If everything is set up properly, you should be able to navigate to localhost:3000 to see a message confirming succesful connection to Couchbase. For troubleshooting and additional setup instructions please refer to the `NextJS_README.md` included in the with-couchbase starter.

Note: Gitpod and testing environments use the .env.default file to automatically set up a Couchbase instance with default credentials.

## Notes About the Quickstart Code
- We've included a `.env.default` file which is used for testing and gitpod instances of the project to ensure smooth setup in these environments.

- In the completed quickstart code, fetch URLs use a dynamic `origin` variable instead of hard coding `http://localhost:3000` to ensure requests work when running in other environments. We use [next-absolute-url](https://www.npmjs.com/package/next-absolute-url) for this.

## Running The Tests
A suite of integration tests has been included, and can be run by first setting up the database:
```
npm run init-db:default
```
and then using the `npm test` command.
