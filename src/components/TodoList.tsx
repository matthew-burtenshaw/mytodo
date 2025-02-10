import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Todo from '../model/Todo';
import TodoComponent from './TodoComponent'

type Props = {
  todos: Todo[];
};

const TodoList = ({todos} : Props) => {

  return (
    <View>
    {todos.length === 0 &&
    <View>
      <Text style={styles.text}>There are currently no Todos, create one!</Text>
    </View>
    }
    { todos.length > 0 &&
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoComponent todo={item} />
        )}
      />
    }
    </View>
  );
    
};

export default TodoList;

const styles = StyleSheet.create({
  text: {
    fontSize:16,
    color: '#333333'
  }
})