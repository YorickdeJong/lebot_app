import { useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import AssignmentsResults from '../../screens/Authenticated/Assignments/Assignments&Results';
import Icon from '../../components/Icon';
import { ColorsBlue } from '../../constants/palet';
import AssignmentTab from './AssignmentTab.navigator';
import CustomHeader from './CustomNavigator.main';
import Controller from '../../screens/Authenticated/Robot/Controller';

//test
const Stack = createNativeStackNavigator()


// DISPLAYS ASSIGNMENTS SCREEN WITH TILES
function Assignments() {
    const navigation = useNavigation();
  
    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',
          header: ({ route }) => {
            return <CustomHeader  />;
          },
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
          },
          }}>
  
        <Stack.Screen 
        component={AssignmentsResults}
        name = "AssignmentsResults"
        options={{
            title: 'Assignments',
            tabBarIcon: ({color}) => {
              return (
                <Icon 
                size = {24}
                icon = "list"
                color = {color}
                addStyle = {{marginRight: 0}}
                onPress={() => navigation.replace('AssignmentsResults')}/>
              )
            },
        }}
        />
        
        <Stack.Screen 
          component={Controller}
          name = "Controller"
          options= {{
            title: 'Controller',
            headerShown: false
        }}/> 

        <Stack.Screen 
        name = "Assignment"
        options={{
            title: 'Assignment',
            headerLeft: ({tintColor}) => {
            return (
              <Icon 
              icon = 'arrow-back-circle'
              size = {30}
              color = {tintColor}
              onPress = {() => navigation.replace('AssignmentsResults')}/>
              )
            },
          headerShown: false,
          headerBackground: null
        }}
          >
          {(props) => <AssignmentTab {...props} subject = {props.route.params.subject} initialIndex={props.route.params.initialIndex} title={props.route.params.title} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  export default Assignments;