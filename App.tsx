import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import BrowseScreen from "./src/screens/BrowseScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";

type RootTabParamList = {
  Browse: undefined;
  CheatSheet: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000",
    card: "#111113",
    border: "#1c1c1e",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#ff8c00",
          tabBarInactiveTintColor: "#8e8e93",
          tabBarStyle: {
            backgroundColor: "#111113",
            borderTopColor: "#1c1c1e",
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === "Browse"
                ? "search"
                : "information-circle";

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Browse" component={BrowseScreen} />
        <Tab.Screen
          name="CheatSheet"
          component={CheatSheetScreen}
          options={{ title: "How to Spot Them" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
