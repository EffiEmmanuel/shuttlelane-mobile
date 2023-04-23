import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
      //   "https://www.shuttlelane.com/api/users/signin",
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

    // const airports = data.data

    // let formattedAirports = []

    // airports.forEach(airport => {
    //   formattedAirports.push({
    //     key: airport?._id,
    //     value: airport?.name,
    //   })
    // })

    // setAirports(formattedAirports)
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
    } else if (user?.currency === "euro") {
      newAmount = amount / euroRate;
      return newAmount;
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

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, display: "relative" }}
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
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {airportDetails?.airportName}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text style={{ fontFamily: "PoppinsRegular" }}>
                  {dropoffAddress ? dropoffAddress : pickupAddress}
                </Text>
              </View>
            </View>

            {/* CARS */}
            <View style={{ marginTop: 20, paddingBottom: 80 }}>
              {airportDetails?.cars.map((vehicle) => {
                const prePrice = makeConversion(Number(vehicle?.rate));
                const price = Intl.NumberFormat("en-US", {
                }).format(prePrice);

                console.log("CAR:", vehicle);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCarPicked(`${vehicle?.name}`);

                      if (carPicked === `${vehicle?.name}`) {
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
                          },
                        });
                      }

                      showToastMessage(
                        "Tap again to confirm selection",
                        "info"
                      );
                    }}
                    key={vehicle?._id}
                    style={{
                      borderRadius: 10,
                      borderWidth: 0.5,
                      borderColor: "#C9C9C9",
                      height: 160,
                      padding: 20,
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
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
                          <Text style={{ fontFamily: "PoppinsRegular" }}>
                            {vehicle?.capacity ?? 4}
                          </Text>
                        </View>
                        {/* LUGGAGE */}
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Icon name="luggage" size={20} color="#000" />
                          {/* <Image
                          source={luggageIcon}
                          resizeMode="cover"
                          style={{ width: 38, height: 38 }}
                        /> */}
                          <Text style={{ fontFamily: "PoppinsRegular" }}>
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
                          fontSize: 32,
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
