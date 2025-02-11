import { Model } from '@nozbe/watermelondb'
import { field, text, date, writer, readonly } from '@nozbe/watermelondb/decorators'

export default class Todo extends Model {
  static table = 'todos';

  @text("title") title!: string;
  @text("description") description!: string;
  @field("priority") priority!: number;
  @field("completed") completed!: boolean;
  @date("created_at") created!: number;

  @writer async toggleCompletion() {
    await this.update(todo => {
      todo.completed = !todo.completed;
    })
  }

  @writer async deleteTodo() {
    await this.markAsDeleted();
  }

  @writer async updateTodo(title: string, description: string, priority: number) {
    await this.update(todo => {
      todo.title = title;
      todo.description = description;
      todo.priority = priority;
    });
  }

}