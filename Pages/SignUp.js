import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import { useState } from 'react';

import { FIREBASE_AUTH } from '../firebaseConfig';
import { FIREBASE_DB } from '../firebaseConfig';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 

export default function SignUp({ navigation }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const limparForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
  }

  const saveUser = async (uidUser) => {
    try {
      await setDoc(doc(db, "usuarios", uidUser), {nome: nome});
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const uidUser = userCredential.user.uid;
        saveUser(uidUser);
        limparForm();
        navigation.navigate('Login');
    })
      .catch((error) => {
        const code = error.code;
        switch (code) {
          case 'auth/weak-password':
            Alert.alert('', 'Senha fraca');
            limparForm();
            break;
          default:
            Alert.alert('', 'Erro ao cadastrar');
        }
      });
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <ImageBackground
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#888"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            autoCompleteType="email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            placeholderTextColor="#888"
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupVoltarButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLink}>Faça login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#272727', // Cor de fundo cinza escuro meio claro com transparência
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Cor de fundo do container com transparência
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -25,
  },
  logo: {
    width: 250,
    height: 250,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupVoltarButton: {
    backgroundColor: '#dc143c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFF',
    fontSize: 16,
  },
  loginLink: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});