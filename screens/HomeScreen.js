import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { listarPersonagens } from '../database';

export default function HomeScreen({ navigation }) {
  const [personagens, setPersonagens] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const lista = listarPersonagens();
      setPersonagens(lista);
    });
    return unsubscribe;
  }, [navigation]);

  function deletarPersonagem(id) {
    // Implementar a função de deletar personagem do banco de dados
    const deletar = require('../database').deletarPersonagem;
    deletar(id);
    // Após deletar, atualizar a lista de personagens
    const listaAtualizada = listarPersonagens();
    setPersonagens(listaAtualizada);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>⚔️ Ficha de RPG</Text>
      <Text style={styles.subtitulo}>D&D 5ª Edição</Text>

  <FlatList
  data={personagens}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Personagem', { personagem: item })}
    >
      <Text style={styles.cardNome}>{item.nome}</Text>
      <Text style={styles.cardInfo}>{item.classe} • {item.raca}</Text>
      <TouchableOpacity
        style={{ ...styles.botaodeletar, marginTop: 5 }}
        onPress={() => Alert.alert(
        'Deletar Personagem',
        'Tem certeza que deseja deletar este personagem?',
        [
      { text: 'Cancelar', style: 'BotaoTexto' },
      { text: 'Deletar', style: 'BotaoTexto', onPress: () => deletarPersonagem(item.id) },
    ]
  )}
      >
        <Text style={styles.botaoTexto}>🗑️ Deletar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )}
  ListEmptyComponent={
    <Text style={styles.vazio}>Nenhum personagem criado ainda.</Text>
  }
/>

<TouchableOpacity
  style={styles.botao}
  onPress={() => navigation.navigate('DadosPessoais')}
>
  <Text style={styles.botaoTexto}>➕ Novo Personagem</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  titulo: {
    color: '#e2b96f',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardNome: {
    color: '#e2b96f',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardInfo: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  vazio: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#e2b96f',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaodeletar: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    marginTop: 5,
  },
});