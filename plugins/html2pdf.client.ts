// plugins/html2pdf.client.ts

import { defineNuxtPlugin } from '#app';
// Import the library - it typically exports the main function as default or named
import html2pdf from 'html2pdf.js';

export default defineNuxtPlugin(() => {
  console.log('html2pdf.js plugin loaded'); // Optional: for debugging

  // Provide the main html2pdf function
  return {
    provide: {
      html2pdf: html2pdf
    }
  };
});