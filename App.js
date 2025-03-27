import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, List, Portal, Modal, Provider } from 'react-native-paper';
import logo from './assets/correios-logo.png';

export default function App() {
  // HOOKS
  const [cep, setCep] = useState('');
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState('');
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [sexoSelecionado, setSexoSelecionado] = useState('');
  const [accordionExpandedEstado, setAccordionExpandedEstado] = useState(false);
  const [accordionExpandedSexo, setAccordionExpandedSexo] = useState(false);
  const [visible, setVisible] = useState(false);

    // Adicionando os estados para nome e telefone
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  

  const estados = [
    'Acre (AC)', 'Alagoas (AL)', 'Amapá (AP)', 'Amazonas (AM)', 'Bahia (BA)',
    'Ceará (CE)', 'Distrito Federal (DF)', 'Espírito Santo (ES)', 'Goiás (GO)',
    'Maranhão (MA)', 'Mato Grosso (MT)', 'Mato Grosso do Sul (MS)', 'Minas Gerais (MG)',
    'Pará (PA)', 'Paraíba (PB)', 'Paraná (PR)', 'Pernambuco (PE)', 'Piauí (PI)',
    'Rio de Janeiro (RJ)', 'Rio Grande do Norte (RN)', 'Rio Grande do Sul (RS)',
    'Rondônia (RO)', 'Roraima (RR)', 'Santa Catarina (SC)', 'São Paulo (SP)',
    'Sergipe (SE)', 'Tocantins (TO)'
  ];

  const sexo = ['Masculino', 'Feminino', 'Outro'];

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  };

  const BuscaCep = () => {
    // Validação simples do CEP
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      setErro('Formato de CEP inválido');
      showModal();
      return;
    }

    let url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          setErro('CEP inválido');
          setDados([]);
          setEstadoSelecionado('');
          showModal();
        } else {
          setErro('');
          setDados(data);

          // Seleciona automaticamente o estado com base no UF retornado
          const estadoEncontrado = estados.find((estado) =>
            estado.includes(`(${data.uf})`)
          );
          setEstadoSelecionado(estadoEncontrado || '');
        }
      })
      .catch(() => {
        setErro('Erro ao buscar CEP');
        setEstadoSelecionado('');
        showModal();
      });
  };

  const handleSelectEstado = (estado) => {
    setEstadoSelecionado(estado);
    setAccordionExpandedEstado(false);
  };

  const handleSelectSexo = (sexo) => {
    setSexoSelecionado(sexo);
    setAccordionExpandedSexo(false);
  };

  return (
    <Provider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <TextInput
              label="Digite seu Nome"
              value={nome}
              onChangeText={(x) => setNome(x)}
              keyboardType="default"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Digite seu Telefone"
              value={telefone}
              onChangeText={(x) => setTelefone(x)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <List.Section style={styles.listSection}>
              <List.Accordion
                title={sexoSelecionado || 'Selecione o sexo'}
                left={(props) => <List.Icon {...props} icon="account" />}
                expanded={accordionExpandedSexo}
                onPress={() => setAccordionExpandedSexo(!accordionExpandedSexo)}
              >
                {sexo.map((item, index) => (
                  <List.Item
                    key={index}
                    title={item}
                    onPress={() => handleSelectSexo(item)}
                  />
                ))}
              </List.Accordion>
            </List.Section>
            <Title>Busca de CEP</Title>
            <TextInput
              label="Digite seu CEP"
              value={cep}
              onChangeText={(x) => setCep(x)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
            <Button
              mode="contained"
              icon="magnify"
              onPress={BuscaCep}
              style={styles.button}
              buttonColor="blue"
            >
              Buscar
            </Button>
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
            <List.Section style={styles.listSection}>
              <List.Accordion
                title={estadoSelecionado || 'Selecione o estado'}
                left={(props) => <List.Icon {...props} icon="map" />}
                expanded={accordionExpandedEstado}
                onPress={() => setAccordionExpandedEstado(!accordionExpandedEstado)}
              >
                {estados.map((estado, index) => (
                  <List.Item
                    key={index}
                    title={estado}
                    onPress={() => handleSelectEstado(estado)}
                  />
                ))}
              </List.Accordion>
            </List.Section>
            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                  <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', fontWeight: 'bold', paddingBottom: '10%', paddingTop: '10%'}}>{erro}</Text>
              </Modal>
            </Portal>
            <Button
              mode="contained"
              icon="send"
              onPress={() => alert(`Nome: ${nome}\nTelefone: ${telefone}\nSexo: ${sexoSelecionado}\nCEP: ${cep}\nLogradouro: ${dados.logradouro}\nBairro: ${dados.bairro}\nLocalidade: ${dados.localidade}\nUF: ${dados.uf}`)}
              style={styles.button}
              buttonColor="green"
            >
              Enviar
            </Button>

            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Provider>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
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
  },
  button: {
    width: '80%',
    marginBottom: 20,
  },
  resultContainer: {
    width: '80%',
  },
  listSection: {
    width: '90%',
    marginTop: 20,
  },
});