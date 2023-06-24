import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../constants/themes";
import { SelectList } from "react-native-dropdown-select-list";
import arrowDownIcon from "../../assets/icons/arrowDownIcon.png";
import closeIcon from "../../assets/icons/closeIcon.png";
import ToastMessage from "../../components/ToastMessage";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated from "react-native-reanimated";
import { Dimensions } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Platform } from "react-native";
// import { Image } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const EditProfileForm = () => {
  // USER DATA
  const [user, setUser] = useState();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [userId, setUserId] = useState(user?._id);
  const [mobile, setMobile] = useState(user?.mobile);
  const [currency, setCurrency] = useState(user?.currency);
  const [userImage, setUserImage] = useState(user?.userImage);
  // COUNTRY CODES CONFIG
  const [isCountryCodesPickerVisible, setIsCountryCodesPickerVisible] =
    useState(false);
  const [countryCode, setCountryCode] = useState(user?.countryCode);

  // TRACK DATA UPDATE
  const [dataUpdated, setDataUpdated] = useState(false);

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

  // const { isLoading, isToasting, toastMessage, toastType, editUserDetails } =
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

  //   FETCH USER DATA
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    console.log('PARSED USER:', parsedUser);
    setUser(parsedUser);
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  // SIGN UP FUNCTION
  async function editUserDetails() {
    setIsLoading(true);

    let imageUrl;
    if (userImage) {
      // UPLOAD IMAGE TO CLOUDINARY
      const formData = new FormData();

      let type;
      if (userImage?.includes(".jpeg")) {
        type = "image/jpeg";
        type = "image/jpeg";
      } else if (userImage?.includes(".jpg")) {
        type = "image/jpg";
      } else if (userImage?.includes(".heic")) {
        type = "image/heic";
      } else if (userImage?.includes(".png")) {
        type = "image/png";
      } else {
        Alert.alert(
          "Attention!",
          "Invalid image file selected. Images must be in the format (.png, .jpeg, .jpg, .heic)"
        );
        setUserImage("");
        return;
      }

      formData.append("file", {
        uri: userImage,
        type: type,
        name: `${user?.name}-profile-picture.${type?.split("/")[1]}`,
      });
      formData.append("upload_preset", "shuttlelane-mobile");

      console.log(formData);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/shuttlelane/image/upload`,
        // "http://172.20.10.6:3001/api/users",
        {
          method: "POST",
          body: formData,
        }
      );

      const imageUpload = await response.json();
      console.log("UPDATED:", imageUpload);

      if (imageUpload?.secure_url) {
        imageUrl = imageUpload?.secure_url;
      }
    }

    console.log(user);
    const response = await fetch(
      `https://www.shuttlelane.com/api/users/update?emailAddress=${email}`,
      // "http://172.20.10.6:3001/api/users",
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name ? `${name}` : user?.name,
          email: email ? email : user?.email,
          mobile: mobile ? mobile : user?.mobile,
          countryCode: countryCode ? countryCode : user?.countryCode,
          currency: currency ? currency : user?.currency,
          image: imageUrl ? imageUrl : user?.image,
        }),
      }
    );
    const user = await response.json();
    console.log("UPDATED:", user);
    if (user?.error) {
      setIsLoading(false);
      return showToastMessage(user?.error, "error");
    }

    await AsyncStorage.setItem("user", JSON.stringify(user?.user));
    setIsLoading(false);
    // router.back();
    showToastMessage("Update successful!", "success");
    // setDataUpdated(true)
    setTimeout(() => {
      router.replace({
        pathname: "/dashboard/home",
        params: {
          dataUpdated: true,
          message: "Account updated successfully!",
          type: "success",
        },
      });
    }, 500);
    return;
  }

  // IMAGE PICKER
  // SELECT IMAGE
  const pickImage = async () => {
    console.log("INSIDE PICK IMAGE");
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setUserImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("ERROR::", error);
    }
  };

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setMobile(user?.mobile);
    setCurrency(user?.currency);
    setCountryCode(user?.countryCode)
    setUserId(user?._id);
  }, [user]);

  return (
    <>
      {/* TOAST MESSAGE */}
      {isToasting && (
        <ToastMessage
          type={toastType}
          message={toastMessage}
          style={{
            position: "absolute",
            top: 0,
            zIndex: 100,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            backgroundColor: "rgba(0,0,0,.4)",
            zIndex: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={42} color={COLORS.shuttlelanePurple} />
        </View>
      )}
      <View style={{ padding: 10 }}>
        {/* <Text
          style={{
            fontSize: 24,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
          }}
        >
          Profile
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "PoppinsRegular",
            marginTop: 1,
          }}
        >
          Edit your account details
        </Text> */}

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={pickImage}>
            {/* {!userImage && ( */}
            <Image
              source={{ uri: userImage ? userImage : `${user?.image}` }}
              style={{ width: 150, height: 150, borderRadius: 100 }}
              placeholder={blurhash}
            />
            {/* // )} */}
            {/* // {userImage && ( */}
            {/* <Image
                source={{ uri: userImage }}
                style={{ width: 150, height: 150, borderRadius: 100 }}
              /> */}
            {/* // )} */}
            <Icon
              name="edit"
              size={20}
              color={COLORS.shuttlelanePurple}
              style={{ position: "absolute", top: 0, right: 3 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Full name
            </Text>
            <TextInput
              value={name}
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
              onChangeText={(value) => setName(value)}
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
              placeholder="+23481234567890"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setMobile(value)}
            />
          </View>

          {/* CURRENCY SELECT DROPDOWN */}
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                marginTop: 10,
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Currency - {currency?.toUpperCase()}
            </Text>
            <SelectList
              setSelected={(value) => setCurrency(value)}
              defaultOption={currency}
              data={currencies}
              arrowicon={
                <Image
                  source={arrowDownIcon}
                  style={{ width: 40, height: 40, marginTop: -8 }}
                  contentFit="cover"
                />
              }
              closeicon={
                <Image
                  source={closeIcon}
                  style={{ width: 50, height: 50, marginTop: -1 }}
                  contentFit="cover"
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
              onPress={() => editUserDetails(name, email, mobile, currency)}
            >
              {!isLoading && (
                <Text
                  style={{
                    fontFamily: "PoppinsSemiBold",
                    color: COLORS.white,
                  }}
                >
                  Save
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

export default EditProfileForm;
