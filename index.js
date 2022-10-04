/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import RegisterScreen from './src/screens/RegisterScreen/RegisterScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => RegisterScreen);
