import { Link, Stack, Tabs, useRouter, useSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import Welcome from "../../components/Welcome";
import RecentBookings from "../../components/RecentBookings";
import { COLORS } from "../..//constants/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastMessage from "../../components/ToastMessage";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text } from "react-native";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list";
import arrowDownIcon from "../../assets/icons/arrowDownIcon.png";
import closeIcon from "../../assets/icons/closeIcon.png";
import { StatusBar } from "expo-status-bar";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState();
  const [userBookings, setUserBookings] = useState();

  // BOOKING STATS STATES
  const [userAirportBookings, setUserAirportBookings] = useState();
  const [userCarBookings, setUserCarBookings] = useState();
  const [userPriorityBookings, setUserPriorityBookings] = useState();

  // IF IT IS A GUEST
  const [currency, setCurrency] = useState("dollars");
  const [guest, setGuest] = useState();
  const currencies = [
    {
      key: "dollars",
      value: "USD",
    },
    {
      key: "euros",
      value: "EUR",
    },
    {
      key: "pounds",
      value: "GBP",
    },
    {
      key: "neira",
      value: "NGN",
    },
  ];

  async function setUserCurrency(value) {
    const user = { currency: value };
    await AsyncStorage.setItem("user", JSON.stringify(user));
  }

  useEffect(() => {
    if (guest) {
      setUserCurrency(currency);
      console.log("GUESTTTTTTTT IS LOGGED IN OOOOO");
    }
  }, [currency]);

  useEffect(() => {
    if (guest) {
      setUserCurrency("dollars");
    }
  }, [guest]);

  // LOADING STATES
  const [isLoading, setIsLoading] = useState(false);
  const [isSpendLoading, setIsSpendLoading] = useState(false);

  const router = useRouter();

  const { dataUpdated, message, type } = useSearchParams();

  // LOGOUT FUNCTION
  async function logoutUser() {
    // setIsLoading(true);
    // showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // setIsLoading(false);
    router.replace("/login");
    return;
  }

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

  // USER DATA
  async function fetchUserData() {
    console.log("INSIDE FETCH USER DATA - OUTER");
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    const parsedGuest = JSON.parse(await AsyncStorage.getItem("isGuest"));

    console.log("PARSED USER:", parsedUser);
    // if (dataUpdated && parsedUser !== user) {
    //   console.log("INSIDE FETCH USER DATA");
    //   setUser(parsedUser);
    //   return
    // }
    console.log("BEFORE SET PU");
    setUser(parsedUser);
    console.log("AFTER SET PU");
    setGuest(parsedGuest);
    console.log("AFTER SET PG");
  }
  useEffect(() => {
    console.log("FROM EDIT AGAIN");
    if (!dataUpdated) fetchUserData();
    console.log("FROM EDIT AFTER UE");
  }, []);

  useEffect(() => {
    async function getUser() {
      if (dataUpdated) {
        console.log("FROM EDIT");
        fetchUserData();
        console.log("FROM EDIT GU");
        showToastMessage(message, type);
      }
    }
    getUser();
  }, [dataUpdated]);

  // USER DATA
  const [userSpend, setUserSpend] = useState(0);
  async function fetchUserSpend() {
    console.log("USEREREREREREE IDDDD:", user?._id);
    setIsSpendLoading(true);
    await axios
      .get(
        `https://www.shuttlelane.com/api/booking/airport/user-spend/${user?._id}`
      )
      .then((res) => {
        console.log("RESPONESE USER SPEND:", res.data);
        setUserSpend(res.data.data);
        setIsSpendLoading(false);
      })
      .catch((err) => {
        console.log("ER:::", err);
        // setIsSpendLoading(false)
      });
  }

  async function fetchUserBookings() {
    setIsLoading(true);
    console.log("userid:", user?._id);

    await axios
      // .get(`https://www.shuttlelane.com/api/booking/airport/${user?._id}`)
      .get(
        `https://www.shuttlelane.com/api/booking/airport/user-bookings/${user?._id}`
      )
      .then((res) => {
        console.log("USER BOOKINGS:", res?.data);
        setIsLoading(false);
        // setUserBookings(res?.data?.data);
        setUserAirportBookings(res?.data?.data?.airport);
        setUserCarBookings(res?.data?.data?.carDoc);
        setUserPriorityBookings(res?.data?.data?.priorityDoc);
      })
      .catch((err) => {
        console.log("USER BOOKINGS ERROR:", err);
        console.log("hiii");
      });
  }

  // USER SPEND
  useEffect(() => {
    if (!guest) {
      fetchUserSpend();
      fetchUserBookings();
    }
  }, [user?._id, guest]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: ({ style, color }) => (
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 12 : 10,
                color: color,
              }}
            >
              Home
            </Text>
          ),
          headerTitle: "",
          headerLeft: () => (
            <View
              style={{
                paddingLeft: 20,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsSemiBold",
                  fontSize: Platform.OS === "ios" ? 16 : 14,
                  width: "100%",
                }}
              >
                {!guest && `Hi, ${user?.name} ✨`}
                {guest && `Hi, Guest ✨`}
              </Text>
            </View>
          ),
          headerRight: () => {
            // fetchUserData();
            if (!guest) {
              return (
                <TouchableOpacity
                  style={{
                    paddingRight: 20,
                    marginTop: 20,
                  }}
                  onPress={() => router.push("/dashboard/more")}
                >
                  <Image
                    source={{ uri: `${user?.image}` }}
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                    placeholder={blurhash}
                  />
                  {/* <Image */}
                </TouchableOpacity>
              );
            } else {
              return (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      paddingRight: 20,
                      marginTop: 20,
                      flexDirection: "row",
                      marginRight: 15,
                    }}
                    onPress={() => router.replace("/signup")}
                  >
                    <Text
                      style={{
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                        fontFamily: "PoppinsRegular",
                        color: "#000",
                      }}
                    >
                      Register
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      paddingRight: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                    onPress={() => router.replace("/login")}
                  >
                    <Text
                      style={{
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                        fontFamily: "PoppinsSemiBold",
                        color: COLORS.shuttlelanePurple,
                      }}
                    >
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
          },
          tabBarIcon: ({ style, color }) => (
            <Icon
              name="home"
              size={Platform.OS === "ios" ? 28 : 24}
              color={color}
              style={{ color: color }}
            />
          ),
          headerShadowVisible: false,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, padding: 20 }}>
          {guest && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  marginBottom: 20,
                  fontFamily: "PoppinsRegular",
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
              >
                Default Currency
              </Text>
              <SelectList
                setSelected={(value) => setCurrency(value)}
                data={currencies}
                arrowicon={
                  <Image
                    source={arrowDownIcon}
                    style={{ width: 40, height: 40, marginTop: -8 }}
                    resizeMode="cover"
                  />
                }
                closeicon={
                  <Image
                    source={closeIcon}
                    style={{ width: 50, height: 50, marginTop: -1 }}
                    resizeMode="cover"
                  />
                }
                boxStyles={{
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: "#C9C9C9",
                  height: 50,
                  padding: 10,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                dropdownItemStyles={{
                  marginVertical: 5,
                }}
                dropdownStyles={{
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: "#C9C9C9",
                  padding: 10,
                }}
                inputStyles={{
                  fontFamily: "PoppinsRegular",
                  color: "#C9C9C9",
                  marginTop: 4,
                  // fontSize: 16,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                dropdownTextStyles={{
                  fontFamily: "PoppinsRegular",
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                placeholder="USD"
                searchPlaceholder="Search Currencies"
              />
            </View>
          )}
          <Welcome
            userBookings={userAirportBookings}
            userCarBookings={userCarBookings}
            userPriorityBookings={userPriorityBookings}
            userSpend={userSpend}
            isLoading={isLoading}
            isSpendLoading={isSpendLoading}
            isGuest={guest ? true : false}
          />
          <RecentBookings
            userBookings={userAirportBookings}
            userCarBookings={userCarBookings}
            userPriorityBookings={userPriorityBookings}
            isLoading={isLoading}
            isGuest={guest ? true : false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
