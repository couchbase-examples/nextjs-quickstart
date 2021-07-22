import Head from 'next/head'
import {connectToDatabase} from '../util/couchbase'
import {UserCard} from "../components/UserCard";
import React from 'react';
import {useState} from "react";
import absoluteUrl from 'next-absolute-url'

export default function Home({isConnected, origin, profile}) {
  const [searchResults, setSearchResults] = useState([]);

  const handleProfilePost = async (event) => {
    await fetch(`${origin}/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
        pass: event.target.password.value,
      })
    })
  }

  const handleProfileSearch = async (event) => {
    event.preventDefault();

    await fetch(`${origin}/api/user?search=${event.target.searchString.value}`, {
      method: 'GET',
    }).then(async (data) => {
      setSearchResults(await data.json());
    })
  }

  const handleProfilePut = async (event) => {
    await fetch(`${origin}/api/user?pid=${event.target.pid.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        email: event.target.email.value,
        pass: event.target.password.value,
      })
    })
  }



  return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main>
          {/*<UserCard firstName={profile.firstName} lastName={profile.lastName} email={profile.email} pid={profile.pid} allowDelete={false}/>*/}

          <br/>
          <br/>
          <form onSubmit={handleProfilePost}>
            <input type="text" placeholder="First Name" name="firstName"/>
            <input type="text" placeholder="Last Name" name="lastName"/>
            <input type="email" placeholder="Email" name="email"/>
            <input type="password" placeholder="Password" name="password"/>
            <button type="submit">Post Profile</button>
          </form>
          <br/>

          <form onSubmit={handleProfilePut}>
            <input type="text" placeholder="PID to Update" name="pid"/>
            <input type="text" placeholder="New First Name" name="firstName"/>
            <input type="text" placeholder="New Last Name" name="lastName"/>
            <input type="email" placeholder="New Email" name="email"/>
            <input type="password" placeholder="New Password" name="password"/>
            <button type="submit">Update Profile</button>
          </form>
          <br/>

          <form onSubmit={handleProfileSearch}>
            <input type="text" placeholder="Search String" name="searchString"/>
            <button type="submit">Search</button>
          </form>

          <h4>Profile Search Results:</h4>
          <div style={{ display: "flex"}}>
            {searchResults !== null && searchResults.map((userProfile) => {
              console.log(userProfile);
              return (
                  <UserCard firstName={userProfile.firstName} lastName={userProfile.lastName} email={userProfile.email} pid={userProfile.pid} origin={origin}/>
              )
            })
            }
          </div>
        </main>

        <footer>
          <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className="logo"/>
          </a>
        </footer>

        <style jsx>{`
          .flex-wrapper {
            display: flex;
          }
          .small {
            font-size: 10px;
          }
          
          .center {
            text-align: center;
          }
          
          td, th {
            padding: 2px 30px;
          }

          table, th, td {
            border: 1px solid #aaa;
          }

          .red, .error {
            color: indianred;
          }

          .green, .success {
            color: lightseagreen;
          }

          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .subtitle {
            font-size: 2rem;
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 45%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            transition: color 0.15s ease, border-color 0.15s ease;
          }

          .card:hover,
          .card:focus,
          .card:active {
            color: #0070f3;
            border-color: #0070f3;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          .logo {
            height: 1em;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
  )
}

// TODO: how does getServersideProps link in w/ front-end interaction? This happens before the page loads..?
// TODO: when does this actually run?
export async function getServerSideProps(context) {
  const {req} = context;
  const { origin } = absoluteUrl(req);

  let connection = await connectToDatabase();

  const {cluster, bucket, profileCollection} = connection;

  // Check connection with a KV GET operation for a key that doesnt exist
  let isConnected = false;
  try {
    await profileCollection.get('testingConnectionKey');
  } catch (err) {
    // error message will return 'document not found' if and only if we are connected
    // (but this document is not present, we're only trying to test the connection here)
    if (err.message === 'document not found') {
      isConnected = true;
    }
    // if the error message is anything OTHER THAN 'document not found', the connection is broken
  }

  // let profile = JSON.parse(JSON.stringify(await getProfileByKey(profileCollection, '1cfaaa82-e63e-4207-addf-f023763d0374')));

  return {
    props: {isConnected, origin, /* profile */ },
  }
}


// TODO: ensure indexes

async function getProfileByKey(collection, key) {
  try {
    let res = await collection.get(key);
    console.log(res.content);
    return res.content;
  } catch (err) {
    // TODO: better error handling
    console.log("fetch error2");
    console.log(err);
  }
}


