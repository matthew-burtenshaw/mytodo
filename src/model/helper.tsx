import { desc } from '@nozbe/watermelondb/QueryDescription';
import { database } from './database';
import Todo from './Todo';

export function getDb() {
  return database;
}

export const createTodo = (title: string, description: string, priority: number) => {
  getDb().write(() =>
    getDb()
    .get<Todo>('todos')
    .create((todo) => {
      todo.title = title,
      todo.description = description,
      todo.priority = priority,
      todo.isCompleted = false
    }),
  )
}

export const deleteTodo = (todo: Todo) => {
  return getDb().write(() => todo.destroyPermanently())
}

export const getTodos = () => {
  return getDb().collections.get<Todo>('todos').query();
}