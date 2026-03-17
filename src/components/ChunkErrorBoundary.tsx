import { Component, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches chunk load failures (e.g. after a new deploy changes asset hashes)
 * and auto-reloads the page to fetch the new bundle.
 * Uses sessionStorage to prevent infinite reload loops.
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State | null {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Loading CSS chunk");

    if (isChunkError) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error: Error) {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Loading CSS chunk");

    if (!isChunkError) {
      throw error;
    }

    // Prevent infinite reload loop: only retry once per 30 seconds
    const lastReload = sessionStorage.getItem("chunk_reload_at");
    const now = Date.now();

    if (lastReload && now - Number(lastReload) < 30_000) {
      // Already reloaded recently — show error state instead of looping
      return;
    }

    sessionStorage.setItem("chunk_reload_at", String(now));
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
          <div className="text-center space-y-4 p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Aplikácia bola aktualizovaná.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Kliknite sem pre obnovenie stránky
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
