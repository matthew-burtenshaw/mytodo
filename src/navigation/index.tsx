import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TodoScreen } from './screens/TodoScreen';
import { TodoModal } from './screens/TodoModal';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'TodoList',
  screens: {
    TodoList: {
      screen: TodoScreen,
      options: {
        title: 'List',
        headerShown: false,
      },
    },
    TodoModal: {
      screen: TodoModal,
      options: () => ({
        presentation: 'modal',
        title: ''
      }),
    }
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
