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

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

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

  // FORGOT PASSWORD HANDLER FUNCTION
  async function forgotPasswordHandler() {
    console.log("email", email);
    setIsLoading(true);
    const response = await fetch(
      "https://www.shuttlelane.com/api/users/forgotpassword",
      // "http://172.20.10.6:3001/api/users/signin",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
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

    showToastMessage(`A password reset link has been sent to your email @${email}`, "success");
    setEmail('')
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
            zIndex: 90,
            top: 0,
            width: Dimensions.get("window").width,
            flexDirection: "row",
            justifyContent: "center",
          }}
        />
      )}
      <View style={{ marginTop: 40, padding: 20 }}>
        <Text
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
        </Text>

        <View style={{ marginTop: 20 }}>
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
            <TouchableOpacity
              style={{
                height: 50,
                // padding: ,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.shuttlelaneYellow,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => forgotPasswordHandler()}
              disabled={isLoading}
            >
              {!isLoading && (
                <>
                  <Icon name="email" size={18} style={{ margin: 5 }} color="#FFF" />
                  <Text style={{color: '#FFF', fontFamily: 'PoppinsSemiBold'}}>Send Email</Text>
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

export default ForgotPasswordForm;
