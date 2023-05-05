
import {View , Text, StyleSheet, FlatList} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import AdminOptionTiles from '../../components/Admin/AdminOptionTiles.components'
import { useNavigation } from '@react-navigation/native'

function AdminDashboard() {
    const navigation = useNavigation()
    const tileNames = ["Create User", "Create Group", "Keys Main", "Analytics", "Support Tickets", "Subscriptions"]

    
    function renderTiles({item}) {
        function navigationHandler() {
            switch(item){
                case 'Create User':
                    navigation.navigate('Create User')
                    break;
                case 'Create Group':
                    navigation.navigate('Create Group')
                    break;
                case 'Keys Main':
                    navigation.navigate('Keys Main')
                    break;
                case 'Analytics':
                    navigation.navigate('Analytics')
                    break;
                case 'Support Tickets':
                    navigation.navigate('Support Tickets')
                    break;
                case 'Subscriptions':
                    navigation.navigate('Subscriptions')
                    break;
                default:
                    console.log('Error')

            }
            //Create a switch
            console.log(`in navigation handler`)
        }
        return (
            <AdminOptionTiles 
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

export default AdminDashboard

const styles = StyleSheet.create({
    backgroundContainer: {
        paddingTop: 10,
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
        alignItems: 'center',
    }
})