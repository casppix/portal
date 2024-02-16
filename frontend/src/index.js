import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./components/contexts/AuthContext";
import {ToastProvider} from "./components/contexts/ToastContext";
import {SearchQueryProvider} from "./components/contexts/SearchContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
  <React.StrictMode>
    <SearchQueryProvider>
    <ToastProvider>
    <App />
    </ToastProvider>
    </SearchQueryProvider>
  </React.StrictMode>
    </AuthProvider>
);

