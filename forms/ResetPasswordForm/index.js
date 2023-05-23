import { Link, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { postRequest } from "../../network/apiClient";
import ToastMessage from "../../components/ToastMessage";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { COLORS } from "../../constants/themes";
import { AuthContext } from "../../context/AuthContext";

const ResetPasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ICON CONFIG
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

  // const { isLoading, isToasting, toastMessage, toastType, loginUser } =
  //   useContext(AuthContext);

  const router = useRouter();

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

  // USER DATA
  const [userData, setUserData] = useState();
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    setUserData(parsedUser);
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  // FORGOT PASSWORD HANDLER FUNCTION
  async function forgotPasswordHandler() {
    console.log("oldPassword", oldPassword);
    if (!oldPassword || !newPassword) {
      return showToastMessage("Please fill in the missing fields.", "error");
    }
    console.log(userData)
    setIsLoading(true);
    const response = await fetch(
      `https://www.shuttlelane.com/api/users/${userData?._id}/reset-password`,
      // "http://172.20.10.6:3001/api/users/signin",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      }
    ).catch((err) => {
      setIsLoading(false);
      return showToastMessage(
        "Please check your internet connection and try again",
        "error"
      );
    });
    const user = await response.json();
    console.log("RESPONSE:", user);
    setIsLoading(false);
    if (user?.error) {
      return showToastMessage(user?.error, "error");
    }

    showToastMessage(`Your password has been successfully reset!`, "success");
    setOldPassword("");
    setNewPassword("");
    return;
  }

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
            zIndex: 90,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}
      <View style={{ padding: 10 }}>
      <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: COLORS.shuttlelanePurple,
            fontFamily: "PoppinsBold",
          }}
        >
          Reset your password
        </Text>
        {/* <Text
          style={{
            fontSize: 24,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
          }}
        >
          Forgot Password
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "PoppinsRegular",
            marginTop: 5,
          }}
        >
          Reset your account password
        </Text> */}

        <View style={{ marginTop: 20 }}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>Old Password</Text>
            <TextInput
              value={oldPassword}
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
              returnKeyType="done"
              secureTextEntry={true}
              placeholder="********"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setOldPassword(value)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "PoppinsRegular" }}>New Password</Text>
            <TextInput
              value={newPassword}
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
              returnKeyType="done"
              placeholder="********"
              placeholderTextColor="#C9C9C9"
              secureTextEntry={true}
              onChangeText={(value) => setNewPassword(value)}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={{
                height: 50,
                // padding: ,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.shuttlelanePurple,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => forgotPasswordHandler()}
              disabled={isLoading}
            >
              {!isLoading && (
                <>
                  <Text
                    style={{ color: "#FFF", fontFamily: "PoppinsSemiBold" }}
                  >
                    Reset password
                  </Text>
                </>
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

export default ResetPasswordForm;
