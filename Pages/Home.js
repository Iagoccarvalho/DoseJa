import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Medicacoes from './Medicacoes'
import Notes from './Notes'
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Home() {
    return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Medicações') {
                  iconName = 'pills';
                } else if (route.name === 'Lembrete') {
                  iconName = 'sticky-note';
                }
                return <FontAwesome5 name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#fff',
              tabBarInactiveTintColor: '#888',
              tabBarStyle: {
                backgroundColor: '#dc143c',
                paddingBottom: 10,
                height: 70,
              },
              tabBarLabelStyle: {
                fontSize: 12,
              },
              tabBarShowLabel: true,
              headerShown: false,
            })}
          >
            <Tab.Screen name="Medicações" component={Medicacoes} />
            <Tab.Screen name="Lembrete" component={Notes} />
          </Tab.Navigator>
      );
}