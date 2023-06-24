import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/themes";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

const ScreenOne = () => {
  const router = useRouter();
  function handleNext() {
    router.push("/onboarding/screenTwo");
  }

  return (
    <SafeAreaView style={{ position: "relative", flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <View style={{ backgroundColor: "white", flex: 1 }}>
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
              top: 130,
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
                  // width: 350,
                  width: 280,
                  height: 80,
                  borderRadius: 40,
                }}
              >
                <Icon
                  name="flight-takeoff"
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
                  fontSize: Platform.OS === "ios" ? 28 : 24,
                  textAlign: "center",
                }}
              >
                Airport Bookings
              </Text>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    maxWidth: 250,
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 14 : 12,
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  Easily make airport drop off and airport pickup bookings
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 80, alignItems: "center" }}>
              {Platform.OS === "ios" && (
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#191919",
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
                      backgroundColor: "#D9D9D9",
                      marginHorizontal: 5,
                      borderRadius: 50,
                    }}
                  ></View>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              marginTop: 50,
              paddingHorizontal: 30,
            }}
          >
            <TouchableOpacity
              onPress={handleNext}
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
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScreenOne;
