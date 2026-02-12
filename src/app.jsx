import React from 'react';
import 'tailwindcss';
import "tailwindcss/preflight";
import "./app.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './home-page/home-page'
import { LoginPage } from './login-page/login-page';
import { GamePageTemplate } from './game-page-template/game-page-template';
import { GameCreationPage } from './game-creation-page/game-creation-page';

export default function App() {
  return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} exact />
                <Route path='/LoginPage' element={<LoginPage />} />
                <Route path='/GamePageTemplate' element={<GamePageTemplate />} />
                <Route path='/GameCreationPage' element={<GameCreationPage />} />
                <Route path='*' element={<NotFound />} />q
            </Routes>
            <footer>
                <p>Eric Vinton - CS 260</p>
                <a href="https://github.com/Emaniacinator/startup">Click here for Github repo</a>
            </footer>
        </BrowserRouter>
  );
}

function NotFound(){
    return <main className="bg-gray-500 text-red-700 justify-center items-center text-5xl">404 Error: Page Not Found</main>
}