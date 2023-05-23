import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/themes";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import carBg from "../../assets/car.jpg";
import logo from "../../assets/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScreenFour = () => {
  const router = useRouter();

  useEffect(() => {
    async function clearAsyncStorage() {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("isGuest");
    }

    clearAsyncStorage();
  }, []);
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          paddingBottom: 100,
          position: "relative",
        }}
      >
        <View
          style={{
            // position: "absolute",
            // top: 0,
            // left: 0,
            width: Dimensions.get("screen").width,
            height: "60%",
          }}
        >
          <ImageBackground
            source={carBg}
            style={{ width: Dimensions.get("screen").width, height: "100%" }}
            resizeMode="cover"
          />
        </View>

        <View
          style={{ alignItems: "center", marginTop: 50, paddingHorizontal: 30 }}
        >
          <Image
            source={logo}
            style={{ height: 120, width: 120, marginTop: -50 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={async () => {
              router.replace("/signup");
            }}
            style={{
              backgroundColor: COLORS.shuttlelanePurple,
              width: 300,
              height: 65,
              // paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
            }}
          >
            <Text style={{ color: COLORS.white }}>Get started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              router.replace("/login");
            }}
            style={{
              borderColor: "#191919",
              borderWidth: 0.4,
              width: 300,
              height: 65,
              // paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#000" }}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("isGuest", "true");
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              router.replace("/dashboard/home");
            }}
            style={{
              // borderColor: "#191919",
              // borderWidth: 0.4,
              // width: 300,
              // height: 65,
              // paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: COLORS.shuttlelanePurple,
              }}
            >
              Continue as guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ScreenFour;
