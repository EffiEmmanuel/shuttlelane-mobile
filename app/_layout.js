import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import logo from "../assets/images/logo.png";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/themes";
import Icon from "react-native-vector-icons/MaterialIcons";
import arrowBackIcon from "../assets/icons/arrowBackIcon.png";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [fontsLoaded] = useFonts({
    PoppinsExtraBold: require("../assets/font/Poppins/Poppins-ExtraBold.ttf"),
    PoppinsBold: require("../assets/font/Poppins/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("../assets/font/Poppins/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("../assets/font/Poppins/Poppins-Medium.ttf"),
    PoppinsRegular: require("../assets/font/Poppins/Poppins-Regular.ttf"),
    PoppinsLight: require("../assets/font/Poppins/Poppins-Light.ttf"),
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      setIsLoading(true);
      try {
        const isUserLoggedIn = await AsyncStorage.getItem("token");
        if (!isUserLoggedIn) {
          setIsUserLoggedIn(false);
        } else {
          setIsUserLoggedIn(true);
          setIsLoading(false);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  // LOGOUT FUNCTION
  async function logoutUser() {
    // setIsLoading(true);
    // showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // setIsLoading(false);
    router.replace("login");
    return;
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      onLayout={onLayoutRootView}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
          headerLeft: () => "",
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="onboarding"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: null,
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="bookings/booking-summary"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
          gestureEnabled: true,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="screenFour"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: null,
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="signup"
        options={{
          // headerTitle: () => (
          //   <Image
          //     source={logo}
          //     resizeMode="contain"
          //     style={style.headerImage}
          //     height={28}
          //     width={28}
          //   />
          // ),
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: () => '',
          gestureEnabled: false
        }}
      />

      <Stack.Screen
        name="forgotPassword"
        options={{
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={style.headerImage}
              height={28}
              width={28}
            />
          ),
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="userProfile"
        options={{
          headerTitle: "",
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editProfile"
        options={{
          headerTitle: "",
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="resetPassword"
        options={{
          headerTitle: "",
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                router.back();
              }}
            >
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="dashboard"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => "",
          headerRight: () => "",
          headerShown: false,
          headerTitle: "",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};

const style = StyleSheet.create({
  headerImage: { width: 100, height: 100, marginTop: -28 },
});

export default Layout;
