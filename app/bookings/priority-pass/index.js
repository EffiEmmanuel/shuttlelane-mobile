import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../constants/themes";
import arrowBackIcon from "../../../assets/icons/arrowBackIcon.png";
import arrowDownIcon from "../../../assets/icons/arrowDownIcon.png";
import searchIcon from "../../../assets/icons/searchIcon.png";
import closeIcon from "../../../assets/icons/closeIcon.png";
import ScreenHeaderBtn from "../../../components/ScreenHeaderBtn";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { TextInput } from "react-native-gesture-handler";
import { getRequest } from "../../../network/apiClient";
import { SelectList } from "react-native-dropdown-select-list";
import DatePicker from "react-native-modern-datepicker";
import { ActivityIndicator } from "react-native";
import axios from "axios";
import ToastMessage from "../../../components/ToastMessage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const PriorityPass = () => {
  const router = useRouter();

  // TIME SETUP
  const shuttleDate = new Date();
  // DATE SETUP
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  // FETCH AIRPORTS
  const fetchAirports = async () => {
    const response = await getRequest("/airports", null, null);
  };

  // TOAST MESSAGE CONFIG
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

  // FORM SETUP
  const [service, setService] = useState("");
  const [airport, setAirport] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pass, setPass] = useState("");
  const [passengers, setPassengers] = useState(0);
  const [time, setTime] = useState("");
  const [flightNumber, setflightNumber] = useState("");
  const [airline, setAirline] = useState("");

  // DATETIME SETUP
  const [timePicker, setTimePicker] = useState(false);

  // ARRIVAL DATE SETUP
  const [date, setDate] = useState();
  // DATE STATES
  const [datePicker, setDatePicker] = useState(false);

  const passTypes = [
    {
      key: 35000,
      value: "Standard Pass",
    },
    {
      key: 45000,
      value: "Premium Pass",
    },
  ];

  const serviceType = [
    {
      key: "Arrival Protocol Service",
      value: "Arrival Protocol Service",
    },
    {
      key: "Departure Protocol Service",
      value: "Departure Protocol Service",
    },
  ];

  // AIRPORTS SETUP
  const [airports, setAirports] = useState();
  // Fetch airports
  const fetchAllAirports = async () => {
    setIsLoading(true);
    const response = await fetch(
      "https://www.shuttlelane.com/api/v1/airports",
      // "http://172.20.10.6:3001/api/airports",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("DATA:::", data);
    const airports = data.data;

    let formattedAirports = [];

    airports.forEach((airport) => {
      formattedAirports.push({
        key: airport?._id,
        value: airport?.airportName,
      });
    });

    console.log("FA:", formattedAirports);
    setAirports(formattedAirports);
    setIsLoading(false);
  };

  // MAP SETUP
  const [mapRegion, setMapRegion] = useState();
  const [isMapLoading, setIsMapLoading] = useState(false);
  // User Location
  const userLocation = async () => {
    setIsMapLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Access to location was denied!");
    }

    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const address = await Location.reverseGeocodeAsync(location.coords);
    console.log(address);

    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setIsMapLoading(false);
  };

  // PRIORITY PASS
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userLocation();
    fetchAllAirports();
  }, []);

  // Fetch Exchange rates
  const [rates, setRates] = useState();

  // FUNCTION
  async function fetchExchangeRates() {
    setIsLoading(true);
    await axios
      .get(`https://www.shuttlelane.com/api/rates`)
      .then((res) => {
        const exchangeRates = res.data.data[0];
        setRates(res.data.data[0]);
        console.log("res:", res.data.data[0]?.dollar);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  }

  // Handle Currency Conversion
  function makeConversion(amount) {
    const dollarRate = Number(rates?.dollar);
    const poundRate = Number(rates?.pound);
    const euroRate = Number(rates?.euro);

    let newAmount;
    if (user?.currency === "neira") {
      newAmount = amount;
      return newAmount;
    } else if (user?.currency === "dollars") {
      newAmount = amount / dollarRate;
      return newAmount;
    } else if (user?.currency === "pounds") {
      newAmount = amount / poundRate;
      return newAmount;
    } else if (user?.currency === "euros") {
      newAmount = amount / euroRate;
      return newAmount;
    }
  }

  // USER DATA
  const [user, setUser] = useState();
  const [guest, setGuest] = useState();
  async function fetchUserData() {
    // const user = ;
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    const parsedGuest = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(parsedUser);
    setGuest(parsedGuest);
  }

  useEffect(() => {
    fetchExchangeRates();
    fetchUserData();
  }, []);

  // ON FORM SUBMIT - PRIORITY PASS
  async function priorityPassNextStep() {
    if (!service || !passengers || !airport || !date || !pass || !time) {
      showToastMessage("Please fill in the missing fields to proceed", "error");
      Alert.alert("Attention", "Please fill in the missing fields to proceed");
      return;
    }

    console.log("HIIIIIIIIIII");
    const total = Number(pass) * Number(passengers);

    const finalPrice = await makeConversion(total);

    const isGuest = JSON.parse(await AsyncStorage.getItem("isGuest"));

    if (isGuest) {
      router.push({
        pathname: "/bookings/user-details",
        params: {
          bookingType: "Priority Pass",
          service,
          passengers,
          airport,
          date,
          pass,
          time,
          total: finalPrice,
          airline,
          flightNumber,
        },
      });
    } else {
      router.push({
        pathname: "/bookings/summary",
        params: {
          bookingType: "Priority Pass",
          service,
          passengers,
          airport,
          date,
          pass,
          time,
          total: finalPrice,
          airline,
          flightNumber,
        },
      });
    }
  }

  // SET DATE
  useEffect(() => {
    const shuttleDate = new Date();
    const year = shuttleDate.getFullYear();
    const month = shuttleDate.getMonth();
    const day = shuttleDate.getDate();

    console.log("year:::", year);
    console.log("month:::", month);
    console.log("day:::", day);
    setYear(year);
    setMonth(month);
    setDay(day);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: COLORS.white }}
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
          headerTitle: "",
        }}
      />

      {/* TOAST MESSAGE */}
      {isToasting && (
        <ToastMessage
          type={toastType}
          message={toastMessage}
          style={{
            position: "absolute",
            zIndex: 90,
            top: 0,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}

      {isLoading && <ActivityIndicator size={36} />}

      {/* FORM HERE */}
      {!isLoading && (
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            paddingTop: 10,
            paddingBottom: 30,
            // position: "fixed",
            top: 0,
          }}
        >
          {/* PRIORITY PASS FORM */}

          <View style={{}}>
            {/* SERVICE SELECT DROPDOWN */}
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", marginVertical: 20 }}>
                <Icon name="flight-land" size={20} />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                  }}
                >
                  Service Type
                </Text>
              </View>
              <SelectList
                setSelected={(value) => setService(value)}
                data={serviceType}
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
                }}
                dropdownItemStyles={{
                  marginVertical: 5,
                }}
                dropdownStyles={{
                  borderRadius: 10,
                  borderWidth: 0.5,
                  maxHeight: 150,
                  borderColor: "#C9C9C9",
                  padding: 10,
                }}
                inputStyles={{
                  fontFamily: "PoppinsRegular",
                  color: "#C9C9C9",
                  marginTop: 4,
                  fontSize: 16,
                }}
                dropdownTextStyles={{
                  fontFamily: "PoppinsRegular",
                }}
                placeholder="Select Service"
                searchPlaceholder="Search airports"
              />
            </View>

            {/* AIRPORT  SELECT DROPDOWN */}
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", marginVertical: 20 }}>
                <Icon name="flight" size={20} />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                  }}
                >
                  Airport
                </Text>
              </View>
              <SelectList
                setSelected={(value) => setAirport(value)}
                data={airports}
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
                }}
                dropdownItemStyles={{
                  marginVertical: 5,
                }}
                dropdownStyles={{
                  borderRadius: 10,
                  borderWidth: 0.5,
                  maxHeight: 150,
                  borderColor: "#C9C9C9",
                  padding: 10,
                }}
                inputStyles={{
                  fontFamily: "PoppinsRegular",
                  color: "#C9C9C9",
                  marginTop: 4,
                  fontSize: 16,
                }}
                dropdownTextStyles={{
                  fontFamily: "PoppinsRegular",
                }}
                placeholder="Select Airport"
                searchPlaceholder="Search airports"
              />
            </View>

            {/* PASSENGERS AND PASS */}
            <View
              style={
                {
                  // flexDirection: "row",
                  // alignItems: "center",
                  // justifyContent: "space-between",
                }
              }
            >
              <View style={{ flexDirection: "row", marginVertical: 20 }}>
                <Icon name="people" size={20} />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                  }}
                >
                  Passengers
                </Text>
              </View>
              <TextInput
                value={passengers}
                style={{
                  height: 50,
                  padding: 10,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  // marginTop: 10,
                  fontFamily: "PoppinsRegular",
                  borderColor: "#C9C9C9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  // width: "47%",
                }}
                keyboardType="number-pad"
                returnKeyType="done"
                placeholder="Passengers"
                placeholderTextColor="#C9C9C9"
                onChangeText={(value) => setPassengers(value)}
              />
            </View>

            {/* DATE PICKER */}
            <View style={{ marginTop: 20 }}>
              <View
                style={
                  {
                    // flexDirection: "row",
                    // justifyContent: "space-between",
                  }
                }
              >
                {/* PASS SELECT DROPDOWN */}
                <View style={{}}>
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Icon name="toll" size={20} />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        marginHorizontal: 5,
                      }}
                    >
                      Pass Type
                    </Text>
                  </View>
                  <SelectList
                    setSelected={(value) => setPass(value)}
                    data={passTypes}
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
                    }}
                    dropdownItemStyles={{
                      marginVertical: 5,
                    }}
                    dropdownStyles={{
                      borderRadius: 10,
                      borderWidth: 0.5,
                      maxHeight: 150,
                      borderColor: "#C9C9C9",
                      padding: 10,
                    }}
                    inputStyles={{
                      fontFamily: "PoppinsRegular",
                      color: "#C9C9C9",
                      marginTop: 4,
                      fontSize: 16,
                    }}
                    dropdownTextStyles={{
                      fontFamily: "PoppinsRegular",
                    }}
                    placeholder="Select Pass"
                    searchPlaceholder="Search airports"
                  />
                </View>
              </View>
            </View>

            {/* AIRLINE */}
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <Icon name="flight-takeoff" size={20} />
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  marginHorizontal: 5,
                }}
              >
                Airline
              </Text>
            </View>
            <TextInput
              value={airline}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                fontFamily: "PoppinsRegular",
                borderColor: "#C9C9C9",
                borderWidth: 0.5,
                borderRadius: 10,
              }}
              placeholder="Airline"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setAirline(value)}
            />

            {/* FLIGHT NUMBER */}
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <Icon name="toll" size={20} />
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  marginHorizontal: 5,
                }}
              >
                Flight Number
              </Text>
            </View>
            <TextInput
              value={flightNumber}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                fontFamily: "PoppinsRegular",
                borderColor: "#C9C9C9",
                borderWidth: 0.5,
                borderRadius: 10,
              }}
              placeholder="Flight Number"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setflightNumber(value)}
            />

            {/* DATE PICKER */}
            <View style={{ marginTop: 5 }}>
              {/* PICKUP DATE */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  height: 50,
                  padding: 10,
                  paddingHorizontal: 20,
                  fontSize: 16,
                  fontFamily: "PoppinsRegular",
                  borderColor: "#C9C9C9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                }}
                onPress={() => setDatePicker(true)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon name="today" size={20} color="#181818" />
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      marginHorizontal: 5,
                      marginTop: 2,
                      color: "#181818",
                    }}
                  >
                    {date ? date : "Date"}
                  </Text>
                </View>
                {datePicker && (
                  <RNDateTimePicker
                    mode="date"
                    display="default"
                    value={new Date(`${year}`, `${month}`, `${day}`)}
                    onChange={(event, value) => {
                      console.log(value.toDateString());
                      setDate(value.toDateString());
                      setDatePicker(false);
                    }}
                    minimumDate={new Date(`${year}`, `${month}`, `${day}`)}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* PICKUP TIME */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                fontFamily: "PoppinsRegular",
                borderColor: "#C9C9C9",
                borderWidth: 0.5,
                borderRadius: 10,
              }}
              onPress={() => setTimePicker(true)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="schedule" size={20} color="#181818" />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                    marginTop: 2,
                    color: "#181818",
                  }}
                >
                  {time ? time : "Time"}
                </Text>
              </View>
              {timePicker && (
                <RNDateTimePicker
                  mode="time"
                  display="clock"
                  is24Hour={false}
                  value={new Date(`${year}`, `${month}`, `${day}`)}
                  onChange={(event, value) => {
                    if (value?.toTimeString() !== `00:00:00 GMT+0100`) {
                      setTime(`${value.toTimeString()}`);
                      setTimePicker(false);
                    }
                    console.log("TIME:", `${value.toTimeString()}`);
                  }}
                />
              )}
            </TouchableOpacity>

            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity
                value=""
                style={{
                  height: 50,
                  padding: 10,
                  fontSize: 16,
                  fontFamily: "PoppinsRegular",
                  backgroundColor: COLORS.shuttlelaneYellow,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignContent: "center",
                }}
                onPress={priorityPassNextStep}
              >
                <Text
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontFamily: "PoppinsRegular",
                    color: COLORS.white,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Book Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MAPS HERE */}
      {isMapLoading && (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size={48} />
          <Text style={{ fontSize: 24, color: "#C1C1C1", textAlign: "center" }}>
            Fetching your location
          </Text>
        </View>
      )}
      {/* {!isMapLoading && (
        <MapView
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          region={mapRegion}
          provider="google"
        >
          <Marker coordinate={mapRegion} title="Marker" />
        </MapView>
      )} */}
    </ScrollView>
  );
};

export default PriorityPass;
