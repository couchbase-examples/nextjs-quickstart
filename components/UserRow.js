import React from 'react';

export const UserRow = ({profile, index, href}) => {
  return (
      <a href={href} className='hover:bg-red-200'>
        <div className={`px-4 py-2 border-b-2 border-x-2 border-gray-500 bg-inherit ${index === 0 ? 'border-t-2' : ''}`}>
          <h4 className='text-gray-900'>{profile.firstName}<strong className='ml-1'>{profile.lastName}</strong></h4>
          <p className='text-gray-600'>{profile.email}</p>
          <code className={'text-xs text-gray-600'}>{profile.pid}</code>
        </div>
      </a>
  );
}
