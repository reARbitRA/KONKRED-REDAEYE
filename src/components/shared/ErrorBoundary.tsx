import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorId: string | null;
}

/** Prevents a feature-level rendering failure from blanking the entire app. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, errorId: null };

  public static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true, errorId: crypto.randomUUID() };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep diagnostics local and avoid sending prompt contents or credentials.
    console.error('UI_RENDER_FAILURE', {
      errorId: this.state.errorId,
      name: error.name,
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex h-full w-full items-center justify-center bg-background p-6 text-foreground">
        <section className="w-full max-w-xl border border-danger/40 bg-secondary p-8 shadow-glow-accent" role="alert">
          <p className="technical-font text-xs text-danger">RENDER_PIPELINE_FAILURE</p>
          <h1 className="mt-3 text-2xl font-black">Workspace unavailable</h1>
          <p className="mt-3 text-sm text-text-secondary">
            This module stopped unexpectedly. Your session data was not sent with the diagnostic event.
          </p>
          {this.state.errorId && (
            <p className="mt-4 break-all font-mono text-xs text-text-secondary">Reference: {this.state.errorId}</p>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 border border-accent bg-accent/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-accent hover:bg-accent hover:text-white"
          >
            Reload workspace
          </button>
        </section>
      </main>
    );
  }
}
