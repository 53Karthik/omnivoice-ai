import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
const MAX = 4 * 1024 * 1024;
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({error:'No file submitted.'},{status:400});
    if (file.size > MAX) return NextResponse.json({error:'Maximum file size is 4 MB.'},{status:413});
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf','txt','md','csv','docx','xlsx','xls'].includes(extension || '')) return NextResponse.json({error:'Unsupported type. Use PDF, TXT, MD, CSV, DOCX, XLSX or XLS.'},{status:415});
    const bytes = Buffer.from(await file.arrayBuffer());
    let text = ''; let pages: number | undefined;
    if (extension === 'pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      let pageNumber = 0;
      const parsed = await pdfParse(bytes, {pagerender: async (page: {getTextContent: () => Promise<{items: Array<{str?:string}>}>}) => {
        pageNumber++;
        const content = await page.getTextContent();
        return `[Page ${pageNumber}]\n` + content.items.map(item => item.str || '').join(' ') + '\n';
      }});
      text = parsed.text; pages = parsed.numpages;
    } else if (extension === 'docx') {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({buffer:bytes})).value;
    } else if (extension === 'xlsx' || extension === 'xls') {
      const xlsx = await import('xlsx');
      const workbook = xlsx.read(bytes,{type:'buffer'});
      text = workbook.SheetNames.map(name => `[Sheet: ${name}]\n${xlsx.utils.sheet_to_csv(workbook.Sheets[name])}`).join('\n\n');
    } else { text = bytes.toString('utf8'); }
    if (!text.trim()) return NextResponse.json({error:'No readable text was found. Scanned PDFs require OCR (not included in this starter).'}, {status:422});
    if (text.length > 220000) text = text.slice(0, 220000) + '\n[Document truncated at 220,000 characters]';
    return NextResponse.json({name:file.name,text,pages,size:file.size});
  } catch (e) { return NextResponse.json({error: `Could not process file: ${e instanceof Error ? e.message : 'unknown error'}`}, {status:500}); }
}
