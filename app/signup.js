import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/themes";
import { Link, Stack, useRouter } from "expo-router";
import logo from "../assets/images/logo.png";
import { TextInput } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../assets/icons/arrowBackIcon.png";
import SignupForm from "../forms/SignupForm";
import { StyleSheet } from "react-native";

const SignUp = () => {
  //   ROUTER
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={style.headerImage}
              height={28}
              width={28}
            />
          ),
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: null,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <SignupForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  headerImage: { width: 100, height: 100, marginTop: -28 },
});

export default SignUp;
