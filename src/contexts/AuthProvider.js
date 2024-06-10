import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored_auth = localStorage.getItem('auth');
        return stored_auth ? JSON.parse(stored_auth) : false;
    });


    const [newUser, setNewUser] = useState(() => {
        const stored_new_user = localStorage.getItem('new_user');
        return stored_new_user ? JSON.parse(stored_new_user): null;
    });

    useEffect( () => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);
    
    useEffect( () => {
        localStorage.setItem('newUser',  JSON.stringify(newUser));
    }, [newUser]);

    return (
        <AuthContext.Provider value={{ auth, setAuth , newUser, setNewUser}}>
            {children}
        </AuthContext.Provider>
    )

    
}



export default AuthContext;


