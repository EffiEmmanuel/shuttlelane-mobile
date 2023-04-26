import { Stack, useRouter } from "expo-router";
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

const AirportTransfer = () => {
  const router = useRouter();

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

  // PASSENGERS SETUP
  const [passengers, setPassengers] = useState("");
  const [airports, setAirports] = useState([]);

  // MAP SETUP
  const [mapRegion, setMapRegion] = useState();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [time, setTime] = useState();

  // User Location
  const [isMapLoading, setIsMapLoading] = useState(false);
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
    userLocation();
  }, []);

  // ON FORM SUBMIT - PICKUP
  async function airportPickupNextStep() {
    if (!pickupAirport || !dropoffAddress || !date || !passengers || !time) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    router.push({
      pathname: "/bookings/airport-transfer/step-2",
      params: {
        pickupAirport,
        dropoffAddress,
        date,
        passengers,
        time,
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
      },
    });
  }

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

      {/* FORM HERE */}
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          paddingVertical: 30,
          position: "fixed",
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
                <Text style={{ fontFamily: "PoppinsRegular", marginLeft: 8 }}>
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
                <Text style={{ fontFamily: "PoppinsRegular", marginLeft: 8 }}>
                  Airport Dropoff
                </Text>
              </TouchableOpacity>
            </View>

            {/* AIRPORT PICKUP FORM */}
            {airportPickup && (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  value={dropoffAddress}
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
                  placeholder="Dropoff Address"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => setDropoffAddress(value)}
                />

                <View>
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
                        fontSize: 16,
                      }}
                      dropdownTextStyles={{
                        fontFamily: "PoppinsRegular",
                      }}
                      placeholder="Select Pickup Airport"
                      searchPlaceholder="Search airports"
                    />
                  </View>
                </View>

                {/* DATE PICKER */}
                <View style={{ marginTop: 10 }}>
                  {datePicker && (
                    <Modal
                      animationType="slide"
                      visible={datePicker}
                      transparent={true}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 22,
                        }}
                      >
                        <View
                          style={{
                            margin: 20,
                            backgroundColor: COLORS.white,
                            borderRadius: 20,
                            width: "90%",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            paddingBottom: 20,
                          }}
                        >
                          <DatePicker
                            mode="calendar"
                            selected={date}
                            AirportTransfer
                            onDateChange={(value) => setDate(value)}
                          />

                          <TouchableOpacity
                            onPress={() => setDatePicker(false)}
                          >
                            <Text style={{ fontFamily: "PoppinsRegular" }}>
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      value=""
                      style={{
                        height: 50,
                        padding: 10,
                        fontSize: 16,
                        fontFamily: "PoppinsRegular",
                        borderColor: "#C9C9C9",
                        borderWidth: 0.5,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignContent: "center",
                        width: "45%",
                      }}
                      onPress={() => setDatePicker(true)}
                    >
                      <Text
                        style={{
                          color: "#C9C9C9",
                          paddingHorizontal: 10,
                          fontSize: 16,
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        {date ? date : "Set Pickup date"}
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      value={time}
                      style={{
                        height: 50,
                        padding: 10,
                        paddingHorizontal: 20,
                        fontSize: 16,
                        fontFamily: "PoppinsRegular",
                        borderColor: "#C9C9C9",
                        borderWidth: 0.5,
                        borderRadius: 10,
                        width: "48%",
                      }}
                      placeholder="TIME E.g 7:30AM"
                      placeholderTextColor="#C9C9C9"
                      onChangeText={(value) => setTime(value)}
                    />
                  </View>
                  <TextInput
                    value={passengers}
                    style={{
                      height: 50,
                      padding: 10,
                      paddingHorizontal: 20,
                      fontSize: 16,
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
                </View>

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
            )}

            {/* AIRPORT DROPOFF FORM */}
            {airportDropoff && (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  value={pickupAddress}
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
                  placeholder="Pickup Address"
                  placeholderTextColor="#C9C9C9"
                  onChangeText={(value) => setPickupAddress(value)}
                />

                {/* SELECT DROPDOWN */}
                <View style={{ marginTop: 10 }}>
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
                      fontSize: 16,
                    }}
                    dropdownTextStyles={{
                      fontFamily: "PoppinsRegular",
                    }}
                    placeholder="Select Dropoff Airport"
                    searchPlaceholder="Search airports"
                  />
                </View>

                {/* DATE PICKER */}
                <View style={{ marginTop: 10 }}>
                  {datePicker && (
                    <Modal
                      animationType="slide"
                      visible={datePicker}
                      transparent={true}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 22,
                        }}
                      >
                        <View
                          style={{
                            margin: 20,
                            backgroundColor: COLORS.white,
                            borderRadius: 20,
                            width: "90%",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                            paddingBottom: 20,
                          }}
                        >
                          <DatePicker
                            mode="calendar"
                            selected={date}
                            AirportTransfer
                            onDateChange={(value) => setDate(value)}
                          />

                          <TouchableOpacity
                            onPress={() => setDatePicker(false)}
                          >
                            <Text style={{ fontFamily: "PoppinsRegular" }}>
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      value=""
                      style={{
                        height: 50,
                        padding: 10,
                        fontSize: 16,
                        fontFamily: "PoppinsRegular",
                        borderColor: "#C9C9C9",
                        borderWidth: 0.5,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignContent: "center",
                        width: "45%",
                      }}
                      onPress={() => setDatePicker(true)}
                    >
                      <Text
                        style={{
                          color: "#C9C9C9",
                          paddingHorizontal: 10,
                          fontSize: 16,
                          fontFamily: "PoppinsRegular",
                        }}
                      >
                        {date ? date : "Set Pickup date"}
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      value={time}
                      style={{
                        height: 50,
                        padding: 10,
                        paddingHorizontal: 20,
                        fontSize: 16,
                        fontFamily: "PoppinsRegular",
                        borderColor: "#C9C9C9",
                        borderWidth: 0.5,
                        borderRadius: 10,
                        width: "48%",
                      }}
                      placeholder="TIME E.g 7:30AM"
                      placeholderTextColor="#C9C9C9"
                      onChangeText={(value) => setTime(value)}
                    />
                  </View>
                </View>

                <TextInput
                  value={passengers}
                  style={{
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: 16,
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
                  onChangeText={(value) => setPassengers(+value)}
                />

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
            )}
          </>
        )}

        {isLoading && <ActivityIndicator size={30} />}
      </View>

      {/* MAPS HERE */}
      {isMapLoading && (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size={48} />
          <Text style={{ fontSize: 24, color: "#C1C1C1", textAlign: "center" }}>
            Fetching your location
          </Text>
        </View>
      )}

      {/* MAPS HERE */}
      {!isMapLoading && (
        <MapView
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          region={mapRegion}
        >
          <Marker coordinate={mapRegion} title="Marker" />
        </MapView>
      )}
    </ScrollView>
  );
};

export default AirportTransfer;
