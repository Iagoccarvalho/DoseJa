import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { FIREBASE_AUTH } from '../firebaseConfig';
import { FIREBASE_DB } from '../firebaseConfig';

import { collection, doc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';


export default function Notes() {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);
    const db = FIREBASE_DB;
    const userId = FIREBASE_AUTH.currentUser.uid;

    useEffect(() => {

      const importasNotas = async () => {
        try {
          const userRef = doc(db, 'usuarios', userId);
          const querySnapshot = await getDocs(collection(userRef, 'notas'));
    
          const noteList = [];
    
          querySnapshot.forEach((doc) => {
            const newNote = {
              id: doc.id,
              conteudo: doc.data().conteudo
            }
            noteList.push(newNote);
          });
          setNotes(noteList);
          console.log(setNotes);
        }catch (error) {
          console.error('Erro ao buscar documentos:', error);
        }
      };
    
      importasNotas();
    }, []);
  
    const handleSaveNote = async () => {
      if (note.trim() !== '') {
        try{

          const notesRef = collection(doc(db, 'usuarios', userId), 'notas');
          
          const docRef = await addDoc(notesRef, {
            conteudo: note
          });

          const noteId = docRef.id;
          const newNote = {id: noteId, conteudo: note};

          setNotes([...notes, newNote]);
          setNote('');

        } catch(error) {
            console.log('erro ao inserir nota');
            console.log(error);
        }
      }
    };
  
    const handleDeleteNote = async (id) => {
      const userRef = doc(db, 'usuarios', userId);
      await deleteDoc(doc(userRef, 'notas', id));
      const updatednotes = notes.filter(note => note.id !== id);
      setNotes(updatednotes);
    };

    return (
      <View style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Bloco de Notas</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu lembrete aqui"
            multiline={true}
            value={note}
            onChangeText={setNote}
          />
          <View style={styles.notesContainer}>
            {notes.map(note => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.savedNoteText}>{note.conteudo}</Text>
                <TouchableOpacity style={styles.deleteNoteButton} onPress={() => handleDeleteNote(note.id)}>
                < FontAwesome5 name="trash" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.saveNoteButton} onPress={handleSaveNote}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  //   return (
  //     <View style={styles.flexContainer}>
  //       <ScrollView contentContainerStyle={styles.container}>
  //         <Text style={styles.title}>Bloco de Notas</Text>
  //         <TextInput
  //           style={styles.input}
  //           placeholder="Digite seu lembrete aqui"
  //           multiline={true}
  //           value={note}
  //           onChangeText={setNote}
  //         />
  //         <View style={styles.notesContainer}>
  //           {renderNotes()}
  //         </View>
  //       </ScrollView>
  //       <TouchableOpacity style={styles.saveNoteButton} onPress={handleSaveNote}>
  //         <Text style={styles.buttonText}>Salvar</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  const styles = StyleSheet.create({
    flexContainer: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#222',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
      textAlign: 'center',
      marginTop: 30,
    },
    alarmCard: {
      width: '100%',
      backgroundColor: '#333',
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    alarmCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    alarmCardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
    },
    alarmLabel: {
      fontSize: 28,
      color: '#fff',
      fontWeight: 'bold',
    },
    alarmTime: {
      fontSize: 28,
      color: '#00ffff',
      fontWeight: 'bold',
    },
    switch: {
      transform: [{ scale: 1.3 }],
      position: 'absolute',
      top: 10,
      right: 10,
    },
    setAlarmButton: {
      backgroundColor: '#dc143c',
      borderRadius: 50,
      paddingVertical: 14,
      paddingHorizontal: 50,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    setAlarmButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    editButton: {
      backgroundColor: '#ff4500',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginLeft: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    deleteButton: {
      backgroundColor: '#dc143c',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginLeft: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    editInput: {
      width: '100%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#dc143c',
      borderRadius: 50,
      paddingVertical: 14,
      paddingHorizontal: 50,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      fontSize: 16,
    },
    saveNoteButton: {
      backgroundColor: '#dc143c',
      borderRadius: 50,
      paddingVertical: 14,
      paddingHorizontal: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    notesContainer: {
      width: '100%',
      alignItems: 'center',
    },
    notesTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff',
      textAlign: 'center',
    },
    noteCard: {
      width: '100%',
      backgroundColor: '#333',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    savedNoteText: {
      flex: 1,
      fontSize: 16,
      color: '#fff',
    },
    deleteNoteButton: {
      backgroundColor: '#dc143c',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginLeft: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
  });