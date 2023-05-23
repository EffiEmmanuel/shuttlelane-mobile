import { Link, Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { COLORS } from "../../../constants/themes";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import axios from "axios";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";

const More = () => {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // LOGOUT FUNCTION
  async function logoutUser() {
    // setIsLoading(true);
    // showToastMessage("Log out successful", "success");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("isGuest");
    // await AsyncStorage.removeItem("hasOnboarded");
    // setIsLoading(false);
    router.replace("/screenFour/signInOptions");
    return;
  }

  // FETCH USER DATA
  async function fetchUserData() {
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    setUser(parsedUser);
    const parsedGuest = JSON.parse(await AsyncStorage.getItem("isGuest"));
    setGuest(parsedGuest);
  }

  useEffect(() => {
    fetchUserData();
  });

  // DELETE USER ACCOUNT FUNCTION
  async function deleteUserAccount() {
    setIsLoading(true);
    await axios
      .delete(`https://www.shuttlelane.com/api/users/${user?._id}`)
      .then(async (res) => {
        console.log("DELETE RESPONSE::", res);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("hasOnboarded");

        Alert.alert(
          "Your account has been deleted",
          "We are sorry to see you go. Please let us know how we can improve our services.",
          [
            {
              text: "Sure",
              onPress: () => {
                setIsLoading(false);
                Linking.openURL("mailto:info@shuttlelane.com");
              },
            },
            {
              text: "No, I'm good",
              onPress: () => {
                setIsLoading(false);
                router.replace("login");
              },
            },
          ]
        );
      })
      .catch((err) => [console.log("DELETE ERROR::", err)]);
  }

  // DELETE ACCOUNT PERMISSION FUNCTION
  async function handleAccountDeletion() {
    Alert.alert(
      "Dangerous action!",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Yes, delete my account",
          onPress: () => deleteUserAccount(),
        },
        {
          text: "No, keep my account",
          onPress: () => console.log("Delete action canceled."),
          style: "cancel",
        },
      ]
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading && (
          <View
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 30,
              position: "absolute",
              top: 0,
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "rgba(0,0,0,.4)",
            }}
          >
            <ActivityIndicator size={36} />
          </View>
        )}

        <View style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 30 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "500",
              color: COLORS.shuttlelanePurple,
              fontFamily: "PoppinsBold",
              marginBottom: 15,
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
                <Icon color={"#191919"} name="person" size={24} />
                <Text style={styles.text}>My Account</Text>
              </View>
              <Icon color={"#191919"} name="chevron-right" size={24} />
            </TouchableOpacity>
          )}
          {!guest && (
            <TouchableOpacity
              onPress={() => router.push("/resetPassword")}
              style={styles.menuItem}
            >
              <View style={styles.iconAndText}>
                <Icon color={"#191919"} name="lock" size={24} />
                <Text style={styles.text}>Reset password</Text>
              </View>
              <Icon color={"#191919"} name="chevron-right" size={24} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="public" size={24} />
              <Text style={styles.text}>Visit Website</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="email" size={24} />
              <Text style={styles.text}>Contact us</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:info@shuttlelane.com")}
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="support-agent" size={24} />
              <Text style={styles.text}>Report a problem</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/customerservice/faq")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="help" size={24} />
              <Text style={styles.text}>FAQs</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/company/terms")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="book" size={24} />
              <Text style={styles.text}>Terms of use</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.shuttlelane.com/company/policy")
            }
            style={styles.menuItem}
          >
            <View style={styles.iconAndText}>
              <Icon color={"#191919"} name="shield" size={24} />
              <Text style={styles.text}>Privacy Policy</Text>
            </View>
            <Icon color={"#191919"} name="chevron-right" size={24} />
          </TouchableOpacity>
          {guest && (
            <TouchableOpacity
              onPress={() => router.replace("signup")}
              style={styles.menuItem}
            >
              <View style={styles.iconAndText}>
                <Icon color={"#191919"} name="person" size={24} />
                <Text style={styles.text}>Create an account</Text>
              </View>
              <Icon color={"#191919"} name="chevron-right" size={24} />
            </TouchableOpacity>
          )}
          {guest && (
            <TouchableOpacity
              onPress={() => router.replace("login")}
              style={styles.menuItem}
            >
              <View style={styles.iconAndText}>
                <Icon color={"#191919"} name="login" size={24} />
                <Text style={styles.text}>Log in</Text>
              </View>
              <Icon color={"#191919"} name="chevron-right" size={24} />
            </TouchableOpacity>
          )}
          {!guest && (
            <TouchableOpacity
              onPress={() => handleAccountDeletion()}
              style={styles.menuItem}
            >
              <View style={styles.iconAndText}>
                <Icon name="delete" size={24} color="#ff0033" />
                <Text style={styles.text}>Delete my account</Text>
              </View>
              <Icon name="arrow-right" size={24} />
            </TouchableOpacity>
          )}
          {!guest && (
            <TouchableOpacity onPress={logoutUser} style={styles.menuItem}>
              <View style={styles.iconAndText}>
                <Icon color={"#191919"} name="logout" size={24} />
                <Text style={styles.text}>Log out</Text>
              </View>
              <Icon color={"#191919"} name="chevron-right" size={24} />
            </TouchableOpacity>
          )}
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
export default More;
