import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  getUser,
  removeUser,
  setUser,
} from "../utils/auth";



const AuthContext = createContext();



// PROVIDER
export const AuthProvider = ({
  children,
}) => {

  const [user, setUserState] =
    useState(getUser());



  // LOGIN
  const login = (userData) => {

    setUser(userData);

    setUserState(userData);
  };



  // LOGOUT
  const logout = () => {

    removeUser();

    setUserState(null);
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



// CUSTOM HOOK
export const useAuth = () => {
  return useContext(AuthContext);
};