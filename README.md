# Quickstart for using Couchbase with Next.js

## Deployment Instructions

The deployment instructions are specifically for [Vercel](https://vercel.com/). If you are deploying on other platforms, you need to adapt the instructions for running the project [locally](#run-the-code-locally).

### Prerequisites

To deploy this project on Vercel, you will need:

- [Vercel Account](https://vercel.com/signup)
- Access to a [Couchbase Capella](https://cloud.couchbase.com/) database running the [Query Service](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/query-service.html). Alternatively, you have the option to sign up for a free Capella database in the integration flow.

### Steps

1. Create a new Capella database (or use existing one) at [cloud.couchbase.com](https://cloud.couchbase.com/).
2. Create a bucket called `user_profile`, and a collection called `profile` (within the `_default` scope).
   - **Note:** the `build` step will attempt to create the collection within your `CB_BUCKET` on deployment.
3. Click Deploy:

&nbsp; &nbsp; &nbsp; &nbsp; <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcouchbase-examples%2Fnextjs-quickstart&project-name=couchbase-nextjs-quickstart&repository-name=couchbase-nextjs-quickstart&developer-id=oac_5eS7l7O4wvTE47rCKEYSFLQT&integration-ids=oac_5eS7l7O4wvTE47rCKEYSFLQT"><img src="https://vercel.com/button" alt="Deploy with Vercel" width="140px"/></a>

4. Follow the steps when prompted. The integration step will open the Couchbase Capella UI and allow you to select resources to connect.
   - If you sign-up for a new Capella account, you may have to re-deploy the application once the database has finished provisioning. Read more in #2 of the [Pitfalls and FAQ section](#common-pitfalls-and-faqs) below.
5. Explore the newly deployed application: create, update, and delete some user profiles. A few sample profiles will be added automatically, and you can load the sample data manually by following [these instructions](#sample-data).

### Common Pitfalls and FAQs

1. **Deployment Failed**

- This usually occurs when the environment variables are missing or not yet set (such as when waiting for a new database to be provisioned). Inspect the build logs for more information, and ensure the environment variables have been set.
- When **deploying a new trial database**, you'll need to wait until the environment variables are set in your Vercel console, and re-deploy to pick up the new values.
- **Note:** A re-deploy is _required_ after any changes to the environment variables, as this is the only way to apply the changes. **This can be done from the "deployments" tab on the project's dashboard (click the three dots on the row for your failed deployment and click "redeploy").**

2. **Integrated with a new trial database**

- If you've deployed this template with a trial database, note that the `profile` collection will be created as a part of the `travel-sample` bucket during the initial build.
- Be sure to re-deploy after updating the environment variables if the initial build fails.
- This is related to the previous, and issues will manifest as deployment failures.

3. **Infinite Loading State OR `Query failed: parsing error` OR `Query failed: bucket not found`**

- No data received from the database. Be sure you are using the right bucket in your `CB_BUCKET` environment variable, a `_default`scope, and a collection named`profile`.

4. **504 Gateway Timeout after deploying**

- This error usually occurs when the application cannot reach the database. Ensure that the environment variables are correct, IP addresses are allowed, and the Database User credentials match those in the environment variables.

## Run the Code Locally

### Prerequisites

To run this project locally, you will need:

- A Couchbase Capella database or Couchbase 7+ database running locally
- Node.js & NPM
- Next.js
- Code Editor

### Get Started

Clone the source code:

```sh
git clone https://github.com/couchbase-examples/nextjs-quickstart.git
```

Install required dependencies:

```sh
npm install
```

**If you are using Capella**, you'll have to manually create a bucket named `user_profile` and a collection named `profile`. See the documentation on [managing buckets](https://docs.couchbase.com/cloud/clusters/data-service/manage-buckets.html) and [creating a collection](https://docs.couchbase.com/cloud/clusters/data-service/scopes-collections.html#create-a-collection) for more information. Note that this collection should be created on the `_default` scope.

### Update environment variables appropriately

We've included a `.env.local.example` file with blank values for you to copy into a file called `.env.local` and fill in the values. We've also included a `.env.default` file for testing and running in GitPod. In most cases, you can ignore the default config file.

- `CB_USERNAME` - The username of an authorized user on your database. Follow [these instructions](https://docs.couchbase.com/cloud/clusters/manage-database-users.html#create-database-credentials) to create database credentials on Capella.
- `CB_PASSWORD` - The password that corresponds to the user specified above.
- `CB_CONNECT_STRING` - The Couchbase connection string. Use the connection string specified on the 'Connect' tab within Capella (formatted like `couchbases://cb.<xxxxxx>.cloud.couchbase.com`) or `couchbase://localhost` for a local/Docker database.
- `CB_BUCKET` - The bucket you'd like to connect to. Set this to `user_profiles` for this template.

### Set up and Run The Application

If you have Couchbase running locally, we can create the bucket and collection by running the following command:

```sh
npm run init-db:local
```

If you'd like to add the sample data, run:

```sh
npm run load-sample-data
```

**Note:** this will also attempt to create a `profile` collection.

**Extra Step for Capella Databases**: if you've manually set up your bucket and collection, you'll need to create the necessary indices as well. To accomplish this, run:

```sh
npm run build-indexes
```

This is because the index creation code is contained within the database initialization script, which we don't use for Capella databases.

Now we're ready to run our application:

```sh
npm run dev
```

If everything is configured properly, you should be able to navigate to localhost:3000 to see the example application. For troubleshooting and additional setup instructions please refer to the `NextJS_README.md` included in the with-couchbase starter.

## Sample Data

- We've included a `MOCK_DATA.json` file containing 15 documents with various mocked user data. The `build` step will automatically load the sample data, but you may want to also load it manually for local testing. Use `npm run load-sample-data` to insert the documents to your database. Be sure your local environment variables are set correctly!
- This file can also be [imported into Capella manually](https://docs.couchbase.com/cloud/clusters/data-service/import-data-documents.html).
- You can also add your own profile data to the database manually by clicking the **+** icon in the UI.

## Notes About the Quickstart Code

- We've included a `.env.default` file which is used for testing and gitpod instances of the project to ensure smooth setup in these environments.
- In the completed quickstart code, fetch URLs use a dynamic `origin` variable instead of hard coding `http://localhost:3000` to ensure requests work when running in other environments.
- _**NOTE FOR CAPELLA DATABASES:**_ The database initialization code currently only works with local databases. If you are using Capella, you'll need to manually create a bucket called `user_profile` and then within that buckets default scope, a collection called `profile`. [See here for more info on managing buckets in Capella.](https://docs.couchbase.com/cloud/clusters/data-service/manage-buckets.html). After bucket and collection creation, you can use the index creation command: `npm run build-indexes`. Running `npm run init-db:local` will also work to create the required indices. The bucket and collection creation steps will fail with `ECONNREFUSED` but it will still be able to create the index on your Capella database.

## Running The Tests

A suite of integration tests has been included, and can be run by first setting up the database:

```
npm run init-db:default
```

and then using the `npm test` command.

## Try it in Your Browser

#### Run with GitPod

[![Try it now!](https://da-demo-images.s3.amazonaws.com/runItNow_outline.png?couchbase-example=nextjs-quickstart-repo&source=github)](https://gitpod.io/#https://github.com/couchbase-examples/nextjs-quickstart)
