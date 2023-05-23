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

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guest, setGuest] = useState();

  const router = useRouter();

  // LOGOUT FUNCTION
  async function logoutUser() {
    // setIsLoading(true);
    // showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    // setIsLoading(false);
    router.replace("login");
    return;
  }

  async function getUser() {
    const parsedGuest = JSON.parse(await AsyncStorage.getItem("isGuest"));
    setGuest(parsedGuest);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "500",
              color: COLORS.shuttlelanePurple,
              fontFamily: "PoppinsBold",
            }}
          >
            Settings
          </Text>

          {!guest && (
            <TouchableOpacity
              onPress={() => router.push("/editProfile")}
              style={styles.menuItem}
            >
              <View style={styles.iconAndText}>
                <Icon name="person" size={24} />
                <Text style={styles.text}>Account</Text>
              </View>
              <Icon name="arrow-right" size={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push("/resetPassword")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="lock" size={24} />
              <Text style={styles.text}>Reset password</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="public" size={24} />
              <Text style={styles.text}>Visit Website</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="email" size={24} />
              <Text style={styles.text}>Contact us</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="support-agent" size={24} />
              <Text style={styles.text}>Report a problem</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/customerservice/faq")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="help" size={24} />
              <Text style={styles.text}>FAQs</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/company/terms")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="book" size={24} />
              <Text style={styles.text}>Terms of use</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/company/policy")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="shield" size={24} />
              <Text style={styles.text}>Privacy Policy</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/company/policy")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon name="trash" size={24} color="#FF9494" />
              <Text style={styles.text}>Delete my account</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logoutUser} style={styles.menuItem}>
            <View style={styles.iconAndText}>
              <Icon name="logout" size={24} />
              <Text style={styles.text}>Log out</Text>
            </View>
            <Icon name="arrow-right" size={24} />
          </TouchableOpacity>
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
export default ProfilePage;
