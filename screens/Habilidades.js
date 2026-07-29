import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { buscarPersonagem, salvarHabilidade, buscarHabilidades} from '../database';

function ItemHabilidade({ nome, descricao }) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.cardHabilidade}>
      <View style={styles.linhaHabilidade}>
        <Text style={styles.textoChave}>{nome}</Text>
        <TouchableOpacity style={styles.botaoVer} onPress={() => setAberto(!aberto)}>
          <Text style={styles.botaoVerTexto}>{aberto ? '👁️ Ocultar' : '👁️ Ver'}</Text>
        </TouchableOpacity>
      </View>
      
      {aberto && (
        <View style={styles.containerDescricao}>
          <Text style={styles.textoValor}>{descricao}</Text>
        </View>
      )}
    </View>
  );
}

export default function Habilidades({ route }) {
  const [HabilidadesClasse, setHabilidadesClasse] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [novoNomeHab, setNovoNomeHab] = useState('');
  const [novaDescHab, setNovaDescHab] = useState('');

  // 1. Corrigido o ID: garantindo pegar de route.params.personagem ou route.params direto
  const idPersonagem =  route.params.personagem.id

useEffect(() => {
  if (idPersonagem) {
    const lista = buscarHabilidades(idPersonagem);
    setHabilidadesClasse(lista || []);
  }
}, [idPersonagem]);

function adicionarHabilidade() {
  if (novoNomeHab.trim() === '' || novaDescHab.trim() === '') {
    Alert.alert("Erro", "Por favor, preencha o nome e a descrição.");
    return;
  }

  salvarHabilidade(idPersonagem, { nome: novoNomeHab, descricao: novaDescHab });

  // re-busca do banco para já vir com o id real gerado pelo SQLite
  setHabilidadesClasse(buscarHabilidades(idPersonagem));

  setNovoNomeHab('');
  setNovaDescHab('');
  setMostrarFormulario(false);
}


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.titulo}>Habilidades de Classe</Text>
        
        {/* Lista de Habilidades */}
        <View style={styles.listaContainer}>
          {HabilidadesClasse.map((hab) => (
            <ItemHabilidade 
              key={hab.id} 
              nome={hab.nome_habilidade} 
              descricao={hab.descricao_habilidade} 
            />
          ))}
        </View>

        {/* Formulário Condicional */}
        {mostrarFormulario && (
          <View style={styles.formulario}>
            <TextInput 
              style={styles.inputGrande}
              placeholder="Nome da Habilidade"
              placeholderTextColor="#888"
              value={novoNomeHab}
              onChangeText={setNovoNomeHab}
            />
            <TextInput 
              style={[styles.inputGrande, { height: 60 }]} 
              placeholder="Descrição da Habilidade"
              placeholderTextColor="#888"
              value={novaDescHab}
              onChangeText={setNovaDescHab}
              multiline
            />
            <TouchableOpacity style={styles.botaoConfirmar} onPress={adicionarHabilidade}>
              <Text style={styles.botaoConfirmarTexto}>Salvar Habilidade</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botão de Alternar Formulário */}
        <TouchableOpacity 
          style={[styles.botao, mostrarFormulario && styles.botaoCancelar]} 
          onPress={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Text style={styles.botaoTexto}>{mostrarFormulario ? '❌' : '➕'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Estilos atualizados
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60 
  },
  conteudo: { 
    paddingBottom: 60 
  },
  titulo: {
    color: '#e2b96f',
    fontSize: 24,
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  botao: { 
    backgroundColor: '#16213e', 
    borderWidth: 1, 
    borderColor: '#e2b96f', 
    borderRadius: 10, 
    padding: 10, 
    width: 50,
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 40,
  },
  botaoCancelar: {
    borderColor: '#ff5555', // Fica vermelho se o formulário estiver aberto para indicar "fechar"
  },
  botaoTexto: { 
    color: '#e2b96f', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  inputGrande: {
    backgroundColor: '#16213e',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 8,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  formulario: {
    width: '100%',
    backgroundColor: '#1f1f3a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2b96f'
  },
  botaoConfirmar: {
    backgroundColor: '#e2b96f',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  botaoConfirmarTexto: {
    color: '#1a1a2e',
    fontWeight: 'bold'
  },
  listaContainer: {
    width: '100%',
    marginBottom: 10,
  },
  cardHabilidade: {
    backgroundColor: '#16213e',
    borderLeftWidth: 4,
    borderLeftColor: '#e2b96f',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  linhaHabilidade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textoChave: {
    color: '#e2b96f',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1, // Faz o nome ocupar o espaço necessário sem esmagar o botão
  },
  botaoVer: {
    backgroundColor: '#1f1f3a',
    borderWidth: 1,
    borderColor: '#e2b96f',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  botaoVerTexto: {
    color: '#fff',
    fontSize: 12,
  },
  containerDescricao: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#252545',
    paddingTop: 8,
  },
  textoValor: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  }
});