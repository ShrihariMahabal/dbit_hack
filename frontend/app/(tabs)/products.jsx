// App.js
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // HTML content with Three.js - all code included inline to avoid loading issues
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Interactive 3D Earth</title>
      <style>
        body { 
          margin: 0;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          background-color: #000;
          touch-action: none;
        }
        canvas { 
          display: block;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: Arial, sans-serif;
        }
        .info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 12px;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border-radius: 5px;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="loading" id="loading">Loading Earth...</div>
      <div class="info" id="info">
        • Pinch or scroll to zoom<br>
        • Drag to rotate<br>
        • Two fingers to pan
      </div>
      
      <script>
        // Load Three.js from CDN with a callback
        function loadScript(url, callback) {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.onload = callback;
          document.head.appendChild(script);
        }
        
        // First load Three.js, then OrbitControls, then start the app
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', function() {
          // After Three.js loads, load OrbitControls
          loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js', initApp);
        });
        
        // Main application
        function initApp() {
          // Make sure Three.js is loaded
          if (typeof THREE === 'undefined') {
            document.getElementById('loading').textContent = 'Error: Three.js not loaded';
            return;
          }
          
          // Scene setup
          const scene = new THREE.Scene();
          
          // Camera setup
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.z = 3;
          
          // Renderer setup
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio);
          document.body.appendChild(renderer.domElement);
          
          // Add OrbitControls - with fallback if not loaded properly
          let controls;
          try {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.minDistance = 1.5;  // Minimum zoom distance
            controls.maxDistance = 10;   // Maximum zoom distance
            controls.enablePan = true;
          } catch (e) {
            console.error('OrbitControls not available:', e);
            document.getElementById('info').textContent = 'Interactive controls not available';
            // Create basic auto-rotation instead
            controls = null;
          }
          
          // Earth geometry
          const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
          
          // Earth material (simple version initially)
          const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            shininess: 5
          });
          
          // Create and add Earth mesh to scene (temporary blue sphere)
          const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
          scene.add(earthMesh);
          
          // Add ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
          scene.add(ambientLight);
          
          // Add directional light (sunlight)
          const sunLight = new THREE.DirectionalLight(0xffffff, 1);
          sunLight.position.set(5, 3, 5);
          scene.add(sunLight);
          
          // Create cloud layer
          const cloudGeometry = new THREE.SphereGeometry(1.02, 32, 32);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
          });
          
          const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
          scene.add(cloudMesh);
          
          // Earth texture loading with fallback
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
            function(texture) {
              // Apply texture to Earth
              earthMaterial.map = texture;
              earthMaterial.needsUpdate = true;
              
              // Hide loading text
              document.getElementById('loading').style.display = 'none';
              
              // Try to load cloud texture
              textureLoader.load(
                'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.jpg',
                function(cloudTexture) {
                  cloudMaterial.map = cloudTexture;
                  cloudMaterial.opacity = 0.4;
                  cloudMaterial.needsUpdate = true;
                }
              );
            },
            null,
            function(error) {
              console.error('Error loading texture', error);
              document.getElementById('loading').textContent = 'Using basic Earth (texture failed to load)';
              setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
              }, 2000);
            }
          );
          
          // Add background stars
          const starGeometry = new THREE.BufferGeometry();
          const starCount = 1000;
          
          const positions = new Float32Array(starCount * 3);
          
          for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
          }
          
          starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          
          const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1
          });
          
          const stars = new THREE.Points(starGeometry, starMaterial);
          scene.add(stars);
          
          // Handle window resize
          window.addEventListener('resize', function() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
          });
          
          // Hide instructions after 5 seconds
          setTimeout(() => {
            const info = document.getElementById('info');
            info.style.opacity = '0';
            info.style.transition = 'opacity 1s ease-out';
          }, 5000);
          
          // Animation loop
          function animate() {
            requestAnimationFrame(animate);
            
            // If OrbitControls is available, update it
            if (controls) {
              controls.update();
            } else {
              // Otherwise do simple auto-rotation
              earthMesh.rotation.y += 0.005;
            }
            
            // Rotate clouds
            if (cloudMesh) {
              cloudMesh.rotation.y += 0.0008;
            }
            
            renderer.render(scene, camera);
          }
          
          // Start animation
          animate();
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading WebView...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
});