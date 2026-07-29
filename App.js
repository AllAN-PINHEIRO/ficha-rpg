import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PersonagemScreen from './screens/PersonagemScreen'
import { inicializarBanco, resetarBanco } from './database';
import HomeScreen from './screens/HomeScreen';
import DadosPessoais from './screens/DadosPessoais';
import Atributo from './screens/Atributo';
import Itens from './screens/Itens';
import Habilidades from './screens/Habilidades';
import Magias from './screens/Magias'

const Stack = createStackNavigator();

export default function App() {

  useEffect(() => { 
     resetarBanco();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#e2b96f',
          headerTitleStyle: { fontWeight: 'bold' },
          
        }}
        
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DadosPessoais"
          component={DadosPessoais}
          options={{ title: 'Dados Pessoais' }}
        />

        <Stack.Screen
        name="Personagem"
        component={PersonagemScreen}
        options={{ title: 'Personagem' }}
       />

        <Stack.Screen
          name="Atributos"
          component={Atributo}
          options={{ title: 'Atributos' }}
        />

        <Stack.Screen
          name="Itens"
          component={Itens}
          options={{ title: 'Itens' }}
        />

        <Stack.Screen
          name="Habilidades"
          component={Habilidades}
          options={{ title: 'Habilidades' }}
        />

        <Stack.Screen
          name="Magias"
          component={Magias}
          options={{title: 'Magias' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}