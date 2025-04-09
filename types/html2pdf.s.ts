// types/html2pdf.d.ts

// Import the type definition if available from the package or @types/html2pdf.js
// If no official types exist, you might need to define a basic function type.
// Let's assume a basic type for now if official ones aren't easily found:
type Html2PdfFunction = (element: HTMLElement | string, opt?: any) => any; // Basic type, adjust if needed

// For the actual library, it might be better typed, check its exports.
// Assuming the default export is the main function/object:
import type html2pdf from 'html2pdf.js'; // Try importing type directly

declare module '#app' {
  interface NuxtApp {
    /**
     * html2pdf instance/function provided by the plugin.
     * See https://github.com/eKoopmans/html2pdf.js for usage.
     */
    $html2pdf: typeof html2pdf; // Use 'typeof' to get the type of the imported value
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
     /**
      * html2pdf instance/function provided by the plugin.
      * See https://github.com/eKoopmans/html2pdf.js for usage.
      */
    $html2pdf: typeof html2pdf;
  }
}

export {}; // Ensure this file is treated as a module