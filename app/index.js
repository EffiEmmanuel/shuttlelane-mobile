import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { COLORS } from "../constants/themes";
import { Link, Stack } from "expo-router";
import {
  Bars3Icon,
  Bars4Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn";
import userIcon from "../assets/icons/userIcon.png";
import logoutIcon from "../assets/icons/logoutIcon.png";
import globeIcon from "../assets/icons/globeIcon.png";
import bookingsIcon from "../assets/icons/bookingsIcon.png";
import logo from "../assets/images/logo.png";
import Welcome from "../components/Welcome";
import RecentBookings from "../components/RecentBookings";

const Home = () => {
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
              <Link href="https://www.shuttlelane.com" style={{ marginTop: 5 }}>
                <Image
                  source={globeIcon}
                  resizeMode="contain"
                  style={{ width: 46, height: 46 }}
                  height={28}
                  width={28}
                />
              </Link>
              <Link href="https://www.shuttlelane.com" style={{ marginTop: 5 }}>
                <Image
                  source={logoutIcon}
                  resizeMode="contain"
                  style={{ width: 46, height: 46 }}
                  height={28}
                  width={28}
                />
              </Link>
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

export default Home;
