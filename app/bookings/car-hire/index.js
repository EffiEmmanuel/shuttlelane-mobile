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

const CarHire = () => {
  const router = useRouter();

  // FETCH AIRPORTS
  const fetchAirports = async () => {
    const response = await getRequest("/airports", null, null);
  };

  // FORM SETUP
  const [pickupAddress, setPickupAddress] = useState(false);

  // DAYS SETUP
  const [days, setDays] = useState(0);

  // SELECT SETUP
  const [carPicked, setCarPicked] = useState("");

  // ARRIVAL DATE SETUP
  const currentDate = new Date();
  const [date, setDate] = useState();
  // DATE STATES
  const [datePicker, setDatePicker] = useState(false);

  const cars = [
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
    {
      key: 350000,
      value: "Mercedes Benz G Wagon",
    },
  ];

  // MAP SETUP
  const [mapRegion, setMapRegion] = useState();
  const [dropoffAddress, setDropoffAddress] = useState("");

  // User Location
  const userLocation = async () => {
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
  };

  useEffect(() => {
    userLocation();
  }, []);

  // ON FORM SUBMIT - PICKUP
  async function carHireNextStep() {
    if (!pickupAddress || !carPicked || !date || !days) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    router.push({
      pathname: "/bookings/summary",
      params: {
        bookingType: 'Car Hire',
        pickupAddress,
        carPicked,
        date,
        days,
      },
    });
  }

  // ON FORM SUBMIT - DROPOFF
  async function airportDropoffNextStep() {
    if (!dropoffAirport || !pickupAddress || !date || !passengers) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    router.push({
      pathname: "/bookings/airport-transfer/airport-dropoff/step-2",
      params: {
        dropoffAirport,
        pickupAddress,
        date,
        passengers,
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
          paddingTop: 10,
          paddingBottom: 30,
          position: "fixed",
          top: 0,
        }}
      >
        {/* AIRPORT PICKUP FORM */}

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
          <View style={{ marginTop: 20 }}>
            <SelectList
              setSelected={(value) => setCarPicked(value)}
              data={cars}
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
              placeholder="Select Car"
              searchPlaceholder="Search airports"
            />
          </View>

          {/* DATE PICKER */}
          <View style={{ marginTop: 20 }}>
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

                    <TouchableOpacity onPress={() => setDatePicker(false)}>
                      <Text style={{ fontFamily: "PoppinsRegular" }}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                  width: "48%",
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
                value={days}
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
                keyboardType="number-pad"
                placeholder="Days"
                placeholderTextColor="#C9C9C9"
                onChangeText={(value) => setDays(value)}
              />
            </View>
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
              onPress={carHireNextStep}
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
      {/* MAPS HERE */}
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
    </ScrollView>
  );
};

export default CarHire;
