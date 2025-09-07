import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

// Initial state (only auth-related stuff)
const initialState = {
  userId: null,
  isAuthenticated: false,
  role: null, // user or admin
};

// Reducer for authentication
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userId: action.payload.userId,
        role: action.payload.role,
      };
    case "SIGN_OUT":
      return { ...state, isAuthenticated: false, userId: null, role: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setAuth = (isAuthenticated, userId, role) => {
    dispatch({ type: "SET_AUTH", payload: { isAuthenticated, userId, role } });
  };

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch({ type: "SIGN_OUT" });
  };

  // Fetch user profile if token exists
  const getUserProfile = async () => {
    try {
      const response = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setAuth(true, data.userId, data.role);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      signOut();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile();
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setAuth,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
