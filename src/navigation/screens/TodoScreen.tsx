import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb'
import TodoList from '../../components/TodoList';
import Todo from '../../model/Todo';

enum SortMode {
  None = "none",
  Ascending = "asc",
  Descending = "desc"
}

export function TodoScreen() {
  const navigation = useNavigation();
  const database = useDatabase();
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterPriority, setFilterPriority] = useState<number>(0);
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [sortMode, setSortmode] = useState<SortMode>(SortMode.None);

  useEffect(() => {
    setLoading(true);
    let conditions = [];

    if(filterPriority > 0) {
      conditions.push(Q.where("priority", filterPriority));
    }

    if(filterCompleted !== null) {
      conditions.push(Q.where("completed", filterCompleted));
    }

    let query = database.get<Todo>("todos").query(...conditions);

    if(sortMode === SortMode.Ascending) {
      query = query.extend(Q.sortBy("priority", "asc"));
    } else if (sortMode === SortMode.Descending) {
      query = query.extend(Q.sortBy("priority", "desc"));
    }

    const subscription = query.observe().subscribe((newTodos) => {
      setTodos(newTodos);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [filterPriority, filterCompleted, sortMode]);

  const cycleSortMode = () => {
    if(sortMode === SortMode.None) {
      setSortmode(SortMode.Descending);
    } else if(sortMode === SortMode.Descending) {
      setSortmode(SortMode.Ascending);
    } else {
      setSortmode(SortMode.None);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome! See below your list of Todos:</Text>
      <TouchableOpacity style={styles.sortButton} onPress={() => navigation.navigate('TodoModal')}>
        <Text style={styles.sortButtonText}>
          + Add Todo
        </Text>
      </TouchableOpacity>
      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          {/* Priority Filter */}
          <Text style={styles.label}>Filter by Priority:</Text>
          <Picker selectedValue={filterPriority} onValueChange={setFilterPriority} style={styles.picker}>
            <Picker.Item label={"All"} value={0} />
            <Picker.Item label={"1 - High"} value={1} />
            <Picker.Item label={"2 - Medium"} value={2} />
            <Picker.Item label={"3 - Low"} value={3} />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          {/* Completion Filter */}
          <Text style={styles.label}>Filter by Completion:</Text>
          <Picker selectedValue={filterCompleted} onValueChange={setFilterCompleted} style={styles.picker}>
            <Picker.Item label={"All"} value={null} />
            <Picker.Item label={"Completed"} value={true} />
            <Picker.Item label={"Incomplete"} value={false} />
          </Picker>
        </View>
      </View>
      {/* Sorting Button */}
      <TouchableOpacity style={styles.sortButton} onPress={cycleSortMode}>
        <Text style={styles.sortButtonText}>
          Sort by Priority:
          {sortMode === SortMode.None ? " None" : (sortMode === SortMode.Descending ? " Low → High" : " High → Low")}
        </Text>
      </TouchableOpacity>
      <TodoList todos={todos} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:24,
    marginTop:24,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333'
  },
  pickerRow: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flex:1,
    marginHorizontal: 8,
    alignSelf:'flex-end'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DDDDDD',
    marginBottom: 8
  },
  sortButton: {
    backgroundColor:'#0000FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  sortButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
