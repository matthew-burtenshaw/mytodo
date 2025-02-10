import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Todo from '../model/Todo'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = {
  todo: Todo;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TodoModal">;

const TodoComponent = ({todo}: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const deleteTodo = async() => {
    await todo.deleteTodo();
  }

  const markAsDone = async() => {
    await todo.toggleCompletion();
  }
  return(
    <TouchableOpacity 
      onPress={() => navigation.navigate("TodoModal", { todo: todo})} 
      style={todo.priority === 1 ? styles.todoItem1 : todo.priority === 2 ? styles.todoItem2 : styles.todoItem3}
    >
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={todo.completed ? styles.toddoTextDone : styles.todoText}>{todo.title}</Text>
          <Text style={todo.completed ? styles.toddoTextDone : styles.todoText}>Priority: {todo.priority}</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.markAsDone} onPress={markAsDone}>
            <Icon 
              name={todo.completed ? "close-circle-outline" : "check-circle-outline"}
              size={24} 
              color="grey"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.delete} onPress={deleteTodo}>
            <Icon name="trash-can-outline" size={24} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const enhance = withObservables(['todo'], ({todo}: {todo: Todo}) => ({
  todo
}))

const EnhancedTodoComponent = enhance(TodoComponent);
export default EnhancedTodoComponent;

const styles = StyleSheet.create({
  todoItem1: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16
  },
  todoItem2: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16
  },
  todoItem3: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor:'blue',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16
  },
  text: {
    flex:4
  },
  todoText: {
    fontSize: 16,
    color: '#333333'
  },
  toddoTextDone: {
    fontSize: 16,
    color: '#333333',
    textDecorationLine: 'line-through'
  },
  markAsDone: {
    marginRight: 16
  },
  delete: {
    height: 24,
    width: 24,
  },
  row: {
    flex:1,
    flexDirection:'row',
  },
  iconRow: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
})