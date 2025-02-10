import { Text } from '@react-navigation/elements';
import { Button, StyleSheet, View, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import { useDatabase } from '@nozbe/watermelondb/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTodo } from '../../model/helper';
import Todo from '../../model/Todo';
import { TodoModalNavigationProp, TodoModalRouteProp } from '../types'

export function TodoModal() {
  const navigation = useNavigation<TodoModalNavigationProp>();
  const route = useRoute<TodoModalRouteProp>();
  const database = useDatabase();

  const existingTodo: Todo | undefined = route.params?.todo || undefined;
  const formik = useFormik({
    initialValues: {
      title: existingTodo?.title || '',
      description: existingTodo?.description || '',
      priority: existingTodo?.priority || 1
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().trim().required('Please enter a title'),
      description: Yup.string().trim().required('Please enter a description'),
      priority: Yup.string().required('Select a priority')
    }),
    onSubmit: createOrEditTodo
  })

  async function createOrEditTodo(values, form) {
    form.setSubmitting();
    try {
      if(existingTodo) {
        // If there is an existing one, edit it
        await existingTodo.updateTodo(values.title, values.description, parseInt(values.priority));
      } else {
        // If there is not an existing one, create it
        await database.write(async () => {
          await database.get<Todo>("todos").create((todo) => {
            todo.title = values.title;
            todo.description = values.description;
            todo.priority = parseInt(values.priority);
            todo.completed = false;
            todo.created = Date.now();
          });
        });
      }
      
      navigation.goBack();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{existingTodo ? 'Edit Todo' : 'Create a new Todo'}</Text>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        value={formik.values.title}
        placeholder='Title'
        onChangeText={formik.handleChange('title')}
        onBlur={formik.handleBlur('title')}
        style={styles.input}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={formik.values.description}
        placeholder='Description'
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
        style={styles.input}
      />
      <Text style={styles.label}>Priority:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formik.values.priority}
          onValueChange={option => {
            formik.handleChange('priority')(option.valueOf().toFixed());
          }}
          style={styles.picker}
        >
          <Picker.Item label='1 - High' value={1}/>
          <Picker.Item label='2 - Medium' value={2}/>
          <Picker.Item label='3 - Low' value={3}/>
        </Picker>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={
            existingTodo ? 
              ( formik.isSubmitting ? "Updating..." : "Update") : 
              ( formik.isSubmitting ? "Creating..." : "Create")
          }
          disabled={!formik.dirty || !formik.isValid || formik.isSubmitting }
          onPress={formik.handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:24,
    backgroundColor: "#F5F5F5",
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#555555'
  },
  input: {
    borderWidth: 2,
    borderColor: "#DDDDDD",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor:'#FFFFFF',
    fontSize:16
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16
  },
  picker: {
    height: 55,
    width: "100%"
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop:16
  },
});
