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
        "https://www.shuttlelane.com/api/booking/search",
        // `http://172.20.10.6:3001/api/booking/search`,
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
        return;
      }
      console.log("RES:::", booking);

      setBooking(booking?.data);
      setIsLoading(false);
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
                marginTop: 10,
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
          {!isLoading && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 18,
                  marginTop: -10,
                  fontWeight: "500",

                  fontFamily: "PoppinsSemiBold",
                }}
              >
                Booking Reference: {bookingId}
              </Text>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Pickup{" "}
                  <Icon
                    name="place"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    {booking?.pickupAirport &&
                      `Airport Name: ${booking?.pickupAirport}`}
                    {booking?.pickupAddress &&
                      `Pickup address: ${booking?.pickupAddress}`}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    {booking?.pickupAirport &&
                      `Meeting Point: Proceed to trolly stand behind Baggage Conveyor for your free trolley and porter service.`}
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Dropoff{" "}
                  <Icon
                    name="place"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    {booking?.dropoffAirport &&
                      `Dropoff Airport: ${booking?.dropoffAirport}`}
                    {booking?.dropoffAddress &&
                      `Dropoff address: ${booking?.dropoffAddress}`}
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Driver Details{" "}
                  <Icon
                    name="person"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Name:{" "}
                    {booking?.assignedDriver?.name
                      ? booking?.assignedDriver?.name
                      : "Not assigned yet"}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Mobile Number:{" "}
                    {booking?.assignedDriver?.mobile
                      ? booking?.assignedDriver?.mobile
                      : "Not assigned yet"}
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              {booking?.assignedCar && (
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: 30,
                      fontWeight: "500",
                      color: COLORS.shuttlelanePurple,
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Car Details{" "}
                    <Icon
                      name="local-taxi"
                      size={20}
                      color={COLORS.shuttlelanePurple}
                    />
                  </Text>

                  <View
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        marginHorizontal: 10,
                        fontWeight: "500",
                        fontFamily: "PoppinsSemiBold",
                      }}
                    >
                      Type:{" "}
                      {booking?.assignedCar?.type
                        ? booking?.assignedCar?.type
                        : "Not assigned yet"}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        marginHorizontal: 10,
                        fontWeight: "500",
                        fontFamily: "PoppinsSemiBold",
                      }}
                    >
                      Plate Number:{" "}
                      {booking?.assignedCar?.plateNumber
                        ? booking?.assignedCar?.plateNumber
                        : "Not assigned yet"}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        marginHorizontal: 10,
                        fontWeight: "500",
                        fontFamily: "PoppinsSemiBold",
                      }}
                    >
                      Color:{" "}
                      {booking?.assignedCar?.color
                        ? booking?.assignedCar?.color
                        : "Not assigned yet"}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {!isLoading && (
            <View>
              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Date and Time{" "}
                  <Icon
                    name="schedule"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Date: {booking?.createdAt.split("T")[0]}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Time: {booking?.time}
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Vehicle Class{" "}
                  <Icon
                    name="local-taxi"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Class: {booking?.carType}
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Passenger{" "}
                  <Icon
                    name="person"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Name: {booking?.firstName} {booking?.lastName}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Passengers: {booking?.passengers} in total
                  </Text>
                </View>
              </View>

              {/* GROUP */}
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 30,
                    fontWeight: "500",
                    color: COLORS.shuttlelanePurple,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Contact{" "}
                  <Icon
                    name="support-agent"
                    size={20}
                    color={COLORS.shuttlelanePurple}
                  />
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Mobile Number: {booking?.mobile}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginHorizontal: 10,
                      fontWeight: "500",
                      fontFamily: "PoppinsSemiBold",
                    }}
                  >
                    Email: {booking?.email}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResultPage;
