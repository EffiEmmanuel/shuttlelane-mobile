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

const PriorityPass = () => {
  const router = useRouter();

  // FETCH AIRPORTS
  const fetchAirports = async () => {
    const response = await getRequest("/airports", null, null);
  };

  // FORM SETUP
  const [service, setService] = useState("");
  const [airport, setAirport] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pass, setPass] = useState("");
  const [passengers, setPassengers] = useState(0);
  const [time, setTime] = useState('');

  // ARRIVAL DATE SETUP
  const [date, setDate] = useState();
  // DATE STATES
  const [datePicker, setDatePicker] = useState(false);

  const airports = [
    {
      key: "Murtala Mohammed International Airport",
      value: "Murtala Mohammed International Airport",
    },
    {
      key: "Murtala Mohammed Domestic Airport",
      value: "Murtala Mohammed Domestic Airport",
    },
  ];

  const passTypes = [
    {
      key: "Standard Pass",
      value: "Standard Pass",
    },
    {
      key: "Premium Pass",
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

  // MAP SETUP
  const [mapRegion, setMapRegion] = useState();

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

  // ON FORM SUBMIT - PRIORITY PASS
  async function priorityPassNextStep() {
    if (!service || !passengers || !airport || !date || !pass || !time) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    router.push({
      pathname: "/bookings/summary",
      params: {
        bookingType: "Priority Pass",
        service,
        passengers,
        airport,
        date,
        pass,
        time
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

        <View style={{}}>
          {/* SERVICE SELECT DROPDOWN */}
          <View style={{ marginTop: 10 }}>
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
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              value={passengers}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 10,
                fontFamily: "PoppinsRegular",
                borderColor: "#C9C9C9",
                borderWidth: 0.5,
                borderRadius: 10,
                width: "47%",
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="Passengers"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setPassengers(value)}
            />

            <TouchableOpacity
              value=""
              style={{
                height: 50,
                padding: 10,
                fontSize: 16,
                marginTop: 10,
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
              {/* PASS SELECT DROPDOWN */}
              <View style={{ width: "47%" }}>
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
                placeholder="TIME: Eg. 12:30PM"
                maxLength={7}
                placeholderTextColor="#C9C9C9"
                onChangeText={(value) => setTime(value)}
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

export default PriorityPass;
