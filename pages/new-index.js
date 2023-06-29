import Head from 'next/head'
import {connectToDatabase} from '../util/couchbase'
import React, {useEffect, useState} from 'react';
import absoluteUrl from 'next-absolute-url'
import styles from '../styles/Home.module.css'
import {Sidebar} from '../components/sidebar/Sidebar';
import Modal from '../components/Modal';
import {AddUserForm} from '../components/AddUserForm';
import {ContentPanel} from '../components/content-panel/ContentPanel';


export default function Home({isConnected, origin}) {
  const [selectedProfile, setSelectedProfile] = useState(undefined)
  const [userProfiles, setUserProfiles] = useState([])
  const [isProfilesLoading, setIsProfilesLoading] = useState(true)

  const [searchString, setSearchString] = useState(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // State to store new user information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State to store updated user information
  const [updatedFirstName, setUpdatedFirstName] = useState(undefined)
  const [updatedLastName, setUpdatedLastName] = useState(undefined)
  const [updatedEmail, setUpdatedEmail] = useState(undefined)

  useEffect( () => {
    async function fetchAllProfiles() {
      await fetch(`${origin}/api/user${searchString ? `?search=${searchString}&limit=200` : '?limit=200'}`, {
        method: 'GET',
      }).then(response => response.json()).then((data) => {
          if (data.message === 'Query failed: planning failure') {
            throw new Error(`Query Failed. Be sure to run \`npm run build-indexes\`!`)
          }

          setUserProfiles(data);
          setIsProfilesLoading(false);
          setSelectedProfile(data[0]);
      })
    }
    fetchAllProfiles();
  }, [searchString])

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  /**
   * Send a request to insert a new profile into the collection, and update local state.
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

  /**
   * Send a request to delete a profile, and update local state.
   * @param pid - The profile ID to remove
   * @return {Promise<void>}
   */
  const handleProfileDeletion = async (pid) => {
    fetch(`${origin}/api/user?pid=${pid}`, {method: 'DELETE'})
        .then((data) => {
          if (data.status === 200) {
            // remove the profile from local state too
            const newArr = userProfiles.filter((p) => {
              return p.pid !== pid;
            })
            setUserProfiles(newArr)
            setSelectedProfile(userProfiles[0])
          }
        })
  }

  /**
   * Send a request to edit a user profile, and update local state.
   * @param pid
   */
  const handleProfileEdit = (pid) => {
    fetch(`${origin}/api/user?pid=${pid}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: updatedFirstName && updatedFirstName,
        lastName: updatedLastName && updatedLastName,
        email: updatedEmail && updatedEmail,
      })
    }).then(response => response.json()).then((data) => {
      let updatedUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        pass: data.pass,
        pid: data.pid
      }
      setSelectedProfile(updatedUser)

      let newProfiles = userProfiles;
      newProfiles[userProfiles.findIndex(p => p.pid === updatedUser.pid)] = updatedUser;

      setUserProfiles(newProfiles)
    })
  }

  return (
      <div>
        <Head>
          <title>Couchbase Next.js Starter</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        {/*bg-blue-200*/}
        <main className={``}>
          <div className="flex min-h-[calc(100vh-4rem)]">
            <Sidebar
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
                profiles={userProfiles}
                setProfiles={setUserProfiles}
                isLoading={isProfilesLoading}
                setIsLoading={setIsProfilesLoading}
                searchString={searchString}
                setSearchString={setSearchString}
                openCreateModal={openCreateModal}
            />
            <ContentPanel
                profile={selectedProfile}
                handleProfileDeletion={handleProfileDeletion}
                handleProfileEdit={handleProfileEdit}
                updatedFirstName={updatedFirstName}
                setUpdatedFirstName={setUpdatedFirstName}
                updatedLastName={updatedLastName}
                setUpdatedLastName={setUpdatedLastName}
                updatedEmail={updatedEmail}
                setUpdatedEmail={setUpdatedEmail}
            />
          </div>

          <Modal
            title='Add a User'
            subheading='Write a new User record to the Database.'
            bodyNode={<AddUserForm setFirstName={setFirstName} setLastName={setLastName} setEmail={setEmail} setPassword={setPassword} />}
            open={isCreateModalOpen}
            setOpen={setIsCreateModalOpen}
            onConfirm={handleProfileCreation}
            icon={'user-plus'}
          />
        </main>

        <footer className={styles.footer + ' max-h-16'}>
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


