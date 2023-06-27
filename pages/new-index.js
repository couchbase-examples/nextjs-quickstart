import Head from 'next/head'
import {connectToDatabase} from '../util/couchbase'
import {UserCard} from '../components/UserCard';
import React, {useEffect, useState} from 'react';
import absoluteUrl from 'next-absolute-url'
import styles from '../styles/Home.module.css'
import {Sidebar} from '../components/sidebar/Sidebar';
import Modal from '../components/Modal';
import {AddUserForm} from '../components/AddUserForm';


export default function Home({isConnected, origin, profile}) {
  const [searchResults, setSearchResults] = useState([]);
  
  const [userProfiles, setUserProfiles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfilesLoading, setIsProfilesLoading] = useState(true)

  const [searchString, setSearchString] = useState(undefined);
  
  useEffect( () => {
    async function fetchAllProfiles() {
      await fetch(`${origin}/api/user${searchString ? `?search=${searchString}&limit=200` : '?limit=200'}`, {
        method: 'GET',
      }).then(response => response.json()).then((data) => {
          console.log(data);
          setUserProfiles(data);
          setIsProfilesLoading(false)
      })
    }
    fetchAllProfiles();
  }, [searchString])

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

  const openCreateModal = () => {
    setIsModalOpen(true)
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Send a request to insert a new profile into the collection
   * @return {Promise<void>}
   */
  const handleProfileCreation = async () => {
    fetch(`${origin}/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        pass: password,
      })
    }).then(response => response.json()).then((data) => {
      let newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        pass: data.pass,
        pid: data.pid
      }
      setUserProfiles([newUser, ...userProfiles])
    })
  }

  return (
      <div className={`bg-red-200`}>
        <Head>
          <title>Couchbase Next.js Starter</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={`bg-blue-200`}>
          <div className="flex">
            <Sidebar profiles={userProfiles} setProfiles={setUserProfiles} isLoading={isProfilesLoading} setIsLoading={setIsProfilesLoading} searchString={searchString} setSearchString={setSearchString} openCreateModal={openCreateModal}/>
            <div className="bg-orange-300 w-5/6">
              Content
            </div>
          </div>

          <Modal
            title='Add a User'
            subheading='Write a new User record to the Database.'
            bodyNode={<AddUserForm setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} setPassword={setPassword} />}
            open={isModalOpen}
            setOpen={setIsModalOpen}
            onConfirm={handleProfileCreation}
          />


          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
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
            { searchResults.message ?
                <p>{searchResults.message}</p>
                :
                <>
              {searchResults.map((userProfile) => {
                console.log(userProfile);
                return (
                    <UserCard firstName={userProfile.firstName} lastName={userProfile.lastName}
                              email={userProfile.email} pid={userProfile.pid} origin={origin}/>
                )
              })
              }
                </>
            }
          </div>
        </main>

        <footer className={styles.footer}>
          <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
          </a>
        </footer>

      </div>
  )
}

export async function getServerSideProps(context) {
  const {req} = context;
  const { origin } = absoluteUrl(req);

  let connection = await connectToDatabase();

  const {cluster, bucket, collection, profileCollection} = connection;

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

async function getProfileByKey(collection, key) {
  try {
    let res = await collection.get(key);
    console.log(res.content);
    return res.content;
  } catch (err) {
    console.log(err);
  }
}


