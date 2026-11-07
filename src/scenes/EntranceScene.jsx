import { forwardRef } from 'react';
import { Box, Label } from './Objects';

const EntranceScene = forwardRef(function EntranceScene({ portalLight, lightLeak }, doorRef) {
  return <group position={[3, 0, 3]}>
    <Box position={[0, -.16, 0]} size={[10, .18, 11]} color="#10151e"/>
    <mesh position={[0, -.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 11]}/>
      <meshPhysicalMaterial color="#111723" metalness={.42} roughness={.24} clearcoat={.7} clearcoatRoughness={.22}/>
    </mesh>

    {/* Deep jambs and header give the threshold a solid architectural frame. */}
    {[-1, 1].map(side => <group key={side}>
      <Box position={[side * 1.62, 2.4, 0]} size={[.3, 4.9, .72]} color="#242b37"/>
      <Box position={[side * 1.43, 2.4, .38]} size={[.035, 4.62, .035]} color="#e63946" emissive="#e63946"/>
    </group>)}
    <Box position={[0, 4.83, 0]} size={[3.55, .22, .72]} color="#252d3a"/>
    <Box position={[0, 4.69, .38]} size={[3.15, .025, .035]} color="#e63946" emissive="#e63946"/>
    <Label text="MIM IRFAN" position={[0, 5.15, .18]} width={2.65} height={.38} color="#f8fafc" small/>

    <group ref={doorRef} position={[-1.43, 0, .06]}>
      <Box position={[1.43, 2.36, 0]} size={[2.86, 4.62, .2]} color="#171e2a"/>
      {/* Recessed panels sit slightly proud of the slab with a narrow metal reveal. */}
      {[1.35, 3.36].map((y, index) => <group key={y}>
        <Box position={[1.43, y, .112]} size={[2.18, 1.55, .035]} color="#0d121b"/>
        <Box position={[1.43, y, .133]} size={[2.02, 1.39, .025]} color={index ? '#1c2430' : '#202733'}/>
        <Box position={[.37, y, .155]} size={[.035, 1.48, .035]} color="#39414d"/>
        <Box position={[2.49, y, .155]} size={[.035, 1.48, .035]} color="#39414d"/>
        <Box position={[1.43, y + .72, .155]} size={[2.15, .035, .035]} color="#39414d"/>
        <Box position={[1.43, y - .72, .155]} size={[2.15, .035, .035]} color="#39414d"/>
      </group>)}
      <Box position={[2.62, 2.28, .19]} size={[.045, .54, .07]} color="#d0ad76" emissive="#6a4721"/>
      <mesh position={[2.62, 2.28, .25]}>
        <cylinderGeometry args={[.035, .035, .52, 12]}/>
        <meshStandardMaterial color="#d0ad76" metalness={.82} roughness={.23}/>
      </mesh>
      <Box position={[1.43, .12, .16]} size={[2.6, .045, .035]} color="#a6793e" emissive="#7f4c1f"/>
    </group>

    {/* Warm spill widens across the glossy floor as the door opens. */}
    <mesh position={[0, -.055, .66]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.2, 1.65]}/>
      <meshBasicMaterial ref={lightLeak} color="#ffb967" transparent opacity={.04} depthWrite={false} toneMapped={false}/>
    </mesh>
    <pointLight ref={portalLight} position={[0, 2.15, .48]} color="#ffb967" intensity={.25} distance={11} decay={2}/>
    <pointLight position={[-2.8, 3.6, 1.1]} color="#e63946" intensity={5.5} distance={8}/>
    <pointLight position={[2.8, 2.8, -1.3]} color="#f59e0b" intensity={3.2} distance={9}/>
  </group>;
});
export default EntranceScene;
