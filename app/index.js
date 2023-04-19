import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserDashboard from "./dashboard";
import LoginPage from "./login";
import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import LoginForm from "../forms/LoginForm";
import { COLORS } from "../constants/themes";
import AuthProvider from "../context/AuthContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const isUserLoggedIn = await AsyncStorage.getItem("token");
        if (!isUserLoggedIn) {
          setIsUserLoggedIn(false);
        } else {
          setIsUserLoggedIn(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    // <AuthProvider>
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, display: "relative" }}
    >
      {isUserLoggedIn ? <UserDashboard /> : <LoginPage />}
    </SafeAreaView>
    // </AuthProvider>
  );
}
