import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Alert, } from 'react-native';
import { salvarPersonagem, atualizarPersonagem } from '../database';

export default function DadosPessoais({ route, navigation }) {

  const [nome, setNome] = useState('');
  const [classe, setClasse] = useState('');
  const [antecedente, setAntecedente] = useState('');
  const [raca, setRaca] = useState('');
  const [nivel, setNivel] = useState('');
  const [subclasse, setSubclasse] = useState('');
  const [iniciativa, setIniciativa] = useState('');
  const [deslocamento, setDeslocamento] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [aparencia, setAparencia] = useState('');
  const [historia, setHistoria] = useState('');
  const [ideais, setIdeais] = useState('');
  const [vinculos, setVinculos] = useState('');
  const [defeitos, setDefeitos] = useState('');
  const [idiomas, setIdiomas] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    if (route.params?.personagem) {
      const p = route.params.personagem;
      setNome(p.nome || '');
      setClasse(p.classe || '');
      setAntecedente(p.antecedente || '');
      setRaca(p.raca || '');
      setNivel(p.nivel || '');
      setSubclasse(p.subclasse || '');
      setIniciativa(p.iniciativa || '');
      setDeslocamento(p.deslocamento || '');
      setTamanho(p.tamanho || '');if (route.params?.personagem)
      setAparencia(p.aparencia || '');
      setHistoria(p.historia || '');
      setIdeais(p.ideais || '');
      setVinculos(p.vinculos || '');
      setDefeitos(p.defeitos || '');
      setIdiomas(p.idiomas || '');
    }
  });
  return unsubscribe;
}, [navigation]);

  function handleSalvar() {
    if (!nome || !classe || !raca) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios: Nome, Classe e Raça.');
      return;
    }

    const dados = {
      nome, classe, raca, antecedente, nivel, subclasse,
      iniciativa, deslocamento, tamanho,
      aparencia, historia, ideais, vinculos, defeitos, idiomas
    };

    if (route.params?.personagem) {
      atualizarPersonagem(route.params.personagem.id, dados);
    } else {
      salvarPersonagem(dados);
    }
    Alert.alert('Sucesso', 'Personagem salvo com sucesso!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>Dados Pessoais do Personagem</Text>

      <Text style={styles.info}>Nome do Personagem</Text>
      <TextInput style={styles.campo} placeholder="Digite o nome do personagem" placeholderTextColor="#999" onChangeText={setNome} value={nome} />

      <Text style={styles.info}>Classe</Text>
      <TextInput style={styles.campo} placeholder="Digite a classe do personagem" placeholderTextColor="#999" onChangeText={setClasse} value={classe} />

      <Text style={styles.info}>Antecedente</Text>
      <TextInput style={styles.campo} placeholder="Ex: Nobre, Mercenário..." placeholderTextColor="#999" onChangeText={setAntecedente} value={antecedente} />

      <Text style={styles.info}>Raça</Text>
      <TextInput style={styles.campo} placeholder="Ex: Elfo, Anão..." placeholderTextColor="#999" onChangeText={setRaca} value={raca} />

      <Text style={styles.info}>Nível</Text>
      <TextInput style={styles.campo} placeholder="1" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setNivel} value={nivel} />

      <Text style={styles.info}>Subclasse</Text>
      <TextInput style={styles.campo} placeholder="Ex: Guerreiro - Campeão" placeholderTextColor="#999" onChangeText={setSubclasse} value={subclasse} />

      <Text style={styles.info}>Iniciativa</Text>
      <TextInput style={styles.campo} placeholder="0" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setIniciativa} value={iniciativa} />

      <Text style={styles.info}>Deslocamento</Text>
      <TextInput style={styles.campo} placeholder="9" placeholderTextColor="#999" keyboardType="numeric" onChangeText={setDeslocamento} value={deslocamento} />

      <Text style={styles.info}>Tamanho</Text>
      <TextInput style={styles.campo} placeholder="Médio" placeholderTextColor="#999" onChangeText={setTamanho} value={tamanho} />

      <Text style={styles.info}>Aparência</Text>
      <TextInput style={styles.campo} placeholder="Descreva a aparência" placeholderTextColor="#999" onChangeText={setAparencia} value={aparencia} />

      <Text style={styles.info}>História</Text>
      <TextInput style={styles.campo} placeholder="Descreva a história" placeholderTextColor="#999" onChangeText={setHistoria} value={historia} />

      <Text style={styles.info}>Ideais</Text>
      <TextInput style={styles.campo} placeholder="Descreva os ideais" placeholderTextColor="#999" onChangeText={setIdeais} value={ideais} />

      <Text style={styles.info}>Vínculos</Text>
      <TextInput style={styles.campo} placeholder="Descreva os vínculos" placeholderTextColor="#999" onChangeText={setVinculos} value={vinculos} />

      <Text style={styles.info}>Defeitos</Text>
      <TextInput style={styles.campo} placeholder="Descreva os defeitos" placeholderTextColor="#999" onChangeText={setDefeitos} value={defeitos} />

      <Text style={styles.info}>Idiomas</Text>
      <TextInput style={styles.campo} placeholder="Liste os idiomas" placeholderTextColor="#999" onChangeText={setIdiomas} value={idiomas} />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>💾 Salvar Personagem</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  conteudo: {
    paddingBottom: 60,
  },
  titulo: {
    color: '#e2b96f',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  campo: {
    backgroundColor: '#16213e',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2b96f',
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  botaoTexto: {
    color: '#e2b96f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});