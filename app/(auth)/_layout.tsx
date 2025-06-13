import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="getStarted" />
      <Stack.Screen name="login" />
    </Stack>
  );
}