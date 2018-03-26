import React from 'react';
import App from './App';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import TodosPage from './pages/TodosPage';

export default [
  {
    ...App,
    routes: [
      {
        ...HomePage,
        path: '/',
        exact: true
      },
      {
        ...TodosPage,
        path: '/todos'
      },
      {
        ...NotFoundPage
      }
    ]
  }
];
