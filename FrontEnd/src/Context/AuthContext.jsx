/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useState } from "react";
import axios from "../Shared/Ajax/JavaAjax";
import { successToast } from "../Shared/Utils/Toast";

// 👇 EXPORT THIS
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [userDetails, setUserDetails] = useState({})
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("token");
  });

    const fetchUserDetails = async (id) => {

    const response = await axios.get(
        `users/${id}`);

        return response.data;
  }

  const isLoggedIn = !!accessToken;
  // const isLoggedIn = false;

    const login = async (data) => {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("roles", JSON.stringify(data.user.roles));

    setAccessToken(data.accessToken);
    // setUserDetails(await fetchUserDetails(data.user.id));
    setUser(data.user);
    
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setUserDetails(null);
    setAccessToken(null);
    
    successToast("Logged out successfully");
  };



   useEffect(() => {

    if (isLoggedIn && user?.id) {
    (async () => {
            setUserDetails(await fetchUserDetails(user.id));
        })();
    }
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        fetchUserDetails,
        accessToken,
        login,
        isLoggedIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
