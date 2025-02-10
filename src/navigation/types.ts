import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Todo from '../model/Todo';

// The stack parameter list
export type RootStackParamList = {
  TodoScreen: undefined;
  TodoModal: { todo?: Todo } | undefined;
};

// Type for the navigation prop
export type TodoModalNavigationProp = NativeStackNavigationProp<RootStackParamList, "TodoModal">;

// Type for route prop to get the param
export type TodoModalRouteProp = RouteProp<RootStackParamList, "TodoModal">;