import React from 'react';

function getInitials(name) {
  const parts = name.split(' ');
  const initials = parts
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  return initials;
}

function getColor(initials) {
  const colors = ['#F7CAC9', '#92A8D1', '#FFD700', '#87fd87', '#FF9898', '#AEC6CF', '#B39EB5', '#FFA07A'];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

function Avatar({ name }) {
  const initials = getInitials(name);
  const color = getColor(initials);

  const avatarStyle = {
    backgroundColor: color,
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '46px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  return (
      <div style={avatarStyle} className='rounded-full w-32 h-32 drop-shadow-lg border-2 border-slate-500'>
        <span className='drop-shadow-md'>
          {initials}
        </span>
      </div>
  );
}

export default Avatar;
