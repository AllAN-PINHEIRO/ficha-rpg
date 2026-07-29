import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Importando as funções do banco atualizadas
import { 
  buscarMagias, 
  salvarMagias, 
  deletarMagias, 
  buscarDadosConjuracao, 
  salvarDadosConjuracao 
} from '../database';

function AtributosConjuracao({
  atributoConjuracao, setAtributoConjuracao,
  modConjuracao, setModConjuracao,
  cdEvitar, setCdEvitar,
  bonusAtaque, setBonusAtaque,
}) {
  return (
    <View>
      <Text style={styles.tituloBloco}>Atributos de conjuração</Text>
      <View style={styles.gradeAtributos}>
        <View style={styles.celulaAtributo}>
          <Text style={styles.info}>Atributo</Text>
          <TextInput
            style={styles.campoGrade}
            value={atributoConjuracao}
            onChangeText={setAtributoConjuracao}
          />
        </View>
        <View style={styles.celulaAtributo}>
          <Text style={styles.info}>Mod.</Text>
          <TextInput
            style={styles.campoGrade}
            value={modConjuracao}
            onChangeText={setModConjuracao}
          />
        </View>
        <View style={styles.celulaAtributo}>
          <Text style={styles.info}>CD evitar</Text>
          <TextInput
            style={styles.campoGrade}
            value={cdEvitar}
            onChangeText={setCdEvitar}
          />
        </View>
        <View style={styles.celulaAtributo}>
          <Text style={styles.info}>Bônus ataque</Text>
          <TextInput
            style={styles.campoGrade}
            value={bonusAtaque}
            onChangeText={setBonusAtaque}
          />
        </View>
      </View>
    </View>
  );
}

function EspacosMagiaBloco({ espacosMagia, onToggle, titulos }) {
  const niveis = Object.keys(espacosMagia).map(Number);
  const meio = Math.ceil(niveis.length / 2);
  const colunaA = niveis.slice(0, meio);
  const colunaB = niveis.slice(meio);

  function renderLinha(nivel) {
    return (
      <View key={nivel} style={styles.linhaCirculo}>
        <Text style={styles.labelCirculo}>{titulos[nivel]}</Text>
        <View style={styles.grupoCirculos}>
          {espacosMagia[nivel].map((usado, index) => (
            <TouchableOpacity key={index} onPress={() => onToggle(nivel, index)}>
              <Text style={styles.iconeCirculo}>{usado ? '🔴' : '🟢'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.tituloBloco}>Espaços de magia</Text>
      <View style={styles.duasColunasCirculos}>
        <View style={styles.colunaCirculos}>{colunaA.map(renderLinha)}</View>
        <View style={styles.colunaCirculos}>{colunaB.map(renderLinha)}</View>
      </View>
    </View>
  );
}

function ItemMagia({ nome, descricao, onDeletar }) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.cardMagia}>
      <View style={styles.linhaMagia}>
        <Text style={styles.textoChaveMagia}>{nome}</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={styles.botaoVerMagia} onPress={() => setAberto(!aberto)}>
            <Text style={styles.botaoVerTextoMagia}>{aberto ? '👁️ Ocultar' : '👁️ Ver'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoVerMagia, { borderColor: '#ff5555' }]} onPress={onDeletar}>
            <Text style={[styles.botaoVerTextoMagia, { color: '#ff5555' }]}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {aberto && (
        <View style={styles.containerDescMagia}>
          <Text style={styles.textoDescMagia}>{descricao}</Text>
        </View>
      )}
    </View>
  );
}

export default function Magias({ route }) {
  const [atributoConjuracao, setAtributoConjuracao] = useState('');
  const [modConjuracao, setModConjuracao] = useState('');
  const [cdEvitar, setCdEvitar] = useState('');
  const [bonusAtaque, setBonusAtaque] = useState('');

  const [espacosMagia, setEspacosMagia] = useState({
    1: [false, false, false, false],
    2: [false, false, false],
    3: [false, false, false],
    4: [false, false, false],
    5: [false, false, false],
    6: [false, false],
    7: [false, false],
    8: [false],
    9: [false],
  });

  const [listaMagias, setListaMagias] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoNomeMagia, setNovoNomeMagia] = useState('');
  const [novaDescMagia, setNovaDescMagia] = useState('');

  const idPersonagem = route.params?.personagem?.id || route.params?.idPersonagem;

  // 1. CARREGAR MAGIAS, ATRIBUTOS E BOLINHAS DO BANCO
  useEffect(() => {
    if (idPersonagem) {
      try {
        // Carrega a lista de magias salvas
        const magiasDoBanco = buscarMagias(idPersonagem);
        if (magiasDoBanco && magiasDoBanco.length > 0) {
          const listaFormatada = magiasDoBanco.map(item => ({
            id: item.id,
            nome: item.nome_magia,
            descricao: item.desc_magia
          }));
          setListaMagias(listaFormatada);
        }

        // Carrega os dados do cabeçalho e círculos de magia
        const dadosConjuracao = buscarDadosConjuracao(idPersonagem);
        if (dadosConjuracao) {
          setAtributoConjuracao(dadosConjuracao.atribu_conjur || '');
          setModConjuracao(dadosConjuracao.mod_conjur || '');
          setCdEvitar(dadosConjuracao.cd_evit || '');
          setBonusAtaque(dadosConjuracao.bonus_ataque || '');
          if (dadosConjuracao.slots) {
            setEspacosMagia(dadosConjuracao.slots);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados de magia:", error);
      }
    }
  }, [idPersonagem]);

  // 2. FUNÇÃO UNIFICADA PARA SALVAR O CABEÇALHO (Atributos e Bolinhas)
  function guardarMudancasCabecalho(valoresAtuais = {}) {
    if (!idPersonagem) return;

    const slotsParaSalvar = valoresAtuais.slots || espacosMagia;
    const atributo = valoresAtuais.atributo !== undefined ? valoresAtuais.atributo : atributoConjuracao;
    const mod = valoresAtuais.mod !== undefined ? valoresAtuais.mod : modConjuracao;
    const cd = valoresAtuais.cd !== undefined ? valoresAtuais.cd : cdEvitar;
    const bonus = valoresAtuais.bonus !== undefined ? valoresAtuais.bonus : bonusAtaque;

    try {
      salvarDadosConjuracao(
        idPersonagem,
        slotsParaSalvar,
        atributo,
        mod,
        cd,
        bonus
      );
    } catch (error) {
      console.error("Erro ao salvar dados do cabeçalho:", error);
    }
  }

  // 3. MONITORAMENTO E SALVAMENTO AUTOMÁTICO DE TEXTO (Debounce 800ms)
  useEffect(() => {
    if (!idPersonagem) return;

    const timerSalvar = setTimeout(() => {
      guardarMudancasCabecalho();
    }, 800);

    return () => clearTimeout(timerSalvar);
  }, [atributoConjuracao, modConjuracao, cdEvitar, bonusAtaque]);

  // 4. ATUALIZAÇÃO INSTANTÂNEA DAS BOLINHAS
  function toggleEspaco(circulo, index) {
    setEspacosMagia(prev => {
      const novoCirculo = [...prev[circulo]];
      novoCirculo[index] = !novoCirculo[index];
      const novoEstadoGeral = { ...prev, [circulo]: novoCirculo };
      
      // Força o salvamento físico imediato das bolinhas
      guardarMudancasCabecalho({ slots: novoEstadoGeral });
      
      return novoEstadoGeral;
    });
  }

  // 5. ADICIONAR NOVA MAGIA NA LISTA
  function adicionarMagia() {
    if (novoNomeMagia.trim() === '' || novaDescMagia.trim() === '') {
      Alert.alert("Erro", "Por favor, preencha o nome e a descrição da magia.");
      return;
    }

    if (!idPersonagem) {
      Alert.alert("Erro", "ID do personagem inválido.");
      return;
    }

    try {
      salvarMagias(
        idPersonagem,
        cdEvitar,
        bonusAtaque,
        atributoConjuracao,
        modConjuracao,
        novoNomeMagia,
        novaDescMagia
      );

      const magiasAtualizadas = buscarMagias(idPersonagem);
      const listaFormatada = magiasAtualizadas.map(item => ({
        id: item.id,
        nome: item.nome_magia,
        descricao: item.desc_magia
      }));
      
      setListaMagias(listaFormatada);
      setNovoNomeMagia('');
      setNovaDescMagia('');
      setModalVisivel(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a magia no banco.");
      console.error(error);
    }
  }

  function removerMagia(idMagia) {
    try {
      deletarMagias(idMagia);
      setListaMagias(prev => prev.filter(magia => magia.id !== idMagia));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a magia.");
    }
  }

  function fecharModal() {
    setNovoNomeMagia('');
    setNovaDescMagia('');
    setModalVisivel(false);
  }

  const titulos = {
    1: '1º círculo', 2: '2º círculo', 3: '3º círculo',
    4: '4º círculo', 5: '5º círculo', 6: '6º círculo',
    7: '7º círculo', 8: '8º círculo', 9: '9º círculo',
  };

  return (
    <View style={styles.container}>
      <AtributosConjuracao
        atributoConjuracao={atributoConjuracao}
        setAtributoConjuracao={setAtributoConjuracao}
        modConjuracao={modConjuracao}
        setModConjuracao={setModConjuracao}
        cdEvitar={cdEvitar}
        setCdEvitar={setCdEvitar}
        bonusAtaque={bonusAtaque}
        setBonusAtaque={setBonusAtaque}
      />

      <View style={styles.divisor} />

      <EspacosMagiaBloco
        espacosMagia={espacosMagia}
        onToggle={toggleEspaco}
        titulos={titulos}
      />

      <View style={styles.divisor} />

      <View style={styles.blocoMagias}>
        <View style={styles.cabecalhoMagias}>
          <Text style={styles.tituloBloco}>Magias</Text>
          <TouchableOpacity style={styles.botaoAbrirModal} onPress={() => setModalVisivel(true)}>
            <Text style={styles.botaoTextoMagia}>➕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={listaMagias}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ItemMagia 
              nome={item.nome} 
              descricao={item.descricao} 
              onDeletar={() => removerMagia(item.id)} 
            />
          )}
          ListEmptyComponent={
            <Text style={styles.vazioTexto}>Nenhuma magia adicionada ainda.</Text>
          }
          contentContainerStyle={styles.listaMagiasConteudo}
          style={{ flex: 1 }}
        />
      </View>

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <KeyboardAvoidingView
          style={styles.modalFundo}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCaixa}>
            <Text style={styles.tituloBloco}>Nova magia</Text>

            <TextInput
              style={styles.inputMagia}
              placeholder="Nome da Magia"
              placeholderTextColor="#888"
              value={novoNomeMagia}
              onChangeText={setNovoNomeMagia}
            />
            <TextInput
              style={[styles.inputMagia, styles.inputDescMagia]}
              placeholder="Descrição da Magia"
              placeholderTextColor="#888"
              value={novaDescMagia}
              onChangeText={setNovaDescMagia}
              multiline
              blurOnSubmit={false}
              textAlignVertical="top"
            />

            <View style={styles.linhaBotoesModal}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={fecharModal}>
                <Text style={styles.botaoTextoMagia}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoConfirmarMagia} onPress={adicionarMagia}>
                <Text style={styles.botaoConfirmarTextoMagia}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// Obs: Cole os seus estilos (const styles = StyleSheet.create({...})) aqui embaixo caso fiquem no mesmo arquivo.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        padding: 20,
        paddingTop: 60,
        },

    divisor: {
        borderTopWidth: 1,
        borderTopColor: '#252545',
        marginVertical: 14,
        },

    tituloBloco: {
        color: '#e2b96f',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        },

    info: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 4,
        },

    // ---- Bloco 1: atributos em grade 2x2 ----
    gradeAtributos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        },

    celulaAtributo: {
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
        },

    campoGrade: {
        backgroundColor: '#16213e',
        color: '#fff',
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#e2b96f',
        textAlign: 'center',
        fontSize: 20,
        minHeight: 40,
        width: '100%',
        },

    // ---- Bloco 2: espaços de magia em duas colunas compactas ----
    duasColunasCirculos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        },

    colunaCirculos: {
        flex: 1,
        },

    linhaCirculo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        },

    labelCirculo: {
        color: '#fff',
        fontSize: 11,
        width: 52,
        },

    grupoCirculos: {
        flexDirection: 'row',
        gap: 4,
        },

    iconeCirculo: {
        fontSize: 14,
        },

    // ---- Bloco 3: lista de magias (única área que rola) ----
    blocoMagias: {
        flex: 1,
        marginTop: 4,
        },

    cabecalhoMagias: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        },

    botaoAbrirModal: {
        backgroundColor: '#16213e',
        borderWidth: 1,
        borderColor: '#e2b96f',
        borderRadius: 10,
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        },

    botaoTextoMagia: {
        color: '#e2b96f',
        fontSize: 16,
        fontWeight: 'bold',
        },

    listaMagiasConteudo: {
        paddingBottom: 12,
        },

    vazioTexto: {
        color: '#888',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 16,
        },

    cardMagia: {
        backgroundColor: '#16213e',
        borderLeftWidth: 4,
        borderLeftColor: '#e2b96f',
        padding: 12,
        borderRadius: 6,
        marginBottom: 10,
        width: '100%',
        },

    linhaMagia: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        },

    textoChaveMagia: {
        color: '#e2b96f',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        flexShrink: 1,
        },

    botaoVerMagia: {
        backgroundColor: '#1f1f3a',
        borderWidth: 1,
        borderColor: '#e2b96f',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        },

    botaoVerTextoMagia: {
        color: '#fff',
        fontSize: 12,
        },

    containerDescMagia: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#252545',
        paddingTop: 8,
        },

    textoDescMagia: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        flexShrink: 1,
        width: '100%',
        },

    // ---- Modal de adicionar nova magia ----
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20,
        },

    modalCaixa: {
        backgroundColor: '#1a1a2e',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#e2b96f',
        padding: 20,
        },

    inputMagia: {
        backgroundColor: '#16213e',
        color: '#fff',
        borderWidth: 1,
        borderColor: '#e2b96f',
        borderRadius: 8,
        width: '100%',
        padding: 10,
        marginBottom: 10,
        },

    inputDescMagia: {
        minHeight: 90,
        textAlignVertical: 'top',
        },

    linhaBotoesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 6,
        },

    botaoCancelarModal: {
        flex: 1,
        backgroundColor: '#16213e',
        borderWidth: 1,
        borderColor: '#ff5555',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        },

    botaoConfirmarMagia: {
        flex: 1,
        backgroundColor: '#e2b96f',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        },

    botaoConfirmarTextoMagia: {
        color: '#1a1a2e',
        fontWeight: 'bold',
        },

})