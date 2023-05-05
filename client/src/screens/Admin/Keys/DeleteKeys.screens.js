
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { Picker } from '@react-native-picker/picker';
import { getAllSchools } from '../../../hooks/schools.hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { deleteAllSchoolKeys } from '../../../hooks/keys.hooks';

function DeleteKeys() {
    const [schools, setSchools] = useState('');
    const [selectedSchool, setSelectedSchool] = useState({
      name: '',
      id: '',
    });
    const [success, setSuccess] = useState(false);
    const [keys, setKeys] = useState(null);

    useEffect(() => {
        const fetchSchools = async () => {
          const fetchedSchools = await getAllSchools();
          setSchools(fetchedSchools);
        }
        fetchSchools();
    }, [])

    const getKeyHandler = async () => {
        if (!selectedSchool) {
          Alert.alert('Please select a shool and/or a role');
          return;
        }

        try {
            console.log(selectedSchool.name)
            try{
                const response = await deleteAllSchoolKeys(selectedSchool.name);
                setKeys(response);
                console.log('keys are: ', response)
            }
            catch(error){
                setKeys([0])
            }
        }
        catch(error){
            console.log(error)
            Alert.alert('Key generation failed. Please try again later.')
            return
        }

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 10000);

    };


    //check if school is empty
    if (!schools){
        return 
    }


    return (
      <KeyboardAwareScrollView
      style={styles.keyboardAwareContainer}
      extraScrollHeight={100}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
          <Text style={styles.label}>School:</Text>
          
          <View style={styles.pickerContainer}>
              <Picker
                  selectionColor={'rgba(0, 0, 0, 1)'}
                  selectedValue={selectedSchool.name}
                  onValueChange={(itemValue, itemIndex) => {
                    if (itemIndex > 0) {
                        setSelectedSchool({name: schools[itemIndex - 1].school_name, id: schools[itemIndex - 1].school_id});
                    } 
                    else {
                        setSelectedSchool({ name: '', id: '' });
                    }
                  }}
                  dropdownIconColor={'rgba(0, 0, 100, 1)'}
              >
                  <Picker.Item label="Pick a School" value="" />
                  {schools.map((school) => {
                      return <Picker.Item key={school.school_id} label={school.school_name} value={school.school_name} />
                  })}
              </Picker>
          </View>

            <TouchableOpacity style={styles.button} onPress={getKeyHandler}>
            <Text style={styles.buttonText}>Delete Keys For School</Text>
            </TouchableOpacity>
        </View> 

        {success && (
            <View style={styles.successTextContainer}>
                <Text
                style={[
                    styles.successText,
                    { fontSize: 22, textAlign: "center", marginBottom: 10 },
                ]}
                >
                Deleted the following keys:
                </Text>
                {/* pressable maken om to keys to copieren en te versturen? */}
                {keys && keys.length > 1
                ? keys.map((key, index) =>
                    key !== 0 ? (
                        <Text key={index} style={styles.successText}>
                        {index}: {key.uuid_key}
                        </Text>
                    ) : null
                    )
                : null}
                {(!keys || keys.length <= 1) && (
                <Text style={[styles.successText, {textAlign: 'center'}]}>
                    No keys found
                </Text>
                )}
            </View>
        )}
      </KeyboardAwareScrollView>
  );
}

export default DeleteKeys;

const styles = StyleSheet.create({
    successTextContainer: {
        marginTop: 15,
        marginLeft: 15,
    },
    successText: {
      color: ColorsBlue.blue50,
      fontSize: 16,
    },
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 18,
        color: ColorsBlue.blue100,
        marginBottom: 8,
    },
    input: {
        borderWidth: 0.6,
        backgroundColor: ColorsBlue.blue1000,
        borderColor: ColorsGray.gray700,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginBottom: 20,
        borderRadius: 4,
        height: 50,
        fontSize: 18,
        color: ColorsBlue.blue50,
    },
    pickerContainer: {
        borderWidth: 0.6,
        borderColor: ColorsGray.gray700,
        backgroundColor: ColorsBlue.blue1000,
        borderRadius: 4,
        marginBottom: 20,
        justifyContent: 'center',
        height: 120,
        width: '100%',
      },
    picker: {
        // marginBottom: 10,
        width: '100%',
        color: ColorsBlue.blue50, // Update the color here
    },
    button: {
        backgroundColor: ColorsBlue.blue700,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    keyboardAvoidingContainer: {
      flex: 1,
      marginTop: 10
    },
});
