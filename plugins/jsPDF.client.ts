// plugins/jspdf.client.ts OR plugins/jspdf.ts

import { defineNuxtPlugin } from '#app';
import jsPDF from 'jspdf'; // npm install jspdf

export default defineNuxtPlugin(() => {
  console.log('jsPDF plugin loaded'); // Optional: for debugging
  return {
    provide: {
      // Provide the actual jsPDF constructor class
      jsPDF: jsPDF
    }
  };
});