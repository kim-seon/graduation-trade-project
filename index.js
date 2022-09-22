/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => LoginScreen);