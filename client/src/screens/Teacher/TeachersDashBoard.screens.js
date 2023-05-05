import {View , Text, StyleSheet, FlatList} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import { useNavigation } from '@react-navigation/native'
import TeacherOptionTiles from '../../components/Teacher/TeacherOptionTiles.components'

function TeacherDashboard() {
    const navigation = useNavigation()
    const tileNames = ["Klassen", "Antwoorden", "Handleiding", "Zoek", "Support"]

    
    function renderTiles({item}) {
        function navigationHandler() {
            switch(item){
                case 'Klassen':
                    navigation.navigate('Classroom')
                    break;
                case 'Antwoorden':
                    navigation.navigate('Answers')
                    break;
                case 'Handleiding':
                    navigation.navigate('Instructions')
                    break;
                case 'Zoek':
                    navigation.navigate('Search')
                    break;
                case 'Support':
                    navigation.navigate('Support')
                    break;
                default:
                    console.log('Error')

            }
            //Create a switch
            console.log(`in navigation handler`)
        }
        return (
            <TeacherOptionTiles 
            tileName = {item}
            onPress = {navigationHandler}
            />
        )
    }

    return (
        <View style = {styles.backgroundContainer}>
            <FlatList 
                data={tileNames} 
                keyExtractor = {(item, index) => index}
                numColumns = {2}
                renderItem = {renderTiles} 
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default TeacherDashboard

const styles = StyleSheet.create({
    backgroundContainer: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
        alignItems: 'center',
    }
})