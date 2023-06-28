import React, {useState} from 'react';
import Gradient from './gradient/Gradient';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';

export const ContentPanel = ({profile, handleProfileDeletion}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    console.log('edit');
    // todo: edit functionality
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
            open={isModalOpen}
            setOpen={setIsModalOpen}
            onConfirm={handleDelete}
            accentColor={'red'}
            icon={'trash'}
        />
        {profile === undefined ?
            // todo: better loader
            <div>loading...</div>
            :
            <>
              <div className="h-1/3 border-b-2 border-gray-900">
                <Gradient firstName={profile.firstName} lastName={profile.lastName}/>
              </div>
              <div className="p-16 flex flex-col gap-2">
                <div className="flex gap-2 mb-2">
                  <button onClick={handleEdit}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full hover:bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
                    <PencilIcon className='h-8 w-8'/>
                    </div>
                  </button>
                  <button onClick={() => setIsModalOpen(true)}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full hover:bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className='h-8 w-8'/>
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
