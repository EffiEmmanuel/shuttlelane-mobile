import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { COLORS } from "../constants/themes";
import { Stack } from "expo-router";
import logo from "../assets/images/logo.png";
import LoginForm from "../forms/LoginForm";
import ToastMessage from "../components/ToastMessage";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
          headerLeft: () => '',
          gestureEnabled: false,
          headerShown: false
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10, marginTop: 50 }}>
          <LoginForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;
