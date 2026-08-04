import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = (): void => {
    (this as any).setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const state = (this as any).state as State;
    const props = (this as any).props as Props;

    if (state.hasError) {
      if (props.fallback) {
        return props.fallback;
      }

      return (
        <div className="min-h-[350px] w-full flex flex-col items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            Something went wrong
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
            {state.error?.message ||
              "An unexpected UI rendering error occurred in this module."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return props.children;
  }
}
