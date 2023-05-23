import { Link, useRouter, useSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../constants/themes";
import { SelectList } from "react-native-dropdown-select-list";
import { Image } from "react-native";
import arrowDownIcon from "../../assets/icons/arrowDownIcon.png";
import closeIcon from "../../assets/icons/closeIcon.png";
import ToastMessage from "../../components/ToastMessage";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated from "react-native-reanimated";
import { Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as CountryCodes from "country-codes-list";
import { Platform } from "react-native";

const UserDetailsForm = ({
  bookingType,
  pickupAirport,
  dropoffAddress,
  passengers,
  date,
  time,
  carPicked,
  total,
  flightNumber,
  pickupAddress,
  days,
  service,
  airport,
  pass,
  airline,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [title, setTitle] = useState("");

  const {} = useSearchParams();

  const router = useRouter();

  // ICON CONFIG
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

  // const { isLoading, isToasting, toastMessage, toastType, signupUser } =
  //   useContext(AuthContext);

  // API CONFIG
  const [isLoading, setIsLoading] = useState(false);

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

  const [guest, setGuest] = useState();

  async function nextStep(
    firstName,
    lastName,
    email,
    mobile,
    title,
    countryCode
  ) {
    guest.firstName = firstName;
    guest.lastName = lastName;
    guest.email = email;
    guest.countryCode = countryCode;
    guest.mobile = mobile;
    guest.title = title;
    console.log("GUEST:", guest);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !countryCode ||
      !mobile ||
      !title
    ) {
      Alert.alert(
        "Attention!",
        "Please make sure you fill in all the missing fields"
      );
      return;
    }

    await AsyncStorage.setItem("user", JSON.stringify(guest));
    router.push({
      pathname: "/bookings/summary",
      params: {
        bookingType,
        pickupAirport,
        dropoffAddress,
        passengers,
        date,
        time,
        carPicked,
        total,
        flightNumber,
        pickupAddress,
        days,
        service,
        airport,
        pass,
        airline,
        countryCode,
        email
      },
    });
  }

  useEffect(() => {
    async function getGuestUser() {
      const parsedGuest = JSON.parse(await AsyncStorage.getItem("user"));
      setGuest(parsedGuest);
    }

    getGuestUser();
  }, []);

  // COUNTRY CODES
  const [countryCodes, setCountryCodes] = useState();
  useEffect(() => {
    const countryCodes = CountryCodes.customList(
      "countryCode",
      "[{countryCode}] {countryNameEn}: +{countryCallingCode}"
    );
    let shuttleCountryCodes = [];
    Object.values(countryCodes).map((code) => {
      // console.log("CODE:", code?.split("+")[1]);
      shuttleCountryCodes.push({
        key: `+${code?.split("+")[1]}`,
        value: `${code?.split("] ")[1]}`,
      });
    });
    console.log("ÇOUNTRY CODES::", shuttleCountryCodes);
    setCountryCodes(shuttleCountryCodes);
  }, []);

  // TITLE
  const titles = [
    {
      key: "Mr",
      value: "Mr",
    },
    {
      key: "Mrs",
      value: "Mrs",
    },
    {
      key: "Miss",
      value: "Miss",
    },
    {
      key: "Ms",
      value: "Ms",
    },
    {
      key: "Dr",
      value: "Dr",
    },
  ];

  return (
    <>
      {/* TOAST MESSAGE */}
      {isToasting && (
        <ToastMessage
          type={toastType}
          message={toastMessage}
          style={{
            position: "absolute",
            zIndex: 99,
            bottom: 0,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}
      <View style={{ marginTop: 10, padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
            textAlign: "center",
          }}
        >
          Passenger Details
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "PoppinsRegular",
            marginTop: 5,
            textAlign: "center",
          }}
        ></Text>

        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>Title</Text>
            <SelectList
              setSelected={(value) => setTitle(value)}
              data={titles}
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
                marginTop: 10,
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
                fontSize: Platform.OS === "ios" ? 16 : 14,
              }}
              dropdownTextStyles={{
                fontFamily: "PoppinsRegular",
              }}
              placeholder="Mr / Mrs / Miss / Ms / Dr"
              searchPlaceholder="Serch Title"
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>First name</Text>
            <TextInput
              value={firstName}
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
              }}
              placeholder="John"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setFirstName(value)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>Last name</Text>
            <TextInput
              value={lastName}
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
              }}
              placeholder="Doe"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setLastName(value)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>Email</Text>
            <TextInput
              value={email}
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
              }}
              keyboardType="email-address"
              returnKeyType="done"
              placeholder="abc@example.com"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setEmail(value)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>Phone Number</Text>

            <View>
              <SelectList
                setSelected={(value) => setCountryCode(value)}
                data={countryCodes}
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
                  marginTop: 10,
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
                  fontSize: Platform.OS === "ios" ? 16 : 14,
                }}
                dropdownTextStyles={{
                  fontFamily: "PoppinsRegular",
                }}
                placeholder="+234"
                searchPlaceholder="Search Country Code"
              />
              <TextInput
                value={mobile}
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
                }}
                keyboardType="phone-pad"
                returnKeyType="done"
                placeholder="81234567890"
                placeholderTextColor="#C9C9C9"
                onChangeText={(value) => setMobile(value)}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.shuttlelanePurple,
                borderRadius: 10,
              }}
              onPress={() =>
                nextStep(firstName, lastName, email, mobile, title, countryCode)
              }
            >
              {!isLoading && (
                <Text
                  style={{
                    fontFamily: "PoppinsSemiBold",
                    color: COLORS.white,
                  }}
                >
                  Make Booking
                </Text>
              )}

              {isLoading && (
                <AnimatedIcon name="scatter-plot" size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default UserDetailsForm;
