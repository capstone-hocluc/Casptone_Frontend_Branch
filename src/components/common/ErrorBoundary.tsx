import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap for a real error-tracking call (Sentry, LogRocket, ...) when one is wired up.
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="hl-error-fallback">
          <h1>Đã có lỗi xảy ra</h1>
          <p>Trang gặp sự cố ngoài dự kiến. Thử tải lại trang, nếu vẫn lỗi hãy liên hệ hỗ trợ.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
