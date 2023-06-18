import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "../../screens/forum/DetailScreen";
import DrawerNav from "./drawers";
import { FontAwesome } from "@expo/vector-icons";
import HeaderPost from "./HeaderPost";
import Post from "../../screens/forum/Post";
import Comments from "../../screens/forum/Comment";
import PostImage from "../../screens/forum/PostImage";

const Stack = createNativeStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: "white" }}>
      <Stack.Screen
        name="ForumContent"
        component={DrawerNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Post"
        component={DetailScreen}
        options={{
          headerRight: () => {
            return <HeaderPost />;
          },
          headerTitle: () => {
            return <FontAwesome name="comments-o" size={30} color="white" />;
          },
          headerStyle: {
            backgroundColor: "#0097b2",
          },
          headerBackTitleStyle: {
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={Post}
        options={{
          headerRight: () => {
            return <HeaderPost />;
          },
          headerTitle: () => {
            return <FontAwesome name="comments-o" size={30} color="white" />;
          },
          headerStyle: {
            backgroundColor: "#0097b2",
          },
          headerBackTitleStyle: {
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="Comment"
        component={Comments}
        options={{
          headerRight: () => {
            return <HeaderPost />;
          },
          headerTitle: () => {
            return <FontAwesome name="comments-o" size={30} color="white" />;
          },
          headerStyle: {
            backgroundColor: "#0097b2",
          },
        }}
      />
      <Stack.Screen
        name="Image"
        component={PostImage}
        options={{headerTintColor: "black"}}
      />
    </Stack.Navigator>
  );
}
