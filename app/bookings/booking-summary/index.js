import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { COLORS } from "../../../constants/themes";
import { useRouter, useSearchParams } from "expo-router";
import ToastMessage from "../../../components/ToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import PayWithFlutterwave from "flutterwave-react-native";

// ENVIRONMENT VARIABLES
import { STRIPE_PUBLISHABLE_KEY, FLUTTERWAVE_KEY } from "@env";

// Icons
import currentLocationIcon from "../.././../assets/icons/currentLocationIcon.png";
import destinationIcon from "../.././../assets/icons/destinationIcon.png";
import carIcon from "../.././../assets/icons/carIcon.png";
import passengerIcon from "../.././../assets/icons/passengerIcon.png";
import timeIcon from "../.././../assets/icons/timeIcon.png";
import priorityPassIcon from "../.././../assets/icons/priorityPassIcon.png";
import calendarIcon from "../.././../assets/icons/calendarIcon.png";
import arrowDownIcon from "../../../assets/icons/arrowDownIcon.png";
import closeIcon from "../../../assets/icons/closeIcon.png";

// Logos
import paypal from "../.././../assets/images/logos/paypal.png";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import stripeLogo from "../.././../assets/images/logos/stripe.png";
import flutterwave from "../.././../assets/images/logos/flutterwave.png";
import { SelectList } from "react-native-dropdown-select-list";
import { ActivityIndicator } from "react-native";

const BookingSummaryPage = () => {
  const router = useRouter();

  const params = useSearchParams();
  const {
    pickupAirport,
    dropoffAddress,
    date,
    passengers,
    carPicked,
    dropoffAirport,
    pickupAddress,
    bookingType,
    pass,
    time,
    airport,
    service,
    total,
    days,
    flightNumber,
    airline,
    countryCode,
    email,
  } = params;

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  // TOAST CONFIGS
  const [isToasting, setIsToasting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  // PRIORITY PASS SETUP
  const [priorityPasses, setPriorityPasses] = useState();
  const [priorityPassAdded, setPriorityPassAdded] = useState(false);
  const [selectedPass, setSelectedPass] = useState();
  const [numberOfPass, setNumberOfPass] = useState(1);
  // CAR HIRE HANDLER
  const [isCarHireLoading, setIsCarHireLoading] = useState(false);
  // AIRPORT STATE
  const [airportPicked, setAirportPicked] = useState();

  // FUNCTIONALITY
  // USER DATA
  const [user, setUser] = useState();
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    console.log("PU", parsedUser);
    setUser(parsedUser);
  }
  // AIRPORT DATA
  const fetchAirportDetails = async () => {
    setIsLoading(true);
    const response = await fetch(
      //   "https://www.shuttlelane.com/api/users/signin",
      `https://www.shuttlelane.com/api/v1/airports/${
        pickupAirport ?? dropoffAirport ?? airport
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
    setAirportPicked(data.data);
    console.log("AIRPORT PICKED:", data.data);
    setIsLoading(false);
  };
  // GET USER
  useEffect(() => {
    fetchAirportDetails();
    fetchUserData();
  }, []);

  // SET THE TOTAL PRICE
  const [orderTotal, setOrderTotal] = useState(null);
  useEffect(() => {
    if (total) {
      setOrderTotal(total);
    }
  }, [total]);

  // CONVERSION RATES SETUP
  const [rates, setRates] = useState();
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
  useEffect(() => {
    fetchExchangeRates();
  }, [user]);

  // PRIORITY PASSES SETUP
  useEffect(() => {
    console.log("TOTALLLLL::", total);
    // GET PRIORITY PASSES
    async function fetchPrioryPasses() {
      await axios
        .get("https://www.shuttlelane.com/api/priority")
        .then((res) => {
          console.log("PASSESS:", res.data);
          let passes = [];
          res?.data?.data?.forEach((pass) => {
            passes.push({
              key: pass?.rate,
              value: pass?.name,
            });
          });
          console.log("PASSESSSSSSSSSSSSSSSSSSSSS:::", passes);
          setPriorityPasses(passes);
        })
        .catch((err) => {
          console.log("PASSESS ERROR:", err.message);
        });
    }

    fetchPrioryPasses();
  }, []);
  // UPDATE TOTAL SETUP
  useEffect(() => {
    async function updateTotal() {
      console.log("TOTAL:", total);
      console.log("TOTAL:", selectedPass);

      const convertedPriorityPassX = await makeConversion(Number(selectedPass));
      const convertedPriorityPass = (
        convertedPriorityPassX * Number(numberOfPass)
      ).toFixed(2);

      console.log("CONVERTED PPASS:", convertedPriorityPass);

      setOrderTotal(
        Number(
          total?.includes(",")
            ? Number(`${total.split(",")[0]}${total.split(",")[1]}`)
            : Number(total)
        ) + Number(convertedPriorityPass)
      );
      console.log(
        "CONVERTED PP:",
        Number(
          total?.includes(",")
            ? Number(`${total.split(",")[0]}${total.split(",")[1]}`).toFixed(2)
            : Number(total).toFixed(2)
        ) + Number(convertedPriorityPass).toFixed(2)
      );
    }
    updateTotal();
  }, [selectedPass, numberOfPass]);

  // CAR HIRE "MAKE BOOKING" HANDLER
  // CAR HIRE HANDLER
  const carHireHandler = async () => {
    const myUser = JSON.parse(await AsyncStorage.getItem("user"));
    setIsCarHireLoading(true);

    await axios
      .post("https://www.shuttlelane.com/api/booking/car", {
        // .post("http://172.20.10.6:3001/api/booking/car", {
        user: user?._id,
        email: `${email}` ?? `${user?.email}`,
        mobile: user?.mobile,
        amount: total,
        currency: user?.currency,
        carType: carPicked,
        pickupAddress: pickupAddress ?? "",
        date: date,
        days: days,
        firstName: user?.firstName ?? user?.name?.split(" ")[0],
        username: `${user?.firstName ?? user?.name?.split(" ")[0]} ${
          user?.lastName ?? user?.name?.split(" ")[1]
        }`,
        title: `${user?.title}`,
        lastName: user?.lastName ?? user?.name?.split(" ")[1],
        countryCode: countryCode ?? user?.countryCode,
      })
      .then((res) => {
        console.log("RESPO::", res.data);
        if (res.data?.message) {
          showToastMessage(
            "Booking Confirmed, thank you for choosing Shuttlelane.",
            "success"
          );
          setTimeout(() => {
            router.replace("/dashboard/home");
          }, 1500);
          return;
        }
      })
      .catch((err) => {
        console.log("ERROOR::", err);
        showToastMessage(err?.message, "error");
        // showToastMessage('Please check your internet connection and try again.', "error");
      });
    setIsCarHireLoading(false);
  };

  // HELPERS
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
      return newAmount.toFixed(2);
    } else if (user?.currency === "pounds") {
      newAmount = amount / poundRate;
      return newAmount.toFixed(2);
    } else if (user?.currency === "euros") {
      newAmount = amount / euroRate;
      return newAmount.toFixed(2);
    }
  }
  // TOAST MESSAGE FUNCTION
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToasting(true);
    setTimeout(() => {
      setIsToasting(false);
    }, 2500);
  };

  // PAYMENTS
  // PAYPAL PAYMENT
  async function payWithPayPal() {
    router.push({
      pathname: "/bookings/pay-with-paypal",
      params: {
        user,
        total: priorityPassAdded ? orderTotal : total,
        bookingType,
        pickupAirport,
        dropoffAddress,
        date,
        passengers,
        carPicked,
        dropoffAirport,
        pickupAddress,
        pass,
        time,
        airport,
        service,
        days,
        flightNumber: flightNumber ?? "",
        airline: airline ?? "",
        countryCode,
      },
    });
  }

  // STRPE PAYMENT
  const stripe = useStripe();
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  async function payWithStripe() {
    setIsStripeLoading(true);
    console.log(typeof total);
    console.log("TOTAL::", total);
    console.log("ORDER TOTAL::", orderTotal);

    console.log("ISORDERTOTAL:", priorityPassAdded);

    if (bookingType == "Airport Pickup" || bookingType == "Airport Dropoff") {
      await axios
        .post(`https://www.shuttlelane.com/stripe/create-payment-intent`, {
          // .post(`http://172.20.10.6:3001/stripe/create-payment-intent`, {
          email: user?.email,
          amount:
            !priorityPassAdded && total?.includes(",")
              ? Number(`${total.split(",")[0]}${total.split(",")[1]}`)
              : priorityPassAdded
              ? Number(orderTotal)
              : Number(total),
          currency:
            user?.currency === "neira"
              ? "ngn"
              : user?.currency === "dollars"
              ? "usd"
              : user?.currency === "pounds"
              ? "gbp"
              : user?.currency === "euros"
              ? "eur"
              : null,
        })
        .then(async (res) => {
          console.log("USER DATA:", user?.email);
          console.log("STRIPE RESPONSE:", res.data);

          // INITIALIZE STRIPE PAYMENT SHEET HERE
          const initPaymentSheet = await stripe.initPaymentSheet({
            paymentIntentClientSecret: res.data,
            merchantDisplayName: "Shuttlelane",
          });
          // CHECK FOR INIT SHEET ERROR
          if (initPaymentSheet.error) {
            setIsStripeLoading(false);
            return Alert.alert(initPaymentSheet.error.message);
          }
          // PRESENT SHEET
          const presentSheet = await stripe.presentPaymentSheet({
            clientSecret: res.data,
          });
          // CHECK FOR PRESENT SHEET ERROR
          if (presentSheet.error) {
            setIsStripeLoading(false);
            console.log("ERROR::", presentSheet.error);
            if (PaymentSheet.error.code === "Failed") {
              Alert.alert(
                "Error",
                "Please check your internet connection and try again."
              );
              return;
            }
            return Alert.alert(presentSheet.error.message);
          }
          // ELSE SHOW SUCCESS MESSAGE

          // SAVE BOOKING TO THE DATABASE
          setIsStripeLoading(true);

          let response;

          switch (bookingType) {
            case "Airport Pickup" || "Airport Dropoff":
              response = await fetch(
                "https://www.shuttlelane.com/api/booking/airport",
                // "http://172.20.10.6:3001/api/booking/airport",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user: user?._id,
                    email: user?.email,
                    mobile: user?.mobile,
                    amount: total,
                    currency: user?.currency,
                    formType: bookingType,
                    carType: carPicked,
                    pickupAirport: pickupAirport
                      ? airportPicked?.airportName
                      : "",
                    dropoffAddress: dropoffAddress ?? "",
                    isPriorityPass: bookingType === "Priority Pass" ?? false,
                    pickupAddress: pickupAddress ?? "",
                    dropoffAirport: dropoffAirport
                      ? airportPicked?.airportName
                      : "",
                    time: time,
                    pickupDate: date,
                    arrivalDate: date,
                    passengers: passengers,
                    countryCode: countryCode ?? user?.countryCode,
                    firstName: user?.firstName ?? user?.name?.split(" ")[0],
                    lastName: user?.lastName ?? user?.name?.split(" ")[1],
                    username: `${
                      user?.firstName ?? user?.name?.split(" ")[0]
                    } ${user?.lastName ?? user?.name?.split(" ")[1]}`,
                    title: `${user?.title}`,
                    paymentStatus: "Successful",
                    paymentId: res?.data,
                    paymentMethod: "Stripe",
                    flightNumber: flightNumber,
                  }),
                }
              );
              break;
            case "Priority Pass":
              response = await fetch(
                "https://www.shuttlelane.com/api/booking/priority",
                // "http://172.20.10.6:3001/api/booking/airport",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user: user?._id,
                    email: user?.email,
                    mobile: user?.mobile,
                    amount: total,
                    currency: user?.currency,
                    airport,
                    service,
                    time: time,
                    date,
                    passengers: passengers,
                    countryCode: countryCode ?? user?.countryCode,
                    firstName: user?.firstName ?? user?.name?.split(" ")[0],
                    lastName: user?.lastName ?? user?.name?.split(" ")[1],
                    username: `${
                      user?.firstName ?? user?.name?.split(" ")[0]
                    } ${user?.lastName ?? user?.name?.split(" ")[1]}`,
                    title: `${user?.title}`,
                    paymentStatus: "Successful",
                    paymentId: res?.data,
                    paymentMethod: "Stripe",
                    flightNumber,
                    airline,
                  }),
                }
              );
              break;
            default:
              break;
          }

          const booking = await response.json();
          console.log("RESPONSE:", booking);

          showToastMessage("Payment successful!", "success");
          setIsStripeLoading(false);
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);

          showToastMessage("Booking successful!", "success");
        })
        .catch((err) => {
          console.log("STRIPE ERROR:", err);
          setIsStripeLoading(false);
        });
    } else {
      console.log("TTTTTTTT:", total);
      let priorityTotalAdapted;
      if (bookingType == "Priority Pass") {
        // priorityTotalAdapted = total / 100;
      }
      await axios
        .post(`https://www.shuttlelane.com/stripe/create-payment-intent`, {
          // .post(`http://172.20.10.6:3001/stripe/create-payment-intent`, {
          email: user?.email,
          amount: total?.includes(",")
            ? Number(`${total.split(",")[0]}${total.split(",")[1]}`).toFixed(2)
            : Number(total).toFixed(2),
          currency:
            user?.currency === "neira"
              ? "ngn"
              : user?.currency === "dollars"
              ? "usd"
              : user?.currency === "pounds"
              ? "gbp"
              : user?.currency === "euros"
              ? "eur"
              : null,
        })
        .then(async (res) => {
          console.log("USER DATA:", user?.email);
          console.log("STRIPE RESPONSE:", res.data);

          // INITIALIZE STRIPE PAYMENT SHEET HERE
          const initPaymentSheet = await stripe.initPaymentSheet({
            paymentIntentClientSecret: res.data,
            merchantDisplayName: "Shuttlelane",
          });
          // CHECK FOR INIT SHEET ERROR
          if (initPaymentSheet.error) {
            setIsStripeLoading(false);
            return Alert.alert(initPaymentSheet.error.message);
          }
          // PRESENT SHEET
          const presentSheet = await stripe.presentPaymentSheet({
            clientSecret: res.data,
          });
          // CHECK FOR PRESENT SHEET ERROR
          if (presentSheet.error) {
            setIsStripeLoading(false);
            console.log("ERROR::", presentSheet.error);
            if (PaymentSheet.error.code === "Failed") {
              Alert.alert(
                "Error",
                "Please check your internet connection and try again."
              );
              return;
            }
            return Alert.alert(presentSheet.error.message);
          }
          // ELSE SHOW SUCCESS MESSAGE

          // SAVE BOOKING TO THE DATABASE
          setIsStripeLoading(true);

          let response;

          switch (bookingType) {
            case "Airport Pickup" || "Airport Dropoff":
              response = await fetch(
                "https://www.shuttlelane.com/api/booking/airport",
                // "http://172.20.10.6:3001/api/booking/airport",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user: user?._id,
                    email: user?.email,
                    mobile: user?.mobile,
                    amount: total,
                    currency: user?.currency,
                    formType: bookingType,
                    carType: carPicked,
                    pickupAirport: pickupAirport
                      ? airportPicked?.airportName
                      : "",
                    dropoffAddress: dropoffAddress ?? "",
                    isPriorityPass: bookingType === "Priority Pass" ?? false,
                    pickupAddress: pickupAddress ?? "",
                    dropoffAirport: dropoffAirport
                      ? airportPicked?.airportName
                      : "",
                    time: time,
                    pickupDate: date,
                    arrivalDate: date,
                    passengers: passengers,
                    countryCode: countryCode ?? user?.countryCode,
                    firstName: user?.firstName ?? user?.name?.split(" ")[0],
                    lastName: user?.lastName ?? user?.name?.split(" ")[1],
                    username: `${
                      user?.firstName ?? user?.name?.split(" ")[0]
                    } ${user?.lastName ?? user?.name?.split(" ")[1]}`,
                    title: `${user?.title}`,
                    paymentStatus: "Successful",
                    paymentId: res?.data,
                    paymentMethod: "Stripe",
                    flightNumber: flightNumber,
                  }),
                }
              );
              break;
            case "Priority Pass":
              response = await fetch(
                "https://www.shuttlelane.com/api/booking/priority",
                // "http://172.20.10.6:3001/api/booking/airport",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user: user?._id,
                    email: user?.email,
                    mobile: user?.mobile,
                    amount: total,
                    currency: user?.currency,
                    airport,
                    service,
                    time: time,
                    date,
                    passengers: passengers,
                    countryCode: countryCode ?? user?.countryCode,
                    firstName: user?.firstName ?? user?.name?.split(" ")[0],
                    lastName: user?.lastName ?? user?.name?.split(" ")[1],
                    username: `${
                      user?.firstName ?? user?.name?.split(" ")[0]
                    } ${user?.lastName ?? user?.name?.split(" ")[1]}`,
                    title: `${user?.title}`,
                    paymentStatus: "Successful",
                    paymentId: res?.data,
                    paymentMethod: "Stripe",
                    flightNumber,
                    airline,
                  }),
                }
              );
              break;
            default:
              break;
          }

          const booking = await response.json();
          console.log("RESPONSE:", booking);

          showToastMessage("Payment successful!", "success");
          setIsStripeLoading(false);
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);

          showToastMessage("Booking successful!", "success");
        })
        .catch((err) => {
          console.log("STRIPE ERROR:", err);
          setIsStripeLoading(false);
        });
    }
  }

  // FLUTTERWAVE CONFIGS
  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = async (data) => {
    console.log("data", data);
    if (data.status === "cancelled") {
      return showToastMessage("Payment was canceled", "error");
    }

    if (data.status !== "cancelled" && data.status !== "failed") {
      const myUser = JSON.parse(await AsyncStorage.getItem("user"));
      let response;

      switch (bookingType) {
        case "Airport Pickup" || "Airport Dropoff":
          response = await fetch(
            "https://www.shuttlelane.com/api/booking/airport",
            // "http://172.20.10.6:3001/api/booking/airport",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: user?._id,
                email: user?.email,
                mobile: user?.mobile,
                amount: total,
                currency: user?.currency,
                formType: bookingType,
                carType: carPicked,
                pickupAirport: pickupAirport ? airportPicked?.airportName : "",
                dropoffAddress: dropoffAddress ?? "",
                isPriorityPass: bookingType === "Priority Pass" ?? false,
                pickupAddress: pickupAddress ?? "",
                dropoffAirport: dropoffAirport
                  ? airportPicked?.airportName
                  : "",
                time: time,
                pickupDate: date,
                arrivalDate: date,
                passengers: passengers,
                countryCode: countryCode ?? user?.countryCode,
                firstName: user?.firstName ?? user?.name?.split(" ")[0],
                lastName: user?.lastName ?? user?.name?.split(" ")[1],
                username: `${user?.firstName ?? user?.name?.split(" ")[0]} ${
                  user?.lastName ?? user?.name?.split(" ")[1]
                }`,
                title: `${user?.title}`,
                paymentStatus: "Successful",
                paymentId: res?.data,
                paymentMethod: "Flutterwave",
                flightNumber,
                airline,
              }),
            }
          );
          break;
        case "Priority Pass":
          response = await fetch(
            "https://www.shuttlelane.com/api/booking/priority",
            // "http://172.20.10.6:3001/api/booking/airport",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: user?._id,
                email: user?.email,
                mobile: user?.mobile,
                amount: total,
                currency: user?.currency,
                airport,
                service,
                time: time,
                date,
                passengers: passengers,
                paymentStatus: "Successful",
                paymentId: res?.data,
                paymentMethod: "Flutterwave",
                flightNumber,
                airline,
                countryCode: countryCode ?? user?.countryCode,
                firstName: user?.firstName ?? user?.name?.split(" ")[0],
                lastName: user?.lastName ?? user?.name?.split(" ")[1],
                username: `${user?.firstName ?? user?.name?.split(" ")[0]} ${
                  user?.lastName ?? user?.name?.split(" ")[1]
                }`,
                title: `${user?.title}`,
              }),
            }
          );
          break;
        default:
          break;
      }

      const booking = await response.json();
      console.log("RESPONSE:", booking);

      showToastMessage("Payment successful!", "success");
      setIsLoading(false);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);

      showToastMessage("Booking successful!", "success");
    }
  };

  /* An example function to generate a random transaction reference */
  const generateTransactionRef = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ flex: 1 }}>
        {/* TOAST MESSAGE */}
        {isToasting && (
          <ToastMessage
            type={toastType}
            message={toastMessage}
            style={{
              position: "absolute",
              zIndex: 100,
              top: 0,
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
            }}
          />
        )}

        <View style={{ padding: 20 }}>
          {/* STRIPE WRAPPER */}
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 24 : 20,
                fontFamily: "PoppinsBold",
                color: COLORS.shuttlelanePurple,
              }}
            >
              Booking Summary
            </Text>

            {/* BOOKING TYPE */}
            <Text
              style={{
                fontSize: Platform.OS === "ios" ? 16 : 12,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              {bookingType}
            </Text>

            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  //   backgroundColor: COLORS.shuttlelaneYellowFaded,
                  // padding: ,
                  marginVertical: 10,
                  borderRadius: 10,
                }}
              >
                {pickupAirport && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={currentLocationIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {airportPicked?.airportName}
                    </Text>
                  </View>
                )}

                {service && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={passengerIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {service}
                    </Text>
                  </View>
                )}

                {dropoffAddress && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={destinationIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {dropoffAddress}
                    </Text>
                  </View>
                )}

                {pickupAddress && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={currentLocationIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {pickupAddress}
                    </Text>
                  </View>
                )}

                {dropoffAirport && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={destinationIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {airportPicked?.airportName}
                    </Text>
                  </View>
                )}

                {airline && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    {/* <Image
                    source={destinationIcon}
                    resizeMode="cover"
                    style={{ width: 28, height: 28 }}
                  /> */}
                    <Icon
                      name="flight"
                      size={14}
                      style={{ marginRight: 5, marginTop: -5 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {airline}
                    </Text>
                  </View>
                )}

                {flightNumber && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                  >
                    {/* <Image
                    source={destinationIcon}
                    resizeMode="cover"
                    style={{ width: 28, height: 28 }}
                  /> */}
                    <Icon
                      name="flight-takeoff"
                      size={14}
                      style={{ marginRight: 5, marginTop: -5 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {flightNumber}
                    </Text>
                  </View>
                )}

                {airport && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={destinationIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {airportPicked?.airportName}
                    </Text>
                  </View>
                )}

                {passengers && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={passengerIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {passengers}
                    </Text>
                  </View>
                )}

                {pass && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={priorityPassIcon}
                      resizeMode="cover"
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                      }}
                    >
                      {pass}
                    </Text>
                  </View>
                )}

                {carPicked && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={carIcon}
                      resizeMode="cover"
                      style={{ width: 30, height: 30 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {carPicked}
                    </Text>
                  </View>
                )}

                {date && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={calendarIcon}
                      resizeMode="cover"
                      style={{ width: 30, height: 30 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {date}
                    </Text>
                  </View>
                )}

                {time && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={timeIcon}
                      resizeMode="cover"
                      style={{ width: 30, height: 30 }}
                    />
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: Platform.OS === "ios" ? 16 : 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {time}
                    </Text>
                  </View>
                )}
              </View>

              {/* PASS OPTION */}
              <View style={{ marginTop: 10 }}>
                {priorityPassAdded && (
                  <>
                    <SelectList
                      setSelected={(value) => {
                        setSelectedPass(value);
                      }}
                      data={priorityPasses}
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
                      placeholder="Select Pass"
                      searchPlaceholder="Search passes"
                    />
                  </>
                )}
              </View>
              {/* PASS OPTION */}
              <View style={{ marginTop: 10 }}>
                {priorityPassAdded && (
                  <>
                    <SelectList
                      setSelected={(value) => {
                        setNumberOfPass(value);
                      }}
                      data={[
                        {
                          key: "1",
                          value: "1",
                        },
                        {
                          key: "2",
                          value: "2",
                        },
                        {
                          key: "3",
                          value: "3",
                        },
                        {
                          key: "4",
                          value: "4",
                        },
                        {
                          key: "5",
                          value: "5",
                        },
                        {
                          key: "6",
                          value: "6",
                        },
                      ]}
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
                      placeholder="Number of pass"
                      // search={false}
                      searchPlaceholder="Input Number (Max 6)"
                    />
                  </>
                )}
              </View>

              {/* TOTAL */}
              <View
                style={{
                  backgroundColor: COLORS.shuttlelaneYellowFaded,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PoppinsBold",
                      textAlign: "center",
                      fontSize: Platform.OS === "ios" ? 24 : 20,
                      textTransform: "uppercase",
                    }}
                  >
                    TOTAL:
                  </Text>
                  <Text
                    style={{
                      fontFamily: "PoppinsBold",
                      textAlign: "center",
                      fontSize: Platform.OS === "ios" ? 24 : 20,
                      marginHorizontal: 10,
                      textTransform: "uppercase",
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
                    {(!orderTotal || !priorityPassAdded) && (
                      <>
                        {total?.includes(",")
                          ? total
                          : Intl.NumberFormat("en-US", {}).format(total)}
                      </>
                    )}

                    {!isNaN(orderTotal) && priorityPassAdded && (
                      <>{Number(orderTotal)?.toFixed(2)}</>
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {(bookingType == "Airport Pickup" ||
              bookingType == "Airport Dropoff") && (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  borderColor: "#D9D9D9",
                  borderWidth: 0.4,
                  height: 30,
                  flexDirection: "row",
                }}
                onPress={() => {
                  setPriorityPassAdded(!priorityPassAdded);
                }}
              >
                {priorityPassAdded && (
                  <Icon name="check" size={18} color="#4BB543" />
                )}
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  Add Priority Pass
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ marginTop: 20 }}>
              {bookingType !== "Car Hire" && (
                <View
                  style={{
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "column",
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Platform.OS === "ios" ? 18 : 14,
                        fontFamily: "PoppinsSemiBold",
                      }}
                    >
                      Pay with:
                    </Text>

                    {/* PAYMENT OPTIONS */}
                    <View style={{ width: "100%", alignItems: "center" }}>
                      {/* PAYPAL PAYMENT */}
                      {user?.currency !== "neira" && (
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            marginTop: 20,
                            borderColor: "#C9C9C9",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 60,
                            borderRadius: 10,
                          }}
                          onPress={payWithPayPal}
                        >
                          <Image
                            source={paypal}
                            style={{ width: 100, height: 100 }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      )}

                      {/* FLUTTERWAVE PAYMENT */}
                      <PayWithFlutterwave
                        onRedirect={handleOnRedirect}
                        options={{
                          tx_ref: generateTransactionRef(10),
                          authorization: FLUTTERWAVE_KEY,
                          customer: {
                            email: `${user?.email}` ?? `${email}`,
                          },
                          amount:
                            !priorityPassAdded && total?.includes(",")
                              ? Number(
                                  `${total.split(",")[0]}${total.split(",")[1]}`
                                )
                              : priorityPassAdded
                              ? Number(orderTotal)
                              : Number(total),
                          currency:
                            user?.currency === "neira"
                              ? "NGN"
                              : user?.currency === "dollars"
                              ? "USD"
                              : user?.currency === "pounds"
                              ? "GBP"
                              : user?.currency === "euros"
                              ? "EUR"
                              : "NGN",
                          payment_options: "card",
                        }}
                        // customButton={(props) => (
                        //   <TouchableOpacity
                        //     style={{
                        //       borderWidth: 1,
                        //       marginTop: 20,
                        //       borderColor: "#C9C9C9",
                        //       width: "100%",
                        //       alignItems: "center",
                        //       justifyContent: "center",
                        //       height: 60,
                        //       borderRadius: 10,
                        //     }}
                        //     onPress={props.onPress}
                        //     isBusy={props.isInitializing}
                        //     disabled={props.disabled}
                        //   >
                        //     {!props.isInitializing && (
                        //       <Image
                        //         source={flutterwave}
                        //         style={{ width: 110, height: 110 }}
                        //         resizeMode="contain"
                        //       />
                        //     )}
                        //     {props.isInitializing && (
                        //       <ActivityIndicator size={32} />
                        //     )}
                        //   </TouchableOpacity>
                        // )}
                      />

                      {/* STRIPE PAYMENT */}
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          marginTop: 20,
                          borderColor: "#C9C9C9",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 60,
                          borderRadius: 10,
                        }}
                        onPress={payWithStripe}
                      >
                        {!isStripeLoading && (
                          <Image
                            source={stripeLogo}
                            style={{ width: 100, height: 100 }}
                            resizeMode="contain"
                          />
                        )}

                        {isStripeLoading && <ActivityIndicator size={32} />}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {bookingType == "Car Hire" && (
                <TouchableOpacity
                  style={{
                    height: 50,
                    padding: 10,
                    paddingHorizontal: 20,
                    fontSize: 16,
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#000",
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: COLORS.shuttlelanePurple,
                  }}
                  onPress={() => carHireHandler()}
                >
                  <Text
                    style={{
                      fontFamily: "PoppinsRegular",
                      color: "#FFF",
                    }}
                  >
                    {isCarHireLoading ? (
                      <ActivityIndicator size={32} color="#FFF" />
                    ) : (
                      "Make Booking"
                    )}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </StripeProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSummaryPage;
