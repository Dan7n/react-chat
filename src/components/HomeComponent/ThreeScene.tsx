import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRef } from "react";

export const Earth = () => {
  const earthModel = useLoader(GLTFLoader, "./earth.gltf");
  const earthRef = useRef<any>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.z += 0.01;
    }
  });

  return (
    <>
      <primitive object={earthModel.scene} scale={0.02} ref={earthRef} />
    </>
  );
};

export const ThreeScene = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Suspense fallback={null}>
          <Earth />
          <OrbitControls />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};
