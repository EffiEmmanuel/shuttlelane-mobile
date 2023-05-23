import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/themes";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";
import carBg from "../../assets/car.jpg";

const ScreenFour = () => {
  const router = useRouter();
  function handleNext() {
    router.push("/onboarding/screenTwo");
  }

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
            backgroundColor: "red",
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
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("hasOnboarded", "true");
              router.replace("/onboarding/screenFour");
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
              router.back();
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
              router.back();
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
            <Text style={{ color: COLORS.shuttlelanePurple, textDecoration: 'underline' }}>Continue as guest in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ScreenFour;
