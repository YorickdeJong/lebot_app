import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useState, useEffect } from "react"
import { changeUserProfile } from "../hooks/auth";


export const UserProfileContext = createContext({
    userprofile: {
        id: '',
        email: '',
        password: '',
        username: '',
        name: '',
        lastname: '',
        dob: '',
        school_name: '',
        school_id: '',
        user_role: '',
        class_id: '',
        class_name: '',
        group_id: '',
        group_name: '',
    },
    editUserProfile: (userInfo) => {},
    editUsername: (newUsername) => {},
    editEmail: (newEmail) => {},
    editPassword: (newPassword) => {},
    getUserProfile: () => {},
    editAdminProfile: (adminInfo) => {},
})


function UserProfileContextProvider({children}) {
    const [userProfile, setUserProfile] = useState({
        id: '',
        email: '',
        password: '',
        username: '',
        name: '',
        lastname: '',
        dob: '',
        school_name: '',
        school_id: '',
        user_role: '',
        class_id: '',
        class_name: '',
        group_id: '',
        group_name: '',
    });


    useEffect(() => {
        loadUserProfileFromStorage();
    }, []);
    
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

    function editAdminProfile(adminInfo) {
        setUserProfile(prevUserProfile => {
            return {
                email: adminInfo.email,
                password: adminInfo.password,
                user_role: adminInfo.user_role
            };
        });
        saveUserProfileToStorage(adminInfo);
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
        getUserProfile: getUserProfile,
        editAdminProfile
    }
    return <UserProfileContext.Provider value = {value}>{children}</UserProfileContext.Provider>
}

export default UserProfileContextProvider