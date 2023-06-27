import React, {useEffect, useState} from 'react';
import {UserRow} from '../UserRow';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';

export const Sidebar = ({profiles, setProfiles, isLoading, setIsLoading, searchString, setSearchString, openCreateModal}) => {
  const handleSearchFieldChange = (event) => {
    setSearchString(event.target.value);
  }

  return (
      <div className={'bg-green-200 w-1/6'}>
        <div className='p-4'>
          <div className="flex place-items-center">
            <h2 className='flex-1 text-2xl text-gray-900 font-bold'>User Directory</h2>
            <span className='hover:cursor-pointer' onClick={openCreateModal}>
              <PlusCircleIcon className='h-8 w-8 text-blue-400 hover:text-blue-600'/>
            </span>
          </div>
          <div className="mt-4">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <MagnifyingGlassIcon className='h-5 w-5 text-gray-500'/>
              </div>
              <input
                  onChange={handleSearchFieldChange}
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 py-1.5 pl-8 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search..."
              />
            </div>
          </div>
        </div>
        {
          isLoading ?
              //TODO: skeleton loaders
              <div>Loading...</div>
              :
                profiles.length > 0 ?
                    <>
                      {
                        profiles.map((profile, idx) => {
                          // todo: correct href
                          return <UserRow profile={profile} index={idx} href={'#'} key={idx}/>
                        })
                      }
                    </>
                    : <></>

        }
      </div>
  );
}
