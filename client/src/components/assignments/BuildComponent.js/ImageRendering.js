import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';

const ImageRender = () => {
  const source = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Three.js in WebView</title>
      <style>body { margin: 0; }</style>
      <script src="https://cdn.jsdelivr.net/npm/three@0.115/build/three.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/three@0.115/examples/js/controls/OrbitControls.js"></script>
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
    
        var scene, camera, renderer, gltfModel, controls;
        var container = document.getElementById('container');    
        init();
        animate();
    
        function init() {
          try {
              window.ReactNativeWebView.postMessage('Init function called');
              scene = new THREE.Scene();
      
              // Change the background color
              scene.background = new THREE.Color(0x010118); // Set this to whatever color you want

              
              // Enhanced Lighting
              var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
              scene.add(ambientLight);
      
              var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
              directionalLight.position.set(0, 1, 1);
              scene.add(directionalLight);
      
              var pointLight = new THREE.PointLight(0xffffff, 1, 0);
              pointLight.position.set(0, 200, 100);
              scene.add(pointLight);
      
              var pointLight2 = new THREE.PointLight(0xffffff, 2, 0);
              pointLight2.position.set(-1, 79, -39);
              scene.add(pointLight2);

              // Add a grid
              var size = 500;
              var divisions = 50;
              var gridHelper = new THREE.GridHelper(size, divisions);
              scene.add(gridHelper);
              
              var pointLight3 = new THREE.PointLight(0xffffff, 1, 0);
              pointLight3.position.set(-3, -18, -3.6);
              scene.add(pointLight3);

              camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
              camera.position.set(-6, 63, -125);
        
              renderer = new THREE.WebGLRenderer({ antialias: true });
              renderer.setSize(window.innerWidth, window.innerHeight);
              container.appendChild(renderer.domElement);
      
              // Initialize OrbitControls
              controls = new THREE.OrbitControls(camera, renderer.domElement);
      
              var loader = new THREE.GLTFLoader();
              window.ReactNativeWebView.postMessage('Loader created');
              loader.load('https://learning-bot-app.herokuapp.com/assignmentOne.glb', 
                  function (gltf) {
                      gltfModel = gltf.scene;
                      
                      // Center the model
                      const box = new THREE.Box3().setFromObject(gltf.scene);
                      const center = box.getCenter(new THREE.Vector3());
  
                      controls.target.copy(center);
  
                      gltfModel.position.x += (gltfModel.position.x - center.x);
                      gltfModel.position.y += (gltfModel.position.y - center.y + 60);
                      gltfModel.position.z += (gltfModel.position.z - center.z);
                      controls.update();
  
                      window.ReactNativeWebView.postMessage('GLTF loading callback called');
                      scene.add(gltfModel);
                      window.ReactNativeWebView.postMessage('GLTF Scene added to the main scene');
                  }, 
                  function (xhr) {
                      var percentage = (xhr.loaded / xhr.total * 100);
                      window.ReactNativeWebView.postMessage('GLTF progress callback called: ' + percentage + '% loaded');
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
            requestAnimationFrame(animate);
      
            controls.update();
            renderer.render(scene, camera); 
            
          } catch(error) {
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
    width: '96%',
    height: 300,
    borderRadius: 20,
    borderColor: 'rgba(77, 77, 77, 0.22)',
    backgroundColor: ColorsBlue.blue1200,
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