import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { buscarAtributo, salvarAtributo, atualizarAtributo, salvarPericias, atualizarPericias, 
        buscarPericias, salvarProficienciaPericias, atualizarProficienciaPericias, buscarProficienciaPericias} from '../database';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';


export default function Atributo({ route }) {

  // Atributos
  const [forca, setForca] = useState('');
  const [destreza, setDestreza] = useState('');
  const [constituicao, setConstituicao] = useState('');
  const [inteligencia, setInteligencia] = useState('');
  const [sabedoria, setSabedoria] = useState('');
  const [carisma, setCarisma] = useState('');
  const [imagem, setImagem] = useState('');
  const [inspiração, setInspiração] = useState('');

  // Perícias
  const [Atletismo, setAtletismo] = useState('');
  const [Acrobacia, setAcrobacia] = useState('');
  const [Furtividade, setFurtividade] = useState('');
  const [Prestidigitação, setPrestidigitação] = useState('');
  const [Arcana, setArcana] = useState('');
  const [Historia, setHistoria] = useState('');
  const [Investigação, setInvestigação] = useState('');
  const [Natureza, setNatureza] = useState('');
  const [Religiao, setReligiao] = useState('');
  const [Adestramento, setAdestramento] = useState('');
  const [Intuicao, setIntuicao] = useState('');
  const [Medicina, setMedicina] = useState('');
  const [Percepcao, setPercepcao] = useState('');
  const [Sobrevivencia, setSobrevivencia] = useState('');
  const [Atuacao, setAtuacao] = useState('');
  const [Enganacao, setEnganacao] = useState('');
  const [Intimidacao, setIntimidacao] = useState('');
  const [Persuasao, setPersuasao] = useState('');

  // Proficiências — lista
  const [proficiencias, setProficiencias] = useState({
    atletismo: false,
    acrobacia: false,
    furtividade: false,
    prestidigitacao: false,  
    arcana: false,
    historia: false,
    investigacao: false,
    natureza: false,
    religiao: false,
    adestramento: false,
    intuicao: false,
    medicina: false,
    percepcao: false,
    sobrevivencia: false,
    atuacao: false,
    enganacao: false,
    intimidacao: false,
    persuasao: false,
  });

  // Carrega atributos, perícias e proficiências ao montar
  useEffect(() => {
    if (route.params?.personagem) {
      const id = route.params.personagem.id;

      const atributos = buscarAtributo(id);
      if (atributos) {
        setForca(atributos.forca || '');
        setDestreza(atributos.destreza || '');
        setConstituicao(atributos.constituicao || '');
        setInteligencia(atributos.inteligencia || '');
        setSabedoria(atributos.sabedoria || '');
        setCarisma(atributos.carisma || '');
        setImagem(atributos.imagem || '');
        setInspiração(atributos.inspiração || '');
      }

      const pericias = buscarPericias(id);
      if (pericias) {
        setAtletismo(pericias.atletismo || '');
        setAcrobacia(pericias.acrobacia || '');
        setFurtividade(pericias.furtividade || '');
        setPrestidigitação(pericias.prestidigitacao || '');
        setArcana(pericias.arcana || '');
        setHistoria(pericias.historia || '');
        setInvestigação(pericias.investigacao || '');
        setNatureza(pericias.natureza || '');
        setReligiao(pericias.religiao || '');
        setAdestramento(pericias.adestramento || '');
        setIntuicao(pericias.intuicao || '');
        setMedicina(pericias.medicina || '');
        setPercepcao(pericias.percepcao || '');
        setSobrevivencia(pericias.sobrevivencia || '');
        setAtuacao(pericias.atuacao || '');
        setEnganacao(pericias.enganacao || '');
        setIntimidacao(pericias.intimidacao || '');
        setPersuasao(pericias.persuasao || '');
      }

      const prof = buscarProficienciaPericias(id);
      if (prof) {
        setProficiencias(prof);
      }
    }
  }, []);

  function handleSalvarAtributos() {
    if (!forca || !destreza || !constituicao || !inteligencia || !sabedoria || !carisma) {
      Alert.alert('Erro', 'Preencha todos os campos de atributos.');
      return;
    }

    const dados = { forca, destreza, constituicao, inteligencia, sabedoria, carisma, imagem, inspiração };

    if (route.params?.personagem) {
      const id = route.params.personagem.id;
      if (buscarAtributo(id)) {
        atualizarAtributo(id, dados);
      } else {
        salvarAtributo(id, dados);
      }
    }
  }

  function handleSalvarPericias() {
    const dadosPericias = {
      atletismo: Atletismo,
      acrobacia: Acrobacia,
      furtividade: Furtividade,
      prestidigitacao: Prestidigitação,
      arcana: Arcana,
      historia: Historia,
      investigacao: Investigação,
      natureza: Natureza,
      religiao: Religiao,
      adestramento: Adestramento,
      intuicao: Intuicao,
      medicina: Medicina,
      percepcao: Percepcao,
      sobrevivencia: Sobrevivencia,
      atuacao: Atuacao,
      enganacao: Enganacao,
      intimidacao: Intimidacao,
      persuasao: Persuasao,
    };

    if (route.params?.personagem) {
      const id = route.params.personagem.id;
      if (buscarPericias(id)) {
        atualizarPericias(id, dadosPericias);
      } else {
        salvarPericias(id, dadosPericias);
      }
    }
  }

  // Corrigido: agora chama as funções certas de proficiência
  function handleSalvarProficienciaPericias() {
    if (route.params?.personagem) {
      const id = route.params.personagem.id;
      if (buscarProficienciaPericias(id)) {
        atualizarProficienciaPericias(id, proficiencias);
      } else {
        salvarProficienciaPericias(id, proficiencias);
      }
    }
  }

  // botão salvar chama as 3 funções
  function handleSalvarTudo() {
    handleSalvarAtributos();
    handleSalvarPericias();
    handleSalvarProficienciaPericias();
    Alert.alert('Sucesso', 'Tudo salvo com sucesso!');
  }

  function toggleProficiencia(pericia) {
    setProficiencias(prev => ({
      ...prev,
      [pericia]: !prev[pericia]
    }));
  }

  function calcularModificador(valor) {
    const numValor = parseInt(valor);
    if (isNaN(numValor)) return 0;
    return Math.floor((numValor - 10) / 2);
  }

  function calcularBonusProficiencia(nivel) {
    const numNivel = parseInt(nivel);
    if (isNaN(numNivel)) return 0;
    if (numNivel >= 1 && numNivel <= 4) return 2;
    if (numNivel >= 5 && numNivel <= 8) return 3;
    if (numNivel >= 9 && numNivel <= 12) return 4;
    if (numNivel >= 13 && numNivel <= 16) return 5;
    if (numNivel >= 17 && numNivel <= 20) return 6;
    return 0;
  }

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      <View style={styles.Bonus}>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Proficiência</Text>
          <Text style={styles.campo}>{calcularBonusProficiencia(route.params.personagem.nivel)}</Text>
        </View>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Inspiração</Text>
          <TextInput style={styles.campo} value={inspiração} onChangeText={setInspiração} keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.titulo}>Atributos</Text>

      <View style={styles.par}>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Força</Text>
          <TextInput style={styles.campo} value={forca} onChangeText={setForca} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(forca)}</Text>
        </View>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Destreza</Text>
          <TextInput style={styles.campo} value={destreza} onChangeText={setDestreza} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(destreza)}</Text>
        </View>
      </View>

      <View style={styles.par}>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Constituição</Text>
          <TextInput style={styles.campo} value={constituicao} onChangeText={setConstituicao} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(constituicao)}</Text>
        </View>
        <TouchableOpacity onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <Text style={styles.info}>📷 Escolher foto</Text>
          )}
        </TouchableOpacity>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Inteligência</Text>
          <TextInput style={styles.campo} value={inteligencia} onChangeText={setInteligencia} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(inteligencia)}</Text>
        </View>
      </View>

      <View style={styles.par}>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Sabedoria</Text>
          <TextInput style={styles.campo} value={sabedoria} onChangeText={setSabedoria} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(sabedoria)}</Text>
        </View>
        <View style={styles.atributoContainer}>
          <Text style={styles.info}>Carisma</Text>
          <TextInput style={styles.campo} value={carisma} onChangeText={setCarisma} keyboardType="numeric" />
          <Text style={styles.info}>Mod: {calcularModificador(carisma)}</Text>
        </View>
      </View>

      <Text style={styles.titulo}>Perícias</Text>

      {/* ✅ Todas as chaves de toggleProficiencia agora batem com o estado */}
      {[
        ['atletismo', Atletismo, setAtletismo, 'Atletismo'],
        ['acrobacia', Acrobacia, setAcrobacia, 'Acrobacia'],
        ['furtividade', Furtividade, setFurtividade, 'Furtividade'],
        ['prestidigitacao', Prestidigitação, setPrestidigitação, 'Prestidigitação'],
        ['arcana', Arcana, setArcana, 'Arcana'],
        ['historia', Historia, setHistoria, 'História'],
        ['investigacao', Investigação, setInvestigação, 'Investigação'],
        ['natureza', Natureza, setNatureza, 'Natureza'],
        ['religiao', Religiao, setReligiao, 'Religião'],
        ['adestramento', Adestramento, setAdestramento, 'Adestramento'],
        ['intuicao', Intuicao, setIntuicao, 'Intuição'],
        ['medicina', Medicina, setMedicina, 'Medicina'],
        ['percepcao', Percepcao, setPercepcao, 'Percepção'],
        ['sobrevivencia', Sobrevivencia, setSobrevivencia, 'Sobrevivência'],
        ['atuacao', Atuacao, setAtuacao, 'Atuação'],
        ['enganacao', Enganacao, setEnganacao, 'Enganação'],
        ['intimidacao', Intimidacao, setIntimidacao, 'Intimidação'],
        ['persuasao', Persuasao, setPersuasao, 'Persuasão'],
      ].reduce((rows, item, index, arr) => {
        if (index % 2 === 0) rows.push(arr.slice(index, index + 2));
        return rows;
      }, []).map((par, i) => (
        <View key={i} style={styles.par}>
          {par.map(([chave, valor, setter, label]) => (
            <View key={chave} style={styles.pericias}>
              <TouchableOpacity onPress={() => toggleProficiencia(chave)}>
                <Text style={styles.info}>{proficiencias[chave] ? '🟢' : '⚪'}</Text>
              </TouchableOpacity>
              <TextInput style={styles.CampoPericia} value={valor} onChangeText={setter} keyboardType="numeric" />
              <Text style={styles.info}>{label}</Text>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.botao} onPress={handleSalvarTudo}>
        <Text style={styles.botaoTexto}>💾 Salvar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60 },

  conteudo: { 
    paddingBottom: 60 },

  titulo: {
    color: '#e2b96f',
    fontSize: 24,
    fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },


  par: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    flexWrap: 'wrap' },

  atributoContainer: {
    flex: 1,
    alignItems: 'center', 
    marginHorizontal: 8 },

  info: { 
    color: '#fff', 
    fontSize: 16, 
    marginBottom: 8, 
    textAlign: 'center' },

  campo: { 
    backgroundColor: '#16213e', 
    color: '#fff', 
    borderRadius: 25, 
    padding: 10, 
    width: 50, 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#e2b96f', 
    marginBottom: 15, 
    textAlign: 'center' },


  botao: { 
    backgroundColor: '#16213e', 
    borderWidth: 1, 
    borderColor: '#e2b96f', 
    borderRadius: 10, 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 40 },


  botaoTexto: { 
    color: '#e2b96f', 
    fontSize: 16, 
    fontWeight: 'bold' },

  Bonus: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 },

  pericias: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 8, 
    width: '48%' },

  CampoPericia: { 
    backgroundColor: '#16213e', 
    color: '#fff', 
    borderRadius: 5, 
    padding: 1, 
    width: 30, 
    height: 30, 
    borderWidth: 1, 
    borderColor: '#e2b96f', 
    textAlign: 'center' },
});