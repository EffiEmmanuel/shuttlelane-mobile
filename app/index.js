import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { COLORS } from "../constants/themes";
import { Stack } from "expo-router";
import logo from "../assets/images/logo.png";
import LoginForm from "../forms/LoginForm";

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
          headerTitle: () => (
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <LoginForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
