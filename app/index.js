import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { COLORS } from "../constants/themes";
import { Stack } from "expo-router";
import { Bars3Icon, Bars4Icon , UserCircleIcon } from "@heroicons/react/24/outline";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn";
import userIcon from '../assets/icons/userIcon.png'
import bars3Icon from '../assets/icons/bars3Icon.png'
import Welcome from "../components/Welcome";
import RecentBookings from "../components/RecentBookings";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn icon={bars3Icon} dimensions="40%" />
          ),
          headerRight: () => (
            <ScreenHeaderBtn icon={userIcon} dimensions="40%" />
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
