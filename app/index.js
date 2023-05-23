import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import splashScreenImage from "../assets/images/splash.png";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { Image } from "react-native";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../constants/themes";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const isGuest = await AsyncStorage.getItem("isGuest");
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

      setIsLoading(true);
      try {
        if (token) {
          setIsUserLoggedIn(true);
          setIsLoading(false);
          await AsyncStorage.removeItem('isGuest')
          router.replace("/dashboard/home");
          return;
        }
        
        if (isGuest) {
          setIsUserLoggedIn(true);
          setIsLoading(false);
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('user')
          router.replace("/screenFour/signInOptions");
          return;
        }
        
        if (!hasOnboarded) {
          setIsLoading(false);
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('user')
          await AsyncStorage.removeItem('isGuest')
          router.replace("/onboarding/screenOne");
          return;
        }
        
        if (!isUserLoggedIn) {
          setIsLoading(false);
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('user')
          await AsyncStorage.removeItem('isGuest')
          router.replace("/screenFour/signInOptions");
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

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Tracking permissions granted.");
      }
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: "",
        }}
      />
      <ActivityIndicator size={60} color={COLORS.shuttlelaneYellow} />
    </View>
  );
}
