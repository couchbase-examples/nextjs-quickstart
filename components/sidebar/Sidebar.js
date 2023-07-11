import React, {useEffect} from 'react';
import {UserRow} from '../UserRow';
import {PlusCircleIcon} from '@heroicons/react/24/outline';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import SidebarLoader from '../loaders/SidebarLoader';

export const Sidebar = ({selectedProfile, setSelectedProfile, profiles, isLoading, setSearchString, openCreateModal}) => {
  const handleSearchFieldChange = (event) => {
    setSearchString(event.target.value);
  };

  useEffect(() => {
    // if we've just added the first profile, select it
    if (profiles.length === 1) {
      setSelectedProfile(profiles[0]);
    }
  }, [profiles, setSelectedProfile]);

  return (
      <div className={'bg-slate-100 w-1/2 max-w-md max-h-[calc(100vh-4rem)] overflow-auto'}>
        <div className='p-4 mb-2'>
          <div className="flex place-items-center">
            <h2 className='flex-1 text-3xl text-gray-900 font-bold'>User Directory</h2>
            <span className='hover:cursor-pointer' onClick={openCreateModal}>
              <PlusCircleIcon className='h-10 w-10 text-blue-400 hover:text-blue-700 hover:drop-shadow-md'/>
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
              <SidebarLoader numRecords={25}/>
              :
                profiles.length > 0 ?
                    <>
                      {
                        profiles.map((profile, idx) => {
                          return (<UserRow profile={profile} index={idx} key={idx} setSelectedProfile={setSelectedProfile} isRowSelected={profile.pid === selectedProfile?.pid}/>);
                        })
                      }
                    </>
                    :
                    <div className='p-4 text-center text-2xl'>
                      No Results Found
                    </div>

        }
      </div>
  );
};
