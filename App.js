import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignInScreen from './screens/SignInScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import MealPrepScreen from './screens/MealPrepScreen';
import InboxScreen from './screens/InboxScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkoutSearchScreen from './screens/WorkoutSearchScreen';
import MealPrepSearchScreen from './screens/MealPrepSearchScreen';
import WorkoutFilterScreen from './screens/WorkoutFilterScreen';
import MealPrepFilterScreen from './screens/MealPrepFilterScreen';
import UserStatsScreen from './screens/UserStatsScreen';
import ChatbotScreen from "./screens/ChatbotScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App Navigation (Bottom Tabs)
function MainApp() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Meal Prep" 
        component={MealPrepScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="cutlery" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="My Stats" 
        component={UserStatsScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="star" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Inbox" 
        component={InboxScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="inbox" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} /> }} 
      />
      <Tab.Screen 
  name="Chatbot" 
  component={ChatbotScreen} 
  options={{ tabBarIcon: ({ color }) => <Icon name="comments" size={24} color={color} /> }} 
/>

    </Tab.Navigator>
  );
}

// App Entry Point - Starts with Sign In
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="WorkoutSearch" component={WorkoutSearchScreen} />
        <Stack.Screen name="MealPrepSearch" component={MealPrepSearchScreen} />
        <Stack.Screen name="WorkoutFilter" component={WorkoutFilterScreen} />
        <Stack.Screen name="MealPrepFilter" component={MealPrepFilterScreen} />
        <Stack.Screen name="UserStats" component={UserStatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
