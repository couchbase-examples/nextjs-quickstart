import React from 'react';

export const UserRow = ({profile, index, href, setSelectedProfile, isRowSelected}) => {
  return (
      <a href={href} className={`hover:bg-orange-200 ${isRowSelected ? 'bg-orange-200' : ''}`} onClick={() => setSelectedProfile(profile)}>
        <div className={`px-4 py-2 border-b border-gray-500 bg-inherit ${index === 0 ? 'border-t' : ''} ${isRowSelected ? 'border-l-8' : ''}`}>
          <h4 className='text-gray-900'>{profile.firstName}<strong className='ml-1'>{profile.lastName}</strong></h4>
          <p className='text-gray-600'>{profile.email}</p>
          <code className={'text-xs text-gray-600'}>{profile.pid}</code>
        </div>
      </a>
  );
}
