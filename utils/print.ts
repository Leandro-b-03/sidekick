export const printSection = (html: HTMLElement, options: any = {}) => {
  // Determine options
  const orientation = options.portrait ? 'portrait' : 'landscape'; // 'portrait' or 'landscape' for jsPDF
  const filename = options.filename || `generated-pdf-${Date.now()}.pdf`;
  const pdfMargin = options.margin ?? 0.25;

  if (!html) {
    console.error('Source HTML element is not available.');
    alert('Cannot print: Source element is missing.');
    return;
  }

  // 1. Clone the element to modify it without affecting the original page
  const clonedElement = html.cloneNode(true) as HTMLElement;

  // 2. Apply modifications for PDF rendering (e.g., adjust sizes for landscape)
  //    Do this *before* getting outerHTML. Using classList/querySelector is more robust
  //    than string replacement where possible.
  if (!options.portrait) {
    // Example: Adjust width class on the root cloned element
    // Ensure the class being removed actually exists on the 'html' element passed in.
    clonedElement.classList.remove('lg:w-[900px]');
    clonedElement.classList.add('lg:w-[550px]'); // Or set a specific width via style if needed

    // Example: Make text smaller globally or in specific areas for landscape
    clonedElement.querySelectorAll('.text-xs').forEach(el => {
        el.classList.remove('text-xs');
        el.classList.add('text-[8px]'); // Use a slightly larger PDF-specific size
    });
    clonedElement.querySelectorAll('h2.font-semibold').forEach(el => {
        el.classList.add('text-[10px]'); // Ensure headers are readable
    });
    clonedElement.querySelectorAll('table th').forEach(el => {
        el.classList.add('text-[9px]'); // Adjust table header size
    });
    clonedElement.querySelectorAll('h2.text-3xl').forEach(el => {
        el.classList.remove('text-3xl');
        el.classList.add('text-[12px]'); // Adjust header size
    });
    // Add more specific adjustments as needed...
  }
  // Add a specific ID for easy targeting IF the original doesn't have one
  clonedElement.id = 'element-to-print-content';

  // 3. Get the final HTML content from the modified clone
  const htmlContent = clonedElement.outerHTML;

  // 4. Open the popup window
  const popupWindow = window.open('', '_blank', 'width=1024,height=768,scrollbars=yes,resizable=yes');

  if (!popupWindow) {
    console.error('Failed to open popup window. Possible popup blocker.');
    alert('Failed to open popup window. Please disable popup blockers for this site.');
    return;
  }

  const printableWidthIn = 8.27 - (pdfMargin * 2);

  // 5. Construct the HTML for the popup window
  const popupHtml = `
    <html>
      <head>
        <title>Generating PDF: ${filename}</title>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <style>
          body { margin: 0; font-family: sans-serif; background-color: #eee; font-size: 10px; /* Can help visualize container */ }
          /* Style the container DIV to roughly match the PDF's printable area width */
          #element-to-print-container {
            width: ${printableWidthIn}in; /* Set width based on A4 & margins */
            margin: 0px auto; /* Center container for preview */
            background-color: white; /* Ensure white background for capture */
            box-shadow: 0 0 10px rgba(0,0,0,0.2); /* Visual aid */
            /* overflow: hidden; */ /* Prevent content overflow affecting capture size */
          }
           /* Ensure content inside takes available width */
           #element-to-print-content {
               width: 100%;
               display: block; /* Or appropriate display type */
           }
          #pdf-loading-indicator { padding: 30px; text-align: center; font-size: 1.2em; }
          .p-tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--p-tag-primary-background);
            color: var(--p-tag-primary-color);
            font-size: 0.875rem;
            font-weight: 700;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            gap: 0.25rem;
          }
          .p-tag-info {
            background: #e0f2fe;
            color: #0369a1;
          }
          .p-tag-warn {
            background: #ffedd5;
            color: #c2410c;
          }
          .p-tag-success {
            background: #dcfce7;
            color: #15803d;
          }
        </style>
      </head>
      <body>
        <div id="pdf-loading-indicator" style="padding: 20px; font-size: 1.2em;">Generating PDF, please wait...</div>

        <div id="element-to-print" style="opacity: 1; position: absolute; left: 0;"> ${htmlContent}
        </div>

        <script>
          // Use window.onload to ensure all resources (Tailwind, html2pdf) are loaded
          window.onload = () => {
            console.log('Popup window loaded.');
            const element = document.getElementById('element-to-print-content'); // Target the actual content
            const loadingIndicator = document.getElementById('pdf-loading-indicator');

            if (!element) {
              console.error('Content element #element-to-print-content not found in popup.');
              if(loadingIndicator) loadingIndicator.innerHTML = 'Error: Content element not found.';
              return;
            }
            if (typeof html2pdf === 'undefined') {
               console.error('html2pdf library not loaded.');
               if(loadingIndicator) loadingIndicator.innerHTML = 'Error: PDF library failed to load.';
               return;
            }

            // Make element visible briefly for rendering if needed, or keep hidden
            // element.style.opacity = '1'; element.style.position = 'static';

            console.log('Configuring html2pdf...');
            const pdfOptions = {
              margin:       0.05, // inches [top, left, bottom, right] or single value
              filename:     '${filename}',
              image:        { type: 'jpeg', quality: 1 }, // Image settings
              html2canvas:  {
                              scale: 2, // Higher scale for better quality
                              useCORS: true, // Important for cross-origin images in the HTML
                              // logging: true, // Enable html2canvas logs if needed
                             },
              jsPDF:        {
                              unit: 'in',
                              format: 'a4',
                              orientation: '${orientation}' // 'portrait' or 'landscape'
                            },
              // pagebreak:    { mode: ['css', 'avoid-all'] } // Page break modes
            };

            console.log('Starting html2pdf generation...');
            // Use modern chainable Promise syntax
            html2pdf().set(pdfOptions).from(element).save()
              .then(() => {
                console.log('PDF has been generated and download triggered.');
                if(loadingIndicator) loadingIndicator.innerHTML = 'PDF generated successfully! Download should start shortly... You can close this window.';
                // Optional: Close popup automatically after a short delay
                // setTimeout(() => { window.close(); }, 3000);
              })
              .catch((err) => {
                console.error('html2pdf failed:', err);
                if(loadingIndicator) loadingIndicator.innerHTML = '<h2>Error Generating PDF</h2><pre>' + err.message + '</pre>';
              });
          };
        </script>
      </body>
    </html>
  `;

  // 6. Write the HTML to the popup and close the document stream
  // This triggers the loading of resources in the popup
  popupWindow.document.open();
  popupWindow.document.write(popupHtml);
  popupWindow.document.close(); // Crucial to fire onload event
  // Optional: Close the popup automatically after a short delay once the PDF is downloaded
  popupWindow.onload = () => {
    const interval = setInterval(() => {
      if (popupWindow.closed) {
        clearInterval(interval);
      } else if (popupWindow.document.readyState === 'complete') {
        setTimeout(() => {
          popupWindow.close();
        }, 1000); // Adjust delay as needed
      }
    }, 500);
  };
};