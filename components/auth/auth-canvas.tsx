"use client"

import { useEffect, useRef } from "react"

interface AuthCanvasProps {
  /** Height of the form rectangle the character draws */
  formHeight?: number
  /** Callback when the drawing animation completes and the form should appear */
  onDrawComplete?: () => void
}

export function AuthCanvas({ formHeight = 480, onDrawComplete }: AuthCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let animationFrameId: number

    const STATES = { WALKING: 0, STOPPING: 1, REACHING: 2, DRAWING: 3, IDLE: 4 }
    let width: number, height: number
    let currentState = STATES.WALKING
    let globalTime = 0

    const charScale = 1.3
    let charX = -200
    let targetCharX = 0
    let groundY = 0

    let walkCycle = 0
    const walkSpeed = 3.5
    let stopProgress = 0
    let reachProgress = 0
    let drawProgress = 0
    let idleTime = 0

    let leftLegAngle = 0,
      rightLegAngle = 0,
      leftArmAngle = 0,
      rightArmAngle = 0,
      bodyBob = 0,
      tasselAngle = 0,
      tasselVel = 0
    let rectX: number, rectY: number, rectW: number, rectH: number

    // Colors – Deep Navy & Gold College Palette
    const gownColor = "#24324c"
    const stoleColor = "#f5b041"
    const skinColor = "#eab896"
    const hairColor = "#fcd34d"
    const pantsColor = "#1f2937"
    const shoeColor = "#030712"
    const bagColor = "#4b5563"

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      groundY = height * 0.75
      targetCharX = width * 0.35

      // Form rectangle dimensions
      rectW = 460
      rectH = formHeight
      rectX = width - rectW - 16
      rectY = height - rectH - 16
    }
    window.addEventListener("resize", resize)
    resize()

    const drawCircle = (x: number, y: number, r: number, fill: string) => {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
    }

    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill: string
    ) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.fillStyle = fill
      ctx.fill()
    }

    // Side-view walking character
    const drawCharacter = (x: number, y: number) => {
      ctx.save()
      ctx.translate(x, y + bodyBob)
      ctx.scale(charScale, charScale)
      const legLength = 60
      const armLength = 55

      // Back Arm
      ctx.save()
      ctx.translate(0, -60)
      ctx.rotate(rightArmAngle)
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.roundRect(-8, 0, 16, armLength, 8)
      ctx.fill()
      drawCircle(0, armLength + 5, 6, skinColor)
      ctx.restore()

      // Back Leg
      ctx.save()
      ctx.translate(4, 0)
      ctx.rotate(rightLegAngle)
      ctx.fillStyle = pantsColor
      ctx.fillRect(-6, 0, 12, legLength)
      ctx.fillStyle = shoeColor
      drawRoundedRect(-10, legLength, 24, 12, 6, shoeColor)
      ctx.restore()

      // Bag
      ctx.save()
      ctx.translate(-15, -40)
      ctx.rotate(0.1)
      drawRoundedRect(-12, -15, 24, 30, 4, bagColor)
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, -15)
      ctx.lineTo(25, -45)
      ctx.stroke()
      ctx.restore()

      // Body
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.moveTo(-15, -70)
      ctx.lineTo(15, -70)
      ctx.lineTo(22, 10)
      ctx.lineTo(-22, 10)
      ctx.closePath()
      ctx.fill()

      // Stole
      ctx.fillStyle = stoleColor
      ctx.beginPath()
      ctx.moveTo(-5, -70)
      ctx.lineTo(5, -70)
      ctx.lineTo(8, -20)
      ctx.lineTo(2, -15)
      ctx.lineTo(-2, -15)
      ctx.lineTo(-8, -20)
      ctx.closePath()
      ctx.fill()

      // Front Leg
      ctx.save()
      ctx.translate(-4, 0)
      ctx.rotate(leftLegAngle)
      ctx.fillStyle = pantsColor
      ctx.fillRect(-6, 0, 12, legLength)
      ctx.fillStyle = shoeColor
      drawRoundedRect(-10, legLength, 24, 12, 6, shoeColor)
      ctx.restore()

      // Head
      ctx.save()
      ctx.translate(0, -80)
      ctx.fillStyle = hairColor
      drawCircle(0, 0, 20, hairColor)
      drawCircle(2, 2, 16, skinColor)
      ctx.fillStyle = "#000"
      drawCircle(10, -2, 2.5, "#000")
      ctx.beginPath()
      ctx.arc(12, 4, 3, 0, Math.PI)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()

      // Cap
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.ellipse(0, -14, 15, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, -26)
      ctx.lineTo(28, -18)
      ctx.lineTo(0, -10)
      ctx.lineTo(-28, -18)
      ctx.closePath()
      ctx.fill()
      drawCircle(0, -18, 3, stoleColor)
      ctx.translate(0, -18)
      ctx.rotate(tasselAngle)
      ctx.strokeStyle = stoleColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(16, 12)
      ctx.stroke()
      drawCircle(16, 12, 3, stoleColor)
      ctx.restore()

      // Front Arm
      ctx.save()
      ctx.translate(0, -60)
      let currentLeftArmAngle = leftArmAngle
      const handY = armLength + 5
      if (currentState === STATES.REACHING)
        currentLeftArmAngle = (-Math.PI / 3) * reachProgress
      else if (currentState === STATES.DRAWING)
        currentLeftArmAngle = (Math.PI / 2) * drawProgress
      else if (currentState === STATES.IDLE && drawProgress === 1)
        currentLeftArmAngle = Math.PI / 4

      ctx.rotate(currentLeftArmAngle)
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.roundRect(-8, 0, 16, armLength, 8)
      ctx.fill()
      drawCircle(0, handY, 6, skinColor)
      if (currentState === STATES.IDLE && drawProgress === 1) {
        ctx.save()
        ctx.translate(0, handY)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = "#fdfbf7"
        ctx.fillRect(-10, -5, 20, 10)
        ctx.strokeStyle = stoleColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-2, -5)
        ctx.lineTo(-2, 5)
        ctx.stroke()
        ctx.restore()
      }
      ctx.restore()
      ctx.restore()
    }

    // Front-facing idle character
    const drawFrontCharacter = (x: number, y: number) => {
      ctx.save()
      ctx.translate(x, y + bodyBob)
      ctx.scale(charScale, charScale)
      // Legs
      ctx.fillStyle = pantsColor
      ctx.fillRect(-12, 0, 10, 60)
      ctx.fillRect(2, 0, 10, 60)
      ctx.fillStyle = shoeColor
      drawRoundedRect(-16, 60, 14, 12, 6, shoeColor)
      drawRoundedRect(-2, 60, 14, 12, 6, shoeColor)
      // Body
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.moveTo(-25, -70)
      ctx.lineTo(25, -70)
      ctx.lineTo(30, 10)
      ctx.lineTo(-30, 10)
      ctx.closePath()
      ctx.fill()
      // Stole
      ctx.fillStyle = stoleColor
      ctx.beginPath()
      ctx.moveTo(-10, -70)
      ctx.lineTo(10, -70)
      ctx.lineTo(15, -20)
      ctx.lineTo(8, -15)
      ctx.lineTo(0, -50)
      ctx.lineTo(-8, -15)
      ctx.lineTo(-15, -20)
      ctx.closePath()
      ctx.fill()
      // Left Arm
      ctx.save()
      ctx.translate(-25, -60)
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.roundRect(-8, 0, 16, 55, 8)
      ctx.fill()
      drawCircle(0, 60, 6, skinColor)
      ctx.save()
      ctx.translate(0, 60)
      ctx.rotate(Math.PI / 6)
      ctx.fillStyle = "#fdfbf7"
      ctx.fillRect(-8, -4, 24, 8)
      ctx.strokeStyle = stoleColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, -4)
      ctx.lineTo(0, 4)
      ctx.stroke()
      ctx.restore()
      ctx.restore()
      // Right Arm
      ctx.save()
      ctx.translate(25, -60)
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.roundRect(-8, 0, 16, 55, 8)
      ctx.fill()
      drawCircle(0, 60, 6, skinColor)
      ctx.restore()
      // Head
      ctx.save()
      ctx.translate(0, -80)
      ctx.fillStyle = hairColor
      drawCircle(0, 0, 22, hairColor)
      drawCircle(0, 2, 16, skinColor)
      ctx.fillStyle = "#000"
      drawCircle(-5, -2, 2.5, "#000")
      drawCircle(5, -2, 2.5, "#000")
      ctx.beginPath()
      ctx.arc(0, 4, 4, 0, Math.PI)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 1
      ctx.stroke()
      // Cap
      ctx.fillStyle = gownColor
      ctx.beginPath()
      ctx.ellipse(0, -14, 18, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.save()
      ctx.translate(0, -18)
      ctx.transform(1, 0, 0, 0.3, 0, 0)
      ctx.beginPath()
      ctx.moveTo(0, -35)
      ctx.lineTo(35, 0)
      ctx.lineTo(0, 35)
      ctx.lineTo(-35, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      drawCircle(0, -18, 3, stoleColor)
      ctx.translate(0, -18)
      ctx.rotate(tasselAngle * 0.5)
      ctx.strokeStyle = stoleColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-12, 15)
      ctx.stroke()
      drawCircle(-12, 15, 3, stoleColor)
      ctx.restore()
      ctx.restore()
    }

    // Golden magic rectangle drawing effect
    const drawMagicRectangle = () => {
      if (currentState !== STATES.DRAWING) return
      const perimeter = rectW * 2 + rectH * 2
      const currentDrawLength = perimeter * drawProgress
      ctx.strokeStyle = "#f5b041"
      ctx.lineWidth = 3
      ctx.shadowColor = "#f5b041"
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.moveTo(rectX, rectY)
      let drawn = 0
      if (currentDrawLength > drawn) {
        const span = Math.min(rectW, currentDrawLength - drawn)
        ctx.lineTo(rectX + span, rectY)
        drawn += rectW
      }
      if (currentDrawLength > drawn) {
        const span = Math.min(rectH, currentDrawLength - drawn)
        ctx.lineTo(rectX + rectW, rectY + span)
        drawn += rectH
      }
      if (currentDrawLength > drawn) {
        const span = Math.min(rectW, currentDrawLength - drawn)
        ctx.lineTo(rectX + rectW - span, rectY + rectH)
        drawn += rectW
      }
      if (currentDrawLength > drawn) {
        const span = Math.min(rectH, currentDrawLength - drawn)
        ctx.lineTo(rectX, rectY + rectH - span)
      }
      ctx.stroke()
      if (drawProgress < 1) {
        let wandX = rectX,
          wandY = rectY
        if (drawn < rectW) wandX = rectX + currentDrawLength
        else if (drawn < rectW + rectH) {
          wandX = rectX + rectW
          wandY = rectY + (currentDrawLength - rectW)
        } else if (drawn < rectW * 2 + rectH) {
          wandX = rectX + rectW - (currentDrawLength - rectW - rectH)
          wandY = rectY + rectH
        } else {
          wandX = rectX
          wandY = rectY + rectH - (currentDrawLength - rectW * 2 - rectH)
        }
        drawCircle(wandX, wandY, 4, "#fff")
      }
      ctx.shadowBlur = 0
    }

    // Campus background
    let bgOffset = 0
    const drawBackground = () => {
      const buildingColor = "#0f172a"
      const pillarColor = "#1e293b"
      const accentGold = "#f5b041"
      const bWidth = 800
      const bHeight = 400
      const bX = targetCharX - bWidth / 2
      const bY = groundY - bHeight
      ctx.fillStyle = buildingColor
      ctx.fillRect(bX, bY, bWidth, bHeight)
      const gateW = 220
      const gateH = 250
      const gateX = targetCharX - gateW / 2
      const gateY = groundY - gateH
      ctx.fillStyle = "#050811"
      ctx.beginPath()
      ctx.moveTo(gateX, groundY)
      ctx.lineTo(gateX, gateY + gateW / 2)
      ctx.arc(targetCharX, gateY + gateW / 2, gateW / 2, Math.PI, 0)
      ctx.lineTo(gateX + gateW, groundY)
      ctx.fill()
      ctx.strokeStyle = "#334155"
      ctx.lineWidth = 3
      for (let i = gateX + 20; i < gateX + gateW; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, groundY)
        ctx.lineTo(i, gateY + gateW / 2)
        ctx.stroke()
      }
      const friezeY = bY + 40
      ctx.fillStyle = pillarColor
      ctx.fillRect(bX - 20, friezeY, bWidth + 40, 80)
      const pWidth = 40
      const pSpacing = (bWidth - pWidth * 6) / 5
      for (let i = 0; i < 6; i++) {
        if (i === 2 || i === 3) continue
        const px = bX + i * (pWidth + pSpacing)
        ctx.fillRect(px, friezeY + 80, pWidth, bHeight - 120)
        ctx.fillStyle = "#334155"
        ctx.fillRect(px - 5, bY + bHeight - 15, pWidth + 10, 15)
        ctx.fillRect(px - 5, friezeY + 80, pWidth + 10, 15)
        ctx.fillStyle = pillarColor
      }
      ctx.beginPath()
      ctx.moveTo(targetCharX, bY - 80)
      ctx.lineTo(bX - 40, friezeY)
      ctx.lineTo(bX + bWidth + 40, friezeY)
      ctx.fill()
      ctx.fillStyle = buildingColor
      ctx.beginPath()
      ctx.moveTo(targetCharX, bY - 55)
      ctx.lineTo(bX + 10, friezeY - 10)
      ctx.lineTo(bX + bWidth - 10, friezeY - 10)
      ctx.fill()
      ctx.fillStyle = accentGold
      ctx.font = "bold 28px Poppins, Outfit, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.letterSpacing = "2px"
      ctx.fillText("RIPHAH INTERNATIONAL COLLEGE", targetCharX, friezeY + 40)
      ctx.fillStyle = "#e3dac9"
      ctx.fillRect(0, groundY, width, height - groundY)
      ctx.fillStyle = accentGold
      ctx.fillRect(0, groundY, width, 4)
      ctx.strokeStyle = "#d4c7b1"
      ctx.lineWidth = 4
      for (let i = bgOffset % 100; i < width; i += 100) {
        ctx.beginPath()
        ctx.moveTo(i, groundY + 4)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
    }

    let hasCalledOnComplete = false

    const update = () => {
      globalTime += 0.016
      switch (currentState) {
        case STATES.WALKING:
          charX += walkSpeed
          bgOffset -= walkSpeed * 0.5
          walkCycle += 0.1
          leftLegAngle = Math.sin(walkCycle) * 0.5
          rightLegAngle = Math.sin(walkCycle + Math.PI) * 0.5
          leftArmAngle = Math.sin(walkCycle + Math.PI) * 0.4
          rightArmAngle = Math.sin(walkCycle) * 0.4
          bodyBob = Math.abs(Math.sin(walkCycle * 2)) * -5
          tasselVel += Math.cos(walkCycle) * -0.05
          tasselVel *= 0.9
          tasselAngle += tasselVel
          if (charX >= targetCharX) currentState = STATES.STOPPING
          break
        case STATES.STOPPING:
          stopProgress += 0.05
          leftLegAngle *= 0.8
          rightLegAngle *= 0.8
          leftArmAngle *= 0.8
          rightArmAngle *= 0.8
          bodyBob *= 0.8
          tasselAngle *= 0.95
          if (stopProgress >= 1) {
            leftLegAngle = rightLegAngle = leftArmAngle = rightArmAngle = bodyBob = 0
            currentState = STATES.REACHING
          }
          break
        case STATES.REACHING:
          reachProgress += 0.03
          if (reachProgress >= 1) {
            reachProgress = 1
            setTimeout(() => {
              if (currentState === STATES.REACHING) currentState = STATES.DRAWING
            }, 300)
          }
          break
        case STATES.DRAWING:
          drawProgress += 0.015
          if (drawProgress >= 1) {
            drawProgress = 1
            currentState = STATES.IDLE
            if (!hasCalledOnComplete && onDrawComplete) {
              hasCalledOnComplete = true
              setTimeout(() => onDrawComplete(), 100)
            }
          }
          break
        case STATES.IDLE:
          idleTime += 0.05
          bodyBob = Math.sin(idleTime) * -2
          leftLegAngle = rightLegAngle = rightArmAngle = 0
          tasselAngle = Math.sin(idleTime * 0.5) * 0.1
          break
      }
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height)
      update()
      drawBackground()
      if (currentState === STATES.DRAWING) drawMagicRectangle()
      if (currentState === STATES.IDLE) drawFrontCharacter(charX, groundY)
      else drawCharacter(charX, groundY)
      animationFrameId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [formHeight, onDrawComplete])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  )
}
