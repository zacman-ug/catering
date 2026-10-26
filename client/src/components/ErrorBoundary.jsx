import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center bg-white border border-stone-200 rounded-2xl p-8">
            <h1 className="font-display text-2xl font-bold text-brand-900 mb-3">Something went wrong</h1>
            <p className="text-stone-600 text-sm mb-6">
              The page hit an unexpected error. Refresh the page or return home.
            </p>
            <a href="/" className="inline-block bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-full">
              Back to Home
            </a>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
