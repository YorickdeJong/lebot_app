import { Text, View, StyleSheet} from 'react-native';
import { useState, } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TabView, TabBar } from 'react-native-tab-view';
import Assignment from '../../screens/Authenticated/Assignments/Assignment';
import BuildScreen from '../../screens/Authenticated/Assignments/BuildScreen';
import CodeAnswerScreen from '../../screens/Authenticated/Assignments/CodeAnswerScreen';
import CodeExampleScreen from '../../screens/Authenticated/Assignments/CodeExampleScreen';
import { ColorsBlue } from '../../constants/palet';

// DISPLAYS ASSIGNMENTS
function AssignmentTab({title, initialIndex, subject}){
    const [index, setIndex] = useState(initialIndex);
    
    const [routes] = useState([
      { key: 'first', title: 'Test Opstelling' },
      { key: 'second', title: 'Codeer Theorie' },
      { key: 'third', title: 'Codeer Vragen' },
      { key: 'fourth', title: 'Vragen Opdrachten' },
    ]);

    const renderTabBar = (props) => (
      <LinearGradient
        colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]}
        style={styles.tabNav}
        start={{
          x: 0,
          y: 0.5,
        }}
        end={{
          x: 1,
          y: 0.5,
        }}
      >
      <TabBar
        {...props}
        style={{ backgroundColor: 'transparent' }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color, fontWeight: focused ? 'bold' : 'normal', fontSize: focused ? 10 : 10,  paddingLeft: 0, paddingRight: 5, textAlign: 'center'}}>
            {route.title.toUpperCase()}
          </Text>
        )}
      />
      </LinearGradient>
    );

    const renderScene = ({route}) => {//SceneMap({
        switch(route.key){
          case 'first' :
            return <BuildScreen //change name to include assignment, also add screens for other subjects
            title = {route.title} 
            tabIndex={0} 
            currentIndex={index}
            subject={subject}
            />;
          case 'second' :
            return <CodeExampleScreen
            title = {route.title}
            tabIndex={1} 
            currentIndex={index}
            subject={subject}
            />;
          case 'third' :
            return <CodeAnswerScreen 
            title = {route.title}
            tabIndex={2}         
            currentIndex={index}
            subject={subject}
            />;
          case 'fourth' :
            return <Assignment 
            title = {title}
            tabIndex={3}
            currentIndex={index}
            subject={subject}
            />;
        }
    };

    return (
      <View style={{ flex: 1}}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%', height: '100%' }}
        />
      </View>
    );
};


export default AssignmentTab;


const styles = StyleSheet.create({
  tabNav: {
    paddingTop: 33,
    shadowColor: ColorsBlue.blue1400,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
  }
})