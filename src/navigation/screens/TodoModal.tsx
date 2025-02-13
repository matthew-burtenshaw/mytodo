import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback, View, Text, TextInput, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import { useDatabase } from '@nozbe/watermelondb/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Todo from '../../model/Todo';
import { TodoModalNavigationProp, TodoModalRouteProp } from '../types'

export function TodoModal() {
  const navigation = useNavigation<TodoModalNavigationProp>();
  const route = useRoute<TodoModalRouteProp>();
  const database = useDatabase();
  const [submissionError, setSubmissionError] = useState<string | undefined>(undefined);

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
      priority: Yup.number().required('Select a priority')
    }),
    onSubmit: async (values, form) => {
      form.setSubmitting(true);
      setSubmissionError(undefined);
      try {
        if(existingTodo) {
          // If there is an existing one, edit it
          await existingTodo.updateTodo(values.title, values.description, values.priority);
        } else {
          // If there is not an existing one, create it
          await database.write(async () => {
            await database.get<Todo>("todos").create((todo) => {
              todo.title = values.title;
              todo.description = values.description;
              todo.priority = values.priority;
              todo.completed = false;
              todo.created = Date.now();
            });
          });
        }
        // Go back to the List screen
        navigation.goBack();
      } catch (error) {
        if(existingTodo) {
          setSubmissionError("Error updating the Todo, please try again");
        } else {
          setSubmissionError("Error creating the Todo, please try again");
        }
      } finally {
        //reset form status
        form.setSubmitting(false);
      }
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>{existingTodo ? 'Edit Todo' : 'Create a new Todo'}</Text>
        
        <Text style={styles.label}>Title:</Text>
        <TextInput
          value={formik.values.title}
          placeholder='Title'
          onChangeText={formik.handleChange('title')}
          onBlur={formik.handleBlur('title')}
          style={styles.input}
        />
        {formik.touched.title && formik.errors.title && 
          <Text style={styles.errorText}>{formik.errors.title}</Text>
        }

        <Text style={styles.label}>Description:</Text>
        <TextInput
          value={formik.values.description}
          placeholder='Description'
          onChangeText={formik.handleChange('description')}
          onBlur={formik.handleBlur('description')}
          style={styles.input}
        />
        {formik.touched.description && formik.errors.description &&
          <Text style={styles.errorText}>{formik.errors.description}</Text>
        }

        <Text style={styles.label}>Priority:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formik.values.priority}
            onValueChange={(option) => {
              formik.setFieldValue('priority', option);
            }}
            style={styles.picker}
          >
            <Picker.Item label='1 - High' value={1}/>
            <Picker.Item label='2 - Medium' value={2}/>
            <Picker.Item label='3 - Low' value={3}/>
          </Picker>
        </View>
        
        <TouchableOpacity 
          disabled={ !formik.dirty || !formik.isValid || formik.isSubmitting} 
          style={ !formik.dirty || !formik.isValid || formik.isSubmitting ? styles.submitButtonDisabled : styles.submitButton} 
          onPress={() => formik.handleSubmit()}
        >
          <Text style={styles.submitButtonText}>
            { existingTodo ? 
                ( formik.isSubmitting ? "Updating..." : "Update") : 
                ( formik.isSubmitting ? "Creating..." : "Create")
            }
          </Text>
        </TouchableOpacity>
        { submissionError && 
          <Text style={styles.errorText}>{submissionError}</Text>
        }
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding:24,
    justifyContent: 'center',
    gap:10
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
  submitButton: {
    backgroundColor:'#0000FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16
  },
  submitButtonDisabled: {
    backgroundColor:'#0000FF',
    opacity: 0.5,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  errorText: {
    color:'#FF0000',
    fontSize:16,
  }
});
