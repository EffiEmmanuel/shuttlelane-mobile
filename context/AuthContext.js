import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({});
  // USER DATA
  const [user, setUser] = useState(null);

  // API CONFIG
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // TOAST CONFIGS
  const [isToasting, setIsToasting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // TOAST MESSAGE FUNCTION
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToasting(true);
    setTimeout(() => {
      setIsToasting(false);
    }, 2500);
  };

  // LOGIN FUNCTION
  async function loginUser(email, password) {
    console.log("email", email);
    console.log("password", password);
    setIsLoading(true);
    const response = await fetch(
      "https://www.shuttlelane.com/api/users/signin",
      // "http://172.20.10.6:3001/api/users",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const user = await response.json();
    console.log("RESPONSE:", user);
    setIsLoading(false);
    if (user?.error) {
      return showToastMessage(user?.error, "error");
    }

    showToastMessage("Log in successful", "success");

    await AsyncStorage.setItem("token", user?.token);
    await AsyncStorage.setItem("user", user?.data);

    setAuthState({
      token: user?.token,
      authenticated: true,
    });
    return;
  }

  // LOGOUT FUNCTION
  async function logoutUser() {
    setIsLoading(true);
    showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsLoading(false);
    setAuthState({
      token: null,
      authenticated: false,
    });
    router.replace("/login");
    return;
  }

  // SIGN UP FUNCTION
  async function signupUser(
    firstName,
    lastName,
    email,
    mobile,
    password,
    currency
  ) {
    setIsLoading(true);
    const response = await fetch(
      "https://www.shuttlelane.com/api/users",
      // "http://172.20.10.6:3001/api/users",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email,
          mobile: mobile,
          password: password,
          currency: currency,
        }),
      }
    );
    const user = await response.json();
    if (user?.error) {
      setIsLoading(false);
      return showToastMessage(user?.error, "error");
    }

    showToastMessage("Account created successfully!", "success");
    setIsLoading(false);
    router.replace("/");
    return;
  }

  useEffect(() => {
    async function prepare() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setAuthState({
            token,
            authenticated: true,
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        loginUser,
        logoutUser,
        signupUser,
        isToasting,
        toastMessage,
        toastType,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
