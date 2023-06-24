import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { COLORS } from "../../constants/themes";
import priorityPassWhite from "../../assets/icons/priorityPassWhite.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import empty from "../../assets/images/empty.png";

const RecentBookings = ({
  userBookings,
  userCarBookings,
  userPriorityBookings,
  isLoading,
  isGuest,
}) => {
  const [user, setUser] = useState();

  // const [isLoading, setIsLoading] = useState(false);

  // async function fetchUserBookings() {
  //   setIsLoading(true);
  //   console.log("userid:", user?._id);
  //   await axios
  //     // .get(`https://www.shuttlelane.com/api/booking/airport/${user?._id}`)
  //     .get(
  //       `https://www.shuttlelane.com/api/booking/airport/user-bookings/${user?._id}`
  //     )
  //     .then((res) => {
  //       console.log("USER BOOKINGS:", res.data);
  //       setIsLoading(false);
  //       setUserBookings(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.log("USER BOOKINGS ERROR:", err);
  //     });
  // }

  // useEffect(() => {
  //   fetchUserBookings();
  // }, [user?._id]);

  const router = useRouter();

  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{
            fontSize: Platform.OS === "ios" ? 24 : 18,
            fontWeight: "500",
            color: "#191919",
            fontFamily: "PoppinsBold",
          }}
        >
          Recent Bookings
        </Text>

        {/* <Text
          style={{
            textDecorationColor: COLORS.shuttlelanePurple,
            textDecorationLine: "underline",
            color: COLORS.shuttlelanePurple,
            marginLeft: 10,
          }}
        >
          See all{"->"}
        </Text> */}
      </View>

      {!isGuest && (
        <View style={{ marginTop: 0 }}>
          {/* <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontFamily: "PoppinsSemiBold" }}>
            Today
          </Text>
        </View> */}

          {isLoading && <ActivityIndicator size={35} />}

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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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

          {!userBookings ||
            !userCarBookings ||
            !userPriorityBookings ||
            (userBookings?.length === 0 &&
              userCarBookings?.length === 0 &&
              userPriorityBookings?.length === 0 && (
                <View style={{ alignItems: "center", marginTop: 90 }}>
                  <View style={{ alignItems: "center" }}>
                    <Image source={empty} style={{ width: 150, height: 150 }} />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 14 : 12,
                        marginTop: 10,
                        textAlign: "center",
                      }}
                    >
                      Nothing here... You have not made any bookings yet.
                    </Text>
                  </View>
                </View>
              ))}
        </View>
      )}

      {isGuest && (
        <View style={{ marginTop: 20 }}>
          <View style={{ alignItems: "center" }}>
            <Image source={empty} style={{ width: 150, height: 150 }} />
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Nothing here, Register or log in to see stats.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default RecentBookings;
