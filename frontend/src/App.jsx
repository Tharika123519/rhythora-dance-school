import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Classes from './pages/Classes';
import Appointment from './pages/Appointment';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
export default function App(){return <><Navbar/><main><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/departments" element={<Departments/>}/><Route path="/classes" element={<Classes/>}/><Route path="/appointments" element={<Appointment/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/contact" element={<Contact/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Signup/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main><Footer/></>}
