// In App.js in a new project

import * as React from 'react';
import { View, Text, Button, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { captureScreen } from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const { request } = PermissionsAndroid;

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />

      <Button
        title="screen shot"
        onPress={async () => {
          // 请求权限
          await request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: '请求授权',
            message: '你最好吧权限给我打开',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          });

          await request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: '请求授权',
            message: '你最好吧权限给我打开',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          });

          captureScreen({
            format: 'jpg',
            quality: 0.8,
          }).then(
            (uri) => {
              console.log('Image saved to', uri);
              RNFS.readFile(uri, 'ascii')
                .then((res) => {
                  console.log(res);
                })
                .catch((e) => {
                  console.log(e);
                });
            },
            (error) => console.error('Oops, snapshot failed', error)
          );
        }}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
