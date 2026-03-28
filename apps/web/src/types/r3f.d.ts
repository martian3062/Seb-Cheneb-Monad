/// <reference types="@react-three/fiber" />

// Extend JSX IntrinsicElements with Three.js elements from R3F
import { ThreeElements } from '@react-three/fiber'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
