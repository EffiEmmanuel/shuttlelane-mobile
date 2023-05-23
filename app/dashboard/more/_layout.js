import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { COLORS } from "../../../constants/themes";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          gestureEnabled: false,
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
