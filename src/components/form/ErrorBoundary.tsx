"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='rounded-md border border-red-200 bg-red-50 p-4'>
          <h2 className='font-semibold text-red-700'>Something went wrong</h2>
          <p className='mt-2 text-red-600'>Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}
