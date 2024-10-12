import React, { useEffect, useState } from "react";
import {UserContext} from "./UserContext";

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user])
    
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;