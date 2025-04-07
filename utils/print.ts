export const printSection = (html: HTMLElement, options: any = {}) => {
  let orientation = 'landscape';
  if (options.portrait) orientation = 'portrait';
  
  if (html) {
    var html_ = html.cloneNode(true) as HTMLElement;
    const popupWindow = window.open('', '_blank');

    let htmlContent = html_.outerHTML;
    if (!options.portrait) {
      html_.classList.remove('lg:w-[900px]');
      html_.classList.add('lg:w-[550px]');
      const tables = html_.querySelectorAll('table');
      tables.forEach((table) => {
        const theads = table.querySelectorAll('thead');
        theads.forEach((thead) => {
          const ths = thead.querySelectorAll('th');
          ths.forEach((th) => {
        th.classList.add('text-[10px]');
          });
        });
      });

      htmlContent = html_.outerHTML.replace(/text-xs/g, 'text-[7px]').replace(/<h2 class="font-semibold">/g, '<h2 class="font-semibold text-[10px]">').replace(/<th colspan="2" class="bg-gray-200 p-1 text-center rounded-t">/g, '<th colspan="2" class="bg-gray-200 p-1 text-center rounded-t text-[10px]">');
    }

    if (popupWindow) {
      const popup = `
        <html>
          <head>
            <title>PDF Preview</title>
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"><\/script>
            <script src="https://cdn.jsdelivr.net/npm/pdfmake@latest/build/pdfmake.min.js"><\/script>
            <script src="https://cdn.jsdelivr.net/npm/pdfmake@latest/build/vfs_fonts.min.js"><\/script>
            <script src="https://cdn.jsdelivr.net/npm/html-to-pdfmake/browser.js"><\/script>
            <style>
              @page {
                size: A4 ${orientation}; /* Use A4 size */
                margin: 0; /* Important for full-page use */
              }

              @media print {
                .page {
                  width: auto;  /* Use full available width */
                  height: auto; /* Use full available height */
                  box-shadow: none; /* Remove shadows for print */
                  /* Any other print-only overrides */
                }
                .no-print {
                    display: none !important;
                }
              }

              /* General Styling (Adjust as needed, but be mindful of print) */
              body {
                font-family: sans-serif; /* Use a web-safe font */
                -webkit-print-color-adjust: exact; /* Important for accurate colors */
                print-color-adjust: exact;         /* Standard property (for future-proofing) */
                margin: 0;
                padding: 0;
              }

              .page {
                  width: 297mm;  /* Half A4 width */
                  height: 210mm; /* Half A4 height*/
                  box-sizing: border-box; /* Include padding/border in width/height */
                  margin: 0 auto; /* Center the page */
                  display: flex;
                  flex-direction: row; /* Landscape orientation */
                  padding: 0mm; /* Add some margin around the content */
                  background-color: white; /* Ensure white background for printing */
              }
              .column {
                  width: ${orientation === 'landscape' ? '50%' : '100%'};
                  height: 100%;
                  box-sizing: border-box;
                  margin-top: 10px;
                  margin-left: 10px;
              }
            </style>
          </head>
          <body>
            <script>
              const html = \`
                <object class="page" type="application/pdf">
                  <div class="column">
                    ${htmlContent}
                  </div>
                </object>
              \`;

              const converted = htmlToPdfmake(html);
              const docDefinition = { content: converted };
              
              // Generate PDF
              pdfMake.createPdf(docDefinition).download('document.pdf');
            </script>
          </body>
        </html>
      `;
      console.log(popup);
      popupWindow.document.open();
      popupWindow.document.write(popup);
      popupWindow.document.close();
    } else {
      console.error('Failed to open popup window.');
    }
  } else {
    console.error('pdfSection is not available.');
  }
};