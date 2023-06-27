import React, { ErrorInfo } from 'react';
import { HOST } from '../constants';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        try {
            fetch(`${HOST}/v1/error`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ error, errorInfo }),
                })
        } catch (error) { }
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            // You can render a fallback UI when an error occurs
            return <>
                <div className="h-screen w-screen flex flex-col justify-center items-center">
                    <div className="text-3xl font-bold">Uh Oh! Something went wrong.</div>
                    <div className="text-xl">
                        If the error persists, please contact us at &nbsp;
                        <a href="mailto:pablo@upstreamapi.com" className="text-blue-500 hover:underline">
                            hi@upstreamapi.com
                        </a>
                    </div>
                </div>
            </>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;