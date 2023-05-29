import { Text, View, StyleSheet, ImageBackground, } from 'react-native';
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
      { key: 'fourth', title: 'Onderzoek' },
    ]);

    const renderTabBar = (props) => (
      <View
        style={styles.tabNav}
      >
      <TabBar
        {...props}
        style={{ backgroundColor: 'transparent' }}
        indicatorStyle={{ backgroundColor: ColorsBlue.blue1000 }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color: focused? ColorsBlue.blue200 : ColorsBlue.blue700, fontWeight: focused ? 'bold' : 'normal', fontSize: focused ? 10 : 10,  paddingLeft: 0, paddingRight: 5, textAlign: 'center'}}>
            {route.title.toUpperCase()}
          </Text>
        )}
      />
      </View>
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
      <LinearGradient 
      colors={[ColorsBlue.blueblack1600, ColorsBlue.blueblack1500]}  
      style = {styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      >
          <ImageBackground
          source={require('./../../../assets/chatbackground.png')} 
          style={
          {flex: 1}
          }
          imageStyle={{opacity: 0.11}}
          >
              <TabView
                lazy
                animationEnabled = {false}
                swipeEnabled= {false}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: '100%', height: '100%' }}
              />
            </ImageBackground>
      </LinearGradient>

    );
};


export default AssignmentTab;


const styles = StyleSheet.create({
  tabNav: {
    paddingTop: 33,
    backgroundColor: ColorsBlue.blue1300
  },
  container: {
    flex: 1, 
},
})