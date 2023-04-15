import { Stack } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [fontsLoaded] = useFonts({
    PoppinsExtraBold: require("../assets/font/Poppins/Poppins-ExtraBold.ttf"),
    PoppinsBold: require("../assets/font/Poppins/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("../assets/font/Poppins/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("../assets/font/Poppins/Poppins-Medium.ttf"),
    PoppinsRegular: require("../assets/font/Poppins/Poppins-Regular.ttf"),
    PoppinsLight: require("../assets/font/Poppins/Poppins-Light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if(fontsLoaded) {
        await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if(!fontsLoaded) return null

  return <Stack onLayout={onLayoutRootView} />;
};

export default Layout;
