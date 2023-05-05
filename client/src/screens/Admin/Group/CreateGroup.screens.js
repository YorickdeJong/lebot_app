

import {View, Text, StyleSheet, FlatList} from 'react-native';
import { ColorsBlue } from '../../../constants/palet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

function CreateGroup() {
    const navigation = useNavigation()
    const groups = ["Create School", "Create Class", "Create Group"]
    
    function renderGroups({item}) {
        function navigationHandler() {
            switch(item){
                case 'Create School':
                    navigation.navigate('Create School')
                    break;
                case 'Create Class':
                    navigation.navigate('Create Class')
                    break;
                case 'Create Group':
                    navigation.navigate('Create Group')
                    break;
                default:
                    console.log('Error')
            }
        }
        return (
            <TouchableOpacity style={styles.groups}
            onPress={navigationHandler}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <FlatList 
                data={groups} 
                keyExtractor = {(item, index) => index}
                numColumns = {1}
                renderItem = {renderGroups} 
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

export default CreateGroup;

const styles = StyleSheet.create({
    groups: {
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: ColorsBlue.blue1000,
        height: 120,
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 4, 
        shadowColor: ColorsBlue.blue1000,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
        borderWidth: 0.2,
        borderColor: ColorsBlue.blue1000,
        backgroundColor: ColorsBlue.blue1000
    },
    container: {
        flex: 1,
        paddingTop: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 30,
        color: ColorsBlue.blue50,
        textShadowColor: ColorsBlue.blue1400, // set text shadow color
        textShadowOffset: { width: 0, height: 3 }, // set text shadow offset
        textShadowRadius: 2, // set text shadow radius
    }
})