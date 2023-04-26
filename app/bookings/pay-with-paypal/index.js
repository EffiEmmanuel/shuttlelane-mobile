import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../../constants/themes";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../../../assets/icons/arrowBackIcon.png";
import currentLocationIcon from "../.././../assets/icons/currentLocationIcon.png";
import destinationIcon from "../.././../assets/icons/destinationIcon.png";
import carIcon from "../.././../assets/icons/carIcon.png";
import passengerIcon from "../.././../assets/icons/passengerIcon.png";
import timeIcon from "../.././../assets/icons/timeIcon.png";
import priorityPassIcon from "../.././../assets/icons/priorityPassIcon.png";
import luggageIcon from "../.././../assets/icons/luggageIcon.png";
import calendarIcon from "../.././../assets/icons/calendarIcon.png";
import paypal from "../.././../assets/images/logos/paypal.png";
import flutterwave from "../.././../assets/images/logos/flutterwave.png";
import stripeLogo from "../.././../assets/images/logos/stripe.png";

import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import ToastMessage from "../../../components/ToastMessage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { FLUTTERWAVE_KEY, STRIPE_PUBLISHABLE_KEY, PAYPAL_BEARER } from "@env";
import WebView from "react-native-webview";

const PayWithPayPal = () => {
  const router = useRouter();

  const params = useSearchParams();
  const {
    total,
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
  } = params;

  console.log("PARAMS;", params);
  const [isLoading, setIsLoading] = useState(false);

  // USER DATA
  const [user, setUser] = useState();
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(parsedUser);
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    paypalPayment();
  }, [user]);

  //   PAYPAL PAYMENT
  const [accessToken, setAccessToken] = useState();
  //   PAYPAL LINK
  const [approvalUrl, setApprovalUrl] = useState();
  const [paymentId, setPaymentId] = useState();

  async function paypalPayment() {
    const transactionCurrency =
      user?.currency === "dollars"
        ? "USD"
        : user?.currency === "pounds"
        ? "GBP"
        : "EUR";

    const paymentDetail = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [
        {
          amount: {
            total: `${parseFloat(total).toFixed(2)}`,
            currency: transactionCurrency,
            details: {
              subtotal: `${parseFloat(total).toFixed(2)}`,
              tax: "0.00",
              shipping: "0.00",
              handling_fee: "0.00",
              shipping_discount: "0.00",
              insurance: "0.00",
            },
          },
        },
      ],

      redirect_urls: {
        return_url: "https://google.com",
        cancel_url: "https://google.com",
      },
    };

    axios
      .post(
        "https://api-m.paypal.com/v1/oauth2/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              `Bearer ${PAYPAL_BEARER}`,
          },
        }
      )
      .then((res) => {
        console.log("RESPONSE FROM TOKEN GENERATION:", res.data);
        setAccessToken(res.data.access_token);

        // MAKE API REQUEST FOR ACTUAL PAYMENT LINK
        return axios
          .post(
            "https://api-m.paypal.com/v1/payments/payment",
            JSON.stringify(paymentDetail),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${res.data.access_token}`,
              },
            }
          )
          .then((res) => {
            console.log("payment response::", res.data.links);
            const { id, links } = res.data;
            const approvalUrl = links.find(
              (data) => data.rel == "approval_url"
            );

            setApprovalUrl(approvalUrl.href);
            setPaymentId(id);
          })
          .catch((err) => {
            console.log("payment ERROR response::", err.response.data);
          });
      })
      .catch((err) => {
        console.log("payment ERROR response::", err.message);
      });
  }

  //   PAYPAL NAVIGATION STATE CHANGE
  async function onNavigationStateChange(webViewState) {
    setIsLoading(true);
    console.log("Weview state::", webViewState);
    if (webViewState.url.includes("https://google.com")) {
      setApprovalUrl(null);
      router.back();
    }

    // GET THE PAYER ID AND PAYMENT ID
    const { PayerID, paymentId } = webViewState.url;
    console.log("PAYERID:", PayerID);

    // MAKE API REQUEST TO VALIDATE PAYMENT
    await axios
      .post(
        `https://api-m.paypal.com/v1/payments/payment/${paymentId}/execute`,
        {
          payer_id: PayerID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async (res) => {
        console.log("PAYMENT VALIDATION RESPONSE:", res.data);
        if (res.data.name == "INVALID_RESOURCE_ID") {
          setApprovalUrl(null);
          alert("Payment Failed. Please try again");
          setIsLoading(false);
          return;
        }

        let response;

        switch (bookingType) {
          case "Car Hire":
            response = await fetch(
              "https://www.shuttlelane.com/api/booking/car",
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
                  carType: carPicked,
                  pickupAddress: pickupAddress ?? "",
                  time: time,
                  date: date,
                  days: days,
                  firstName: user?.name?.split(" ")[0],
                  lastName: user?.name?.split(" ")[1],
                }),
              }
            );
            break;
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
                  firstName: user?.name?.split(" ")[0],
                  lastName: user?.name?.split(" ")[1],
                  paymentStatus: "Successful",
                  paymentId: res?.data,
                  paymentMethod: "Stripe",
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
                  firstName: user?.name?.split(" ")[0],
                  lastName: user?.name?.split(" ")[1],
                  paymentStatus: "Successful",
                  paymentId: res?.data,
                  paymentMethod: "Stripe",
                }),
              }
            );
            break;
          default:
            break;
        }

        const booking = await response.json();
        console.log("RESPONSE:", booking);

        Alert.alert("Payment successful!");
        setIsLoading(false);
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);

        Alert.alert("Booking successful!");
      })
      .catch((err) => {
        console.log("PAYMENT VALIDATION ERROR:", err.response.data);
        setIsLoading(false);
      });
  }

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

  return (
    <View style={{ flex: 1 }}>
      {approvalUrl ? (
        <WebView
          style={{ height: "100%", width: "100%", backgroundColor: "red" }}
          source={{ uri: approvalUrl }}
          onNavigationStateChange={onNavigationStateChange}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={true}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Do not go back or refresh page.</Text>
          <ActivityIndicator size={36} />
        </View>
      )}
    </View>
  );
};

export default PayWithPayPal;
