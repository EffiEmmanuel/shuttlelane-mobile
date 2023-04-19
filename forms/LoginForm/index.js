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

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  // LOGIN FUNCTION
  async function loginUser() {
    console.log("email", email);
    console.log("password", password);
    setIsLoading(true);
    const response = await fetch(
      //   "https://www.shuttlelane.com/api/users/signin",
      "http://172.20.10.6:3001/api/users/signin",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    const user = await response.json();
    console.log("RESPONSE:", user);
    setIsLoading(false);
    if (user?.error) {
      return showToastMessage(user?.error, "error");
    }

    showToastMessage("Log in successful", "success");
    const stringifiedToken = JSON.stringify(user?.token);
    const userObject = JSON.stringify({
      name: user?.data?.name,
      email: user?.data?.email,
      mobile: user?.data?.mobile,
      currency: user?.data?.currency,
    });

    await AsyncStorage.setItem("token", stringifiedToken);
    await AsyncStorage.setItem("user", userObject);
    setIsLoading(false);
    router.replace("/dashboard");
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
          Log in
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "PoppinsRegular",
            marginTop: 5,
          }}
        >
          Sign in to your Shuttlelane account
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
            <Text style={{ fontFamily: "PoppinsRegular" }}>Password</Text>
            <TextInput
              value={password}
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
              secureTextEntry={true}
              returnKeyType="done"
              placeholder="********"
              placeholderTextColor="#C9C9C9"
              onChangeText={(value) => setPassword(value)}
            />
          </View>

          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text>
              {" "}
              <Link style={{ color: COLORS.shuttlelanePurple }} href="/">
                Forgot Password?
              </Link>
            </Text>
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
                backgroundColor: COLORS.shuttlelaneYellow,
                borderRadius: 10,
              }}
              onPress={() => loginUser()}
            >
              {!isLoading && (
                <Text
                  style={{ fontFamily: "PoppinsSemiBold", color: COLORS.white }}
                >
                  Log in
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
            <Text>
              Don't have an account?{" "}
              <Link style={{ color: COLORS.shuttlelanePurple }} href="/sign-up">
                Sign up
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default LoginForm;
