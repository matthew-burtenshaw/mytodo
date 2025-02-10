import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import schema from './schema';
import Todo from './Todo';

const adapter = new SQLiteAdapter({
  schema,
  jsi: Platform.OS === 'ios',
  dbName:'todo_db',
  onSetUpError: error => {
    console.log('Error setting up the database!');
    console.log(error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    Todo
  ]
});