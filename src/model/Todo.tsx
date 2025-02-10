import { Model } from '@nozbe/watermelondb'
import { field, text, date, writer, readonly } from '@nozbe/watermelondb/decorators'

export default class Todo extends Model {
  static table = 'todos';

  // @ts-ignore
  @text("title") title!: string;
  // @ts-ignore
  @text("description") description!: string;
  // @ts-ignore
  @field("priority") priority!: number;
  // @ts-ignore
  @field("completed") completed!: boolean;
  // @ts-ignore
  @date("created_at") created!: number;

  // @ts-ignore
  @writer async toggleCompletion() {
    await this.update(todo => {
      todo.completed = !todo.completed;
    })
  }

  // @ts-ignore
  @writer async deleteTodo() {
    await this.destroyPermanently();
  }

  // @ts-ignore
  @writer async updateTodo(title: string, description: string, priority: number) {
    await this.update(todo => {
      todo.title = title;
      todo.description = description;
      todo.priority = priority;
    });
  }

}