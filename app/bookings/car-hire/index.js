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
import axios from "axios";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const CarHire = () => {
  const router = useRouter();

  // FETCH AIRPORTS
  const fetchAirports = async () => {
    const response = await getRequest("/airports", null, null);
  };

  // FORM SETUP
  const [pickupAddress, setPickupAddress] = useState(false);

  // DAYS SETUP
  const [days, setDays] = useState("");

  // SELECT SETUP
  const [carPicked, setCarPicked] = useState("");

  // ARRIVAL DATE SETUP
  const currentDate = new Date();
  const [date, setDate] = useState();
  const shuttleDate = new Date();
  // DATE SETUP
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();

  // DATE STATES
  const [datePicker, setDatePicker] = useState(false);

  // const cars = [
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  //   {
  //     key: 350000,
  //     value: "Mercedes Benz G Wagon",
  //   },
  // ];

  // MAP SETUP
  // const [mapRegion, setMapRegion] = useState();
  const [dropoffAddress, setDropoffAddress] = useState("");

  // LOADER
  const [isLoading, setIsLoading] = useState(false);
  // const [isMapLoading, setIsMapLoading] = useState(false);

  // User Location
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

  //   setMapRegion({
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude,
  //     latitudeDelta: 0.0922,
  //     longitudeDelta: 0.0421,
  //   });

  //   setIsMapLoading(false);
  // };

  // Fetch Exchange rates
  const [rates, setRates] = useState();
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  // FUNCTION
  async function fetchExchangeRates() {
    setIsRatesLoading(true);
    await axios
      .get(`https://www.shuttlelane.com/api/rates`)
      .then((res) => {
        const exchangeRates = res.data.data[0];
        setRates(res.data.data[0]);
        console.log("res:", res.data.data[0]?.dollar);
        setIsRatesLoading(false);
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

  // CARS SETUP
  const [cars, setCars] = useState();
  const [isCarsLoading, setIsCarsLoading] = useState(false);
  async function fetchCars() {
    setIsCarsLoading(true);
    await axios
      .get("https://www.shuttlelane.com/api/cars")
      .then((res) => {
        console.log("CARS:", res.data);
        let carFormat = [];
        let carArray = res.data.data;
        carArray.forEach(async (car) => {
          console.log("CAR RATE:", car?.rate);
          const prePrice = await makeConversion(Number(car?.rate));
          console.log("PREPRICE::", prePrice);
          const price = Intl.NumberFormat("en-US", {}).format(prePrice);
          console.log("PRICE::", price);
          carFormat.push({
            key: car?.name,
            value: car?.name,
            price: price,
          });
        });
        console.log("CAR FORMAT::", carFormat);
        setCars(carFormat);
        setIsCarsLoading(false);
      })
      .catch((err) => {
        console.log("CARS ERROR:", err);
        console.log("ALL CARS:", cars);
      });
  }

  // USER DATA
  const [user, setUser] = useState();
  // GUEST DATA
  const [guest, setGuest] = useState();
  async function fetchUserData() {
    // const user = ;
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    const parsedGuest = JSON.parse(await AsyncStorage.getItem("isGuest"));
    setUser(parsedUser);
    setGuest(parsedGuest);
  }

  useEffect(() => {
    fetchExchangeRates();
    fetchUserData();
    // userLocation();
  }, []);

  useEffect(() => {
    // if (rates) {
    fetchCars();
    // }
  }, [rates]);

  // CAR DATE SETUP
  const [isCarDate, setIsCarDate] = useState();

  // ON FORM SUBMIT - PICKUP
  async function carHireNextStep() {
    if (!pickupAddress || !carPicked || !date || !days) {
      alert("Please fill in the missing fields to proceed");
      return;
    }

    const prePrice = cars.filter((car) => car?.value === carPicked)[0].price;

    console.log("PP:", prePrice);

    const totalPrice = prePrice?.includes(",")
      ? Number(`${prePrice.split(",")[0]}${prePrice.split(",")[1]}`)
      : Number(prePrice);
    console.log("TP:", totalPrice);

    const finalPrice = totalPrice * Number(days);
    console.log("fP:", finalPrice);

    if (guest) {
      router.push({
        pathname: "/bookings/user-details",
        params: {
          bookingType: "Car Hire",
          pickupAddress,
          carPicked: carPicked,
          date,
          days,
          total: finalPrice,
        },
      });
    } else {
      router.push({
        pathname: "/bookings/booking-summary",
        params: {
          bookingType: "Car Hire",
          pickupAddress,
          carPicked: carPicked,
          date,
          days,
          total: finalPrice,
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
          headerTitle: () => (
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                marginTop: 3,
                fontSize: Platform.OS === "ios" ? 14 : 11,
              }}
            >
              Car Hire
            </Text>
          ),
        }}
      />

      {(isRatesLoading || isCarsLoading) && <ActivityIndicator size={36} />}

      {/* FORM HERE */}
      {!isLoading && !isCarsLoading && !isRatesLoading && (
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
          {/* AIRPORT PICKUP FORM */}

          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Icon name="home" size={20} color="#181818" />
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                  marginHorizontal: 5,
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
                fontSize: Platform.OS === "ios" ? 16 : 12,
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
              <View style={{ flexDirection: "row" }}>
                <Icon name="directions-car" size={20} color="#181818" />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                    color: "#181818",
                  }}
                >
                  Car
                </Text>
              </View>
              <SelectList
                setSelected={(value) => {
                  console.log(value);
                  setCarPicked(value);
                }}
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
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                dropdownStyles={{
                  borderRadius: 10,
                  borderWidth: 0.5,
                  maxHeight: 150,
                  borderColor: "#C9C9C9",
                  padding: 10,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                inputStyles={{
                  fontFamily: "PoppinsRegular",
                  color: "#C9C9C9",
                  marginTop: 4,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                dropdownTextStyles={{
                  fontFamily: "PoppinsRegular",
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
                placeholder="Select Car"
                searchPlaceholder="Search cars"
              />
            </View>

            {/* DAYS */}
            <View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Icon name="today" size={20} color="#181818" />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    marginHorizontal: 5,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                    color: "#181818",
                  }}
                >
                  Days
                </Text>
              </View>

              <TextInput
                value={days}
                style={{
                  height: 50,
                  padding: 10,
                  paddingHorizontal: 20,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                  fontFamily: "PoppinsRegular",
                  borderColor: "#C9C9C9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  // width: "48%",
                }}
                keyboardType="number-pad"
                placeholder="Days"
                placeholderTextColor="#C9C9C9"
                onChangeText={(value) => setDays(value)}
              />
            </View>

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
                onPress={() => setIsCarDate(true)}
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
                      fontSize: Platform.OS === "ios" ? 16 : 12,
                    }}
                  >
                    {date ? date : "Date"}
                  </Text>
                </View>
                {isCarDate && (
                  <RNDateTimePicker
                    mode="date"
                    display="calendar"
                    value={new Date(`${year}`, `${month}`, `${day}`)}
                    onChange={(event, value) => {
                      console.log(value.toDateString());
                      if (
                        value != `${new Date(`${year}`, `${month}`, `${day}`)}`
                      ) {
                        setDate(value.toDateString());
                      }
                      setIsCarDate(false);
                    }}
                    minimumDate={new Date(`${year}`, `${month}`, `${day}`)}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* NEXT BUTTON */}
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
        </View>
      )}

      {/* MAPS HERE */}
      {/* {isMapLoading && (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size={48} />
          <Text style={{ fontSize: Platform.OS === "ios" ? 16 : 12, color: "#C1C1C1", textAlign: "center" }}>
            Fetching your location
          </Text>
        </View>
      )} */}
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

export default CarHire;
