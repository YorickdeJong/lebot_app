import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { createSchool, deleteSchool } from '../../../hooks/schools.hooks';


function CreateSchools() {
    const [schoolNameCreate, setSchoolNameCreate] = useState('');
    const [schoolNameDelete, setSchoolNameDelete] = useState('');
    const [displaySchoolNameCreate, setDisplaySchoolNameCreate] = useState('');
    const [displaySchoolNameDelete, setDisplaySchoolNameDelete] = useState('');
    const [schoolCreated, setSchoolCreated] = useState(false);
    const [schoolDeleted, setSchoolDeleted] = useState(false);

    const createSchoolHandler = async () => {
        // Handle school creation logic
        setSchoolCreated(true);
        
        //Set school and add to database, if exists also print message
        try {
            const {school_name, school_id} = await createSchool(schoolNameCreate)
            setDisplaySchoolNameCreate(`School ${school_name} Added`);
        }
        catch (error){
            setDisplaySchoolNameCreate('School already exists')
            console.log(error)
        }

        //empty field
        setSchoolNameCreate('');
    
        //show message for 5 seconds
        setTimeout(() => {
          setSchoolCreated(false);
        }, 5000);
    };
    
    const deleteSchoolHandler = async () => {
        // Handle school deletion logic
        setSchoolDeleted(true);


        try {
            const {school_name, school_id} = await deleteSchool(schoolNameDelete)
            console.log('school_name', school_name)
            setDisplaySchoolNameDelete(`School ${school_name} Deleted`);
        }
        catch (error){
            setDisplaySchoolNameDelete('School does not exists')
            console.log(error)
        }
        setSchoolNameDelete('');
    
        setTimeout(() => {
          setSchoolDeleted(false);
        }, 5000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Create School Name:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setSchoolNameCreate}
                value={schoolNameCreate}
                placeholder="Enter school name"
                placeholderTextColor={ColorsGray.gray400}
            />

            <TouchableOpacity style={styles.button} onPress={createSchoolHandler}>
                <Text style={styles.buttonText}>Create School</Text>
            </TouchableOpacity>

            {schoolCreated && (
                <View style ={styles.created}>
                    <Text style={styles.createdText}>{displaySchoolNameCreate}</Text>
                </View>
            )}

            <Text style={[styles.label, {marginTop: 20}]}>Delete Shool Name:</Text>
            <TextInput
                style={styles.input}
                onChangeText={setSchoolNameDelete}
                value={schoolNameDelete}
                placeholder="Enter school name"
                placeholderTextColor={ColorsGray.gray400}
            />

            <TouchableOpacity style={styles.button} onPress={deleteSchoolHandler}>
                <Text style={styles.buttonText}>Delete School</Text>
            </TouchableOpacity>

            {schoolDeleted && (
                <View style ={styles.created}>
                    <Text style={styles.createdText}>{displaySchoolNameDelete}</Text>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
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
        height: 45,
        fontSize: 18,
        color: ColorsBlue.blue50,
    },
    button: {
        backgroundColor: ColorsBlue.blue700,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    createdText: {
        textAlign: 'center',
        fontSize: 25,
        color: ColorsBlue.blue100,
        marginTop: 20,
      },
});

export default CreateSchools;