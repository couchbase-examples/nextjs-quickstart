import React, {useEffect, useState} from 'react';
import Gradient from './gradient/Gradient';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import {EditUserForm} from '../EditUserForm';
import ContentLoader from '../loaders/ContentLoader';

export const ContentPanel = ({profile, handleProfileEdit, handleProfileDeletion, updatedFirstName, setUpdatedFirstName, updatedLastName, setUpdatedLastName, updatedEmail, setUpdatedEmail}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    handleProfileEdit(profile.pid)
  }

  const handleDelete = () => {
    handleProfileDeletion(profile.pid)
  }

  return (
      <div className='w-full'>
        <Modal
            title='Are you sure?'
            subheading='This operation cannot be reversed.'
            bodyNode={<div className='mt-4'>The profile for {profile?.firstName} {profile?.lastName} will be permanently deleted.</div>}
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onConfirm={handleDelete}
            accentColor={'red'}
            icon={'trash'}
        />
        <Modal
            title='Edit User Profile'
            subheading='Update details for this user.'
            bodyNode={
              <EditUserForm
                  firstName={profile?.firstName}
                  setFirstName={setUpdatedFirstName}
                  lastName={profile?.lastName}
                  setLastName={setUpdatedLastName}
                  email={profile?.email}
                  setEmail={setUpdatedEmail}
              />
            }
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            onConfirm={handleEdit}
            accentColor={'green'}
            icon={'pencil'}
        />
        {profile === undefined ?
            <ContentLoader/>
            :
            <>
              <div className="h-1/3 border-b-2 border-gray-900">
                <Gradient firstName={profile.firstName} lastName={profile.lastName}/>
              </div>
              <div className="p-16 flex flex-col gap-2">
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setIsEditModalOpen(true)}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-green-300 hover:bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilIcon className='h-8 w-8 text-gray-700'/>
                    </div>
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-300 hover:bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon className='h-8 w-8 text-gray-700'/>
                    </div>
                  </button>
                </div>
                <h2 className='text-5xl text-gray-900'>{profile.firstName}<strong className='ml-3'>{profile.lastName}</strong></h2>
                <p className='text-xl'>{profile.email}</p>
                <code className='bg-gray-200 w-fit px-3 py-2 -ml-3 rounded-md'>{profile.pid}</code>
              </div>
            </>
        }
      </div>
  )
}
