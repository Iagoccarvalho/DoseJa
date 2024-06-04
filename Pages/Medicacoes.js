import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Switch, Modal, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';

import { FIREBASE_AUTH } from '../firebaseConfig';
import { FIREBASE_DB } from '../firebaseConfig';

import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs, Timestamp  } from "firebase/firestore"; 

export default function Medicacoes({ navigation }) {
  const [alarmList, setAlarmList] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState(new Date());
  const [newMedicationName, setNewMedicationName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddingDose, setIsAddingDose] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const db = FIREBASE_DB;
  const auth = FIREBASE_AUTH;
  const userId = FIREBASE_AUTH.currentUser.uid;


  useEffect(() => {

  const importarListaMedicacoes = async () => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      const querySnapshot = await getDocs(collection(userRef, 'medicacoes'));

      const alarms = [];

      querySnapshot.forEach((doc) => {
        const newAlarm = {
          id: doc.id,
          isOn: doc.data().isOn,
          medicationName: doc.data().medicationName,
          time: new Timestamp(doc.data().time.seconds, doc.data().time.nanoseconds).toDate()
        }
        alarms.push(newAlarm);
      });
      setAlarmList(alarms);
    }catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  importarListaMedicacoes();
}, []);

  const handleLogout = async () => {
    try{
      auth.signOut();
      navigation.navigate('Login');
    } catch(e){
      Alert.alert('Logout', 'erro ao fazer logout!');
    }

  };

  const handleAlarmToggle = async (id, isOn) => {
    const userRef = doc(db, 'usuarios', userId);

    if(isOn){
      await updateDoc(doc(userRef, 'medicacoes', id), {
        isOn: false
      });
    } else {
        await updateDoc(doc(userRef, 'medicacoes', id), {
          isOn: true
      });
    }

    const updatedAlarmList = alarmList.map(alarm => {
      if (alarm.id === id) {
        return { ...alarm, isOn: !alarm.isOn };
      }
      return alarm;
    });
    setAlarmList(updatedAlarmList);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime !== undefined) {
      setNewAlarmTime(selectedTime);
      setShowTimePicker(false);
      setModalVisible(true);
    }
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  const handleCancel = () => {
    setNewMedicationName('');
    setShowTimePicker(false);
    setModalVisible(false);
    setIsAddingDose(false);
    setEditingAlarm(null);
  };

  const handleSave = async (editindId) => {
    if (newMedicationName.trim() === '') {
      alert('Por favor, insira o nome da medicação.');
      return;
    }

    if (isAddingDose) {
      try{

        const medicacoes = collection(doc(db, 'usuarios', userId), 'medicacoes');
        const docRef = await addDoc(medicacoes, {
          time: newAlarmTime,
          isOn: false,
          medicationName: newMedicationName
        });

        const medicacaoId = docRef.id;
        const newAlarm = { id: medicacaoId, time: newAlarmTime, isOn: false, medicationName: newMedicationName };

        setAlarmList([...alarmList, newAlarm]);

      } catch (error) {

          console.error('Erro ao adicionar documento à nova coleção: ', error);
          Alert.alert('', 'Erro ao adicionar dose')

      }   
    } else if (editingAlarm !== null) {
      const novosDados = {
        medicationName: newMedicationName,
        time: newAlarmTime
      };
      updateMedicacao(editingAlarm.id, novosDados);
      const updatedAlarmList = alarmList.map(alarm => {
        if (alarm.id === editingAlarm.id) {
          setModalVisible(false);
          return { ...alarm, medicationName: newMedicationName, time: newAlarmTime };
        }
        setModalVisible(false);
        return alarm;
      });
      setAlarmList(updatedAlarmList);
    }

    handleCancel();
  };

  const updateMedicacao = async (medicacaoId, novosDados) => {
    try {
      const userRef = doc(db, "usuarios", userId);
      const medicacoes = collection(userRef, "medicacoes");
      const medicacaoRef = doc(medicacoes, medicacaoId);
      await updateDoc(medicacaoRef, novosDados);
    } catch (error) {
        console.error('Erro ao atualizar documento: ', error);
    }
  }

  const handleEditAlarm = (id) => {
    const alarm = alarmList.find(alarm => alarm.id === id);
    setEditingAlarm(alarm);
    setNewAlarmTime(alarm.time);
    setNewMedicationName(alarm.medicationName);
    setIsAddingDose(false);
    setShowTimePicker(true);
  };

  const handleDeleteAlarm = async (id) => {
    try{
      const userRef = doc(db, 'usuarios', userId);
      await deleteDoc(doc(userRef, 'medicacoes', id));
      const updatedAlarmList = alarmList.filter(alarm => alarm.id !== id);
      setAlarmList(updatedAlarmList);
    }catch(error){
      alert('Erro ao deletar');
    }
    
  };

  const handleAddDose = () => {
    setIsAddingDose(true);
    openTimePicker();
  };

  return (
    <View style={styles.flexContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicações</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>  
        <ScrollView contentContainerStyle={styles.container}>
          {alarmList.map(alarm => (
          <View key={alarm.id} style={styles.alarmCard}>
            <Text style={styles.alarmLabel}>{alarm.medicationName}</Text>
            <Text style={styles.alarmTime}>{alarm.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={alarm.isOn ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => handleAlarmToggle(alarm.id, alarm.isOn)}
              value={alarm.isOn}
              style={styles.switch}
            />
            <View style={styles.alarmCardActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditAlarm(alarm.id)}>
                <FontAwesome5 name="pencil-alt" size={14} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAlarm(alarm.id)}>
                <FontAwesome5 name="trash" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.setAlarmButton} onPress={handleAddDose}>
        <Text style={styles.setAlarmButtonText}>Adicionar Dose</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={newAlarmTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingAlarm ? 'Editar Medicação' : 'Adicionar Dose'}</Text>
              <TextInput
                style={styles.editInput}
                value={newMedicationName}
                onChangeText={setNewMedicationName}
                placeholder="Digite o nome da medicação"
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#222',
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
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
  },
  logoutButton: {
    padding: 10,
    marginTop: 30,
    backgroundColor: '#dc143c',
    borderRadius: 20,
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