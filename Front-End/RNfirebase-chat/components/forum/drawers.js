import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../../screens/forum/HomeScreen";
import HeaderForum from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllForums } from "../../stores/forumsSlice";
import { View, ActivityIndicator } from "react-native";
import { Image } from "react-native";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  const dispatch = useDispatch();
  const forums = useSelector((state) => state.forumsReducer.forums);

  useEffect(() => {
    dispatch(fetchAllForums());
  }, []);

  if (!forums || forums.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Drawer.Navigator screenOptions={{headerTintColor: "white"}}>
      {forums.map((el) => {
        return (
          <Drawer.Screen
            key={el._id}
            name={el.name}
            component={HomeScreen}
            initialParams={{ forumId: el._id }}
            options={{
              drawerStyle: {
                backgroundColor: "white",
              },
              drawerIcon: () => {
                return (
                  <Image source={{uri : el.flagImage}} style={{width: 24, height: 24, borderRadius: 100, backgroundColor: "black"}} />
                );
              },
              drawerLabelStyle: {
                color: "black",
              },
              headerStyle: {
                backgroundColor: "#0097b2",
              },
              headerTitleStyle: {
                color: "black",
              },
              headerRight: () => {
                return <HeaderForum forumId={el._id} />;
              },
              headerTitle: () => <></>,
              drawerType: "front",
              drawerItemStyle: {
                backgroundColor: "white"
              },
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
}
