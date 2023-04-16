import { Link } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../constants/themes";
import { postRequest } from "../../network/apiClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser() {
    const response = await fetch(
      "https://www.shuttlelane.com/api/users/signin",
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
    console.log("RESPONSE:", response);
  }

  return (
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
            onPress={loginUser}
          >
            <Text
              style={{ fontFamily: "PoppinsSemiBold", color: COLORS.white }}
            >
              Log in
            </Text>
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
  );
};

export default LoginForm;
