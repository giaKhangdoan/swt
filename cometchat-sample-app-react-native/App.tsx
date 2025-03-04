import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { DateChecker } from './src/components/dateChecker/DateChecker';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <DateChecker />
    </SafeAreaView>
  );
};

export default App;
