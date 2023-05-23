import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/themes";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import empty from "../../assets/images/empty.png";

const Bookings = () => {
  const [userBookings, setUserBookings] = useState();
  const [userCarBookings, setUserCarBookings] = useState();
  const [userPriorityBookings, setUserPriorityBookings] = useState();
  const [user, setUser] = useState();
  const [guest, setGuest] = useState();

  const [isLoading, setIsLoading] = useState(false);

  async function getUser() {
    const user = await AsyncStorage.getItem("user");
    const guest = await AsyncStorage.getItem("isGuest");
    const parsedUser = JSON.parse(user);
    const parsedGuest = JSON.parse(guest);
    console.log(parsedUser);
    setUser(parsedUser);
    setGuest(parsedGuest);
  }

  async function fetchUserBookings() {
    setIsLoading(true);
    console.log("userid:", user?._id);
    await axios
      .get(
        `https://www.shuttlelane.com/api/booking/airport/user-bookings/${user?._id}`
      )
      .then((res) => {
        console.log("USER BOOKINGS:", res.data);
        setUserBookings(res.data.data?.airport);
        setUserCarBookings(res.data.data?.carDoc);
        setUserPriorityBookings(res.data.data?.priorityDoc);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("USER BOOKINGS ERROR:", err);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!guest) {
      fetchUserBookings();
    }
  }, [user?._id]);

  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: COLORS.shuttlelanePurple,
            fontFamily: "PoppinsBold",
          }}
        >
          Bookings
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#000",
            fontFamily: "PoppinsRegular",
            marginTop: 5,
          }}
        >
          All your bookings with Shuttlelane
        </Text>

        {guest && (
          <View style={{ alignItems: "center", marginTop: 90 }}>
            <View style={{ alignItems: "center" }}>
              <Image source={empty} style={{ width: 150, height: 150 }} />
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Nothing here, Register or log in to see stats.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.shuttlelanePurple,
                borderRadius: 10,
              }}
              onPress={() => router.replace("/signup")}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#000",
                  fontFamily: "PoppinsRegular",
                  marginTop: 5,
                  color: COLORS.white,
                }}
              >
                Get started
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!guest && !isLoading && (
          <View style={{ marginTop: 30 }}>
            {userBookings?.map((booking) => (
              <TouchableOpacity
                key={booking?._id}
                onPress={() =>
                  router.push({
                    pathname: "/bookings/search",
                    bookingId: booking?.bookingReference ?? booking?._id,
                  })
                }
                style={{ marginVertical: 10 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // padding: 1,
                    marginTop: 10,
                    borderRadius: 20,
                  }}
                >
                  {/* Booking Type */}
                  <View style={{ justifyContent: "center" }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: COLORS.shuttlelanePurple,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {booking?.bookingType === "airport" ? (
                        <Icon name="flight-takeoff" size={24} color="#FFF" />
                      ) : booking?.isPriorityPass == "true" ? (
                        <Icon name="luggage" size={24} color="#FFF" />
                      ) : (
                        <Icon name="directions-car" size={24} color="#FFF" />
                      )}
                    </View>
                  </View>

                  {/* Booking Dropoff and Pickup addresses */}
                  <View style={{ padding: 10 }}>
                    <View style={{}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Pick up:{" "}
                        {booking?.pickupAddress === ""
                          ? booking?.pickupAirport
                          : booking?.pickupAddress}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Price:{" "}
                        {booking?.currency === "pounds"
                          ? "£"
                          : booking?.currency === "dollars"
                          ? "$"
                          : booking?.currency === "euros"
                          ? "€"
                          : booking?.currency === "neira"
                          ? "₦"
                          : "!"}
                        {booking?.amount}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {userCarBookings?.map((booking) => (
              <TouchableOpacity
                key={booking?._id}
                onPress={() =>
                  router.push({
                    pathname: "/bookings/search",
                    bookingId: booking?.bookingReference ?? booking?._id,
                  })
                }
                style={{ marginVertical: 10 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // padding: 1,
                    marginTop: 10,
                    borderRadius: 20,
                  }}
                >
                  {/* Booking Type */}
                  <View style={{ justifyContent: "center" }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: COLORS.shuttlelanePurple,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {booking?.bookingType === "airport" ? (
                        <Icon name="flight-takeoff" size={24} color="#FFF" />
                      ) : booking?.isPriorityPass == "true" ? (
                        <Icon name="luggage" size={24} color="#FFF" />
                      ) : (
                        <Icon name="directions-car" size={24} color="#FFF" />
                      )}
                    </View>
                  </View>

                  {/* Booking Dropoff and Pickup addresses */}
                  <View style={{ padding: 10 }}>
                    <View style={{}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Pick up:{" "}
                        {booking?.pickupAddress === ""
                          ? booking?.pickupAirport
                          : booking?.pickupAddress}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Price:{" "}
                        {booking?.currency === "pounds"
                          ? "£"
                          : booking?.currency === "dollars"
                          ? "$"
                          : booking?.currency === "euros"
                          ? "€"
                          : booking?.currency === "neira"
                          ? "₦"
                          : "!"}
                        {booking?.amount}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {userPriorityBookings?.map((booking) => (
              <TouchableOpacity
                key={booking?._id}
                onPress={() =>
                  router.push({
                    pathname: "/bookings/search",
                    bookingId: booking?.bookingReference ?? booking?._id,
                  })
                }
                style={{ marginVertical: 10 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // padding: 1,
                    marginTop: 10,
                    borderRadius: 20,
                  }}
                >
                  {/* Booking Type */}
                  <View style={{ justifyContent: "center" }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: COLORS.shuttlelanePurple,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {booking?.bookingType === "airport" ? (
                        <Icon name="flight-takeoff" size={24} color="#FFF" />
                      ) : booking?.isPriorityPass == "true" ? (
                        <Icon name="luggage" size={24} color="#FFF" />
                      ) : (
                        <Icon name="directions-car" size={24} color="#FFF" />
                      )}
                    </View>
                  </View>

                  {/* Booking Dropoff and Pickup addresses */}
                  <View style={{ padding: 10 }}>
                    <View style={{}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Pick up:{" "}
                        {booking?.pickupAddress === ""
                          ? booking?.pickupAirport
                          : booking?.pickupAddress}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          // maxWidth: "90%",
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        Price:{" "}
                        {booking?.currency === "pounds"
                          ? "£"
                          : booking?.currency === "dollars"
                          ? "$"
                          : booking?.currency === "euros"
                          ? "€"
                          : booking?.currency === "neira"
                          ? "₦"
                          : "!"}
                        {booking?.amount}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {isLoading && <ActivityIndicator size={32} />}

            {!userBookings ||
              !userCarBookings ||
              !userPriorityBookings ||
              (userBookings?.length === 0 &&
                userCarBookings?.length === 0 &&
                userPriorityBookings?.length === 0 && (
                  <View style={{ alignItems: "center", marginTop: 90 }}>
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={empty}
                        style={{ width: 150, height: 150 }}
                      />
                      <Text
                        style={{
                          fontFamily: "PoppinsRegular",
                          fontSize: 14,
                          marginTop: 10,
                          textAlign: "center",
                        }}
                      >
                        Nothing here... You have not made any bookings yet.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        height: 50,
                        padding: 10,
                        paddingHorizontal: 20,
                        fontSize: 16,
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.shuttlelanePurple,
                        borderRadius: 10,
                      }}
                      onPress={() => router.replace("/dashboard/home")}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#000",
                          fontFamily: "PoppinsRegular",
                          marginTop: 5,
                          color: COLORS.white,
                        }}
                      >
                        Make Booking
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Bookings;
