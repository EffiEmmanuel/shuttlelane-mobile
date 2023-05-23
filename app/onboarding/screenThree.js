import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/themes";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native";

const ScreenThree = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ position: "relative", flex: 1 }}>
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: COLORS.white,
            },
            headerShadowVisible: false,
            headerTitle: "",
            headerLeft: null,
            gestureEnabled: false,
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flex: 1,
            paddingBottom: 100,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 120,
              width: Dimensions.get("window").width,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 25,
                  paddingHorizontal: 20,
                  backgroundColor: COLORS.shuttlelanePurple,
                  // width: 300,
                  width: 280,
                  height: 80,
                  borderRadius: 40,
                }}
              >
                <Icon
                  name="luggage"
                  size={32}
                  color="#FFF"
                  style={{
                    marginHorizontal: 8,
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      color: COLORS.white,
                      fontSize: Platform.OS === "ios" ? 14 : 10,
                    }}
                  >
                    Booking Confirmed!
                  </Text>
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      color: COLORS.white,
                      fontSize: Platform.OS === "ios" ? 14 : 10,
                    }}
                  >
                    Your booking has been confirmed.
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 90, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 28,
                  textAlign: "center",
                }}
              >
                Priority Pass
              </Text>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    maxWidth: 300,
                    fontFamily: "PoppinsRegular",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  With our standard and premium pass, you can easily skip
                  security and immigration queues.
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 60, alignItems: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#D9D9D9",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#D9D9D9",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#191919",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
              </View>
            </View>

            {/* <View style={{ marginTop: 90, alignItems: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#D9D9D9",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#D9D9D9",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "#191919",
                    marginHorizontal: 5,
                    borderRadius: 50,
                  }}
                ></View>
              </View>
            </View> */}
          </View>

          <View
            style={{
              alignItems: "center",
              marginTop: 50,
              paddingHorizontal: 30,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.setItem("hasOnboarded", "true");
                router.replace("/screenFour/signInOptions");
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
              <Text style={{ color: COLORS.white }}>Next</Text>
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
              <Text style={{ color: "#000" }}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScreenThree;
