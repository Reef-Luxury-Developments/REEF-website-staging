import React, { useEffect, useRef, useState } from "react";
import { Point3D, Point2D, Rotation } from "../types";

// --- Constants & Configuration ---

const SCALE = 100; // Size of the cube in the SVG coordinate space
const PERSPECTIVE = 800; // Camera distance for perspective projection
const THICK_SEGMENT_RATIO = 0.25; // How much of the edge is covered by the thick "cap" (0.0 - 0.5)
const MAX_X_ROTATION = 0.6; // Maximum X rotation in radians (prevents flipping)
const MIN_X_ROTATION = -0.6; // Minimum X rotation in radians

// Definition of a standard Cube (vertices -1 to 1)
const VERTICES: Point3D[] = [
  { x: -1, y: -1, z: -1 }, // 0
  { x: 1, y: -1, z: -1 }, // 1
  { x: 1, y: 1, z: -1 }, // 2
  { x: -1, y: 1, z: -1 }, // 3
  { x: -1, y: -1, z: 1 }, // 4
  { x: 1, y: -1, z: 1 }, // 5
  { x: 1, y: 1, z: 1 }, // 6
  { x: -1, y: 1, z: 1 }, // 7
];

// Pairs of vertex indices that form edges
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0], // Back face
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4], // Front face
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], // Connecting edges
];

// --- Math Helpers ---

// Clamp a value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Rotate a 3D point around the origin
const rotatePoint = (point: Point3D, rotation: Rotation): Point3D => {
  // 1. Rotate around Y-axis
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;

  // 2. Rotate around X-axis
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const y2 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  return { x: x1, y: y2, z: z2 };
};

// Project 3D point to 2D SVG space
const projectPoint = (point: Point3D): Point2D => {
  // Weak perspective projection
  const scaleProjected = PERSPECTIVE / (PERSPECTIVE + point.z * SCALE);
  return {
    x: point.x * SCALE * scaleProjected,
    y: point.y * SCALE * scaleProjected,
  };
};

// Linear interpolation between two 2D points
const lerp = (p1: Point2D, p2: Point2D, t: number): Point2D => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
};

interface CubeIconProps {
  size?: number;
  color?: string;
  accentColor?: string;
  isHovered?: boolean;
  interactive?: boolean;
}

const CubeIcon: React.FC<CubeIconProps> = ({
  size = 300,
  color = "#374151", // Tailwind gray-700
  accentColor = "#E5E7EB", // Tailwind gray-200
  isHovered = false,
  interactive = true,
}) => {
  const requestRef = useRef<number | null>(null);

  // Unified Render Item type
  type RenderItem =
    | { type: "edge"; index: number; z: number }
    | { type: "vertex"; index: number; z: number };

  const [renderData, setRenderData] = useState<{
    vertices: Point2D[];
    drawOrder: RenderItem[];
  }>({ vertices: [], drawOrder: [] });

  // Current rotation state
  // Changed x from -0.5 to 0.6 to show the top face instead of the bottom
  const rotationRef = useRef<Rotation>({ x: 0.4, y: 0.8 });

  // Mouse target for tilting
  const mouseTargetRef = useRef<Rotation>({ x: 0, y: 0 });

  // Animation Loop
  const animate = (time: number) => {
    // 1. Auto-rotation (constant slow spin on Y)
    const autoSpeed = 0.01;

    // 2. Interactive Tilt (interpolating towards mouse target)
    // We blend the auto-rotation with the tilt offset

    // Smoothly update current rotation
    // Changed base tilt from -0.5 to 0.6
    const targetX = clamp(
      0.4 + mouseTargetRef.current.x, // Base X tilt + mouse influence
      MIN_X_ROTATION,
      MAX_X_ROTATION
    ); // Clamp to prevent flipping
    const targetY = rotationRef.current.y + autoSpeed; // Continuous Y rotation

    rotationRef.current = {
      x: clamp(
        rotationRef.current.x + (targetX - rotationRef.current.x) * 0.1, // Smooth dampening for tilt
        MIN_X_ROTATION,
        MAX_X_ROTATION
      ),
      y: targetY,
    };

    // 3. Project all vertices and calculate depth
    const rotatedVertices = VERTICES.map((v) =>
      rotatePoint(v, rotationRef.current)
    );
    const projectedVertices = rotatedVertices.map(projectPoint);

    // 4. Create a combined list of items to draw (Edges + Vertices) for correct occlusion
    const drawItems: RenderItem[] = [];

    // Add Edges
    EDGES.forEach((edge, index) => {
      const v1 = rotatedVertices[edge[0]];
      const v2 = rotatedVertices[edge[1]];
      const avgZ = (v1.z + v2.z) / 2;
      drawItems.push({ type: "edge", index, z: avgZ });
    });

    // Add Vertices (Dots)
    rotatedVertices.forEach((v, index) => {
      drawItems.push({ type: "vertex", index, z: v.z });
    });

    // Sort by Z descending (furthest first)
    drawItems.sort((a, b) => b.z - a.z);

    setRenderData({ vertices: projectedVertices, drawOrder: drawItems });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Handle Mouse Move globally
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse from -1 to 1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;

      // Map mouse Y to X-rotation (tilt up/down)
      // Map mouse X to Y-rotation speed or tilt? Let's do tilt.
      mouseTargetRef.current = {
        x: y * 1.5, // Tilt sensitivity
        y: x * 0.5, // Slight horizontal tilt influence
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  // --- Rendering ---

  // We need at least one frame of data
  if (!renderData || renderData.vertices.length === 0) return null;

  const { vertices, drawOrder } = renderData;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-150 -150 300 300"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="overflow-visible"
    >
      <defs>
        {/* Optional: Add glow filter if desired for a 'neon' look, but keeping it clean for now */}
      </defs>

      {/* Draw items (Edges and Vertices) in depth order (furthest first) */}
      {drawOrder.map((item, i) => {
        if (item.type === "edge") {
          const edgeIndex = item.index;
          const [start, end] = EDGES[edgeIndex];
          const p1 = vertices[start];
          const p2 = vertices[end];

          // Calculate the "cap" points (start -> 25% towards end, and end -> 25% towards start)
          const capStart = lerp(p1, p2, THICK_SEGMENT_RATIO);
          const capEnd = lerp(p2, p1, THICK_SEGMENT_RATIO);

          return (
            <React.Fragment key={`edge-group-${edgeIndex}-${i}`}>
              {/* 1. Thin Connection Line (Wireframe) */}
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={accentColor}
                strokeWidth={size / 10}
              />

              {/* 2. Thick Corner Caps */}
              <g stroke={color} strokeWidth={size / 4}>
                {/* Cap at vertex 1 */}
                <line x1={p1.x} y1={p1.y} x2={capStart.x} y2={capStart.y} />
                {/* Cap at vertex 2 */}
                <line x1={p2.x} y1={p2.y} x2={capEnd.x} y2={capEnd.y} />
              </g>
            </React.Fragment>
          );
        } else {
          // It's a vertex (dot)
          const p = vertices[item.index];
          return (
            <circle
              key={`v-${item.index}-${i}`}
              cx={p.x}
              cy={p.y}
              r={size / 36}
              fill={color}
            />
          );
        }
      })}
    </svg>
  );
};

export default CubeIcon;
