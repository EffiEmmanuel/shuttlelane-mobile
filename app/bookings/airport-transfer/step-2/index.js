import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../../constants/themes";
import arrowBackIcon from "../../../../assets/icons/arrowBackIcon.png";
import currentLocationIcon from "../../../../assets/icons/currentLocationIcon.png";
import destinationIcon from "../../../../assets/icons/destinationIcon.png";
import passengerIcon from "../../../../assets/icons/passengerIcon.png";
import luggageIcon from "../../../../assets/icons/luggageIcon.png";

// CARS
import economy from "../../../../assets/images/cars/economy.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ToastMessage from "../../../../components/ToastMessage";

const AirportPickupStepTwo = () => {
  const params = useSearchParams();
  const {
    pickupAirport,
    dropoffAddress,
    date,
    passengers,
    time,
    dropoffAirport,
    pickupAddress,
    flightNumber,
    isGuest,
  } = params;

  // pickup airport
  const [airportDetails, setAirportDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // USER DATA
  const [user, setUser] = useState();
  async function fetchUserData() {
    // const user = ;
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(parsedUser);
  }

  // CAR STATE
  const [carPicked, setCarPicked] = useState("");

  // Fetch Airport
  const fetchAirportDetails = async () => {
    setIsLoading(true);
    const response = await fetch(
      `https://www.shuttlelane.com/api/v1/airports/${
        pickupAirport ? pickupAirport : dropoffAirport
      }`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("AIRPORT DATA:", data);
    setAirportDetails(data.data);
    setIsLoading(false);
  };

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

  const [price, setPrice] = useState(0);

  // Handle Currency Conversion
  function makeConversion(amount) {
    const dollarRate = Number(rates?.dollar);
    const poundRate = Number(rates?.pound);
    const euroRate = Number(rates?.euro);

    console.log("HIIII");
    console.log("USER CURRENCY", user?.currency);

    let newAmount;
    if (user?.currency === "neira") {
      newAmount = amount;
      console.log("NEW AMOUNT:", newAmount);
      return newAmount;
    } else if (user?.currency === "dollars") {
      newAmount = amount / dollarRate;
      console.log("rate$:", dollarRate);
      console.log("NEW AMOUNT:", newAmount);
      return newAmount.toFixed(2);
    } else if (user?.currency === "pounds") {
      newAmount = amount / poundRate;
      console.log("rate GBP:", poundRate);
      console.log("NEW AMOUNT:", newAmount);
      return newAmount.toFixed(2);
    } else if (user?.currency === "euros") {
      newAmount = amount / euroRate;
      console.log("rate $:", euroRate);
      console.log("NEW AMOUNT:", newAmount);
      return newAmount.toFixed(2);
    }
  }

  useEffect(() => {
    fetchAirportDetails();
  }, [pickupAirport]);

  useEffect(() => {
    fetchUserData();
    fetchExchangeRates();
  }, []);

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

  // CAR DETAILS SETUP
  const [isCarDetails, setIsCarDetails] = useState(false);
  const [carDetails, setCarDetails] = useState();
  const showCarDetails = (vehicle) => {
    setCarDetails(vehicle);
    setIsCarDetails(true);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{}}
              onPress={() => {
                router.back();
              }}
            >
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

      {/* CAR DETAILS MODAL */}
      <Modal visible={isCarDetails} animationType="slide" transparent={true}>
        <View
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: "#FFF",
            // paddingVertical: 40,
            paddingTop: 40,
            paddingHorizontal: 20,
          }}
        >
          <ScrollView
            style={{ flex: 1, flexDirection: "column" }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                height: Dimensions.get("screen").height,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    fontSize: Platform.OS === 'ios' ? 20 : 16,
                    color: COLORS.shuttlelanePurple,
                  }}
                >
                  Car Details
                </Text>
                <TouchableOpacity onPress={() => setIsCarDetails(false)}>
                  <Icon name="close" size={25} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: carDetails?.image }}
                  style={{ width: "80%", height: "80%", marginTop: -110 }}
                  resizeMode="contain"
                />
              </View>
              <View style={{ marginTop: -350 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "PoppinsBold",fontSize: Platform.OS === 'ios' ? 24 : 20, }}>
                    {carDetails?.name}
                  </Text>

                  {/* CAR LUGGAGE AND PASSENGER DETAILS */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
                      <Icon name="people" size={18} />
                      <Text
                        style={{
                          fontFamily: "PoppinsRegular",
                          fontSize: Platform.OS === 'ios' ? 18 : 14,
                          marginLeft: 5,
                        }}
                      >
                        {carDetails?.capacity}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
                      <Icon name="luggage" size={18} />
                      <Text
                        style={{
                          fontFamily: "PoppinsRegular",
                          fontSize: Platform.OS === 'ios' ? 18 : 14,
                          marginLeft: 5,
                        }}
                      >
                        {carDetails?.luggage}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontFamily: "PoppinsRegular", fontSize: Platform.OS === 'ios' ? 16 : 12, }}>
                    {carDetails?.name === "Economy" &&
                      "The most economic and popular class suitable for most trips. Promises a smooth and convenient ride. Can accommodate up to 4 passengers and 2 luggages."}

                    {carDetails?.name === "Business" &&
                      "Can accommodate up to 4 passengers and comes with extra space for luggages. It also promises a smooth and convenient ride."}
                    {carDetails?.name === "Executive" &&
                      "A step closer to luxury. Comfort and convenience is guaranteed. Can accommodate up to 4 passengers and 2 luggages."}
                    {carDetails?.name === "Luxury" &&
                      "The most prestigious vehicles in our fleet. It is for those who love luxury and comfort. Takes you on your trip in elegance and style."}
                    {carDetails?.name === "Shuttle" &&
                      "One of the most spacious vehicles in our fleet. It is for those who love to travel in numbers and comfort. Can accommodate up to 10 passengers and 6 luggages. It also promises a smooth and convenient ride."}
                    {carDetails?.name === "Shuttle Extra" &&
                      "The most spacious vehicles in our fleet. It is for those who love to travel in numbers and comfort. Can accommodate up to 10 passengers and 7 luggages. It also promises a smooth and convenient ride."}
                  </Text>
                </View>

                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontFamily: "PoppinsBold",
                      fontSize: Platform.OS === 'ios' ? 20 : 16,
                      color: COLORS.shuttlelanePurple,
                    }}
                  >
                    Also included
                  </Text>

                  <View style={{ marginVertical: 10 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        Free airport meet and greet.
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        Free Porter Service.
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        Free bottled water.
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        Free cancellation up to 24 hours before pick-up.
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        60 minutes waiting time after flight arrival.
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="check" size={28} color="#4BB543" />
                      <Text
                        style={{ fontFamily: "PoppinsRegular", marginLeft: 5, fontSize: Platform.OS === 'ios' ? 12 : 11, }}
                      >
                        Free Trolley.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 20 }}
      >
        {isLoading && <ActivityIndicator size={32} />}
        {!isLoading && (
          <>
            <View
              style={{
                backgroundColor: COLORS.shuttlelaneYellowFaded,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={currentLocationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular", fontSize: Platform.OS === 'ios' ? 12 : 11 }}>
                  {airportDetails?.airportName}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular", maxWidth: "90%", fontSize: Platform.OS === 'ios' ? 12 : 11 }}>
                  {dropoffAddress ? dropoffAddress : pickupAddress}
                </Text>
              </View>
            </View>

            {/* CARS */}
            <View style={{ marginTop: 20, paddingBottom: 80 }}>
              {airportDetails?.cars.map((vehicle) => {
                console.log("VEHICLEEEEEEEEE:::", vehicle);
                const prePrice = makeConversion(Number(vehicle?.rate));
                const price = Intl.NumberFormat("en-US", {}).format(prePrice);

                console.log("CAR:", vehicle?.rate);
                console.log("price::", prePrice);
                console.log("price::", price);

                return (
                  <View
                    style={{
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: "#C9C9C9",
                      // height: 160,
                      padding: 20,
                      marginVertical: 10,
                    }}
                    key={vehicle?._id}
                  >
                    <TouchableOpacity
                      onPress={async () => {
                        setCarPicked(`${vehicle?.name}`);

                        const guest = await AsyncStorage.getItem("isGuest");

                        if (carPicked === `${vehicle?.name}`) {
                          if (guest) {
                            console.log("Hiiiii");
                            router.push({
                              pathname: "/bookings/user-details",
                              params: {
                                bookingType: pickupAirport
                                  ? "Airport Pickup"
                                  : "Airport Dropoff",
                                pickupAirport,
                                dropoffAddress,
                                passengers,
                                date,
                                time,
                                carPicked: carPicked,
                                total: price,
                                flightNumber,
                              },
                            });
                          } else {
                            router.push({
                              pathname: "/bookings/summary",
                              params: {
                                bookingType: pickupAirport
                                  ? "Airport Pickup"
                                  : "Airport Dropoff",
                                pickupAirport,
                                dropoffAddress,
                                passengers,
                                date,
                                time,
                                carPicked: carPicked,
                                total: price,
                                flightNumber,
                              },
                            });
                          }
                        }

                        showToastMessage(
                          "Tap again to confirm selection",
                          "info"
                        );
                      }}
                      key={vehicle?._id}
                      style={{}}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{ fontFamily: "PoppinsBold", fontSize: Platform.OS === 'ios' ? 20 : 16}}
                        >
                          {vehicle?.name}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {/* PASSENGERS */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginHorizontal: 8,
                            }}
                          >
                            <Icon name="person" size={20} color="#000" />
                            <Text style={{ fontFamily: "PoppinsRegular", fontSize: Platform.OS === 'ios' ? 16 : 12, }}>
                              {vehicle?.capacity ?? 4}
                            </Text>
                          </View>
                          {/* LUGGAGE */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Icon name="luggage" size={20} color="#000" />
                            {/* <Image
                          source={luggageIcon}
                          resizeMode="cover"
                          style={{ width: 38, height: 38 }}
                        /> */}
                            <Text style={{ fontFamily: "PoppinsRegular", fontSize: Platform.OS === 'ios' ? 16 : 12, }}>
                              {vehicle?.luggage ?? 3}
                            </Text>
                          </View>
                          {/* BOXES */}
                          {/* <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={luggageIcon}
                          resizeMode="cover"
                          style={{ width: 38, height: 38 }}
                        />
                        <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                      </View> */}
                        </View>
                      </View>
                      {/* CAR AND PRICE */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: -10,
                        }}
                      >
                        <Image
                          source={{ uri: vehicle?.image }}
                          resizeMode="contain"
                          style={{ height: 130, width: 130 }}
                        />
                        <Text
                          style={{
                            fontFamily: "PoppinsBold",
                            fontSize: Platform.OS === 'ios' ? 32 : 28,
                            color: COLORS.green,
                          }}
                        >
                          {user?.currency === "dollars"
                            ? "$"
                            : user?.currency === "neira"
                            ? "₦"
                            : user?.currency === "pounds"
                            ? "£"
                            : user?.currency === "euros"
                            ? "€"
                            : "!"}
                          {price}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{}}
                      onPress={() => showCarDetails(vehicle)}
                    >
                      <Text style={{ textDecorationLine: "underline", fontSize: Platform.OS === 'ios' ? 16 : 12 }}>
                        Trip details {">"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AirportPickupStepTwo;
