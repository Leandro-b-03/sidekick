// types/jspdf.d.ts
import type { jsPDF } from 'jspdf';

declare module '#app' {
  interface NuxtApp {
    /**
     * jsPDF constructor instance provided by the plugin.
     * Usage: const doc = new nuxtApp.$jsPDF();
     */
    $jsPDF: typeof jsPDF; // Use 'typeof jsPDF' for the constructor type
  }
}

// Also declare for composables API
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        /**
         * jsPDF constructor instance provided by the plugin.
         * Usage: const doc = new this.$jsPDF(); (In Options API)
         */
        $jsPDF: typeof jsPDF;
    }
}

export {}; // Ensure this file is treated as a module