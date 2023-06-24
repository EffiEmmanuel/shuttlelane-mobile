import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const AirportTransfer = () => {
  const router = useRouter();

  // DATE SETUP
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  // PARAMS
  const { isGuest } = useSearchParams();
  console.log("IS GUEST::::::::", isGuest);

  // FETCH AIRPORTS
  const fetchAirports = async () => {
    const response = await getRequest("/airports", null, null);
    console.log("RESPONSE::::", response);
  };

  const [isLoading, setIsLoading] = useState(false);

  // FORM SETUP
  // RADIO BUTTON
  const [airportDropoff, setAirportDropoff] = useState(false);
  const [airportPickup, setAirportPickup] = useState(true);

  // SELECT SETUP
  const [pickupAirport, setPickupAirport] = useState("");
  const [dropoffAirport, setDropoffAirport] = useState("");

  // ARRIVAL DATE SETUP
  const currentDate = new Date();
  const [date, setDate] = useState();
  // DATE STATES
  const [datePicker, setDatePicker] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [timePickerDropoff, setTimePickerDropoff] = useState(false);
  const [datePickerDropoff, setDatePickerDropoff] = useState(false);

  // PASSENGERS SETUP
  const [passengers, setPassengers] = useState("");
  const [airports, setAirports] = useState([]);

  // MAP SETUP
  // const [mapRegion, setMapRegion] = useState();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [flightNumber, setFlightNumber] = useState("");

  const [time, setTime] = useState("");

  // USER ADDRESS
  const [userAddress, setUserAddress] = useState("");

  // User Location
  // const [isMapLoading, setIsMapLoading] = useState(false);
  // const userLocation = async () => {
  //   setIsMapLoading(true);
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     console.log("Access to location was denied!");
  //   }

  //   const location = await Location.getCurrentPositionAsync({
  //     enableHighAccuracy: true,
  //   });

  //   const address = await Location.reverseGeocodeAsync(location.coords);
  //   console.log(address);
  //   setUserAddress(address);

  //   setMapRegion({
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   });
  //   setIsMapLoading(false);
  // };

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

  useEffect(() => {
    fetchAllAirports();
    // userLocation();
    console.log("ISGUEUST FROM FORM AT:", isGuest);
  }, []);

  // ON FORM SUBMIT - PICKUP
  async function airportPickupNextStep() {
    if (!pickupAirport || !dropoffAddress || !date || !passengers || !time) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    console.log("ISGUESTTTTT STEP O1:", isGuest);
    router.push({
      pathname: "/bookings/airport-transfer/step-2",
      params: {
        pickupAirport,
        dropoffAddress,
        date,
        passengers,
        time,
        flightNumber,
        isGuest,
      },
    });
  }

  // ON FORM SUBMIT - DROPOFF
  async function airportDropoffNextStep() {
    if (!dropoffAirport || !pickupAddress || !date || !passengers || !time) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    router.push({
      pathname: "/bookings/airport-transfer/step-2",
      params: {
        dropoffAirport,
        pickupAddress,
        date,
        passengers,
        time,
        flightNumber,
        isGuest,
      },
    });
  }

  // SET USER DROPOFF ADDRESS
  // useEffect(() => {
  //   if (userAddress) {
  //     const streetNumber =
  //       userAddress[0]?.streetNumber !== null
  //         ? `${userAddress[0]?.streetNumber},`
  //         : null;
  //     const street =
  //       userAddress[0]?.street !== null ? `${userAddress[0]?.street},` : null;
  //     const city =
  //       userAddress[0]?.city !== null ? `${userAddress[0]?.city},` : null;
  //     const region =
  //       userAddress[0]?.region !== null ? `${userAddress[0]?.region},` : null;
  //     const country =
  //       userAddress[0]?.country !== null ? `${userAddress[0]?.country}` : null;
  //     const name =
  //       userAddress[0]?.name !== null ? `${userAddress[0]?.name},` : null;

  //     const address = `${streetNumber !== null ? streetNumber : ""} ${
  //       name !== null ? name : ""
  //     } ${street !== null ? street : ""}  ${city !== null ? city : ""} ${
  //       region !== null ? region : ""
  //     } ${country !== null ? country : ""}`;

  //     console.log(address);
  //     setDropoffAddress(address);
  //   }
  // }, [isMapLoading]);

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
          headerTitle: () => (
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                marginTop: 3,
                fontSize: Platform.OS === "ios" ? 14 : 11,
              }}
            >
              Airport Transfer
            </Text>
          ),
        }}
      />

      {/* FORM HERE */}
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          paddingVertical: 30,
          // position: "fixed",
          top: 0,
        }}
      >
        {!isLoading && (
          <>
            {/* RADIO BUTTONS */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setAirportDropoff(false);
                  setAirportPickup(true);
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {airportPickup && (
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: COLORS.shuttlelaneYellow,
                      }}
                    ></View>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginLeft: 8,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                  }}
                >
                  Airport Pickup
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setAirportPickup(false);
                  setAirportDropoff(true);
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 15,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {airportDropoff && (
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: COLORS.shuttlelaneYellow,
                      }}
                    ></View>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginLeft: 8,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                  }}
                >
                  Airport Dropoff
                </Text>
              </TouchableOpacity>
            </View>

            {/* AIRPORT PICKUP FORM */}
            {airportPickup && (
              <View style={{ marginTop: 20 }}>
                {/* DROPOFF ADDRESS */}
                <View style={{ flexDirection: "row", marginVertical: 20 }}>
                  <Icon name="home" size={20} />
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      marginHorizontal: 5,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                    }}
                  >
                    Dropoff Address
                  </Text>
                </View>
                <TextInput
                  value={dropoffAddress}
                  style={{
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                  placeholder="Dropoff Address"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => setDropoffAddress(value)}
                />

                {/* PICKUP AIRPORT */}
                <View>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Icon name="flight-land" size={20} color="#181818" />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        marginHorizontal: 5,
                        color: "#181818",
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                      }}
                    >
                      Pickup Airport
                    </Text>
                  </View>
                  {/* SELECT DROPDOWN */}
                  <View style={{ marginTop: 10 }}>
                    <SelectList
                      setSelected={(value) => setPickupAirport(value)}
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
                        fontSize: Platform.OS === 'ios' ? 12 : 11,
                      }}
                      dropdownStyles={{
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: "#C9C9C9",
                        padding: 10,
                        fontSize: Platform.OS === 'ios' ? 12 : 11,
                      }}
                      inputStyles={{
                        fontFamily: "PoppinsRegular",
                        color: "#C9C9C9",
                        marginTop: 4,
                        fontSize: Platform.OS === 'ios' ? 12 : 11,
                      }}
                      dropdownTextStyles={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === 'ios' ? 12 : 11,
                      }}
                      placeholder="Select Pickup Airport"
                      searchPlaceholder="Search airports"
                    />
                  </View>
                </View>

                {/* DATE PICKER */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Icon name="people" size={20} color="#181818" />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        marginHorizontal: 5,
                        color: "#181818",
                        fontSize: Platform.OS === "ios" ? 14 : 11,
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
                      fontSize: Platform.OS === 'ios' ? 16 : 12,
                      fontFamily: "PoppinsRegular",
                      borderColor: "#C9C9C9",
                      borderWidth: 0.5,
                      borderRadius: 10,
                      // width: "45%",
                      marginTop: 10,
                    }}
                    keyboardType="number-pad"
                    aria-valuemax={10}
                    aria-valuemin={1}
                    maxLength={2}
                    placeholder="Passengers"
                    placeholderTextColor="#C9C9C9"
                    onChangeText={(value) => setPassengers(+value)}
                  />

                  {/* FLIGHT NUMBER */}
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Icon name="flight-takeoff" size={20} color="#181818" />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        marginHorizontal: 5,
                        color: "#181818",
                        fontSize: Platform.OS === "ios" ? 14 : 11,
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
                      fontSize: Platform.OS === 'ios' ? 16 : 12,
                      fontFamily: "PoppinsRegular",
                      borderColor: "#C9C9C9",
                      borderWidth: 0.5,
                      borderRadius: 10,
                      // width: "45%",
                      marginTop: 10,
                    }}
                    placeholder="Flight Number"
                    placeholderTextColor="#C9C9C9"
                    onChangeText={(value) => setFlightNumber(value)}
                  />
                </View>

                {/* PICKUP DATE */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setDatePicker(true);
                  }}
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
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                        marginHorizontal: 5,
                        marginTop: 2,
                        color: "#181818",
                      }}
                    >
                      {!date ? "Date" : date}
                    </Text>
                  </View>
                  {datePicker && (
                    <RNDateTimePicker
                      mode="date"
                      display="calendar"
                      value={new Date(`${year}`, `${month}`, `${day}`)}
                      onChange={(event, value) => {
                        console.log(value.toDateString());
                        if (
                          value !=
                          `${new Date(`${year}`, `${month}`, `${day}`)}`
                        ) {
                          setDate(value.toDateString());
                        }
                        setDatePicker(false);
                      }}
                      minimumDate={new Date(`${year}`, `${month}`, `${day}`)}
                    />
                  )}
                </TouchableOpacity>

                {/* PICKUP TIME */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
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
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                        marginHorizontal: 5,
                        marginTop: 2,
                        color: "#181818",
                      }}
                    >
                      {!time ? "Time" : time}
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
                    onPress={airportPickupNextStep}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
            )}

            {/* AIRPORT DROPOFF FORM */}
            {airportDropoff && (
              <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Icon name="home" size={20} color="#181818" />
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      marginHorizontal: 5,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                      color: "#181818",
                    }}
                  >
                    Pickup Address
                  </Text>
                </View>
                <TextInput
                  value={pickupAddress}
                  style={{
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === 'ios' ? 16 : 12,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                  placeholder="Pickup Address"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => setPickupAddress(value)}
                />

                {/* SELECT DROPDOWN */}
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Icon name="flight-takeoff" size={20} color="#181818" />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        marginHorizontal: 5,
                        color: "#181818",
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                      }}
                    >
                      Dropoff Airport
                    </Text>
                  </View>
                  <SelectList
                    setSelected={(value) => setDropoffAirport(value)}
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
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                    }}
                    dropdownStyles={{
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: "#C9C9C9",
                      padding: 10,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                    }}
                    inputStyles={{
                      fontFamily: "PoppinsRegular",
                      color: "#C9C9C9",
                      marginTop: 4,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                    }}
                    dropdownTextStyles={{
                      fontFamily: "PoppinsRegular",
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                    }}
                    placeholder="Select Dropoff Airport"
                    searchPlaceholder="Search airports"
                  />
                </View>

                {/* DATE PICKER */}
                <View style={{ marginTop: 10 }}></View>

                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Icon name="people" size={20} color="#181818" />
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      marginHorizontal: 5,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                      color: "#181818",
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
                    fontSize: Platform.OS === 'ios' ? 16 : 12,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                    // width: "45%",
                    marginTop: 10,
                  }}
                  keyboardType="number-pad"
                  placeholder="Passengers"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => {
                    setPassengers(+value);
                  }}
                />

                {/* FLIGHT NUMBER */}
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Icon name="flight-takeoff" size={20} color="#181818" />
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      marginHorizontal: 5,
                      fontSize: Platform.OS === "ios" ? 14 : 11,
                      color: "#181818",
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
                    fontSize: Platform.OS === 'ios' ? 16 : 12,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                    // width: "45%",
                    marginTop: 10,
                  }}
                  placeholder="Flight Number"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => setFlightNumber(value)}
                />
                {/* PICKUP DATE */}
                <TouchableOpacity
                  onPress={() => {
                    setDatePickerDropoff(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
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
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                        marginHorizontal: 5,
                        marginTop: 2,
                        color: "#181818",
                      }}
                    >
                      {date ? date : "Date"}
                    </Text>
                  </View>

                  {datePickerDropoff && (
                    <RNDateTimePicker
                      mode="date"
                      display="calendar"
                      show={false}
                      id="Date-Shuttlelane"
                      value={new Date(`${year}`, `${month}`, `${day}`)}
                      onChange={(event, value) => {
                        console.log(value.toDateString());
                        if (
                          value !=
                          `${new Date(`${year}`, `${month}`, `${day}`)}`
                        ) {
                          setDate(value.toDateString());
                        }
                        // setDate(value.toDateString());
                        setDatePickerDropoff(false);
                      }}
                      minimumDate={new Date(`${year}`, `${month}`, `${day}`)}
                    />
                  )}
                </TouchableOpacity>

                {/* PICKUP TIME */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 20,
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: Platform.OS === "ios" ? 14 : 11,
                    fontFamily: "PoppinsRegular",
                    borderColor: "#C9C9C9",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                  onPress={() => setTimePickerDropoff(true)}
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
                        fontSize: Platform.OS === "ios" ? 14 : 11,
                        marginHorizontal: 5,
                        marginTop: 2,
                        color: "#181818",
                      }}
                    >
                      {time ? time : "Time"}
                    </Text>
                  </View>
                  {timePickerDropoff && (
                    <RNDateTimePicker
                      mode="time"
                      display="clock"
                      id="Time-Shuttlelane"
                      is24Hour={false}
                      show={false}
                      value={new Date(`${year}`, `${month}`, `${day}`)}
                      onChange={(event, value) => {
                        if (value?.toTimeString() !== `00:00:00 GMT+0100`) {
                          setTime(`${value.toTimeString()}`);
                          setTimePickerDropoff(false);
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
                    onPress={airportDropoffNextStep}
                  >
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        // fontSize: 16,
                        fontSize: Platform.OS === "ios" ? 16 : 12,
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
            )}
          </>
        )}

        {isLoading && <ActivityIndicator size={30} />}
      </View>

      {/* MAPS HERE */}
      {/* {isMapLoading && (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size={48} />
          <Text style={{ fontSize: 24, color: "#C1C1C1", textAlign: "center", fontSize: Platform.OS === "ios" ? 16 : 12, }}>
            Fetching your location
          </Text>
        </View>
      )} */}

      {/* MAPS HERE */}
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

export default AirportTransfer;
