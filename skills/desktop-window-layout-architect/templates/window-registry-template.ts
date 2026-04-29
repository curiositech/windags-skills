/**
 * Role-aware desktop window registry template.
 *
 * Example input:
 *   createWindowRegistry({ target: "review-workspace" })
 *
 * Example output:
 *   typed window definitions with geometry, restore, and placement metadata
 */

export type WindowMode = 'normal' | 'maximized' | 'snapped-left' | 'snapped-right' | 'tiled';
export type SurfaceKind = 'primary' | 'auxiliary' | 'panel' | 'modal';
export type SurfaceRole =
  | 'navigation'
  | 'canvas'
  | 'detail'
  | 'inspector'
  | 'artifact'
  | 'console'
  | 'utility';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowDefinition {
  id: string;
  title: string;
  kind: SurfaceKind;
  role: SurfaceRole;
  defaultSize: { width: number; height: number };
  minContentSize: { width: number; height: number };
  snapSafeMinWidth?: number;
  collapsePriority: number;
  centeredOnFirstOpen?: boolean;
  restoreLastNormalBounds?: boolean;
}

export interface WindowRuntimeState {
  mode: WindowMode;
  bounds: Bounds;
  restoreBounds: Bounds | null;
}
