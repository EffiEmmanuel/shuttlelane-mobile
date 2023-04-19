import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../../constants/themes";
import { Text } from "react-native";
import { Image } from "react-native";
import logo from "../../../assets/images/logo.png";
import arrowBackIcon from "../../../assets/icons/arrowBackIcon.png";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SearchResultPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const { bookingId } = params;
  console.log(bookingId);

  const router = useRouter();

  const [booking, setBooking] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    async function fetchBooking() {
      setIsLoading(true);
      const response = await fetch(
        // "https://www.shuttlelane.com/api/users",
        `http://172.20.10.6:3001/api/booking/search`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: bookingId,
          }),
        }
      );
      const booking = await response.json();

      if (booking?.status === 404) {
        setErrorMessage(booking?.message);
        setIsLoading(false);
      }
      console.log("RES:::", booking);
    }

    fetchBooking();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, display: "relative" }}
    >
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={{}} onPress={() => router.back()}>
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20, marginTop: 20 }}>
          <Text
            style={{
              fontSize: 24,
              marginTop: 5,
              fontWeight: "500",
              color: COLORS.shuttlelanePurple,
              fontFamily: "PoppinsBold",
            }}
          >
            Search Results
          </Text>
          {/* <LoginForm /> */}
          {errorMessage && (
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                fontWeight: "500",

                fontFamily: "PoppinsRegular",
              }}
            >
              {errorMessage}. Kindly, go back and search again.
            </Text>
          )}

          {/* LOADER */}
          {isLoading && (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size={40} />
            </View>
          )}

          {/* BOOKING DETAILS */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                fontWeight: "500",

                fontFamily: "PoppinsSemiBold",
              }}
            >
              Booking Reference: CJJJODFA
            </Text>

            <View style={{ marginTop: 20 }}>
              <Icon name="place" size={24} color="#000" />
            </View>

            <Text
              style={{
                fontSize: 18,
                marginTop: 20,
                fontWeight: "500",

                fontFamily: "PoppinsSemiBold",
              }}
            >
              Booking Reference: CJJJODFA
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResultPage;
