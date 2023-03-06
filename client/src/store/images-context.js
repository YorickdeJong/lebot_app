import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";


export const ImagesContext = createContext({
    images: [],
    initializeImages: (images) => {},
    addImages: (image) => {},
    filterImageWithAssignment: (title) => {},
})


function ImagesContextProvider({children}) {
    const [images, setImages] = useState([]);

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

    async function saveImagesInStorage(images) {
        try {
            const imagesJSON = JSON.stringify(images);
            await AsyncStorage.setItem("images", imagesJSON);
            console.log('saved images in storage')
        }
        catch (error){
            console.error("Error saving images to storage:", error);
        }
    }

    function initializeImages(imageArray) {
            setImages(imageArray);
            saveImagesInStorage(imageArray);
        }

    function addImages(image) {
        setImages(images => [...images, image]);
        saveImagesInStorage(images => [...images, image]);
    }

    function filterImageWithAssignment(title) {
        return images.filter((image) => image.title === title)
    }

    const value = {
        images: images,
        initializeImages: initializeImages,
        addImages: addImages,
        filterImageWithAssignment: filterImageWithAssignment,
    }

    return <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
}

export default ImagesContextProvider