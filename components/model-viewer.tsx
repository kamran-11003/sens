"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, Html, Center, useGLTF } from "@react-three/drei"
import * as THREE from "three"

export interface ModelConfig {
  src: string
  position?: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
}

interface ModelViewerProps {
  models: ModelConfig[]
  className?: string
  cameraPosition?: [number, number, number]
  fov?: number
}

/**
 * A single GLB model that the user can grab and spin on its own (independent of
 * any other model in the scene). Idle, it gently floats. Dragging on THIS model
 * rotates only THIS model — handled per-object rather than via camera orbit, so
 * two models side by side rotate independently.
 */
function Model({ src, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ModelConfig) {
  const { scene } = useGLTF(src)
  // Clone so the same GLB can be mounted more than once / reused across pages.
  const object = useMemo(() => scene.clone(), [scene])

  const groupRef = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !groupRef.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      groupRef.current.rotation.y += dx * 0.01
      groupRef.current.rotation.x += dy * 0.01
    }
    const onUp = () => {
      if (dragging.current) {
        dragging.current = false
        document.body.style.cursor = ""
      }
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
        <primitive
          object={object}
          scale={scale}
          onPointerDown={(e: any) => {
            e.stopPropagation()
            dragging.current = true
            last.current = { x: e.clientX, y: e.clientY }
            document.body.style.cursor = "grabbing"
          }}
          onPointerOver={(e: any) => {
            e.stopPropagation()
            if (!dragging.current) document.body.style.cursor = "grab"
          }}
          onPointerOut={() => {
            if (!dragging.current) document.body.style.cursor = ""
          }}
        />
      </Float>
    </group>
  )
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white/70">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#f5b041] animate-spin" />
      </div>
    </Html>
  )
}

export function ModelViewer({
  models,
  className,
  cameraPosition = [0, 0, 7],
  fov = 45,
}: ModelViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#f5b041" />

        <Suspense fallback={<Loader />}>
          {/* Center the whole group so the models sit in frame (head-to-feet)
              regardless of where each GLB's pivot/origin actually is. */}
          <Center>
            {models.map((model, i) => (
              <Model key={`${model.src}-${i}`} {...model} />
            ))}
          </Center>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Warm the cache for the models used across the site.
useGLTF.preload("/malestudent.glb")
useGLTF.preload("/femalestudentmodel.glb")
useGLTF.preload("/teacher-3d-model.glb")
