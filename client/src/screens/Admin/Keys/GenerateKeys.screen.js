import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { Picker } from '@react-native-picker/picker';
import { getAllSchools } from '../../../hooks/schools.hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Random from 'expo-random';
import { createKeys } from '../../../hooks/keys.hooks';


function GenerateKeys() {
    const [schools, setSchools] = useState('');
    const [selectedSchool, setSelectedSchool] = useState({
      name: '',
      id: '',
    });
    const [role, setRole] = useState('');
    const [numKeys, setNumKeys] = useState('');
    const [success, setSuccess] = useState(false);
    const keysArray = [];

    useEffect(() => {
        const fetchSchools = async () => {
          const fetchedSchools = await getAllSchools();
          setSchools(fetchedSchools);
        }
        fetchSchools();
    }, [])

    console.log('keysarray', keysArray)

    const generateUUID = async () => {
        const randomBytes = await Random.getRandomBytesAsync(16);
        const byteArray = new Uint8Array(randomBytes);
      
        byteArray[6] = (byteArray[6] & 0x0f) | 0x40;
        byteArray[8] = (byteArray[8] & 0x3f) | 0x80;
      
        const uuid = [...byteArray].map((byte, index) => {
          if (index === 4 || index === 6 || index === 8 || index === 10) {
            return '-' + byte.toString(16).padStart(2, '0');
          }
          return byte.toString(16).padStart(2, '0');
        }).join('');
      
        return {
          uuid_key: uuid,
          school_id: selectedSchool.id,
          school_name: selectedSchool.name,
          user_role: role,
        };
    };
    

    const isValidNumKeys = (numKeys) => {
        const num = parseInt(numKeys, 10);
        return num > 0 && Number.isInteger(num);
    };

    const generateKeysHandler = async () => {
        if (!isValidNumKeys(numKeys)) {
          Alert.alert('Please enter a valid integer greater than 0');
          return;
        }

        if (!selectedSchool || !role) {
          Alert.alert('Please select a shool and/or a role');
          return;
        }

        try {
            const uuidKeys = await Promise.all(Array.from({ length: numKeys }, () => generateUUID()));
            console.log('UUID', uuidKeys)
            await createKeys(uuidKeys);
        }
        catch(error){
            console.log(error)
            Alert.alert('Key generation failed. Please try again later.')
            return
        }

        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 5000);


        // Generate keys based on the user inputs
        console.log('Generating keys with the following parameters:');
        console.log('School:', selectedSchool);
        console.log('Role:', role);
        console.log('Number of keys:', numKeys);
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

          <Text style={styles.label}>Role:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                  selectionColor={'rgba(0, 0, 0, 1)'}
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
                  dropdownIconColor={'rgba(0, 0, 100, 1)'}
                  
              >
                <Picker.Item label="Pick a User" value="" />
                <Picker.Item label="Student" value="student" />
                <Picker.Item label="Teacher" value="teacher" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            <Text style={styles.label}>Number of keys:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNumKeys}
              value={numKeys}
              keyboardType="numeric"
              placeholder="Enter number of keys"
              placeholderTextColor={ColorsGray.gray200}
            />

            <TouchableOpacity style={styles.button} onPress={generateKeysHandler}>
              <Text style={styles.buttonText}>Generate Keys</Text>
            </TouchableOpacity>
            </View>

            {success &&
            <View style = {styles.successTextContainer}>
              <Text style={[styles.successText, {fontSize: 22}]}>Generating keys with:</Text>
              <Text style={styles.successText}>School: {selectedSchool.name}</Text>
              <Text style={styles.successText}>User: {role}</Text>
              <Text style={styles.successText}>Number of Keys: {numKeys}</Text>
            </View>
            }
      </KeyboardAwareScrollView>
  );
}

export default GenerateKeys;

const styles = StyleSheet.create({
    successTextContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    successText: {
      color: ColorsBlue.blue50,
      fontSize: 18,
      textAlign: 'center',
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
        color: 'white',
        fontSize: 18,
    },
    keyboardAvoidingContainer: {
      flex: 1,
      marginTop: 10
    },
});
