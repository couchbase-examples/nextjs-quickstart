import React from 'react';

export const UserCard = (props) => {
  const handleDeletion = async (event) => {
    await fetch(`${props.origin}/api/user?pid=${props.pid}`, {
      method: 'DELETE',
    }).then(async (data) => {
      console.log(data);
    })
  }
  return (
      <div style={{marginRight: '10px', marginLeft: '10px', border: '1px solid #8f8f8f', borderRadius: '10px', padding: '10px'}}>
        <p><strong>{props.firstName}</strong> {props.lastName}</p>
        <p>{props.email}</p>
        <em>{!!props.pid && 'PID: ' + props.pid}</em>
        <br/>
        <button onClick={handleDeletion}>Delete</button>
      </div>
  );
}
