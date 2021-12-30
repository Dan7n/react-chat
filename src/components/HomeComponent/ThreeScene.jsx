import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Stage, useGLTF, Stars, useHelper } from "@react-three/drei";
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRef } from "react";
import { motion } from "framer-motion/three";
import { DirectionalLightHelper } from "three";

export default function Earth({ ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/earth.gltf");

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <motion.group
      ref={group}
      {...props}
      dispose={null}
      animate={{ x: 0, y: 0, z: -200, rotateY: 1 }}
      initial={{ y: -60, z: -300 }}
      transition={{ ease: "easeOut", duration: 1.8 }}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0.05]} scale={[100, 100, 100]}>
            <mesh geometry={nodes["URF-Height_watr_0"].geometry} material={materials.watr} />
            <mesh geometry={nodes["URF-Height_Lampd_0"].geometry} material={materials.Lampd} />
            <mesh geometry={nodes["URF-Height_Lampd_Ice_0"].geometry} material={materials.Lampd_Ice} />
          </group>
        </group>
      </group>
    </motion.group>
  );
}

export const ThreeScene = () => {
  return (
    <div className="three-container">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <motion.pointLight animate={{ x: 2 }} color="#fff" intensity={0.3} />
          <motion.directionalLight color="#EF2F88" intensity={10} rotation={[0, 7, 0]} animate={{ x: 200 }} />
          <Earth position={[0, -30, -200]} scale={0.8} />
          {/* <OrbitControls /> */}
          {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};
