# DESIGN.md: MindGPS Desktop Concept Map Implementation

## 1. Product Goal
Create a spatial, interactive "Mind Map" workspace where users can visually organize thoughts and emotions. The interface must promote a sense of calm and clarity through soft glassmorphism and fluid, physics-based interactions.

## 2. Desktop Layout Rules
*   **Bounded Workspace:** The canvas must live inside a defined content panel (e.g., a main `<section>` or `<div>`), not a full-screen viewport.
*   **Responsive Scaling:** On desktop, the workspace should feel spacious. Use a `min-h-[600px]` or `h-full` within a flex container.
*   **Integrated Controls:** Zoom and "Add" controls must be anchored to the bottom-right or bottom-center of the *canvas container*, not the browser window.
*   **Safe Areas:** Ensure a 24px padding buffer between the canvas edge and the nearest UI panels to prevent "clipping" of large bubbles.

## 3. Canvas Behavior Rules
*   **Container-Based Camera:** All coordinate math (`x`, `y`, `scale`) must be relative to the `getBoundingClientRect()` of the canvas container.
*   **Infinite Pan:** Users can click-and-drag the background to move the "camera." 
    *   *Logic:* `newCameraPos = initialPos + (currentMouse - startMouse)`.
*   **Focal Zoom:** Zooming (mouse wheel) must zoom toward the cursor position, not the center of the screen.
    *   *Math:* Calculate the "World Space" coordinate under the mouse, apply the scale, then adjust the camera offset to keep that World Space point under the same Screen Space point.
*   **Centering Logic:** When adding a new bubble or clicking "Focus," the canvas should smoothly animate the camera so the target coordinate is at `(container.width / 2, container.height / 2)`.

## 4. Bubble Interaction Rules
*   **Draggable Nodes:** Bubbles are absolute-positioned elements within a transformed "World" div.
*   **Drag Logic:** Use `framer-motion` for the `drag` prop. 
    *   **Crucial:** Convert the drag delta from Screen Space to World Space by dividing by the current `scale` (e.g., `worldDelta = screenDelta / scale`).
*   **Selection:** Clicking a bubble selects it, showing a "Halo" and revealing action buttons (Delete, Add Child).
*   **Connections:** Render curved SVG paths (S-curves) between parent and child nodes. Use `M x1 y1 C midX y1, midX y2, x2 y2` for the path data.

## 5. Visual Design System
*   **Palette:**
    *   Background: `#F8FAFC` (Slate-50) with soft Lavender radial gradients.
    *   Primary Action: `#4F46E5` (Indigo-600).
    *   Bubble Fills: `rgba(255, 255, 255, 0.4)` with `backdrop-blur(20px)`.
*   **Glassmorphism:** Use a 1px white border (`border-white/60`) and a subtle inner highlight to simulate a "pearl" or "glass sphere" effect.
*   **Typography:** Use **Plus Jakarta Sans** or **Inter**. Labels should be `font-semibold` and scale slightly with zoom level.

## 6. Technical Implementation (React + TypeScript)
*   **State Management:** Store the array of `Bubble` objects in a parent component. Each bubble needs: `id`, `text`, `x`, `y`, `parentId`, and `type`.
*   **Refs:** Use a `useRef<HTMLDivElement>` for the canvas container to measure dimensions for centering math.
*   **Performance:** Wrap the SVG connection renderer in `useMemo` to prevent expensive path recalculations during simple camera pans.
*   **Persistence:** Sync the bubbles array to `localStorage` on every change using a `useEffect`.

## 7. Constraints (Do NOT Change)
*   **Do NOT** use absolute window coordinates for positioning; always use the container offset.
*   **Do NOT** remove the `framer-motion` spring transitions; they are essential for the "calm" feel.
*   **Do NOT** use heavy 3D libraries (like Three.js); stick to 2D CSS transforms and SVG for simplicity.

## 8. Acceptance Criteria
1.  User can pan the canvas by dragging the background.
2.  User can zoom in/out using the mouse wheel, centered on the cursor.
3.  New bubbles appear in the center of the *visible* area.
4.  Dragging a bubble updates its position correctly regardless of the current zoom level.
5.  Curved lines correctly track between bubbles during movement.
6.  The UI remains responsive and does not "jitter" during high-speed panning.

## 9. Implementation Priorities
1.  **Camera Math:** Implement container-relative pan and zoom logic.
2.  **Node Rendering:** Render the `bubbles` array using absolute positioning within the transformed world.
3.  **Drag Conversion:** Fix the drag-delta math to account for `scale`.
4.  **Connections:** Implement the SVG S-curve connector layer.
5.  **Visual Polish:** Apply glassmorphism CSS and spring animations.