import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database } from '@nozbe/watermelondb'
import schema from '../../model/schema'
import migrations from '../../model/migrations'
import Todo from '../../model/Todo'


export function Loading() {
  const navigation = useNavigation();

  useEffect(() => {
    //Set up the database
    setupDatabase()
  }, [])

  const setupDatabase = () => {
    const adapter = new SQLiteAdapter({
      schema,
      migrations,
      dbName:'todo_db',
      onSetUpError: error => {
        console.log('Error setting up the database!');
        console.log(error);
      }
    });
    
    const database = new Database({
      adapter,
      modelClasses: [
        Todo
      ]
    });
    navigation.navigate('TodoList');
  }

  return (
    <View style={styles.container}>
      {/* Show the logo and then a loading spinner or animation */}
      <Text>Loading!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
