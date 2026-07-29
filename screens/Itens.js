import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { buscarItens, salvarItens, atualizarItens } from '../database';


export default function Itens( { route}) {
    const [armaduraleve, setArmaduraLeve] = useState('');
    const [armaduramedia, setArmaduraMedia] = useState('');
    const [armadurapesada, setArmaduraPesada] = useState('');
    const [escudo, setEscudo] = useState('');
    const [armas, setArmas] = useState('');
    const [ferramentas, setFerramentas] = useState('');
    const [equipamentos, setEquipamentos] = useState('');
    const [itemsintonizados1, setItemsIntonizados1] = useState('');
    const [itemsintonizados2, setItemsIntonizados2] = useState('');
    const [itemsintonizados3, setItemsIntonizados3] = useState('');
    const [PC, setPC] = useState('');
    const [PP, setPP] = useState('');
    const [PE, setPE] = useState('');
    const [PO, setPO] = useState('');
    const [PL, setPL] = useState('');

    const [sintonizar, setSintonizar] = useState({
        sintonizado1: false,
        sintonizado2: false,
        sintonizado3: false,
    });


    useEffect(() => {
    if (route.params?.personagem) {
                const id = route.params.personagem.id;
                const itens = buscarItens(id);

            if (itens){
                setArmaduraLeve(itens.armaduraleve);
                setArmaduraMedia(itens.armaduramedia);
                setArmaduraPesada(itens.armadurapesada);
                setEscudo(itens.escudo);
                setArmas(itens.armas);
                setFerramentas(itens.ferramentas);
                setEquipamentos(itens.equipamentos);
                setItemsIntonizados1(itens.itemsintonizados1);
                setItemsIntonizados2(itens.itemsintonizados2);
                setItemsIntonizados3(itens.itemsintonizados3);
                setPC(itens.PC.toString() || '');
                setPP(itens.PP.toString() || '');
                setPE(itens.PE.toString() || '');
                setPO(itens.PO.toString() || '');
                setPL(itens.PL.toString() || '');
            }
    
        }

    },[]);

function handleSalvarItens() {

        const dados = {
            armaduraleve,
            armaduramedia,
            armadurapesada,
            escudo,
            armas,
            ferramentas,
            equipamentos,
            itemsintonizados1,
            itemsintonizados2,
            itemsintonizados3,
            PC: PC || '0',
            PP: PP || '0',
            PE: PE || '0',
            PO: PO || '0',
            PL: PL || '0'
        };
        const idPersonagem = route.params.personagem.id;
        const itensExistentes = buscarItens(idPersonagem);
        if (itensExistentes) {
        atualizarItens(idPersonagem, dados);
        }else{
        salvarItens(idPersonagem, dados);
        }
        Alert.alert('Sucesso', 'Itens salvos com sucesso!');
}

return (
    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>TREINAMENTO E PROFICIÊNCIA EM EQUIPAMENTOS</Text>
      <Text style={styles.titulo}>Armaduras</Text>


      <View style={styles.par}>
          <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setArmaduraLeve(!armaduraleve)}
              >
              <Text style={styles.checkboxTexto}>
                  {armaduraleve ? '☑️' : '⬜'}
              </Text>
              <Text style={styles.info}>Leve</Text>
          </TouchableOpacity>

          
          <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setArmaduraMedia(!armaduramedia)}
              >
              <Text style={styles.checkboxTexto}>
                  {armaduramedia ? '☑️' : '⬜'}
              </Text>
              <Text style={styles.info}>Média</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setArmaduraPesada(!armadurapesada)}
              >
              <Text style={styles.checkboxTexto}>
                  {armadurapesada ? '☑️' : '⬜'}
              </Text>
              <Text style={styles.info}>Pesada</Text>
          </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setEscudo(!escudo)}
              >
              <Text style={styles.checkboxTexto}>
                  {escudo ? '☑️' : '⬜'}
              </Text>
              <Text style={styles.info}>Escudo</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.container}>
              <Text style={styles.titulo}>Armas</Text>


              <TextInput style={styles.campo}
                placeholder="Liste as armas"
                placeholderTextColor="#999"
                onChangeText={setArmas}
                value={armas}
                multiline={true}
                textAlignVertical="top" />
      </View>

      <View style={styles.container}>
              <Text style={styles.titulo}>Ferramentas</Text>


              <TextInput style={styles.campo}
                placeholder="Liste as ferramentas"
                placeholderTextColor="#999"
                onChangeText={setFerramentas}
                value={ferramentas}
                multiline={true}
                textAlignVertical="top" />
      </View>

      
      <View style={styles.container}>
              <Text style={styles.titulo}>Equipamentos</Text>


              <TextInput style={styles.campo}
                placeholder="Liste os equipamentos"
                placeholderTextColor="#999"
                onChangeText={setEquipamentos}
                value={equipamentos}
                multiline={true}
                textAlignVertical="top" />
              
              <View>
                <Text style={styles.titulo}>Itens Intonizados</Text>
                
                    <TextInput style={styles.campo}
                      placeholder="Item 1"
                      placeholderTextColor="#999"
                      onChangeText={setItemsIntonizados1}
                      value={itemsintonizados1}
                    />
                  
                  
                    <TextInput style={styles.campo}
                      placeholder="Item 2"
                      placeholderTextColor="#999"
                      onChangeText={setItemsIntonizados2}
                      value={itemsintonizados2}
                    />

                    <TextInput style={styles.campo}
                      placeholder="Item 3"
                      placeholderTextColor="#999"
                      onChangeText={setItemsIntonizados3}
                      value={itemsintonizados3}
                    />
          
              </View>
              

      </View>


      <View style={styles.container}>
        <Text style={styles.titulo}>Moedas</Text>
        <View style={styles.par}>
          <TextInput style={styles.campo}
            placeholder="PC"
            placeholderTextColor="#999"
            onChangeText={setPC}
            value={PC}
            
          />
          <TextInput style={styles.campo}
            placeholder="PP"
            placeholderTextColor="#999"
            onChangeText={setPP}
            value={PP}
            keyboardType="numeric"
          />
          <TextInput style={styles.campo}
            placeholder="PE"
            placeholderTextColor="#999"
            onChangeText={setPE}
            value={PE}
            keyboardType="numeric"
          />
          <TextInput style={styles.campo}
            placeholder="PO"
            placeholderTextColor="#999"
            onChangeText={setPO}
            value={PO}
            keyboardType="numeric"
          />
          <TextInput style={styles.campo}
            placeholder="PL"
            placeholderTextColor="#999"
            onChangeText={setPL}
            value={PL}
            keyboardType="numeric"
          />
        </View>
      </View>



      <TouchableOpacity style={styles.botao} onPress={handleSalvarItens}>
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
    paddingTop: 10,
    },

  titulo: {
    color: '#e2b96f',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

par: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

  label: {
    color: '#e2b96f',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#e2b96f',
    padding: 10,
    marginBottom: 20,
  },
checkbox: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  gap: 2,
},
checkboxTexto: {
  fontSize: 15,
},

  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
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
campo: {
  backgroundColor: '#16213e',
  color: '#fff',
  borderRadius: 10,
  padding: 10,
  minHeight: 50,      // altura mínima
  borderWidth: 1,
  borderColor: '#e2b96f',
  textAlignVertical: 'top',
  },
});