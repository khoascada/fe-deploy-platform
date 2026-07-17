'use client';

import { Button } from '@components/ui';
import { RotateCcw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

export type ErrorBoundaryVariant = 'page' | 'header' | 'sidebar';

export interface ErrorMessages {
  title: string;
  description: string;
  tryAgain: string;
  sectionError: string;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: ErrorBoundaryVariant;
  onReset?: () => void;
  messages?: ErrorMessages;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    const { onReset } = this.props;

    this.setState({ hasError: false, error: null });

    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  renderErrorUI() {
    const { variant = 'page', messages } = this.props;
    const { error } = this.state;

    // Default messages (fallback if no translations provided)
    const defaultMessages: ErrorMessages = {
      title: 'Có lỗi xảy ra',
      description: 'Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp diễn',
      tryAgain: 'Thử lại',
      sectionError: 'Phần này gặp lỗi',
    };

    const msg = messages || defaultMessages;

    if (variant === 'header') {
      return (
        <div className="bg-background/80 border-border sticky top-0 z-50 flex h-[64px] items-center justify-center gap-4 border-b p-4 backdrop-blur-xl">
          <span className="text-muted-foreground text-sm">{msg.title}</span>
          <Button onClick={this.handleReset} variant="default" size="sm">
            <RotateCcw size={14} />
            <span>{msg.tryAgain}</span>
          </Button>
        </div>
      );
    }

    if (variant === 'sidebar') {
      return (
        <div className="border-border bg-card flex w-[220px] flex-col items-center justify-center gap-2 overflow-y-auto border-r">
          <span className="text-muted-foreground text-sm">{msg.title}</span>
          <Button onClick={this.handleReset} variant="default" size="sm">
            <RotateCcw size={14} />
            <span className="ml-1">{msg.tryAgain}</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex min-h-[400px] w-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <svg
              className="text-destructive h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-foreground mb-2 text-2xl font-bold">{msg.title}</h1>
            <p className="text-muted-foreground text-sm">{msg.description}</p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="bg-muted mt-4 max-w-md rounded p-3 text-left text-xs">
                <summary className="text-foreground cursor-pointer font-semibold">
                  Chi tiết lỗi (Dev only)
                </summary>
                <pre className="text-destructive mt-2 overflow-auto">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>

          <Button onClick={this.handleReset} variant="default" size="sm">
            <RotateCcw size={16} />
            <span className="font-semibold">{msg.tryAgain}</span>
          </Button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback has priority
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
