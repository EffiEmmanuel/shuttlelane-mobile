import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { COLORS } from "../../constants/themes";
import { Link, Stack, useRouter } from "expo-router";
import logo from "../../assets/images/logo.png";
import { TextInput } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../../assets/icons/arrowBackIcon.png";
import SignupForm from "../../forms/SignupForm";

const SignUp = () => {
  //   ROUTER
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, display: "relative" }}
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
          headerLeft: () => (
            <TouchableOpacity style={{}} onPress={() => router.back()}>
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
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

export default SignUp;
