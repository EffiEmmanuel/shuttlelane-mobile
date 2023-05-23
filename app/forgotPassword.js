import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/themes";
import { Stack } from "expo-router";
import logo from "../assets/images/logo.png";
import LoginForm from "../forms/LoginForm";
import arrowBackIcon from "../assets/icons/arrowBackIcon.png";
import ToastMessage from "../components/ToastMessage";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ForgotPasswordForm from "../forms/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <ForgotPasswordForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  headerImage: { width: 100, height: 100, marginTop: -28 },
});

export default ForgotPasswordPage;
