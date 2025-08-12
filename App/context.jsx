import React, {createContext, useContext, useState} from 'react';

// Create a context with default values and methods
const StateContext = createContext({
  user: {},
  setUser: () => {},
});

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState(false);
  return (
    <StateContext.Provider
      value={{user,setUser}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
