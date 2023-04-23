import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { COLORS } from "../../constants/themes";
import priorityPassWhite from "../../assets/icons/priorityPassWhite.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecentBookings = () => {
  const [userBookings, setUserBookings] = useState();
  const [user, setUser] = useState();

  async function getUser() {
    const user = await AsyncStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    console.log(parsedUser);
    setUser(parsedUser);
  }

  async function fetchUserBookings() {
    console.log("userid:", user?._id);
    await axios
      // .get(`https://www.shuttlelane.com/api/booking/airport/${user?._id}`)
      .get(
        `http://172.20.10.6:3001/api/booking/airport/user-bookings/${user?._id}`
      )
      .then((res) => {
        console.log("USER BOOKINGS:", res.data);
        setUserBookings(res.data.data);
      })
      .catch((err) => {
        console.log("USER BOOKINGS ERROR:", err);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    fetchUserBookings();
  }, [user?._id]);

  return (
    <View style={{ marginTop: 45 }}>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: COLORS.shuttlelanePurple,
            fontFamily: "PoppinsBold",
          }}
        >
          Recent Bookings
        </Text>

        <Text
          style={{
            textDecorationColor: COLORS.shuttlelanePurple,
            textDecorationLine: "underline",
            color: COLORS.shuttlelanePurple,
            marginLeft: 10,
          }}
        >
          See all{"->"}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        {/* <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontFamily: "PoppinsSemiBold" }}>
            Today
          </Text>
        </View> */}

        {userBookings?.map((booking) => (
          <View key={booking?._id} style={{ marginTop: 10 }}>
            <View
              style={{
                backgroundColor: "#FBFBFB",
                flexDirection: "row",
                padding: 20,
                marginTop: 10,
                borderRadius: 20,
              }}
            >
              {/* Booking Type */}
              <View style={{ justifyContent: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: COLORS.shuttlelaneYellow,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {booking?.bookingType === "airport" ? (
                    <Icon name="flight-takeoff" size={24} color="#FFF" />
                  ) : (
                    <Icon name="luggage" size={24} color="#FFF" />
                  )}
                </View>
              </View>

              {/* Booking Dropoff and Pickup addresses */}
              <View style={{ justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderColor: "#C9C9C9",
                      borderWidth: "1px",
                      borderRadius: "50%",
                      marginHorizontal: 10,
                    }}
                  ></View>
                  <Text
                    numberOfLines={1}
                    style={{ maxWidth: "70%", fontFamily: "PoppinsRegular" }}
                  >
                    Pick up:{" "}
                    {booking?.pickupAddress === ""
                      ? booking?.pickupAirport
                      : booking?.pickupAddress}
                  </Text>
                </View>
                <View
                  style={{
                    width: 2,
                    height: 30,
                    marginLeft: 16.5,
                    backgroundColor: "#D9D9D9",
                  }}
                ></View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderColor: "#C9C9C9",
                      borderWidth: "1px",
                      borderRadius: "50%",
                      marginHorizontal: 10,
                    }}
                  ></View>
                  <Text
                    numberOfLines={1}
                    style={{ maxWidth: "70%", fontFamily: "PoppinsRegular" }}
                  >
                    Dropoff:{" "}
                    {booking?.dropoffAddress === ""
                      ? booking?.dropoffAirport
                      : booking?.dropoffAddress}
                  </Text>
                </View>
              </View>

              {/* Booking Price */}
              <View
                style={{
                  // height: "100%",
                  justifyContent: "center",
                  marginLeft: -40,
                  maxWidth: "20%",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.green,
                    fontFamily: "PoppinsBold",
                  }}
                >
                  {booking?.currency === "neira"
                    ? "₦"
                    : booking?.currency === "pounds"
                    ? "£"
                    : booking?.currency === "dollars"
                    ? "$"
                    : booking?.currency === "euro"
                    ? "€"
                    : "!"}
                  {booking?.amount}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    // color: COLORS.green,
                    fontFamily: "PoppinsRegular",
                    marginTop: 5
                  }}
                >
                  {booking?.pickupDate?.split('T')[0]}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecentBookings;
