import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native";
import Welcome from "../../components/Welcome";
import RecentBookings from "../../components/RecentBookings";
import { COLORS } from "../../constants/themes";
import logo from "../../assets/images/logo.png";
import globeIcon from "../../assets/icons/globeIcon.png";
import logoutIcon from "../../assets/icons/logoutIcon.png";
import passengerIcon from "../../assets/icons/passengerIcon.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../../context/AuthContext";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  const router = useRouter()

  // LOGOUT FUNCTION
  async function logoutUser() {
    // setIsLoading(true);
    // showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // setIsLoading(false);
    router.replace("/login");
    return;
  }

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
          headerLeft: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
          headerRight: () => (
            <>
              <Link href="https://www.shuttlelane.com" style={{ marginTop: 7 }}>
                <Icon name="account-circle" size={30} color="#000" />
              </Link>
              <TouchableOpacity onPress={logoutUser} style={{ marginTop: 5 }}>
                <Image
                  source={logoutIcon}
                  resizeMode="contain"
                  style={{ width: 46, height: 46 }}
                  height={28}
                  width={28}
                />
              </TouchableOpacity>
            </>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Welcome />
          <RecentBookings />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDashboard;
