import React, { useEffect } from 'react';
import { useUserContext } from './UserContext';


export default function UserList(){

    const { state, dispatch } = useUserContext();


// recuperation des utilisateurs avec useEffect 
useEffect(() => {
    fetch('http://localhost:8080/api/users')
    .then(res => res.json())
    .then(data => dispatch({ type : 'SET_USERS', payload: data }));
}, []);

return (
    <div>
        <h3> <span style={{ color: '#007bff' }}> Users </span></h3>
        <ul className="list-group">
            {state.users.map(user => (
                <li
                key={user.id}
                className="list-group-item list-group-item-action p-1 small"
                onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user})}
                style={{cursor: 'pointer'}}
                >
                    {user.name}
                </li>
            ))}
        </ul>
    </div>
);
}