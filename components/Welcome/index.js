import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/themes";
import {
  PaperAirplaneIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import airplaneIcon from "../../assets/icons/airportPass.png";
import carHireIcon from "../../assets/icons/carHire.png";
import priorityPassIcon from "../../assets/icons/proprityPassIcon.png";
import searchIcon from "../../assets/icons/searchIcon.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import ToastMessage from "../ToastMessage";
import { Dimensions } from "react-native";
import { Alert } from "react-native";

const Welcome = ({
  userBookings,
  userCarBookings,
  userPriorityBookings,
  userSpend,
  isLoading,
  isSpendLoading,
  isGuest,
}) => {
  const [user, setUser] = useState();

  const router = useRouter();

  // const { logoutUser, isLoading } = useContext(AuthContext)
  // TOAST CONFIGS
  const [isToasting, setIsToasting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  // TOAST MESSAGE FUNCTION
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToasting(true);
    setTimeout(() => {
      setIsToasting(false);
    }, 2500);
  };

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      console.log(parsedUser);
      setUser(parsedUser);
    }

    getUser();
    console.log("GUESTTTTT FROM WELCOME:", isGuest);
  }, []);

  async function handleSearch() {
    if (!search || search === "") {
      return showToastMessage("Search field cannot be empty", "error");
    }

    router.push({
      pathname: "/bookings/search",
      params: {
        bookingId: search,
      },
    });
  }

  // Search State
  const [search, setSearch] = useState("");
  return (
    <>
      {/* TOAST MESSAGE */}
      {isToasting && (
        <ToastMessage
          type={toastType}
          message={toastMessage}
          style={{
            position: "absolute",
            zIndex: 90,
            top: 30,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}

      <View style={{ marginTop: 30 }}>
        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <View
              style={{
                height: 90,
                width: Dimensions.get("window").width / 2 - 30,
                backgroundColor: COLORS.shuttlelaneYellowFaded,
                position: "relative",
                top: -20,
                marginVertical: 15,
                borderRadius: 10,
                padding: 20,
              }}
            >
              <View>
                <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16 }}>
                  Total Bookings:
                </Text>
                <Text style={{ fontFamily: "PoppinsBold", fontSize: 26 }}>
                  {userBookings?.length}
                </Text>
              </View>
            </View> */}
            <View
              style={{
                height: 100,
                width: Dimensions.get("window").width / 2 - 30,
                backgroundColor: COLORS.shuttlelaneYellowFaded,
                position: "relative",
                top: -20,
                marginVertical: 15,
                borderRadius: 10,
                padding: 15,
              }}
            >
              <View
                style={{
                  position: "relative",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Tooltip💡",
                      "This is only an estimate of the total number of airport bookings you have made on Shuttlelane. We are constantly improving on these features and if you need further enquiries, please contact support @info@shuttlelane.com"
                    )
                  }
                  style={{
                    width: "100%",
                  }}
                >
                  <Icon
                    name="flight-takeoff"
                    size={18}
                    color="#191919"
                    style={{ position: "absolute", right: 0 }}
                  />

                  <Text
                    style={{
                      fontFamily: "PoppinsSemiBold",
                      fontSize: Platform.OS === "ios" ? 16 : 12,
                    }}
                  >
                    Bookings:
                  </Text>
                  {!isGuest && (
                    <Text style={{ fontFamily: "PoppinsBold", fontSize: Platform.OS === "ios" ? 26 : 22, }}>
                      {isLoading && (
                        <ActivityIndicator
                          size={20}
                          color={COLORS.shuttlelanePurple}
                        />
                      )}
                      {!isLoading &&
                        userBookings?.length +
                          userCarBookings?.length +
                          userPriorityBookings?.length}
                    </Text>
                  )}
                  {isGuest && (
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 12 : 10,
                        marginTop: 10,
                      }}
                    >
                      Create an account to see stats
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: 100,
                width: Dimensions.get("window").width / 2 - 30,
                backgroundColor: COLORS.shuttlelaneYellowFaded,
                position: "relative",
                top: -20,
                marginVertical: 15,
                borderRadius: 10,
                padding: 15,
              }}
            >
              <View
                style={{
                  position: "relative",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Tooltip💡",
                      "This is only an estimate of the total amount you have spent on Shuttlelane. For now, we advise that you avoid changing currencies to get the best estimates. For further enquiries, please contact support @info@shuttlelane.com"
                    )
                  }
                  style={{
                    width: "100%",
                  }}
                >
                  <Icon
                    name="info"
                    size={18}
                    color="#191919"
                    style={{ position: "absolute", right: 0 }}
                  />

                  <Text
                    style={{
                      fontFamily: "PoppinsSemiBold",
                      fontSize: Platform.OS === "ios" ? 16 : 12,
                    }}
                  >
                    Total Spent:
                  </Text>
                  {!isGuest && (
                    <Text style={{ fontFamily: "PoppinsBold", fontSize: Platform.OS === "ios" ? 26 : 22,}}>
                      {isSpendLoading && (
                        <ActivityIndicator
                          size={20}
                          color={COLORS.shuttlelanePurple}
                        />
                      )}

                      {!isSpendLoading && (
                        <>
                          {user?.currency === "dollars" && "$"}
                          {user?.currency === "pounds" && "£"}
                          {user?.currency === "euros" && "€"}
                          {user?.currency === "neira" && "₦"}
                          {userSpend}
                        </>
                      )}
                    </Text>
                  )}
                  {isGuest && (
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 12 : 10,
                        marginTop: 10,
                      }}
                    >
                      Create an account to see stats
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: Platform.OS === "ios" ? 28 : 20,
              marginTop: 10,
              fontWeight: "500",
              color: "#191919",
              fontFamily: "PoppinsBold",
              maxWidth: 300,
            }}
          >
            Schedule your next booking
          </Text>
        </View>
        {/* Search bookings */}
        <View style={{ marginTop: 40, flexDirection: "row", width: "100%" }}>
          <TextInput
            style={{
              padding: 10,
              paddingHorizontal: 20,
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              height: 55,
              borderRadius: 10,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              fontFamily: "PoppinsRegular",
              fontSize: Platform.OS === "ios" ? 16 : 12,
              width: "85%",
            }}
            placeholder="Search for a booking"
            placeholderTextColor="#C9C9C9"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.shuttlelanePurple,
              width: "15%",
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleSearch}
          >
            <Image
              source={searchIcon}
              style={{ width: 45, height: 45 }}
              resizeMode="cover"
              width={30}
              height={30}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingHorizontal: 25,
            marginTop: 50,
            // backgroundColor: "#FBFBFB",
            paddingVertical: 14,
            borderRadius: 20,
          }}
        >
          <View
            style={{
              marginTop: -10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Platform.OS === "ios" ? 60 : 50,
                  width: Platform.OS === "ios" ? 60 : 50,
                  borderWidth: 1,
                  backgroundColor: COLORS.shuttlelanePurple,
                  borderRadius: 50,
                  marginBottom: 15,
                }}
                onPress={() => {
                  console.log("IS GUEST FROM AIRPORT TRANSFER::", isGuest);
                  router.push({
                    pathname: "/bookings/airport-transfer",
                    params: {
                      isGuest: isGuest,
                    },
                  });
                }}
              >
                {/* <PaperAirplaneIcon style={{ width: 24, rotate: "-90deg" }} /> */}
                {/* <Image source={airplaneIcon} style={{ width: 55, height: 55 }} /> */}
                <Icon
                  name="flight-takeoff"
                  size={Platform.OS === "ios" ? 30 : 27}
                  color={COLORS.white}
                  style={{ marginVertical: "auto" }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: Platform.OS === "ios" ? 12 : 11,
                  marginTop: -5,
                  color: "#A1A1A1",
                  fontFamily: "PoppinsRegular",
                }}
              >
                Airport
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Platform.OS === "ios" ? 60 : 50,
                  width: Platform.OS === "ios" ? 60 : 50,
                  borderWidth: 1,
                  backgroundColor: COLORS.shuttlelanePurple,
                  borderRadius: 50,
                  marginBottom: 15,
                }}
                onPress={() => router.push("/bookings/car-hire")}
              >
                <Icon
                  name="car-rental"
                  size={Platform.OS === "ios" ? 30 : 27}
                  color={COLORS.white}
                  style={{ marginVertical: "auto" }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: Platform.OS === "ios" ? 12 : 11,
                  marginTop: -10,
                  color: "#A1A1A1",
                  fontFamily: "PoppinsRegular",
                }}
              >
                Car Hire
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Platform.OS === "ios" ? 60 : 50,
                  width: Platform.OS === "ios" ? 60 : 50,
                  borderWidth: 1,
                  backgroundColor: COLORS.shuttlelanePurple,
                  borderRadius: 50,
                  marginBottom: 15,
                }}
                onPress={() => router.push("/bookings/priority-pass")}
              >
                <Icon
                  name="luggage"
                  size={30}
                  color={COLORS.white}
                  style={{ marginVertical: "auto" }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: Platform.OS === 'ios' ? 12 : 11,
                  marginTop: 0,
                  color: "#A1A1A1",
                  fontFamily: "PoppinsRegular",
                  marginTop: -5,
                }}
              >
                Priority
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Welcome;
