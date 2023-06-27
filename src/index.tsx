import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './input.css';
import Home from './Views/Home';
import { Login, SupabaseProvider } from './Contexts/SupabaseContext';
import Pricing from './Views/Pricing';
import { AccountContextProvider } from './Contexts/AuthContext';
import { AppContextProvider } from './Contexts/AppContext';
import ChatbotEditor from './Views/ChatbotEditor';
import { Toasts } from './Utils/Utils';
import { PrivateRoute } from './Contexts/SupabaseContext';
import ErrorBoundary from './Contexts/ErrorBoundary';
import Demo from './Views/Demo';
import NotFoundPage from './Views/Notfound';
import Privacy from './Views/Privacy';
import TemplateEditor from './Views/TemplateEditor';
import { TemplateProvider } from './Contexts/TemplateContext';
import Landing from './Views/Landing';
import Document from './Views/DocumentView';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // <React.StrictMode>
  <ErrorBoundary>
    <SupabaseProvider>
      <AppContextProvider>
        <TemplateProvider>
          <AccountContextProvider>
            <Toasts />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<Demo />} path='/demo' />
                <Route element={<Login />} path="/login" />
                <Route element={<Document />} path="/documents/:botId" />
                <Route element={<Pricing />} path="/pricing" />
                <Route element={<Privacy />} path="/privacy" />
                <Route element={<PrivateRoute> <Home view='documents' /> </PrivateRoute>} path="/documents" />
                <Route element={<PrivateRoute> <Home view='templates'/> </PrivateRoute>} path="/templates" />
                <Route element={<PrivateRoute> <Home view='account'/> </PrivateRoute>} path="/account" />
                <Route element={<PrivateRoute> <ChatbotEditor mode='new' /></PrivateRoute>} path="/create/post" />
                <Route element={<PrivateRoute> <ChatbotEditor mode='edit' /></PrivateRoute>} path="/edit/post/:botId" />
                <Route element={<PrivateRoute> <TemplateEditor mode='new' /></PrivateRoute>} path="/create/template" />
                <Route element={<PrivateRoute> <TemplateEditor mode='edit' /></PrivateRoute>} path="/edit/template/:templateId" />
                <Route element={<NotFoundPage />} path="*" />
              </Routes>
            </BrowserRouter>
          </AccountContextProvider>
        </TemplateProvider>
      </AppContextProvider>
    </SupabaseProvider >
  </ErrorBoundary>
  // </React.StrictMode>
);

reportWebVitals();