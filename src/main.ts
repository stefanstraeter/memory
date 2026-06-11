
import './styles/main.scss';
import { bootstrapApp } from './core/bootstrap';

/**
 * @fileoverview This file serves as the entry point for the Memory game application. It imports necessary styles and the bootstrap function to initialize the app. The code ensures that the application is bootstrapped once the DOM content is fully loaded, allowing for proper setup of event listeners and UI components.
 * setup of event listeners and UI components.
 */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp(); 
}