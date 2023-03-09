import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect, useContext } from "react";
import { useImages } from "../hooks/images";
import { UserProfileContext } from "./userProfile-context";

export const ImagesContext = createContext({
    images: [],
    getDecodedImages: (assignment_number) => {},
})


function ImagesContextProvider({children}) {
    const [images, setImages] = useState([]);
    const [encodedImages, setEncodedImages] = useState();

    const userprofileCtx = useContext(UserProfileContext);

    useEffect(() => {
        loadImagesDataFromStorage();
    }, []);

    async function loadImagesDataFromStorage() {
        try {
            const imagesJSON = await AsyncStorage.getItem("images");
            if (imagesJSON !== null) {
                setImages(JSON.parse(imagesJSON));
            }
        } 
        catch (error) {
            console.error("Error loading images from storage:", error);
        }
    }

    async function saveImagesInStorage(imagesJSON) {
        try {
            await AsyncStorage.setItem("images", imagesJSON);
            console.log('saved images in storage')
        }
        catch (error){
            console.error("Error saving images to storage:", error);
        }
    }

    function getDecodedImages(assignment_number, title, isMounted) {
        const user_profile_id = userprofileCtx.userprofile.id;
        const fetchImages = useImages(user_profile_id, assignment_number, title, isMounted, setEncodedImages);
        fetchImages();
        
        const imagesJSON = JSON.stringify(encodedImages);

        try {
            const decodedImages = imagesJSON.map((image) => {
                const binary = atob(image.data); // TODO check if this is correct
                const bytes = new Uint8Array(binary.length);
                
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: image.mime_type });
                const urlCreator = window.URL || window.webkitURL;
                return urlCreator.createObjectURL(blob);
            });
            setImages(prevDecodedImages => {
                const newDecodedImages = [...prevDecodedImages, decodedImages];
                saveImagesInStorage(newDecodedImages); //This has to be defined inside the setImages function
                return newDecodedImages;
            }); 
        }
        catch (error) {
            console.error("Error decoding images:", error);

        }

    }


    const value = {
        images: images,
        getDecodedImages: getDecodedImages,
    }

    return <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
}

export default ImagesContextProvider