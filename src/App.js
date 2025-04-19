// import React, { useRef, useEffect, useState } from 'react';
// import URDFLoader from 'urdf-loader';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// function App() {
//   const canvasRef = useRef(null);
//   const [robot, setRobot] = useState(null);
//   const [viewer, setViewer] = useState(null);

//   const setRobotJointValues = (robot, positions) => {
//     Object.keys(positions).forEach((jointName) => {
//       const joint = robot.joints[jointName];
//       if (joint && joint.setAngle) {
//         //joint.setAngle(positions[jointName]);

//         viewer.setJointValue(jointName, positions[jointName]);

//       }
//     });
//   };

//   const animateRobot = async () => {
//     const position1 = [ 0.5, -0.5, 0.2 ];
//     const position2 = [ -0.5, 0.5, -0.2 ];
//     const position3 = [ 0, 0, 0 ];

//     const positions = [position1, position2, position3];
//     for (const position of positions) {
//       robot.joints['elbow'].setJointValue(position[0]);
//       robot.joints['shoulder'].setJointValue(position[1]);
//       robot.joints['wrist'].setJointValue(position[2]);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   };

//   useEffect(() => {
//     console.log(viewer)
//   }, [viewer])

//   useEffect(() => {
//     console.log(robot)
//   }, [robot])

//   const handleAnimateButtonClick = () => {
//     animateRobot();
//   };

//   useEffect(() => {
//     const manager = new THREE.LoadingManager();
//     const loader = new URDFLoader(manager);

//     loader.load('./robot.urdf', (loadedRobot) => {
//       setRobot(loadedRobot);
//       setViewer(loader)
//       const scene = new THREE.Scene();

//       // Set up lights and camera
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//       directionalLight.position.set(0, 1, 0);

//       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       camera.position.z = 2;

//       scene.add(ambientLight, directionalLight, loadedRobot);

//       const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//       renderer.setSize(window.innerWidth, window.innerHeight);

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.update();

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };

//       animate();
//     });
//   }, []);

//   return (
//     <div>
//       <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />
//       <button onClick={handleAnimateButtonClick} style={{ position: 'absolute', top: 10, right: 10 }}>
//         Animate Robot
//       </button>
//     </div>
//   );
// }

// export default App;

////////////////////////////////////////////////////////////////////////////////

// import React, { useRef, useEffect, useState } from 'react';
// import URDFLoader from 'urdf-loader';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// function App() {
//   const canvasRef = useRef(null);
//   const robotRef = useRef(null);
//   const [jointSliders, setJointSliders] = useState({});
//   const [materialType, setMaterialType] = useState("none");

//   const MotionAPI = {
//     motions: {
//       raise_hand: [
//         { time: 0.0, joints: { RA: 0.0 } },
//         { time: 0.5, joints: { RA: 1.5 } },
//         { time: 1.0, joints: { RA: 0.0 } }
//       ],
//       shake_head: [
//         { time: 0.0, joints: { HR: 0.0 } },
//         { time: 0.3, joints: { HR: 0.6 } },
//         { time: 0.4, joints: { HR: -0.6 } },
//         { time: 0.7, joints: { HR: 0.6 } },
//         { time: 1.0, joints: { HR: 0.0 } }
//       ],
//       dance_spin: [
//         { time: 0.1, joints: { BR: 0.0, RA: 0.0, LA: 1.5} },
//         { time: 0.2, joints: { BR: 0.7, RA: 1.5, LA: 0.0 } },
//         { time: 0.3, joints: { BR: 1.4, RA: 0.0, LA: 1.5 } },
//         { time: 0.4, joints: { BR: 2.1, RA: 1.5, LA: 0.0 } },
//         { time: 0.5, joints: { BR: 2.8, RA: 0.0, LA: 1.5 } },
//         { time: 0.6, joints: { BR: 3.5, RA: 1.5, LA: 0.0 } },
//         { time: 0.7, joints: { BR: 4.2, RA: 0.0, LA: 1.5 } },
//         { time: 0.8, joints: { BR: 4.9, RA: 1.5, LA: 0.0 } },
//         { time: 0.9, joints: { BR: 5.6, RA: 0.0, LA: 1.5 } },
//         { time: 1.0, joints: { BR: 6.28, RA: 0.0, LA: 0.0 } }
//       ]
//     },

//     play: (motionName) => {
//       const robot = robotRef.current;
//       const frames = MotionAPI.motions[motionName];
//       if (!robot || !frames) return;

//       let start = performance.now();
//       const duration = frames[frames.length - 1].time * 1000;

//       const animate = (now) => {
//         const elapsed = now - start;
//         const t = elapsed / duration;

//         let i = 0;
//         while (i < frames.length - 1 && t > frames[i + 1].time) i++;

//         const f1 = frames[i];
//         const f2 = frames[i + 1] ?? f1;

//         const localT = (t - f1.time) / (f2.time - f1.time);

//         Object.keys(f1.joints).forEach((jointName) => {
//           const v1 = f1.joints[jointName];
//           const v2 = f2.joints[jointName];
//           const value = v1 + (v2 - v1) * localT;
//           if (robot.joints[jointName]) {
//             robot.joints[jointName].setJointValue(value);
//           }
//         });

//         if (t < 1) {
//           requestAnimationFrame(animate);
//         } else {
//           const finalPose = frames[frames.length - 1].joints;
//           Object.entries(finalPose).forEach(([jointName, value]) => {
//             if (robot.joints[jointName]) {
//               robot.joints[jointName].setJointValue(value);
//             }
//           });
//         }
//       };

//       requestAnimationFrame(animate);
//     }
//   };

//   const updateJointValue = (jointName, value) => {
//     const robot = robotRef.current;
//     if (robot && robot.joints[jointName]) {
//       robot.joints[jointName].setJointValue(value);
//     }
//   };

//   const buildJointSliders = (robot) => {
//     const sliders = {};
//     Object.keys(robot.joints).forEach((jointName) => {
//       const joint = robot.joints[jointName];
//       if (jointName === "screen_to_head" || joint.type === 'fixed') return;
//       sliders[jointName] = {
//         joint,
//         value: joint.angle ?? 0,
//       };
//     });
//     setJointSliders(sliders);
//   };

//   const applyMaterial = (robot, material) => {
//     robot.traverse((child) => {
//       if (child.name === "screen_panel") {
//         child.traverse((mesh) => {
//           if (mesh instanceof THREE.Mesh) {
//             if (mesh.material) mesh.material.dispose();
//             mesh.material = material;
//             mesh.material.needsUpdate = true;
//           }
//         });
//       }
//     });
//   };

//   useEffect(() => {
//     const manager = new THREE.LoadingManager();
//     const loader = new URDFLoader(manager);

//     loader.load('/my_robot/robot_with_visible_screen.urdf', (robot) => {
//       robotRef.current = robot;

//       const blackMaterial = new THREE.MeshBasicMaterial({
//         color: 0x000000,
//         side: THREE.DoubleSide,
//       });
//       applyMaterial(robot, blackMaterial);

//       const scene = new THREE.Scene();
//       const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//       const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//       directionalLight.position.set(0, 1, 0);

//       const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//       camera.position.z = 3;

//       scene.add(ambientLight, directionalLight, robot);

//       const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
//       renderer.setSize(window.innerWidth, window.innerHeight);

//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.target.set(0, 0, 0);
//       controls.update();

//       buildJointSliders(robot);

//       const animate = () => {
//         requestAnimationFrame(animate);
//         controls.update();
//         renderer.render(scene, camera);
//       };

//       animate();
//     });
//   }, []);

//   useEffect(() => {
//     const robot = robotRef.current;
//     if (!robot) return;

//     if (materialType === "none") {
//       const blackMaterial = new THREE.MeshBasicMaterial({
//         color: 0x000000,
//         side: THREE.DoubleSide
//       });
//       applyMaterial(robot, blackMaterial);
//     }

//     if (materialType === "image") {
//       new THREE.TextureLoader().load('/images/smile.png', (texture) => {
//         texture.minFilter = THREE.LinearFilter;
//         texture.magFilter = THREE.LinearFilter;
//         const imageMaterial = new THREE.MeshBasicMaterial({
//           map: texture,
//           side: THREE.DoubleSide,
//           transparent: true,
//           color: 0xffffff,
//           opacity: 1.0
//         });
//         applyMaterial(robot, imageMaterial);
//       });
//     }

//     if (materialType === "video") {
//       const video = document.createElement('video');
//       video.src = '/videos/firework.mp4';
//       video.loop = true;
//       video.muted = true;
//       video.autoplay = true;
//       video.playsInline = true;
//       video.crossOrigin = 'anonymous';
//       video.play();

//       const videoTexture = new THREE.VideoTexture(video);
//       videoTexture.minFilter = THREE.LinearFilter;
//       videoTexture.magFilter = THREE.LinearFilter;

//       const videoMaterial = new THREE.MeshBasicMaterial({
//         map: videoTexture,
//         side: THREE.DoubleSide
//       });

//       applyMaterial(robot, videoMaterial);
//     }
//   }, [materialType]);

//   return (
//     <>
//       <canvas
//         ref={canvasRef}
//         style={{ width: '100vw', height: '100vh' }}
//       />
//       <div style={{
//         position: 'absolute',
//         top: 10,
//         left: 10,
//         backgroundColor: 'rgba(255,255,255,0.8)',
//         padding: '10px',
//         borderRadius: '8px',
//         maxHeight: '90vh',
//         overflowY: 'auto'
//       }}>
//         <div style={{ marginBottom: '10px' }}>
//           <button onClick={() => setMaterialType("image")} style={buttonStyle(materialType === "image")}>Show Image</button>
//           <button onClick={() => setMaterialType("video")} style={buttonStyle(materialType === "video")}>Play Video</button>
//           <button onClick={() => setMaterialType("none")} style={buttonStyle(materialType === "none")}>Clear</button>
//           <button onClick={() => MotionAPI.play("raise_hand")} style={buttonStyle(false)}>Raise Hand</button>
//           <button onClick={() => MotionAPI.play("shake_head")} style={buttonStyle(false)}>Shake Head</button>
//           <button onClick={() => MotionAPI.play("dance_spin")} style={buttonStyle(false)}>Dance Spin</button>
//         </div>

//         {Object.entries(jointSliders).map(([jointName, slider]) => {
//           const lower = slider.joint.limit?.lower ?? -Math.PI;
//           const upper = slider.joint.limit?.upper ?? Math.PI;
//           return (
//             <div key={jointName} style={{ marginBottom: '10px' }}>
//               <label>{jointName}:</label>
//               <input
//                 type="range"
//                 min={lower}
//                 max={upper}
//                 step="0.01"
//                 value={slider.value}
//                 onChange={(e) => {
//                   const newValue = parseFloat(e.target.value);
//                   updateJointValue(jointName, newValue);
//                   setJointSliders((prev) => ({
//                     ...prev,
//                     [jointName]: {
//                       ...prev[jointName],
//                       value: newValue,
//                     },
//                   }));
//                 }}
//               />
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// function buttonStyle(active) {
//   return {
//     marginRight: '8px',
//     padding: '6px 12px',
//     backgroundColor: active ? '#555' : '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   };
// }

// export default App;






















import React, { useRef, useEffect, useState } from 'react';
import URDFLoader from 'urdf-loader';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer} from 'three-stdlib';
import html2canvas from 'html2canvas';
import RobotTimeline from './RobotTimeline.jsx';

function App() {
  const canvasRef = useRef(null);
  const robotRef = useRef(null);
  const cssContainerRef = useRef(null);
  const cssRendererRef = useRef(null);
  const [jointSliders, setJointSliders] = useState({});
  const [materialType, setMaterialType] = useState("none");

  const MotionAPI = {
    motions: {
      raise_hand: [
        { time: 0.0, joints: { RA: 0.0 } },
        { time: 0.5, joints: { RA: 1.5 } },
        { time: 1.0, joints: { RA: 0.0 } }
      ],
      shake_head: [
        { time: 0.0, joints: { HR: 0.0 } },
        { time: 0.3, joints: { HR: 0.6 } },
        { time: 0.4, joints: { HR: -0.6 } },
        { time: 0.7, joints: { HR: 0.6 } },
        { time: 1.0, joints: { HR: 0.0 } }
      ],
      dance_spin: [
        { time: 0.1, joints: { HK: 0.0, BR: 0.0, RA: 0.0, LA: 1.5} },
        { time: 0.2, joints: { HK: 0.6, BR: 0.7, RA: 1.5, LA: 0.0 } },
        { time: 0.3, joints: { HK: 0.0, BR: 1.4, RA: 0.0, LA: 1.5 } },
        { time: 0.4, joints: { HK: -0.6, BR: 2.1, RA: 1.5, LA: 0.0 } },
        { time: 0.5, joints: { HK: 0.0, BR: 2.8, RA: 0.0, LA: 1.5 } },
        { time: 0.6, joints: { HK: 0.6, BR: 3.5, RA: 1.5, LA: 0.0 } },
        { time: 0.7, joints: { HK: 0.0, BR: 4.2, RA: 0.0, LA: 1.5 } },
        { time: 0.8, joints: { HK: -0.6, BR: 4.9, RA: 1.5, LA: 0.0 } },
        { time: 0.9, joints: { HK: 0.0, BR: 5.6, RA: 0.0, LA: 1.5 } },
        { time: 1.0, joints: { HK: 0.0, BR: 6.28, RA: 0.0, LA: 0.0 } }
      ]
    },
    playSingleJoint: (motionName, jointName, startTime = 0, endTime = 1) => {
      const robot = robotRef.current;
      const frames = MotionAPI.motions[motionName];
      if (!robot || !frames) return;
    
      //const motionDuration = frames[frames.length - 1].time * 1000;
      const actionDuration = (endTime - startTime) * 1000;
    
      let start = performance.now();
    
      const animate = (now) => {
        const elapsed = now - start;
        const t = elapsed / actionDuration;
    
        let i = 0;
        while (i < frames.length - 1 && t > frames[i + 1].time) i++;
    
        const f1 = frames[i];
        const f2 = frames[i + 1] ?? f1;
    
        const localT = (t - f1.time) / (f2.time - f1.time);
    
        const v1 = f1.joints[jointName];
        const v2 = f2.joints[jointName];
    
        if (v1 != null && v2 != null) {
          const value = v1 + (v2 - v1) * localT;
          if (robot.joints[jointName]) {
            robot.joints[jointName].setJointValue(value);
          }
        }
    
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          const final = frames[frames.length - 1].joints[jointName];
          if (final != null && robot.joints[jointName]) {
            robot.joints[jointName].setJointValue(final);
          }
        }
      };
    
      requestAnimationFrame(animate);
    },
    
    play: (motionName) => {
      const robot = robotRef.current;
      const frames = MotionAPI.motions[motionName];
      if (!robot || !frames) return;

      let start = performance.now();
      const duration = frames[frames.length - 1].time * 1000;

      const animate = (now) => {
        const elapsed = now - start;
        const t = elapsed / duration;

        let i = 0;
        while (i < frames.length - 1 && t > frames[i + 1].time) i++;

        const f1 = frames[i];
        const f2 = frames[i + 1] ?? f1;

        const localT = (t - f1.time) / (f2.time - f1.time);

        Object.keys(f1.joints).forEach((jointName) => {
          const v1 = f1.joints[jointName];
          const v2 = f2.joints[jointName];
          const value = v1 + (v2 - v1) * localT;
          if (robot.joints[jointName]) {
            robot.joints[jointName].setJointValue(value);
          }
        });

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          const finalPose = frames[frames.length - 1].joints;
          Object.entries(finalPose).forEach(([jointName, value]) => {
            if (robot.joints[jointName]) {
              robot.joints[jointName].setJointValue(value);
            }
          });
        }
      };

      requestAnimationFrame(animate);
    }
  };

  const updateJointValue = (jointName, value) => {
    const robot = robotRef.current;
    if (robot && robot.joints[jointName]) {
      robot.joints[jointName].setJointValue(value);
    }
  };

  const buildJointSliders = (robot) => {
    const sliders = {};
    Object.keys(robot.joints).forEach((jointName) => {
      const joint = robot.joints[jointName];
      if (jointName === "screen_to_head" || joint.type === 'fixed') return;
      sliders[jointName] = {
        joint,
        value: joint.angle ?? 0,
      };
    });
    setJointSliders(sliders);
  };

  const applyMaterial = (robot, material) => {
    robot.traverse((child) => {
      if (child.name === "screen_panel") {
        child.traverse((mesh) => {
          if (mesh instanceof THREE.Mesh) {
            if (mesh.material) mesh.material.dispose();
            mesh.material = material;
            mesh.material.needsUpdate = true;
          }
        });
      }
    });
  };

  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new URDFLoader(manager);

    loader.load('/my_robot/robot_with_visible_screen.urdf', (robot) => {
      robotRef.current = robot;

      const blackMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      });
      applyMaterial(robot, blackMaterial);

      const scene = new THREE.Scene();
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 1, 0);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3;

      scene.add(ambientLight, directionalLight, robot);

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const cssRenderer = new CSS3DRenderer();
      cssRenderer.setSize(window.innerWidth, window.innerHeight);
      cssRenderer.domElement.style.position = 'absolute';
      cssRenderer.domElement.style.top = 0;
      cssRenderer.domElement.style.pointerEvents = 'none';
      cssContainerRef.current.appendChild(cssRenderer.domElement);
      cssRendererRef.current = cssRenderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();

      buildJointSliders(robot);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
      };

      animate();
    });
  }, []);

  useEffect(() => {
    const robot = robotRef.current;
    if (!robot) return;
  
    if (materialType === "none") {
      const blackMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
      });
      applyMaterial(robot, blackMaterial);
    }
  
    if (materialType === "image") {
      new THREE.TextureLoader().load('/images/smile.png', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        const imageMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          color: 0xffffff,
          opacity: 1.0
        });
        applyMaterial(robot, imageMaterial);
      });
    }
  
    if (materialType === "video") {
      const video = document.createElement('video');
      video.src = '/videos/firework.mp4';
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.play();
  
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
  
      const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide
      });
  
      applyMaterial(robot, videoMaterial);
    }
  
    if (materialType === "html") {
      const iframe = document.createElement('iframe');
      iframe.src = '/html/face.html';
      iframe.style.width = '256px';
      iframe.style.height = '256px';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    
      let texture = null;
      let htmlMaterial = null;
      let stopped = false;
      let lastCaptureTime = 0;
      const captureInterval = 25;
    
      const startCaptureLoop = () => {
        const loop = (now) => {
          if (stopped) return;
    
          if (now - lastCaptureTime >= captureInterval) {
            lastCaptureTime = now;
    
            html2canvas(iframe.contentDocument.body, { scale: 0.5 }).then((canvas) => {
              if (!texture) {
                texture = new THREE.CanvasTexture(canvas);
                htmlMaterial = new THREE.MeshBasicMaterial({
                  map: texture,
                  side: THREE.DoubleSide,
                  transparent: true,
                });
                applyMaterial(robot, htmlMaterial);
              } else {
                texture.image = canvas;
                texture.needsUpdate = true;
              }
            });
          }
    
          requestAnimationFrame(loop);
        };
    
        requestAnimationFrame(loop);
      };
    
      iframe.onload = () => {
        startCaptureLoop();
      };
    
      return () => {
        stopped = true;
        if (iframe && iframe.parentElement) {
          document.body.removeChild(iframe);
        }
        if (texture) texture.dispose();
        if (htmlMaterial) htmlMaterial.dispose();
      };
    }
  }, [materialType]);
  

  return (
    <>
      <div ref={cssContainerRef} style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100vw', height: '100vh' }}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '10px',
        borderRadius: '8px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setMaterialType("image")} style={buttonStyle(materialType === "image")}>Show Image</button>
          <button onClick={() => setMaterialType("video")} style={buttonStyle(materialType === "video")}>Play Video</button>
          <button onClick={() => setMaterialType("html")} style={buttonStyle(materialType === "html")}>Show HTML (Snapshot)</button>
          <button onClick={() => setMaterialType("none")} style={buttonStyle(materialType === "none")}>Clear</button>
          <button onClick={() => MotionAPI.play("raise_hand")} style={buttonStyle(false)}>Raise Hand</button>
          <button onClick={() => MotionAPI.play("shake_head")} style={buttonStyle(false)}>Shake Head</button>
          <button onClick={() => MotionAPI.play("dance_spin")} style={buttonStyle(false)}>Dance Spin</button>
        </div>

        {Object.entries(jointSliders).map(([jointName, slider]) => {
          const lower = slider.joint.limit?.lower ?? -Math.PI;
          const upper = slider.joint.limit?.upper ?? Math.PI;
          return (
            <div key={jointName} style={{ marginBottom: '10px' }}>
              <label>{jointName}:</label>
              <input
                type="range"
                min={lower}
                max={upper}
                step="0.01"
                value={slider.value}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  updateJointValue(jointName, newValue);
                  setJointSliders((prev) => ({
                    ...prev,
                    [jointName]: {
                      ...prev[jointName],
                      value: newValue,
                    },
                  }));
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#eee',
        zIndex: 10
      }}>
        <RobotTimeline
          onTimelineChange={(data) => console.log('timeline changed', data)}
          playMotion={(motionName, jointName, start, end) => 
            MotionAPI.playSingleJoint(motionName, jointName, start, end)}
        />
      </div>
    </>
  );
}

function buttonStyle(active) {
  return {
    marginRight: '8px',
    padding: '6px 12px',
    backgroundColor: active ? '#555' : '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
}

export default App;














// import React from 'react';
// import TimelineDemo from './TimelineDemo';

// function App() {
//   return <TimelineDemo />;
// }

// export default App;



