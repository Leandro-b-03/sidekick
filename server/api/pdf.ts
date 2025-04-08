import { eventHandler, readBody, setResponseHeaders } from 'h3';
import wkhtmltopdf from 'wkhtmltopdf'; // npm install wkhtmltopdf
import fs from 'node:fs';
import path from 'node:path';
import BlobStream from 'blob-stream';

// !!! IMPORTANT: Path to your BUILT Tailwind CSS file !!!
// This path is tricky and depends on your build output structure.
// You might need to adjust this based on where Nuxt places built assets.
// It's often in '.output/public/_nuxt/...' after `npm run build`.
// This approach is fragile because the filename might change (hashed).
// A more robust way might involve specific Nuxt hooks or configurations
// to make the CSS path predictable or accessible.
const CSS_PATH = path.resolve(process.cwd(), '.output/public/_nuxt/entry.css'); // EXAMPLE PATH - Highly likely to be wrong/unstable!

let tailwindCss = '';
// try {
//     // Try to read the built CSS file ONCE on server start or cache it.
//     // Reading it on every request is inefficient.
//     // This whole approach of finding the built CSS is complex.
//     if (fs.existsSync(CSS_PATH)) {
//         tailwindCss = fs.readFileSync(CSS_PATH, 'utf-8');
//         console.log(`Loaded CSS from ${CSS_PATH}`);
//     } else {
//         console.warn(`WARN: Built Tailwind CSS not found at ${CSS_PATH}. PDF styling will be incorrect.`);
//     }
// } catch (err) {
//     console.error(`Error reading CSS file at ${CSS_PATH}:`, err);
// }


export default eventHandler(async (event) => {
    console.log('PDF generation request received (wkhtmltopdf).');
    let body;
    try {
        body = await readBody(event);
        if (!body || typeof body.html !== 'string') {
            throw new Error('Invalid request body. "html" string is required.');
        }
    } catch (error: any) {
         console.error('Error reading request body:', error);
         event.node.res.statusCode = 400;
         return { error: 'Invalid request body', message: error?.message };
    }

    const { html: receivedHtml, filename = `document_${Date.now()}.pdf`, portrait = true } = body;
    const orientation = portrait ? 'Portrait' : 'Landscape';

    console.log(`Generating PDF for filename: ${filename}, orientation: ${orientation}`);

    // Prepare HTML with injected CSS
    const fullHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
                /* Inject the BUILD output CSS */
                ${tailwindCss}

                /* Optional: Add @page rules or print-specific overrides */
                 @page { margin: 0.5in; }
                 body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
        </head>
        <body>
            ${receivedHtml}
        </body>
        </html>
    `;

    try {
        // Set headers BEFORE streaming
        setResponseHeaders(event, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
        });

        // wkhtmltopdf returns a stream
        const stream = wkhtmltopdf(fullHtmlContent, {
            pageSize: 'A4',
            orientation: orientation,
            // Add other wkhtmltopdf options if needed
            // e.g., enableJavascript: true, (use with caution)
        });

        // Pipe the generated PDF stream to the response
        // node-wkhtmltopdf stream might need explicit piping handling with h3
        // This assumes 'stream' is a standard Node Readable stream
         stream.pipe(event.node.res);

         // Wait for the stream to finish or error
         await new Promise((resolve, reject) => {
             stream.on('end', resolve);
             stream.on('error', reject);
             event.node.res.on('error', reject); // Handle response errors too
         });

         const chunks: Buffer[] = [];
         stream.on('data', (chunk) => chunks.push(chunk));
         stream.on('end', () => {
             const buffer = Buffer.concat(chunks);
             const blob = new Blob([buffer], { type: 'application/pdf' });
             console.log('Blob created successfully.');

             return blob;
         });

         console.log('PDF stream finished successfully (wkhtmltopdf).');
         // No return needed, piping handles it.

    } catch (error: any) {
        console.error('Error during wkhtmltopdf PDF generation:', error);
        // Check if response is already ended before sending error
         if (!event.node.res.writableEnded) {
             event.node.res.statusCode = 500;
             // Send a simple text/plain error because headers might already be PDF
             event.node.res.setHeader('Content-Type', 'text/plain');
             event.node.res.end(`PDF generation failed: ${error.message}`);
         }
    }
});