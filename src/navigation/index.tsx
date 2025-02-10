import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Loading } from './screens/Loading';
import { TodoScreen } from './screens/TodoScreen';
import { TodoModal } from './screens/TodoModal';
import { NotFound } from './screens/NotFound';

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
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
