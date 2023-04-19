import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../../constants/themes";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../../../assets/icons/arrowBackIcon.png";
import currentLocationIcon from "../.././../assets/icons/currentLocationIcon.png";
import destinationIcon from "../.././../assets/icons/destinationIcon.png";
import carIcon from "../.././../assets/icons/carIcon.png";
import passengerIcon from "../.././../assets/icons/passengerIcon.png";
import timeIcon from "../.././../assets/icons/timeIcon.png";
import priorityPassIcon from "../.././../assets/icons/priorityPassIcon.png";
import luggageIcon from "../.././../assets/icons/luggageIcon.png";
import calendarIcon from "../.././../assets/icons/calendarIcon.png";
import paypal from "../.././../assets/images/logos/paypal.png";
import flutterwave from "../.././../assets/images/logos/flutterwave.png";
import stripe from "../.././../assets/images/logos/stripe.png";

import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingSummary = () => {
  const router = useRouter();

  const params = useSearchParams();
  const {
    pickupAirport,
    dropoffAddress,
    date,
    passengers,
    carPicked,
    dropoffAirport,
    pickupAddress,
    bookingType,
    pass,
    time,
    airport,
    service,
    total,
  } = params;
  
  const [isLoading, setIsLoading] = useState(false)

    // USER DATA
    const [user, setUser] = useState();
    async function fetchUserData() {
      const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
      setUser(parsedUser);
    }
  
    // AIRPORT STATE
    const [airportPicked, setAirportPicked] = useState()
  
    // Fetch Airport
    const fetchAirportDetails = async () => {
      setIsLoading(true);
      const response = await fetch(
        //   "https://www.shuttlelane.com/api/users/signin",
        `http://172.20.10.6:3001/api/airports/${pickupAirport}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAirportPicked(data.data);
      console.log('AIRPORT PICKED:', data.data)
      setIsLoading(false);
    };
  
  
    useEffect(() => {
      fetchAirportDetails();
      fetchUserData();
    }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={{}} onPress={() => router.back()}>
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
          }}
        >
          Booking Summary
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "PoppinsSemiBold",
          }}
        >
          {bookingType}
        </Text>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              //   backgroundColor: COLORS.shuttlelaneYellowFaded,
              // padding: ,
              marginVertical: 10,
              borderRadius: 10,
            }}
          >
            {pickupAirport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={currentLocationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {airportPicked?.name}
                </Text>
              </View>
            )}

            {service && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={passengerIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>{service}</Text>
              </View>
            )}

            {dropoffAddress && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {dropoffAddress}
                </Text>
              </View>
            )}

            {pickupAddress && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={currentLocationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {pickupAddress}
                </Text>
              </View>
            )}

            {dropoffAirport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {dropoffAirport}
                </Text>
              </View>
            )}

            {airport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>{airport}</Text>
              </View>
            )}

            {passengers && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={passengerIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {passengers}
                </Text>
              </View>
            )}

            {pass && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={priorityPassIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>{pass}</Text>
              </View>
            )}

            {carPicked && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={carIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    textTransform: "capitalize",
                  }}
                >
                  {carPicked}
                </Text>
              </View>
            )}

            {date && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={calendarIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    textTransform: "capitalize",
                  }}
                >
                  {date}
                </Text>
              </View>
            )}

            {time && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={timeIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    textTransform: "capitalize",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              backgroundColor: COLORS.shuttlelaneYellowFaded,
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  textAlign: "center",
                  fontSize: 26,
                  textTransform: "uppercase",
                }}
              >
                TOTAL:
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  textAlign: "center",
                  fontSize: 26,
                  marginHorizontal: 10,
                  textTransform: "uppercase",
                }}
              >
                {user?.currency === "dollars"
                  ? "$"
                  : user?.currency === "neira"
                  ? "₦"
                  : user?.currency === "pounds"
                  ? "£"
                  : user?.currency === "euros"
                  ? "€"
                  : "!"}
                {total}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontFamily: "PoppinsSemiBold" }}>
                Pay with:
              </Text>

              {/* PAYMENT OPTIONS */}
              <View style={{ width: "100%", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    marginTop: 20,
                    borderColor: "#C9C9C9",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 60,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={paypal}
                    style={{ width: 100, height: 100 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    marginTop: 20,
                    borderColor: "#C9C9C9",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 60,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={flutterwave}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    marginTop: 20,
                    borderColor: "#C9C9C9",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 60,
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={stripe}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSummary;
