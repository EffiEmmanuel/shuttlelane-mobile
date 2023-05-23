import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native";
import Welcome from "../components/Welcome";
import RecentBookings from "../components/RecentBookings";
import { COLORS } from "../constants/themes";
import logo from "../assets/images/logo.png";
import globeIcon from "../assets/icons/globeIcon.png";
import logoutIcon from "../assets/icons/logoutIcon.png";
import passengerIcon from "../assets/icons/passengerIcon.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../context/AuthContext";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../assets/icons/arrowBackIcon.png";
import * as Linking from "expo-linking";
import EditProfileForm from "../forms/EditProfileForm";

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // USER DATA
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(parsedUser);
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
            <EditProfileForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingVertical: 10,
    borderBottomColor: "#C1C1C1",
    borderBottomWidth: 0.2,
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    marginHorizontal: 10,
  },
});
export default EditProfilePage;
