"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Environment, MeshWobbleMaterial, Text } from "@react-three/drei"
import * as THREE from "three"

// --- Procedural 3D Models ---

function GraduationCapModel() {
  return (
    <group rotation={[0.4, 0.2, 0]} scale={0.9}>
      {/* Top Part */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.5, 0.05, 1.5]} />
        <meshStandardMaterial color="#0a1128" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
        <meshStandardMaterial color="#0a1128" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Tassel */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
      <group position={[0.7, 0.15, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

function MicroscopeModel() {
  return (
    <group rotation={[0.4, -0.4, 0.2]} scale={0.8}>
      {/* Base - clean flat box */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1.2, 0.15, 1]} />
        <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Main Support - simpler C-shape */}
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.2, 1.4, 0.2]} />
        <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Horizontal Bridge */}
      <mesh position={[0.1, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.2]} />
        <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Eye piece barrel */}
      <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 32]} />
        <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Lens barrel pointing down */}
      <mesh position={[0.4, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
        <meshPhysicalMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Stage */}
      <mesh position={[0.2, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.8]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function NotebookModel() {
  return (
    <group rotation={[0.6, -0.5, 0.2]} scale={0.8}>
      {/* Closed Book Cover */}
      <mesh>
        <boxGeometry args={[1.1, 1.5, 0.2]} />
        <meshPhysicalMaterial color="#1E3A8A" metalness={0.1} roughness={0.6} clearcoat={0.5} />
      </mesh>
      {/* Text on Cover */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.12}
        color="#f5b041"
        anchorX="center"
        anchorY="middle"
      >
        NOTEBOOK
      </Text>
      {/* Page edges showing on three sides */}
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[1.05, 1.4, 0.15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* Gold Ribbon Bookmark hanging out */}
      <mesh position={[0.3, -0.85, 0.1]}>
        <boxGeometry args={[0.08, 0.3, 0.02]} />
        <meshStandardMaterial color="#f5b041" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Spine logo/detail */}
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.1, 1.5, 0.25]} />
        <meshPhysicalMaterial color="#172554" metalness={0.1} roughness={0.6} />
      </mesh>
    </group>
  )
}

function PenModel() {
  return (
    <group rotation={[0.8, 0.5, 0]}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 2, 16]} />
        <meshStandardMaterial color="#0a1128" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cap/Clip */}
      <mesh position={[0, 0.6, 0.08]}>
        <boxGeometry args={[0.02, 0.4, 0.05]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 16]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Nib */}
      <mesh position={[0, -1.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.06, 0.3, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0} />
      </mesh>
    </group>
  )
}

function FlaskModel() {
  return (
    <group rotation={[0.2, 0, 0.1]}>
      {/* Glass Body */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.4, 1, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.1} roughness={0} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.13, 0.35, 0.6, 32]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} metalness={0.1} roughness={0} />
      </mesh>
    </group>
  )
}

function BellModel() {
  return (
    <group rotation={[0.3, 0, -0.2]} scale={0.7}>
      {/* Bell Body */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.6, 0.8, 32]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color="#4a2c00" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Top Knob */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function LightbulbModel() {
  return (
    <group>
      {/* Bulb */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshWobbleMaterial color="#fef3c7" factor={0.1} speed={1} transparent opacity={0.4} />
      </mesh>
      {/* Filament (Glowing core) */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f5b041" emissive="#f5b041" emissiveIntensity={2} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function CompassModel() {
  return (
    <group rotation={[0, 0, 0.4]}>
      {/* Leg 1 */}
      <mesh position={[-0.2, -0.5, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0} />
      </mesh>
      {/* Leg 2 */}
      <mesh position={[0.2, -0.5, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0} />
      </mesh>
      {/* Hinge */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#f5b041" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// --- Main Components ---

function FloatingModel({ 
  position, 
  Children, 
  scale = 1.8,
  delay = 0 
}: { 
  position: [number, number, number], 
  Children: React.ComponentType, 
  scale?: number,
  delay?: number
}) {
  return (
    <Float 
      speed={3.5} 
      rotationIntensity={2.5} 
      floatIntensity={4.5} 
      position={position}
    >
      <group scale={scale}>
        <Children />
      </group>
    </Float>
  )
}

function ParticleField() {
  const count = 400
  const mesh = useRef<THREE.Points>(null)
  
  const [positions] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return [positions]
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#f5b041"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

function CameraRig() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02
    camera.position.y += (mouse.y * 1 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#f5b041" />
        <pointLight position={[10, -10, 5]} intensity={1.5} color="#1E3A8A" />
        
        {/* Procedural 3D Models - Structured Grid on Right Side */}
        {/* Column 1 */}
        <FloatingModel position={[5, 4.5, -2]} Children={GraduationCapModel} />
        <FloatingModel position={[6, 1.5, -2]} Children={NotebookModel} />
        <FloatingModel position={[5, -1.5, -2]} Children={FlaskModel} />
        <FloatingModel position={[6, -4.5, -2]} Children={PenModel} />
        
        {/* Column 2 */}
        <FloatingModel position={[11, 4, -3]} Children={CompassModel} />
        <FloatingModel position={[10, 1, -3]} Children={LightbulbModel} />
        <FloatingModel position={[11, -2, -3]} Children={MicroscopeModel} />
        <FloatingModel position={[10, -5, -3]} Children={BellModel} />
        
        <ParticleField />
        <CameraRig />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
