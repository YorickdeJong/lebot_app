import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { ColorsGray } from '../../../constants/palet';

const ImageRender = () => {
  const source = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <title>Three.js in WebView</title>
          <style>body { margin: 0; }</style>
          <script src="https://cdn.jsdelivr.net/npm/three@0.115/build/three.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.115/examples/js/loaders/GLTFLoader.js"></script>
      </head>
      <body>
      <div id="container"></div>
        <script>
            if (typeof THREE === 'undefined') {
              window.ReactNativeWebView.postMessage('THREE is not defined');
            } else {
              window.ReactNativeWebView.postMessage('THREE is available');
            }
            window.ReactNativeWebView.postMessage('Script is running');
            
            var scene, camera, renderer;
            var container = document.getElementById('container');    
            init();
            animate();
    
            function init() {
              try {
                window.ReactNativeWebView.postMessage('Init function called');
                scene = new THREE.Scene();
                var ambientLight = new THREE.AmbientLight(0xcccccc);
                scene.add(ambientLight);
                camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                camera.position.z = 500;
              
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(renderer.domElement);
              
                  var loader = new THREE.GLTFLoader().setCrossOrigin('anonymous');
                  window.ReactNativeWebView.postMessage('Loader created');
                  loader.load('https://learning-bot-app.herokuapp.com/assignmentOne.glb', 
                    function (gltf) {
                      window.ReactNativeWebView.postMessage('GLTF loading callback called');
                      scene.add(gltf.scene);
                    }, 
                    function (xhr) {
                      window.ReactNativeWebView.postMessage('GLTF progress callback called: ' + xhr.loaded / xhr.total);
                    },
                    function (error) {
                      window.ReactNativeWebView.postMessage('An error occurred while loading the GLTF: ' + error.message);
                    }
                  );
              } catch (error) {
                window.ReactNativeWebView.postMessage('An error occurred while creating the loader: ' + error.message);
              }
            }
    
            function animate() {
              try {
                window.ReactNativeWebView.postMessage('Animate function called');
                requestAnimationFrame(animate);
                renderer.render(scene, camera); 
              }
              catch(error) {
                window.ReactNativeWebView.postMessage('An error occurred while animating: ' + error.message);
              }
            }
          </script>
      </body>
    </html>
  `;
  
    return (
          <WebView
              originWhitelist={['*']}
              source={{ html: source }}
              // injectedJavaScript={`window.ReactNativeWebView.postMessage = message => window.ReactNativeWebView.postMessage(message);`}
              onMessage={(event) => console.log('webview', event.nativeEvent.data)}
              startInLoadingState={true}
              style={styles.container}
          />          
    );
  }
  
const styles = StyleSheet.create({
  container: {
      alignSelf: 'center',
      width: '94%',
      height: 300,
      borderRadius: 20,
      borderColor: ColorsGray.gray500,
      backgroundColor: 'Black',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
});

export default React.memo(ImageRender);


// import React, { useEffect, useRef, useState } from 'react';
// import { GLView } from 'expo-gl';
// import { Renderer, THREE } from 'expo-three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { Asset } from 'expo-asset';
// import { decode as atob } from 'base-64';
// import * as FileSystem from 'expo-file-system';
// import { StyleSheet } from 'react-native';
// import { ColorsGray } from '../../../constants/palet';

// export default function ImageRender() {
//   const [loading, setLoading] = useState(true);

//   let timeout;
//   const onContextCreate = async (gl) => {
//     try {
//       console.log('check')
//       const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
//       const renderer = new Renderer({ gl });
//       renderer.setSize(width, height);
//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//       camera.position.z = 5;
  
//       console.log('check 2')
//       const render = () => {
//         timeout = requestAnimationFrame(render);
//         renderer.render(scene, camera);
//         gl.endFrameEXP();
//       };
  
//       console.log('check 3')
//       const loader = new GLTFLoader();
//       const uri = 'https://learning-bot-app.herokuapp.com/assignmentOne.glb';
//       const asset = Asset.fromURI(uri);
//       await asset.downloadAsync();
      
//       console.log('check 4')
//       FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 })
//         .then((base64String) => {
//           const buffer = Uint8Array.from(atob(base64String), c => c.charCodeAt(0)).buffer;
//           loader.parse(
//             buffer,
//             '',
//             (gltf) => {
//               scene.add(gltf.scene);
//               setLoading(false);
//             },
//             (error) => {
//               console.error('An error occurred while parsing GLTF:', error);
//             }
//           );
//         })
//         .catch((err) => {
//           console.error('Failed to read file:', err);
//         });
//       render();
//       console.log('check 5')
//     }
//     catch (error) {
//       console.log('errror', error)
//     }
//   }

//   const onContextDestroy = () => {
//     if (timeout) {
//       cancelAnimationFrame(timeout);
//     }
//   };

//   console.log('check 6')
//   return (
//         <GLView style={styles.container} onContextCreate={onContextCreate} onContextDestroy={onContextDestroy} />
//   )
// }


// const styles = StyleSheet.create({
//       container: {
//         alignSelf: 'center',
//         width: '94%',
//         height: 500,
//         borderRadius: 20,
//         borderColor: ColorsGray.gray500,
//         backgroundColor: 'Black',
//         borderWidth: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
// })