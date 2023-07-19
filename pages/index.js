import Head from 'next/head';
import { connectToDatabase } from '../util/couchbase';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Sidebar } from '../components/sidebar/Sidebar';
import Modal from '../components/Modal';
import { AddUserForm } from '../components/forms/AddUserForm';
import { ContentPanel } from '../components/content-panel/ContentPanel';
import { validateEmail } from '../util/helpers/validateEmail';
import Image from 'next/image';
import Notification from '../components/Notification';

export default function Home({ origin }) {
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  const [userProfiles, setUserProfiles] = useState([]);
  const [isProfilesLoading, setIsProfilesLoading] = useState(true);

  const [searchString, setSearchString] = useState(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isReadonlyNotificationOpen, setIsReadonlyNotificationOpen] =
    useState(false);
  const [
    isBucketNotFoundNotificationOpen,
    setIsBucketNotFoundNotificationOpen,
  ] = useState(false);

  // State to store new user information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // State to store updated user information
  const [updatedFirstName, setUpdatedFirstName] = useState(undefined);
  const [updatedLastName, setUpdatedLastName] = useState(undefined);
  const [updatedEmail, setUpdatedEmail] = useState(undefined);

  useEffect(() => {
    const fetchAllProfiles = () => {
      fetch(
        `${origin}/api/user${
          searchString ? `?search=${searchString}&limit=200` : '?limit=200'
        }`,
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            if (data.message === 'Query failed: planning failure') {
              throw new Error(
                `Query Failed. Be sure to run \`npm run build-indexes\`!`
              );
            }

            if (
              data.message === 'Query failed: bucket not found' ||
              data.message === 'Query failed: parsing failure'
            ) {
              setIsBucketNotFoundNotificationOpen(true);
              throw new Error(
                data.message +
                  '\n' +
                  'Be sure to use a bucket named `user_profile`, a scope named `_default`, and a collection named `profile`' +
                  '\n' +
                  'See the "Common Pitfalls and FAQ" section of the README for more information.'
              );
            }

            throw new Error(data.message);
          }

          data.sort((a, b) => a.firstName.localeCompare(b.firstName)); // Sort the profiles alphabetically by name

          setUserProfiles(data);
          setIsProfilesLoading(false);
          setSelectedProfile(data[0]);
        });
    };
    fetchAllProfiles();
  }, [searchString, origin]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * Send a request to insert a new profile into the collection, and update local state.
   * @return {Promise<void>}
   */
  const handleProfileCreation = () => {
    setFirstName(undefined);
    setLastName(undefined);
    setEmail(undefined);

    fetch(`${origin}/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          setIsReadonlyNotificationOpen(true);
          throw new Error('Could not edit profile. Database is read-only');
        }

        if (response.status !== 201) {
          response.json().then((data) => {
            throw new Error(`Error Creating Profile: ${data.message}`);
          });
        }

        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        let newUser = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          pid: data.pid,
        };
        setUserProfiles([newUser, ...userProfiles]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Send a request to delete a profile, and update local state.
   * @param pid - The profile ID to remove
   * @return {Promise<void>}
   */
  const handleProfileDeletion = (pid) => {
    fetch(`${origin}/api/user?pid=${pid}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 401) {
          setIsReadonlyNotificationOpen(true);
          throw new Error('Could not edit profile. Database is read-only');
        }

        if (response.status !== 200) {
          throw new Error(`Error Deleting Profile: ${response.message}`);
        }
        return response;
      })
      .then((response) => response.json())
      .then(() => {
        // remove the profile from local state too
        const newArr = userProfiles.filter((p) => {
          return p.pid !== pid;
        });
        setUserProfiles(newArr);
        setSelectedProfile(newArr[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          setIsReadonlyNotificationOpen(true);
          throw new Error('Could not edit profile. Database is read-only');
        }
        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        let updatedUser = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          pid: data.pid,
        };
        setSelectedProfile(updatedUser);

        let newProfiles = userProfiles;
        newProfiles[userProfiles.findIndex((p) => p.pid === updatedUser.pid)] =
          updatedUser;

        setUserProfiles(newProfiles);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const resetProfileState = () => {
    setFirstName(undefined);
    setLastName(undefined);
    setEmail(undefined);
  };

  // TODO: Remove once https://github.com/vercel/next.js/issues/52216 is resolved.
  // `next/image` seems to be affected by a default + named export bundling bug.
  let ResolvedImage = Image;
  if ('default' in ResolvedImage) {
    ResolvedImage = ResolvedImage.default;
  }

  return (
    <div>
      <Head>
        <title>Couchbase Next.js Starter</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={``}>
        <div className='flex min-h-[calc(100vh-4rem)]'>
          <Sidebar
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            profiles={userProfiles}
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
            setUpdatedFirstName={setUpdatedFirstName}
            setUpdatedLastName={setUpdatedLastName}
            setUpdatedEmail={setUpdatedEmail}
          />
        </div>

        <Modal
          title='Add a User'
          subheading='Write a new User record to the Database.'
          bodyNode={
            <AddUserForm
              setFirstName={setFirstName}
              setLastName={setLastName}
              setEmail={setEmail}
            />
          }
          open={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          onConfirm={handleProfileCreation}
          onCancel={resetProfileState}
          isConfirmValid={
            firstName && lastName && email && validateEmail(email)
          }
          icon={'user-plus'}
        />

        <Notification
          message={
            'This Database is read-only. Adding, Editing, and Deleting users is not supported.'
          }
          open={isReadonlyNotificationOpen}
          setOpen={setIsReadonlyNotificationOpen}
          timeout={15000}
        />

        <Notification
          message={
            'Bucket Not Found. Be sure to use a bucket named `user_profile`, a scope named `_default`, and a collection named `profile`. See the "Common Pitfalls and FAQ" section of the README for more information.'
          }
          open={isBucketNotFoundNotificationOpen}
          setOpen={setIsBucketNotFoundNotificationOpen}
        />
      </main>

      <footer className={styles.footer + ' max-h-16 bg-zinc-700 text-white'}>
        <a
          href='https://cloud.couchbase.com/sign-in'
          target='_blank'
          rel='noopener noreferrer'>
          <ResolvedImage
            width='0'
            height='0'
            src='/capella-full.svg'
            alt='Couchbase Capella Logo'
            className='mr-2 h-10 w-auto'
          />
        </a>

        <div className='border-l-2 border-white h-10 mx-10' />

        <a href='https://vercel.com/' target='_blank' rel='noopener noreferrer'>
          <ResolvedImage
            width={0}
            height={0}
            src='/vercel.svg'
            alt='Vercel Logo'
            className='h-7 w-auto'
          />
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const origin = req ? `${protocol}://${req.headers.host}` : '';

  let connection = await connectToDatabase();

  const { profileCollection } = connection;

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

  return {
    props: { isConnected, origin },
  };
}
