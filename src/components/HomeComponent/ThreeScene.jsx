import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import { Suspense } from "react";
import React, { useRef } from "react";
import { motion } from "framer-motion/three";

const Earth = React.memo(({ ...props }) => {
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
      animate={{ x: 0, y: -60, z: -200, rotateY: 1 }}
      initial={{ y: -140, z: -300 }}
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
});

export const ThreeScene = React.memo(() => {
  return (
    <div className="three-container">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <motion.pointLight animate={{ x: 2 }} color="#fff" intensity={0.3} />
          <motion.directionalLight color="#EF2F88" intensity={10} rotation={[0, 7, 0]} animate={{ x: 200 }} />
          <PresentationControls snap={true} speed={0.65} config={{ mass: 1, tension: 170, friction: 26 }}>
            <Earth scale={1.3} />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
});
