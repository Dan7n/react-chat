import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { Effects as EffectsComposer, Center, shaderMaterial, Plane } from "@react-three/drei";
import { extend, useThree, Canvas, useFrame, MeshProps } from "@react-three/fiber";
import { vertexShader, fragmentShader } from "./shaders";
// import { UnrealBloomPass } from "three-stdlib";

// extend({ UnrealBloomPass });

function Box(props) {
  const mesh = useRef<THREE.Mesh>(null);
  // rotate the box
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });
  // draw the box
  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFAE00" />
    </mesh>
  );
}

export const ThreeScene = React.memo(() => {
  console.log("rendered");
  return (
    <Canvas dpr={window.devicePixelRatio}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} />
    </Canvas>
  );
});

// export const Effects = () => {
//   const { size, scene, camera } = useThree();
//   const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

//   return (
//     <EffectsComposer multisamping={8} renderIndex={1} disableGamma disableRenderPass>
//       <renderPass attachArray="passes" scene={scene} camera={camera} />
//       {/* <UnrealBloomPass attachArray="passes" args={[aspect, 0.4, 1, 0]} /> */}
//     </EffectsComposer>
//   );
// };
