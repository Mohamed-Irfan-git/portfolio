# Spatial layout and current implementation phase

## Connected floor plan

```text
Approach
   ↓
[ branded entrance / hinged door ] — [ developer studio / desk + monitor ]
                                              ↓ monitor portal
                                     [ About corridor ]
                                              ↓
                                  [ project installation gallery ]
                                              ↓
                                   [ skills hologram lab ]
                                              ↓
                                      [ contact station ]
```

The entry opening faces down the studio axis. The studio room begins directly behind the threshold; its side walls, ceiling, floor and far wall form one enclosure. The work desk sits to the right, with a clear aisle around its left end. The monitor faces back toward that aisle. The later spaces are laid out along that axis as procedural placeholders. Their connecting openings and camera movement are future phases; this first implementation only connects the entrance and studio. The gallery will use wall mounted installations, followed by the skills lab and contact station.

The scene uses one R3F Canvas and one camera. During the first implementation phase the camera path is complete from the entrance through the door, around the desk and to the workstation display. The later room modules remain parked outside the initial Canvas during this phase; their geometry and the travel path will be added in later phases.

## Entrance to studio camera score

The camera starts at `(0.7, 2.9, 12)` and looks toward the branded door at `(1.25, 2.5, 3)`. It moves to `(1.25, 2.85, 7.2)` while centering the opening, holds near the threshold as the door rotates around its left hinge, passes the wall plane at `z = 3`, then arcs to the left of the desk. It settles at `(0.5, 2.68, -3.35)` facing the workstation monitor. Camera position, look target, door angle and monitor scanline share one scrubbed GSAP timeline between the entrance and studio anchors, so reverse scrolling reverses every movement.

## Blender assets to prepare

The first two rooms use working procedural geometry while the scene is being art directed. These Blender assets can replace matching procedural groups one at a time:

| Asset | Approximate blockout | Materials and details |
| --- | --- | --- |
| `entrance-portal.glb` | 3.2 m clear opening, 4.8 m high; separate jambs, header and door leaf | Dark anodized metal, restrained red emissive inlay, brushed handle; keep the hinge origin at the left jamb |
| `studio-modules.glb` | 16 m wide x 13 m deep x 6 m high modular room; walls should be separable for the open entrance | Matte navy architectural panels, dark graphite floor, narrow red guide light and warm brass details; bake bevels and ambient occlusion |
| `developer-desk.glb` | 5 m desk, 2.1 m deep, work surface at 1.45 m; separate legs and display stand | Walnut / dark timber top, powder coated metal frame, low roughness only on selected metal parts |
| `studio-props.glb` | Keyboard, mouse, adjustable lamp, books and small shelf objects | Reuse a small material palette, bevel hard edges, keep readable silhouette and no tiny geometry |
| `monitor-housing.glb` | 2.5 m x 1.5 m display, separate bezel, stand and screen surface | Matte graphite casing; screen is a separate emissive surface so the app can animate it |

In Blender, keep object origins useful for placement: door at its hinge; desk at the center of its floor footprint; room modules at their joining edge. Apply transforms, use bevels in geometry or weighted normals, join static architectural pieces by material, and keep animated parts separate. UV unwrap and bake ambient occlusion for the studio walls and props. Export each module through **File → Export → glTF 2.0 → GLB**, include materials and textures, and use Draco mesh compression where available. Keep textures at 1K for shared studio materials and 2K only for the portrait/display hero surface. Validate GLB dimensions and pivots in the browser before removing its procedural replacement.

Load a future model with Drei's `useGLTF('/models/entrance-portal.glb')` and place its scene at the matching world origin. Keep any animated hinge as a distinct named node (for example `DoorLeaf`) so the camera timeline can rotate it. No Blender model is claimed as complete yet; the procedural doorway and furnishings are live placeholders.

## Interactions and access

- The 3D door highlights on hover and click scrolls to the studio. The visible entrance button provides the same route without aiming at the 3D object.
- The workstation screen wakes with a timeline driven scanline as the camera arrives.
- Portfolio headings, navigation, projects, skills and contact links remain real HTML. Project detail overlays keep keyboard focus, support Escape, and use the existing public repository links.
- On mobile and reduced-motion preferences the Canvas is omitted; every portfolio section remains directly available. A WebGL context loss switches to a portrait-based scene fallback.
