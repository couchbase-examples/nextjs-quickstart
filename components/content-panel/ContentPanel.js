import React, {useState} from 'react';
import Gradient from './gradient/Gradient';
import {PencilIcon, TrashIcon} from '@heroicons/react/24/outline';
import Modal from '../Modal';
import {EditUserForm} from '../forms/EditUserForm';
import ContentLoader from '../loaders/ContentLoader';
import Avatar from './avatar/Avatar';
import {validateEmail} from '../../util/helpers/validateEmail';

export const ContentPanel = ({profile, handleProfileEdit, handleProfileDeletion, setUpdatedFirstName, setUpdatedLastName, setUpdatedEmail}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditModalConfirmable, setIsEditModalConfirmable] = useState(false);

  const handleEdit = () => {
    handleProfileEdit(profile.pid);
  };

  const handleDelete = () => {
    handleProfileDeletion(profile.pid);
  };

  const handleSetUpdatedFirstName = (fName) => {
    setUpdatedFirstName(fName);
    if (fName.length === 0) {
      setIsEditModalConfirmable(false);
      return;
    }
    setIsEditModalConfirmable(true);
  };

  const handleSetUpdatedLastName = (lName) => {
    setUpdatedLastName(lName);
    if (lName.length === 0) {
      setIsEditModalConfirmable(false);
      return;
    }
    setIsEditModalConfirmable(true);
  };

  const handleSetUpdatedEmail = (eAddress) => {
    setUpdatedEmail(eAddress);
    if (eAddress.length === 0 || !validateEmail(eAddress)) {
      setIsEditModalConfirmable(false);
      return;
    }
    setIsEditModalConfirmable(true);
  };

  return (
      <div className='w-full'>
        <Modal
            title='Are you sure?'
            subheading='This operation cannot be reversed.'
            bodyNode={<div className='mt-4'>The profile for {profile?.firstName} {profile?.lastName} will be permanently deleted.</div>}
            open={isDeleteModalOpen}
            setOpen={setIsDeleteModalOpen}
            onConfirm={handleDelete}
            isConfirmValid={true}
            accentColor={'red'}
            icon={'trash'}
        />
        <Modal
            title='Edit User Profile'
            subheading='Update details for this user.'
            bodyNode={
              <EditUserForm
                  firstName={profile?.firstName}
                  setFirstName={handleSetUpdatedFirstName}
                  lastName={profile?.lastName}
                  setLastName={handleSetUpdatedLastName}
                  email={profile?.email}
                  setEmail={handleSetUpdatedEmail}
              />
            }
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
            onConfirm={handleEdit}
            isConfirmValid={isEditModalConfirmable}
            accentColor={'green'}
            icon={'pencil'}
        />
        {profile === undefined ?
            <ContentLoader/>
            :
            <>
              <div className="h-1/3 border-b-2 border-slate-500">
                <Gradient firstName={profile.firstName} lastName={profile.lastName}/>
              </div>
              <div className='absolute top-[calc(33.33%-22px-4rem)] md:left-[calc(28rem+4rem)]'>
                <Avatar name={`${profile.firstName} ${profile.lastName}`}/>
              </div>
              <div className="p-16 flex flex-col gap-2 mt-8">
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setIsEditModalOpen(true)}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-green-200 hover:bg-green-300 sm:mx-0 sm:h-10 sm:w-10 hover:drop-shadow-md">
                      <PencilIcon className='h-8 w-8 text-gray-700'/>
                    </div>
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)}>
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-200 hover:bg-red-300 sm:mx-0 sm:h-10 sm:w-10 hover:drop-shadow-md">
                      <TrashIcon className='h-8 w-8 text-gray-700'/>
                    </div>
                  </button>
                </div>
                <h2 className='text-5xl text-gray-900'>{profile.firstName}<strong className='ml-3'>{profile.lastName}</strong></h2>
                <p className='text-xl'>{profile.email}</p>
                <code className='bg-slate-100 w-fit px-2 py-1 -ml-2 rounded-md'>{profile.pid}</code>
              </div>
            </>
        }
      </div>
  );
};
