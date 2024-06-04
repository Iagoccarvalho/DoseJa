import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const auth = FIREBASE_AUTH;

  const limparForm = () => {
    setEmail('');
    setSenha('');
  }

  const handleLogin = () => {
    if(email && senha){
      signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
          limparForm();
          navigation.navigate('Home');
      })
      .catch((error) => {
        const code = error.code;
        switch (code) {
          case 'auth/invalid-credential':
            Alert.alert('', 'Usuário inválido');
            limparForm();
            break;
          default:
            Alert.alert('', 'Erro ao logar');
        }
      });
    }
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
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>Criar conta gratuita</Text>
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
    backgroundColor: '#272727',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  loginButton: {
    backgroundColor: '#dc143c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#28A745',
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
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});