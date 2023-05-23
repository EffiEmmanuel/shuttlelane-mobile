import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs, useNavigation, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/themes";
import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Layout = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  // fetchUserData()

  const [userImage, setUserImage] = useState(blurhash);

  // USER DATA

  async function fetchUserData() {
    console.log("INSIDE FETCH USER DATA - OUTER");
    const parsedUser = JSON.parse(await AsyncStorage.getItem("user"));
    console.log("PARSED USER:", parsedUser);
    if (parsedUser !== user) {
      console.log("INSIDE FETCH USER DATA");
      setUser(parsedUser);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: COLORS.shuttlelanePurple,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: ({ style, color }) => (
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 12,
                color: color,
              }}
            >
              Home
            </Text>
          ),
          headerTitle: "",
          headerLeft: () => (
            <View
              style={{
                paddingLeft: 20,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsSemiBold",
                  fontSize: 18,
                }}
              >
                Hi, {user?.name?.split(' ')[0]} ✨
              </Text>
            </View>
          ),
          headerRight: () => {
            // fetchUserData();
            return (
              <TouchableOpacity
                style={{
                  paddingRight: 20,
                  marginTop: 20,
                }}
                onPress={() => router.push("/dashboard/more")}
              >
                <Image
                  source={{ uri: `${user?.image}` }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                  placeholder={blurhash}
                />
                {/* <Image */}
              </TouchableOpacity>
            );
          },
          tabBarIcon: ({ style, color }) => (
            <Icon
              name="home"
              size={28}
              color={color}
              style={{ color: color }}
            />
          ),
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "Bookings",
          headerTitle: "",
          tabBarIcon: ({ style, color }) => (
            <Icon
              name="flight-takeoff"
              size={28}
              color={color}
              style={{ color: color }}
            />
          ),
          headerShadowVisible: false,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          tabBarLabel: "More",
          headerTitle: "",
          tabBarIcon: ({ style, color }) => (
            <Icon
              name="menu"
              size={28}
              color={color}
              style={{ color: color }}
            />
          ),
          headerShadowVisible: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
