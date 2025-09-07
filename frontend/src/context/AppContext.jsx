import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

// Initial state
const initialState = {
  userId: null, // store the whole user object
  isAuthenticated: false,
  role: null, // "user" or "admin"
  hoveredDropdown: null,
  isDropdownOpen: false,
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
    case "SET_HOVERED_DROPDOWN":
      return { ...state, hoveredDropdown: action.payload };
    case "CLEAR_HOVERED_DROPDOWN":
      return { ...state, hoveredDropdown: null };
    case "SET_DROPDOWN_OPEN":
      return { ...state, isDropdownOpen: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setAuth = (isAuthenticated, userId, role) => {
    dispatch({ type: "SET_AUTH", payload: { isAuthenticated, userId, role } });
  };
  const setHoveredDropdown = (dropdown) =>
    dispatch({ type: "SET_HOVERED_DROPDOWN", payload: dropdown });
  const clearHoveredDropdown = () =>
    dispatch({ type: "CLEAR_HOVERED_DROPDOWN" });
  const setDropdownOpen = (isOpen) =>
    dispatch({ type: "SET_DROPDOWN_OPEN", payload: isOpen });

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch({ type: "SIGN_OUT" });
  };

  // Fetch user profile if token exists
  const getUserProfile = async () => {
    try {
      const response = await axios.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;

      // Make sure the backend returns userId + role
      const user = {
        id: data.userId,
        email: data.email, // optional
        name: data.name, // optional
      };

      setAuth(true, user, data.role);
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
        setHoveredDropdown,
        clearHoveredDropdown,
        setDropdownOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
