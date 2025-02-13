import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Todo from '../model/Todo';
import TodoComponent from './TodoComponent'

type Props = {
  todos: Todo[];
  loading: boolean;
};

const TodoList = ({todos, loading} : Props) => {

  return (
    <View style={styles.container}>
    {todos.length === 0 &&
    <View style={styles.emptyContainer}>
      <Text style={styles.text}>There are currently no Todos, create one!</Text>
    </View>
    }
    { todos.length > 0 && loading &&
    <View style={styles.emptyContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
    }
    { todos.length > 0 && !loading &&
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoComponent todo={item} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    }
    </View>
  );
    
};

export default TodoList;

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize:16,
    color: '#333333'
  },
  listContainer: {
    paddingBottom: 16
  },
  loadingText: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 16,
  }
})