import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'public/Komang David Dananjaya Suartana - Resume.pdf';
const outputDirectory = 'public/resume';
const data = new Uint8Array(await readFile(pdfPath));
const pdf = await getDocument({ data, disableWorker: true }).promise;

await mkdir(outputDirectory, { recursive: true });

for (const file of await readdir(outputDirectory)) {
  if (file.endsWith('.webp')) await unlink(`${outputDirectory}/${file}`);
}

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));

  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport,
  }).promise;

  await writeFile(
    `${outputDirectory}/page-${pageNumber}.webp`,
    canvas.toBuffer('image/webp', 85),
  );
}

console.log(`Rendered ${pdf.numPages} resume pages.`);
