import { Link, useRouter } from "expo-router";
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
import { Platform } from "react-native";

import { CountryPicker } from "react-native-country-codes-picker";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [currency, setCurrency] = useState("");
  const [image, setImage] = useState();

  const router = useRouter();

  const currencies = [
    {
      key: "neira",
      value: "₦ - Naira",
    },
    {
      key: "pounds",
      value: "£ - Pounds",
    },
    {
      key: "dollars",
      value: "$ - Dollars",
    },
    {
      key: "euros",
      value: "€ - Euro",
    },
  ];

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

  // SELECT IMAGE
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // SIGN UP FUNCTION
  async function signupUser() {
    setIsLoading(true);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !countryCode ||
      !password ||
      !currency ||
      !image
    ) {
      Alert.alert("Attention", "Please fill in the missing fields.");
      return;
    }

    if (password?.length < 8) {
      Alert.alert(
        "Attention",
        "Please use a stronger password. Passwords must be grater than 8 characters."
      );
      return;
    }
    // UPLOAD IMAGE TO CLOUDINARY
    const formData = new FormData();

    let type;
    if (image?.includes(".jpeg")) {
      type = "image/jpeg";
      type = "image/jpeg";
    } else if (image?.includes(".jpg")) {
      type = "image/jpg";
    } else if (image?.includes(".heic")) {
      type = "image/heic";
    } else if (image?.includes(".png")) {
      type = "image/png";
    } else {
      Alert.alert(
        "Attention!",
        "Invalid image file selected. Images must be in the format (.png, .jpeg, .jpg, .heic)"
      );
      setImage("");
      return;
    }

    formData.append("file", {
      uri: image,
      type: type,
      name: `${firstName}-profile-picture.${type?.split("/")[1]}`,
    });
    formData.append("upload_preset", "shuttlelane-mobile");

    console.log(formData);

    setIsLoading(true);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/shuttlelane/image/upload`,
      // "http://172.20.10.6:3001/api/users",
      {
        method: "POST",
        // headers: {
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        // },
        body: formData,
      }
    );

    const imageUpload = await response.json();
    console.log("UPDATED:", imageUpload);

    if (imageUpload?.secure_url) {
      const imageUrl = imageUpload?.secure_url;
      const response = await fetch(
        "https://www.shuttlelane.com/api/users",
        // "http://w.10.6:3001/api/users",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email: email,
            mobile: mobile,
            countryCode: countryCode,
            password: password,
            currency: currency,
            image: imageUrl,
          }),
        }
      );
      const user = await response.json();
      console.log("USER::", user);
      if (user?.error) {
        setIsLoading(false);
        return showToastMessage(user?.error, "error");
      }

      showToastMessage("Account created successfully!", "success");
      setIsLoading(false);
      setTimeout(() => {
        router.replace("login");
      }, 1500);
      return;
    }
  }

  // COUNTRY CODES
  const [countryCode, setCountryCode] = useState("");
  const [isCountryCodesPickerVisible, setIsCountryCodesPickerVisible] =
    useState(false);

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
      <View style={{ marginTop: 20, padding: 20 }}>
        <Text
          style={{
            fontSize: Platform.OS === "ios" ? 24 : 20,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
            textAlign: "center",
          }}
        >
          Create an account
        </Text>
        <Text
          style={{
            fontSize: Platform.OS === "ios" ? 16 : 12,
            fontFamily: "PoppinsRegular",
            marginTop: 5,
            textAlign: "center",
          }}
        >
          Sign up for an account with us today!
        </Text>

        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              First name
            </Text>
            <TextInput
              value={firstName}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
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
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Last name
            </Text>
            <TextInput
              value={lastName}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
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
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
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
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Phone Number
            </Text>

            <View>
              <TouchableOpacity
                onPress={() => setIsCountryCodesPickerVisible(true)}
                style={{
                  height: 50,
                  padding: 10,
                  paddingHorizontal: 20,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                  marginTop: 10,
                  fontFamily: "PoppinsRegular",
                  borderColor: "#C9C9C9",
                  borderWidth: 0.5,
                  borderRadius: 10,
                }}
              >
                {countryCode ? (
                  <Text
                    style={{
                      color: "black",
                      fontSize: Platform.OS === "ios" ? 16 : 12,
                      fontFamily: "PoppinsRegular",
                    }}
                  >
                    {countryCode}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: "#C9C9C9",
                      fontSize: Platform.OS === "ios" ? 16 : 12,
                      fontFamily: "PoppinsRegular",
                    }}
                  >
                    Select Country Code
                  </Text>
                )}
              </TouchableOpacity>
              {/* For showing picker just put show state to show prop */}
              <CountryPicker
                show={isCountryCodesPickerVisible}
                // when picker button press you will get the country object with dial code
                pickerButtonOnPress={(item) => {
                  setCountryCode(item.dial_code);
                  setIsCountryCodesPickerVisible(false);
                }}
              />

              <TextInput
                value={mobile}
                style={{
                  height: 50,
                  padding: 10,
                  paddingHorizontal: 20,
                  fontSize: Platform.OS === "ios" ? 16 : 12,
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
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
                marginTop: 10,
                fontFamily: "PoppinsRegular",
                borderColor: "#C9C9C9",
                borderWidth: 0.5,
                borderRadius: 10,
              }}
              secureTextEntry={true}
              returnKeyType="done"
              placeholder="********"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          {/* SERVICE SELECT DROPDOWN */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                marginTop: 10,
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Currency
            </Text>
            <SelectList
              setSelected={(value) => setCurrency(value)}
              data={currencies}
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
              placeholder="Select Currency"
              searchPlaceholder="Search Currencies"
            />
          </View>

          {/* SELECT IMAGE */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Profile Picture
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 10,
              }}
              onPress={pickImage}
            >
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "#000",
                  fontSize: Platform.OS === "ios" ? 16 : 12,
                }}
              >
                {image ? "Selected" : "Profile Picture"}
              </Text>
            </TouchableOpacity>

            {image && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150, borderRadius: 500 }}
                />
              </View>
            )}
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: Platform.OS === "ios" ? 16 : 12,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.shuttlelanePurple,
                borderRadius: 10,
              }}
              onPress={() =>
                signupUser(
                  firstName,
                  lastName,
                  email,
                  mobile,
                  password,
                  currency
                )
              }
            >
              {!isLoading && (
                <Text
                  style={{
                    fontFamily: "PoppinsSemiBold",
                    color: COLORS.white,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  Create account
                </Text>
              )}

              {isLoading && (
                <AnimatedIcon name="scatter-plot" size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 20,
              // flexDirection: "row",
              // justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: Platform.OS === "ios" ? 16 : 12 }}>
              Already have an account?{" "}
              <Link style={{ color: COLORS.shuttlelanePurple }} href="/login">
                Log in
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default SignupForm;
