import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 border-2 border-red-500/50 bg-red-900/20 rounded-lg text-red-200">
                    <h2 className="font-bold text-lg mb-2">Algo deu errado neste componente.</h2>
                    <p className="text-sm opacity-80">{this.state.error?.message}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-900 hover:bg-red-800 rounded transition-colors"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Tentar novamente
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
