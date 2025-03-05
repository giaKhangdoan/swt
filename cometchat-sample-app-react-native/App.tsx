import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import DateTimeChecker from './src/components/DateTimeChecker';

const App = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <DateTimeChecker />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default App;
