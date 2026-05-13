"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  OrbitControls, 
  Float, 
  Html, 
  Environment,
  Box,
  Cylinder,
  Sphere,
  RoundedBox
} from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, FlaskConical, GraduationCap, Library, Dumbbell, Coffee } from "lucide-react"

interface Hotspot {
  id: string
  name: string
  description: string
  position: [number, number, number]
  icon: React.ComponentType<{ className?: string }>
  images: string[]
}

const hotspots: Hotspot[] = [
  {
    id: "library",
    name: "Central Library",
    description: "A state-of-the-art library with over 100,000 books, digital resources, and collaborative study spaces.",
    position: [-3, 1.5, 2],
    icon: Library,
    images: []
  },
  {
    id: "labs",
    name: "Research Labs",
    description: "Cutting-edge laboratories equipped with the latest technology for scientific research and innovation.",
    position: [3, 1.5, -2],
    icon: FlaskConical,
    images: []
  },
  {
    id: "lecture",
    name: "Lecture Halls",
    description: "Modern lecture halls with interactive displays, surround sound, and comfortable seating for 500+ students.",
    position: [0, 1.5, -3],
    icon: GraduationCap,
    images: []
  },
  {
    id: "sports",
    name: "Sports Complex",
    description: "Olympic-standard sports facilities including swimming pool, gym, tennis courts, and athletics track.",
    position: [-4, 1, -3],
    icon: Dumbbell,
    images: []
  },
  {
    id: "cafeteria",
    name: "Student Cafeteria",
    description: "Multi-cuisine cafeteria serving healthy, delicious meals in a vibrant social atmosphere.",
    position: [4, 1, 2],
    icon: Coffee,
    images: []
  }
]

function Building({ position, size, color }: { 
  position: [number, number, number]
  size: [number, number, number]
  color: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <RoundedBox
      ref={meshRef}
      args={size}
      radius={0.1}
      smoothness={4}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.6}
      />
    </RoundedBox>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1a472a" roughness={0.8} />
    </mesh>
  )
}

function Trees() {
  const treePositions: [number, number, number][] = [
    [-6, 0, 4], [-5, 0, -4], [6, 0, 3], [7, 0, -3],
    [-7, 0, 0], [7, 0, 0], [-4, 0, 5], [4, 0, 5],
  ]
  
  return (
    <>
      {treePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <Cylinder args={[0.1, 0.15, 1]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#4a3728" />
          </Cylinder>
          <Sphere args={[0.6, 8, 8]} position={[0, 1.3, 0]}>
            <meshStandardMaterial color="#2d5a27" />
          </Sphere>
        </group>
      ))}
    </>
  )
}

function PulsingHotspot({ 
  hotspot, 
  onClick 
}: { 
  hotspot: Hotspot
  onClick: () => void 
}) {
  const [hovered, setHovered] = useState(false)
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sphereRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      sphereRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={hotspot.position}>
        <Sphere
          ref={sphereRef}
          args={[0.15, 16, 16]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={hovered ? "#F59E0B" : "#1E3A8A"}
            emissive={hovered ? "#F59E0B" : "#1E3A8A"}
            emissiveIntensity={hovered ? 1 : 0.5}
            transparent
            opacity={0.9}
          />
        </Sphere>
        
        {/* Outer glow ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.35, 32]} />
          <meshBasicMaterial 
            color={hovered ? "#F59E0B" : "#7C3AED"} 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {hovered && (
          <Html center distanceFactor={10}>
            <div className="px-3 py-1.5 rounded-lg glass text-white text-sm whitespace-nowrap font-medium">
              {hotspot.name}
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

function CampusModel({ onHotspotClick }: { onHotspotClick: (hotspot: Hotspot) => void }) {
  return (
    <>
      {/* Main Building */}
      <Building position={[0, 1, -2]} size={[4, 2.5, 3]} color="#2c3e50" />
      
      {/* Library */}
      <Building position={[-3, 0.75, 2]} size={[2.5, 2, 2]} color="#34495e" />
      
      {/* Labs */}
      <Building position={[3, 0.75, -2]} size={[2, 2, 2.5]} color="#1E3A8A" />
      
      {/* Sports Complex */}
      <Building position={[-4, 0.5, -3]} size={[3, 1.5, 2]} color="#7C3AED" />
      
      {/* Cafeteria */}
      <Building position={[4, 0.5, 2]} size={[2, 1.5, 2]} color="#F59E0B" />
      
      {/* Walkways */}
      <Box args={[10, 0.05, 0.5]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[0.5, 0.05, 8]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      
      <Ground />
      <Trees />
      
      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <PulsingHotspot
          key={hotspot.id}
          hotspot={hotspot}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}
    </>
  )
}

interface HotspotModalProps {
  hotspot: Hotspot | null
  onClose: () => void
}

function HotspotModal({ hotspot, onClose }: HotspotModalProps) {
  if (!hotspot) return null
  
  const Icon = hotspot.icon
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-lg glass rounded-3xl p-6 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{hotspot.name}</h3>
              <p className="text-sm text-muted-foreground">Click to explore</p>
            </div>
          </div>
          
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#1E3A8A]/20 to-[#7C3AED]/20 mb-4 flex items-center justify-center">
            <Icon className="w-16 h-16 text-[#1E3A8A]/50" />
          </div>
          
          <p className="text-foreground/80 leading-relaxed">
            {hotspot.description}
          </p>
          
          <div className="flex gap-3 mt-6">
            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-semibold">
              Take Virtual Tour
            </button>
            <button className="px-6 py-3 rounded-xl border border-border font-semibold">
              Learn More
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function CampusScene() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  
  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#87CEEB"]} />
        <fog attach="fog" args={["#87CEEB", 15, 35]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#F59E0B" />
        
        <CampusModel onHotspotClick={setSelectedHotspot} />
        
        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <Environment preset="sunset" />
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl glass text-sm text-foreground/70">
        Drag to rotate • Scroll to zoom • Click hotspots to explore
      </div>
      
      <HotspotModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />
    </div>
  )
}
