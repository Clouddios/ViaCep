import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import logo from './assets/correios-logo.png'; // Importe a imagem local

export default function App() {
  // HOOK
  const [cep, setCep] = useState(''); // Cria um estado para o CEP
  let [dados, setDados] = useState([]); // Cria um estado para os dados do CEP
  let [erro, setErro] = useState(''); // Cria um estado para a mensagem de erro

  const BuscaCep = ()=>{
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
      .then((response)=>{return response.json()}
      ).then(
        (data)=>{
          if (data.erro) {
            setErro('CEP inválido');
            setDados([]);
          } else {
            setErro('');
            setDados(data);
          }
        }
    ).catch(
        ()=>{setErro('Erro ao buscar CEP')}
    )
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Title>Busca de CEP</Title>
        <TextInput
          label='Digite seu CEP'
          value={cep}
          onChangeText={(x)=>{setCep(x)}}
          keyboardType='numeric'
          mode='outlined'
          style={styles.input}
        />
        <Button
          mode="contained"
          icon="magnify"
          onPress={() => {BuscaCep(cep)}}
          style={styles.button}
          buttonColor="blue"
        >
          Buscar
        </Button>
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        <Card style={styles.resultContainer}>
          <Card.Content>
            <Title>Resultado:</Title>
            <Paragraph>Logradouro: {dados.logradouro}</Paragraph>
            <Paragraph>Bairro: {dados.bairro}</Paragraph>
            <Paragraph>Localidade: {dados.localidade}</Paragraph>
            <Paragraph>UF: {dados.uf}</Paragraph>
            <Paragraph>CEP: {dados.cep}</Paragraph>
          </Card.Content>
        </Card>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 10,
    color: 'blue',
  },
  button: {
    width: '80%',
    marginBottom: 20,
  },
  resultContainer: {
    width: '80%',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
});
