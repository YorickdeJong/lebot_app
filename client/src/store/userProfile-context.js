import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useState, useEffect } from "react"
import { changeUserProfile } from "../hooks/auth";


export const UserProfileContext = createContext({
    userprofile: {
        email: '',
        password: '',
        username: '',
        name: '',
        lastname: '',
        dob: '',
        school: '',
        classschool: '',
        level: '',
        id: ''
    },
    editUserProfile: (userInfo) => {},
    editUsername: (newUsername) => {},
    editEmail: (newEmail) => {},
    editPassword: (newPassword) => {},
    getUserProfile: () => {}
})


function UserProfileContextProvider({children}) {
    const [userProfile, setUserProfile] = useState({
        email: '',
        password: '',
        username: '',
        name: '',
        lastname: '',
        dob: '',
        school: '',
        classschool: '',
        level: '', 
        id: ''
    });


    useEffect(() => {
        loadUserProfileFromStorage();
    }, []);

    useEffect(() => {
        changeUserProfile(userProfile)
    }, [userProfile])
    async function loadUserProfileFromStorage() {
        try {
            const jsonValue = await AsyncStorage.getItem("userProfile");
            if (jsonValue !== null) {
                setUserProfile(JSON.parse(jsonValue));
            }
        } 
        catch (error) {
            console.error("Error loading user profile from storage:", error);
        }
    }

    async function saveUserProfileToStorage(profile) {
        try {
            const jsonValue = JSON.stringify(profile);
            await AsyncStorage.setItem("userProfile", jsonValue);
        } 
        catch (error) {
            console.error("Error saving user profile to storage:", error);
        }
    }

    function editUserProfile(userInfo) {
        setUserProfile(userInfo);
        saveUserProfileToStorage(userInfo);
    }

    function editUsername(newUsername) {
        setUserProfile({ ...userProfile, username: newUsername });
        saveUserProfileToStorage({ ...userProfile, username: newUsername });
    }

    function editEmail(newEmail) {
        setUserProfile({ ...userProfile, email: newEmail });
        saveUserProfileToStorage({ ...userProfile, email: newEmail });
    }

    function editPassword(newPassword) {
        setUserProfile({ ...userProfile, password: newPassword });
        saveUserProfileToStorage({ ...userProfile, password: newPassword });
    }



    function getUserProfile() {
        return userProfile;
    }

    const value = {
        userprofile: userProfile,
        editUserProfile: editUserProfile,
        editUsername: editUsername,
        editEmail: editEmail,
        editPassword: editPassword,
        getUserProfile: getUserProfile
    }
    return <UserProfileContext.Provider value = {value}>{children}</UserProfileContext.Provider>
}

export default UserProfileContextProvider