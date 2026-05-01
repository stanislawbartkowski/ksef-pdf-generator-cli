import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { Position } from '../shared/enums/common.enum';
import { initI18next } from '../lib-public/i18n/i18n-init';
import { generateDokumentUPO } from '../lib-public/generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from '../lib-public/generators/UPO4_3/Naglowek';
import { Upo } from '../lib-public/types/upo-v4_2.types';
import { parseXMLFromPath } from './xml-parser';
import { writePDF } from './pdf-writer';

pdfMake.vfs = pdfFonts.vfs;

export async function generateUpoCLI(inputPath: string, outputPath: string): Promise<void> {
  await initI18next();
  const upo = parseXMLFromPath(inputPath) as Upo;

  const docDefinition: TDocumentDefinitions = {
    content: [generateNaglowekUPO(upo.Potwierdzenie!), generateDokumentUPO(upo.Potwierdzenie!)],
    ...generateStyle(),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    footer: (currentPage: number, pageCount: number) => ({
      text: currentPage.toString() + ' z ' + pageCount,
      alignment: Position.RIGHT,
      margin: [0, 0, 20, 0],
    }),
  };

  await writePDF(pdfMake.createPdf(docDefinition), outputPath);
}
