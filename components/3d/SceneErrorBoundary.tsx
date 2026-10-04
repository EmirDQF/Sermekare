"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface SceneErrorBoundaryProps {
  children: ReactNode;
  /** Se llama una vez cuando la escena falla: el hueco vuelve a mostrar su fallback (SVG/imagen). */
  onError: (error: Error) => void;
}

interface SceneErrorBoundaryState {
  failed: boolean;
}

/** Aísla los errores de WebGL/escena para que nunca rompan la página. */
export class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[3D] La escena falló; se muestra el fallback.", error, info.componentStack);
    }
    this.props.onError(error);
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}
