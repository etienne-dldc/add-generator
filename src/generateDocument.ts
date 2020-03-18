import {
  PDFDocument,
  PDFName,
  PDFArray,
  PDFDict,
  PDFString,
  PDFNumber,
  StandardFonts
} from 'pdf-lib';
import download from 'downloadjs';
import { Signature } from './SignatureInput';

const range = (size: number) => new Array(size).fill(null).map((_, i) => i);

const FIELDS = {
  name: '(Champ de texte 1)',
  birthdate: '(Champ de texte 2)',
  address: '(Champ de texte 3)',
  work: '(Case à cocher 1)',
  food: '(Case à cocher 2)',
  health: '(Case à cocher 3)',
  family: '(Case à cocher 4)',
  workout: '(Case à cocher 5)',
  place: '(Champ de texte 4)',
  day: '(Champ de texte 5)',
  month: '(Champ de texte 7)'
};

export type Reason = 'work' | 'food' | 'health' | 'family' | 'workout';

const REASON_NAME: { [K in Reason]: string } = {
  family: 'Famille',
  food: 'Courses',
  health: 'Santé',
  work: 'Travail',
  workout: 'Sport'
};

export interface Options {
  name: string;
  birthdate: string;
  address: string;
  reason: Reason | null;
  place: string;
  day: string;
  month: string;
  signature: Signature | null;
}

export async function generateDocument(options: Options) {
  const url = '/attestation_de_deplacement_derogatoire.pdf';
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.getPages()[0];

  const acroForm: PDFDict = pdfDoc.context.lookup(
    pdfDoc.catalog.get(PDFName.of('AcroForm')),
    PDFDict
  );
  const acroFieldRefs = pdfDoc.context.lookup(acroForm.get(PDFName.of('Fields')), PDFArray);

  const fillField = (name: string, value: string, size: number = 13) =>
    range(acroFieldRefs.size()).forEach(i => {
      const field = acroFieldRefs.lookup(i, PDFDict);
      const fieldName = field.lookup(PDFName.of('T'), PDFString).toString();
      if (fieldName === name) {
        const kids = field.lookup(PDFName.of('Kids'), PDFArray);
        const firstKid = kids.lookup(0, PDFDict);
        const fieldRect = firstKid.lookup(PDFName.of('Rect'), PDFArray);

        page.drawText(value, {
          x: fieldRect.lookup(0, PDFNumber).value() + 3,
          y: fieldRect.lookup(3, PDFNumber).value() - 11,
          font: helveticaFont,
          size: size,
          lineHeight: size * 1.3
        });
      }
    });

  fillField(FIELDS.name, options.name);
  fillField(FIELDS.birthdate, options.birthdate);
  fillField(FIELDS.address, options.address);
  if (options.reason) {
    fillField(FIELDS[options.reason], 'X');
  }
  fillField(FIELDS.place, options.place, 10);
  fillField(FIELDS.day, options.day, 10);
  fillField(FIELDS.month, options.month, 10);

  if (options.signature) {
    const signature = options.signature;
    const res = await fetch(signature.data);
    const image = await res.arrayBuffer();
    const signatureImage =
      signature.type === 'png' ? await pdfDoc.embedPng(image) : await pdfDoc.embedJpg(image);
    const signatureDims = signatureImage.scale(1);
    const imgWidth = signatureDims.width; // 3
    const imgHeight = signatureDims.height; // 3
    const imgRatio = imgWidth / imgHeight; // 1
    const spaceWidth = page.getWidth() * 0.45; // 4
    const spaceHeight = page.getHeight() * 0.1; // 2
    const spaceRatio = spaceWidth / spaceHeight; // 2
    console.log({
      imgWidth,
      imgHeight,
      imgRatio,
      spaceWidth,
      spaceHeight,
      spaceRatio
    });

    const [width, height] =
      imgRatio < spaceRatio
        ? // same height
          [imgWidth * (spaceHeight / imgHeight), spaceHeight]
        : [spaceWidth, imgHeight * (spaceWidth / imgWidth)];

    page.drawImage(signatureImage, {
      x: page.getWidth() * 0.5 + spaceWidth / 2 - width / 2,
      y: page.getHeight() * 0.02 + spaceHeight / 2 - height / 2,
      width: width,
      height: height
    });
  }

  const pdfBytes = await pdfDoc.save();

  const fileName = [
    'ADD',
    `${options.day}.${options.month}.2020`,
    options.reason ? REASON_NAME[options.reason] : null,
    options.name.replace(/ /, '_')
  ]
    .filter(v => v !== null)
    .join('-');

  download(pdfBytes as any, `${fileName}.pdf`, 'application/pdf');
}

(window as any).generateDocument = generateDocument;
