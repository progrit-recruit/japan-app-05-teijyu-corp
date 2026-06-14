import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import MainApp from './src/screens/MainApp';

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return (
      <>
        <LoginScreen onLogin={setSession} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <MainApp lang={session.lang} user={session.user} />
      <StatusBar style="auto" />
    </>
  );
}
