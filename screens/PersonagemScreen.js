import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { buscarPersonagem, buscarStatusCombate, salvarStatusCombate } from '../database';
export default function PersonagemScreen({ route, navigation }) {
  const [personagem, setPersonagem] = useState(route.params?.personagem || null);
  
  const [ca, setCa] = useState('');
  const [pvAtual, setPvAtual] = useState('');
  const [pvMax, setPvMax] = useState('');
  const [listaAtaques, setListaAtaques] = useState([
    { id: 1, nome: '', bonus: '', dano: '', obs: '' }
  ]);

  const idPersonagem = personagem?.id;

  // 1. CARREGAR OS DADOS QUANDO A TELA GANHAR FOCO
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (idPersonagem) {
        // Atualiza dados básicos do personagem
        const atualizado = buscarPersonagem(idPersonagem);
        if (atualizado) setPersonagem(atualizado);

        // NOVO: Busca CA, PVs e Armas do banco
        const dadosCombate = buscarStatusCombate(idPersonagem);
        if (dadosCombate) {
          setCa(dadosCombate.ca || '');
          setPvAtual(dadosCombate.pv_atual || '');
          setPvMax(dadosCombate.pv_max || '');
          if (dadosCombate.ataques && dadosCombate.ataques.length > 0) {
            setListaAtaques(dadosCombate.ataques);
          }
        }
      }
    });
    return unsubscribe;
  }, [navigation, idPersonagem]);

  // 2. FUNÇÃO UNIFICADA PARA MANDAR PRO BANCO
  function guardarDadosCombate(listaAtual = listaAtaques) {
    if (!idPersonagem) return;
    try {
      salvarStatusCombate(idPersonagem, ca, pvAtual, pvMax, listaAtual);
    } catch (error) {
      console.error("Erro ao salvar dados de combate:", error);
    }
  }

  // 3. AUTOSALVAMENTO INTELIGENTE (Roda sempre que algo mudar)
  useEffect(() => {
    if (!idPersonagem) return;

    const timerSalvar = setTimeout(() => {
      guardarDadosCombate();
    }, 800); // Salva automático 800ms após o usuário parar de digitar

    return () => clearTimeout(timerSalvar);
  }, [ca, pvAtual, pvMax, listaAtaques]);

  // 4. ATUALIZAR FUNÇÃO DE ADICIONAR ARMA (Para salvar na hora o novo campo criado)
  function adicionarNovoAtaque() {
    const novoAtaque = {
      id: Date.now(),
      nome: '',
      bonus: '',
      dano: '',
      obs: ''
    };
    const novaLista = [...listaAtaques, novoAtaque];
    setListaAtaques(novaLista);
    guardarDadosCombate(novaLista); // Salva imediatamente a existência da nova caixinha
  }

  function atualizarCampoAtaque(id, campo, valor) {
    const listaAtualizada = listaAtaques.map(ataque => {
      if (ataque.id === id) {
        return { ...ataque, [campo]: valor };
      }
      return ataque;
    });
    setListaAtaques(listaAtualizada);
  }

  // ... (Resto do seu código do return JSX e Styles permanecem iguais)
  return (
    <ScrollView 
    style={styles.container} 
    contentContainerStyle={styles.scrollContainer} // Alterado aqui
  >
      {/* Cabeçalho do Personagem */}
      <Text style={styles.titulo}>{personagem.nome}</Text>
      <Text style={styles.subtitulo}>{personagem.classe} • {personagem.raca}</Text>

      {/* Grid de Status Rápido (CA e PV) */}
      <View style={styles.rowStatus}>
        <View style={styles.cardStatus}>
          <Text style={styles.infoLabel}>🛡️ CA</Text>
          <TextInput 
            style={styles.inputStatus} 
            value={ca} 
            onChangeText={setCa} 
            placeholder="10"
            placeholderTextColor="#555"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.cardStatus, { flex: 2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.infoLabel}>❤️ PV Atual</Text>
            <TextInput 
              style={[styles.inputStatus, { color: '#ff5555' }]} 
              value={pvAtual} 
              onChangeText={setPvAtual} 
              placeholder="0"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
          
          <Text style={{ color: '#e2b96f', fontSize: 20, marginTop: 15 }}>/</Text>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.infoLabel}>MAX</Text>
            <TextInput 
              style={styles.inputStatus} 
              value={pvMax} 
              onChangeText={setPvMax} 
              placeholder="0"
              placeholderTextColor="#555"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Seção de Ataque / Armas */}
  <View style={styles.secaoArmas}>
  {/* Cabeçalho alinhado com o Botão de Adicionar */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
    <Text style={styles.tituloSecao}>⚔️ Ataques Rápidos</Text>
    <TouchableOpacity 
      style={{ backgroundColor: '#e2b96f', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}
      onPress={adicionarNovoAtaque}
    >
      <Text style={{ color: '#1a1a2e', fontWeight: 'bold', fontSize: 14 }}>➕ Add Arma</Text>
    </TouchableOpacity>
  </View>
  
  {/* Cabeçalho da Tabela */}
  <View style={styles.rowArmasHeader}>
    <Text style={[styles.labelArmaHeader, { flex: 2 }]}>Nome</Text>
    <Text style={[styles.labelArmaHeader, { flex: 1 }]}>Bônus</Text>
    <Text style={[styles.labelArmaHeader, { flex: 1.2 }]}>Dano/Tipo</Text>
    <Text style={[styles.labelArmaHeader, { flex: 1.5 }]}>Obs</Text>
  </View>

  {/* RENDERIZAÇÃO DINÂMICA DAS LINHAS */}
  {listaAtaques.map((ataque) => (
    <View key={ataque.id} style={[styles.rowArmasInputs, { marginBottom: 8 }]}>
      <TextInput 
        style={[styles.inputArma, { flex: 2, textAlign: 'left' }]} 
        value={ataque.nome}
        onChangeText={(text) => atualizarCampoAtaque(ataque.id, 'nome', text)}
        placeholder="Espada..."
        placeholderTextColor="#555"
      />
      <TextInput 
        style={[styles.inputArma, { flex: 1 }]} 
        value={ataque.bonus}
        onChangeText={(text) => atualizarCampoAtaque(ataque.id, 'bonus', text)}
        placeholder="+5"
        placeholderTextColor="#555"
      />
      <TextInput 
        style={[styles.inputArma, { flex: 1.2 }]} 
        value={ataque.dano}
        onChangeText={(text) => atualizarCampoAtaque(ataque.id, 'dano', text)}
        placeholder="1d8+3"
        placeholderTextColor="#555"
      />
      <TextInput 
        style={[styles.inputArma, { flex: 1.5, textAlign: 'left' }]} 
        value={ataque.obs}
        onChangeText={(text) => atualizarCampoAtaque(ataque.id, 'obs', text)}
        placeholder="Acuidade..."
        placeholderTextColor="#555"
      />
    </View>
  ))}
</View>

      {/* Menu de Navegação Interativo */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.push('DadosPessoais', { personagem })}
        >
          <Text style={styles.botaoTexto}>📋 Dados Pessoais</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botao}
          onPress={() => navigation.push('Atributos', { personagem })}
        >
          <Text style={styles.botaoTexto}>⚔️ Atributos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.push('Itens', { personagem })}
        >
          <Text style={styles.botaoTexto}>🎒 Inventário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.push('Habilidades', { personagem })}
        >
          <Text style={styles.botaoTexto}>💪🏻 Habilidades</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botao}
          onPress={() => navigation.push('Magias', { personagem })}
        >
          <Text style={styles.botaoTexto}>✨ Magias</Text>
        </TouchableOpacity>
      </View>
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
  scrollContainer: {
    paddingBottom: 100, // Cria o espaço em branco necessário no final da tela
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
    marginBottom: 25,
  },
  
  // Estilos da linha de Status (CA e PV)
  rowStatus: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cardStatus: {
    flex: 1,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  inputStatus: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 2,
    minWidth: 45,
  },

  // Estilos da Seção de Armas / Tabela
  secaoArmas: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34495e',
    padding: 12,
    marginBottom: 30,
  },
  tituloSecao: {
    color: '#e2b96f',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowArmasHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
    paddingBottom: 6,
    marginBottom: 6,
  },
  labelArmaHeader: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowArmasInputs: {
    flexDirection: 'row',
    gap: 6,
  },
  inputArma: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2b96f',
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  // Estilos do Menu de Botões
  menu: {
    gap: 12,
  },
  botao: {
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#e2b96f',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#e2b96f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});