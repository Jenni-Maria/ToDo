//import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'
import { useFonts } from 'expo-font';

const STORAGE_KEY = 'todos'

export default function App() {

  const [loaded] = useFonts({
    MsMadiRegular: require('./assets/fonts/MsMadi-Regular.ttf'),
  });


  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState ([])

  const addTodo = () => {
    const newKey = String(todos.length)
    const object = {key: newKey, description: newTodo}
    const newTodos = [...todos, object]
      setTodos(newTodos)
      setNewTodo('')
  }

  const storeData = async(value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(STORAGE_KEY,jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getData = async() => {
    try {
      return AsyncStorage.getItem(STORAGE_KEY)
      .then(req => JSON.parse(req))
      .then(json => {
        if (json === null) {
          json =[]
        }
        setTodos(json)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My To Do list</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter new ToDo...'
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
        returnKeyType='done'
        onSubmitEditing={() => addTodo()}
        />
      <FlatList
        data={todos}
        extraData={todos}
        renderItem={({item}) =>
        <Text style={styles.list}>{item.description}</Text>
      }
      />
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight:0,
    backgroundColor: '#fcdb9d',
    alignItems: 'left',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 40,
    fontFamily: 'MsMadiRegular', //muista kirjoittaa fontin nimi yhteen ilman väliviivoja tms.
    textAlign: 'left',
    paddingLeft: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderColor: '#FAFAFA',
    height: 40,
    margin: 8,
  },
  list: {
    //margin: 10,
    paddingLeft: 10,
    fontFamily: 'MsMadiRegular',
    fontSize: 15,
  },
  row: {
    height: 30,
  }
});
