import React, {useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Todo from '../model/Todo'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Animated,  { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

type Props = {
  todo: Todo;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TodoModal">;

const TodoComponent = ({todo}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const translateX = useSharedValue(-200);
  const opacity = useSharedValue(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Animate the Todo item in
    translateX.value = withTiming(0, { duration: 500 });
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  // Create this function so that it can be ranOnJS
  const handleDelete = async () => {
    await todo.deleteTodo();
  }

  const deleteTodo = async() => {
    setIsDeleting(true);
    translateX.value = withTiming(-200, { duration: 300}, () => {
      runOnJS(handleDelete)();
    });
    //Animate out the Todo
    opacity.value = withTiming(0, { duration: 200 });
  }

  const markAsDone = async() => {
    await todo.toggleCompletion();
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value
    }
  });

  return(
    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("TodoModal", { todo: todo})} 
        style={todo.priority === 1 ? styles.todoItem1 : todo.priority === 2 ? styles.todoItem2 : styles.todoItem3}
        disabled={isDeleting}
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
    </Animated.View>
  )
};

const enhance = withObservables(['todo'], ({todo}: {todo: Todo}) => ({
  todo
}))

const EnhancedTodoComponent = enhance(TodoComponent);
export default EnhancedTodoComponent;

const styles = StyleSheet.create({
  animatedContainer: {
    overflow:'hidden'
  },
  todoItem1: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF0000',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16
  },
  todoItem2: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#5CA904',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 16
  },
  todoItem3: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor:'#0000FF',
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