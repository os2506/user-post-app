import React, { createContext, useReducer, useContext } from "react";

const UserContext = createContext();

const initialState = {
    users:[],
    posts:[],
    selectedUser: null,
}

function userReducer(state, action) {
    switch (action.type) {
        case 'SET_USERS':
            return {...state, users : action.payload};
        case 'SET_POSTS':
            return {...state, posts : action.payload};
        case 'SET_SELECTED_USER':
            return {...state, selectedUser : action.payload};
        default:
            return state;
    }
}

// export function UserProvider
export function UserProvider({children}) {
    const [state, dispatch] = useReducer(userReducer, initialState);
    
    
    return(
        <UserContext.Provider value={{ state, dispatch}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext(){
    return useContext(UserContext);
}
