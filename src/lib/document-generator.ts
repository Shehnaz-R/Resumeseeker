// Dynamic imports to handle potential SSR issues
let jsPDF: any;
let html2canvas: any;
let docx: any;
let saveAs: any;

// Load libraries dynamically
const loadLibraries = async () => {
  if (typeof window !== 'undefined') {
    jsPDF = (await import('jspdf')).default;
    html2canvas = (await import('html2canvas')).default;
    docx = await import('docx');
    saveAs = (await import('file-saver')).saveAs;
  }
};

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export class DocumentGenerator {
  private resumeData: ResumeData;
  private templateName: string;

  constructor(resumeData: ResumeData, templateName: string) {
    this.resumeData = resumeData;
    this.templateName = templateName;
  }

  async generatePDF(): Promise<void> {
    try {
      await loadLibraries();
      
      if (!jsPDF || !html2canvas) {
        throw new Error('PDF libraries not loaded');
      }

      // Create a temporary div with the resume content
      const resumeElement = this.createResumeElement();
      document.body.appendChild(resumeElement);

      // Generate canvas from the element
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: resumeElement.scrollHeight
      });

      // Remove the temporary element
      document.body.removeChild(resumeElement);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const fileName = `${this.resumeData.personalInfo.name || 'resume'}-${this.templateName.toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async generateWord(): Promise<void> {
    try {
      await loadLibraries();
      
      if (!docx || !saveAs) {
        throw new Error('Word libraries not loaded');
      }

      const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: this.createWordContent()
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      const fileName = `${this.resumeData.personalInfo.name || 'resume'}-${this.templateName.toLowerCase()}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error generating Word document:', error);
      throw new Error('Failed to generate Word document');
    }
  }

  private createResumeElement(): HTMLDivElement {
    const div = document.createElement('div');
    div.style.cssText = `
      width: 800px;
      padding: 40px;
      background: white;
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    `;

    div.innerHTML = this.generateResumeHTML();
    return div;
  }

  private generateResumeHTML(): string {
    const { personalInfo, summary, experience, education, skills } = this.resumeData;
    
    return `
      <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">${personalInfo.name || 'Your Name'}</h1>
          <div style="font-size: 14px; color: #6b7280;">
            <span>${personalInfo.email || 'email@example.com'}</span>
            ${personalInfo.phone ? ` • <span>${personalInfo.phone}</span>` : ''}
            ${personalInfo.location ? ` • <span>${personalInfo.location}</span>` : ''}
          </div>
        </div>

        ${summary ? `
        <!-- Professional Summary -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h2>
          <p style="font-size: 14px; line-height: 1.6; margin: 0; text-align: justify;">${summary}</p>
        </div>
        ` : ''}

        ${experience ? `
        <!-- Work Experience -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">WORK EXPERIENCE</h2>
          <div style="font-size: 14px; line-height: 1.6; white-space: pre-line;">${experience}</div>
        </div>
        ` : ''}

        ${education ? `
        <!-- Education -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">EDUCATION</h2>
          <div style="font-size: 14px; line-height: 1.6; white-space: pre-line;">${education}</div>
        </div>
        ` : ''}

        ${skills ? `
        <!-- Skills -->
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">SKILLS</h2>
          <div style="font-size: 14px; line-height: 1.6;">${skills}</div>
        </div>
        ` : ''}
      </div>
    `;
  }

  private createWordContent(): any[] {
    const { personalInfo, summary, experience, education, skills } = this.resumeData;
    const content: any[] = [];

    // Header
    content.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: personalInfo.name || 'Your Name',
            bold: true,
            size: 32,
            color: '1f2937'
          })
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    // Contact Information
    const contactInfo = [
      personalInfo.email || 'email@example.com',
      personalInfo.phone,
      personalInfo.location
    ].filter(Boolean).join(' • ');

    content.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: contactInfo,
            size: 20,
            color: '6b7280'
          })
        ],
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Professional Summary
    if (summary) {
      content.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 24,
              color: '1f2937'
            })
          ],
          spacing: { before: 200, after: 200 }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: summary,
              size: 20
            })
          ],
          spacing: { after: 300 }
        })
      );
    }

    // Work Experience
    if (experience) {
      content.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: 'WORK EXPERIENCE',
              bold: true,
              size: 24,
              color: '1f2937'
            })
          ],
          spacing: { before: 200, after: 200 }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: experience,
              size: 20
            })
          ],
          spacing: { after: 300 }
        })
      );
    }

    // Education
    if (education) {
      content.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: 'EDUCATION',
              bold: true,
              size: 24,
              color: '1f2937'
            })
          ],
          spacing: { before: 200, after: 200 }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: education,
              size: 20
            })
          ],
          spacing: { after: 300 }
        })
      );
    }

    // Skills
    if (skills) {
      content.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: 'SKILLS',
              bold: true,
              size: 24,
              color: '1f2937'
            })
          ],
          spacing: { before: 200, after: 200 }
        }),
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: skills,
              size: 20
            })
          ],
          spacing: { after: 300 }
        })
      );
    }

    return content;
  }
}
