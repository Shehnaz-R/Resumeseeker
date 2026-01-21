export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
  };
  summary: string;
  experience: string;
  education: string;
  skills: string;
  strengths: string;
  projects: string;
  certifications: string;
}

export class SimpleDocumentGenerator {
  private resumeData: ResumeData;
  private templateName: string;

  constructor(resumeData: ResumeData, templateName: string) {
    this.resumeData = resumeData;
    this.templateName = templateName;
  }

  private isFileSystemAccessSupported(): boolean {
    return 'showSaveFilePicker' in window;
  }

  async generatePDF(): Promise<boolean> {
    try {
      // Create a simple text-based PDF using jsPDF
      const content = this.generateResumeHTML();
      
      // Create a temporary div with the resume content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#333';
      tempDiv.style.backgroundColor = '#ffffff';
      
      // Add styles for better formatting
      const style = document.createElement('style');
      style.textContent = `
        .header { 
          text-align: center; 
          border-bottom: 2px solid #2563eb; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .name { 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 10px; 
        }
        .contact { 
          font-size: 14px; 
          color: #6b7280; 
        }
        .section { 
          margin-bottom: 25px; 
        }
        .section-title { 
          font-size: 18px; 
          font-weight: bold; 
          margin-bottom: 10px; 
          border-bottom: 1px solid #e5e7eb; 
          padding-bottom: 5px; 
        }
        .section-content { 
          font-size: 14px; 
          line-height: 1.6; 
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(tempDiv);
      
      // Use html2canvas to convert to image, then jsPDF to create PDF
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      // Clean up
      document.body.removeChild(tempDiv);
      document.head.removeChild(style);
      
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
      
      // Save the PDF with a default name, but let the browser show the save dialog
      const defaultFileName = `${this.resumeData.personalInfo.name || 'resume'}-${this.templateName.toLowerCase()}.pdf`;
      
      // Create a blob and trigger download with save dialog
      const pdfBlob = pdf.output('blob');
      
      // Try to use File System Access API for better save dialog experience
      if (this.isFileSystemAccessSupported()) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: defaultFileName,
            types: [{
              description: 'PDF files',
              accept: {
                'application/pdf': ['.pdf'],
              },
            }],
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(pdfBlob);
          await writable.close();
          
          return true; // Success, exit early
        } catch (error: any) {
          // Check if user cancelled the dialog
          if (error.name === 'AbortError' || error.message?.includes('canceled')) {
            console.log('User cancelled the save dialog');
            return false; // User cancelled
          }
          
          // Other errors, fall back to regular download
          console.log('File System Access API error, falling back to regular download:', error);
        }
      }
      
      // Fallback: Use regular download method
      const link = document.createElement('a');
      const url = URL.createObjectURL(pdfBlob);
      
      link.href = url;
      link.download = defaultFileName;
      link.style.display = 'none';
      
      // Add to DOM, click, then remove
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true; // Fallback download completed
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async generateWord(): Promise<boolean> {
    try {
      // Create a simple HTML file that can be opened in Word
      const content = this.generateResumeHTML();
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume - ${this.resumeData.personalInfo.name || 'Resume'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .name { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            .contact { 
              font-size: 14px; 
              color: #6b7280; 
            }
            .section { 
              margin-bottom: 25px; 
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 10px; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 5px; 
            }
            .section-content { 
              font-size: 14px; 
              line-height: 1.6; 
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const defaultFileName = `${this.resumeData.personalInfo.name || 'resume'}-${this.templateName.toLowerCase()}.doc`;
      
      // Try to use File System Access API for better save dialog experience
      if (this.isFileSystemAccessSupported()) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: defaultFileName,
            types: [{
              description: 'Word documents',
              accept: {
                'application/msword': ['.doc'],
              },
            }],
          });
          
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          
          return true; // Success, exit early
        } catch (error: any) {
          // Check if user cancelled the dialog
          if (error.name === 'AbortError' || error.message?.includes('canceled')) {
            console.log('User cancelled the save dialog');
            return false; // User cancelled
          }
          
          // Other errors, fall back to regular download
          console.log('File System Access API error, falling back to regular download:', error);
        }
      }
      
      // Fallback: Use regular download method
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = defaultFileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true; // Fallback download completed
      
    } catch (error) {
      console.error('Error generating Word document:', error);
      throw new Error('Failed to generate Word document');
    }
  }

  private generateResumeHTML(): string {
    const { personalInfo, summary, experience, education, skills, strengths, projects, certifications } = this.resumeData;
    
    return `
      <div class="header">
        <div class="flex items-center justify-center gap-6">
          ${personalInfo.profileImage ? `
            <img src="${personalInfo.profileImage}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;" />
          ` : ''}
          <div>
            <div class="name">${personalInfo.name || 'Your Name'}</div>
            <div class="contact">
              ${personalInfo.email || 'email@example.com'}
              ${personalInfo.phone ? ` • ${personalInfo.phone}` : ''}
              ${personalInfo.location ? ` • ${personalInfo.location}` : ''}
            </div>
          </div>
        </div>
      </div>

      ${summary ? `
      <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <div class="section-content">${summary}</div>
      </div>
      ` : ''}

      ${experience ? `
      <div class="section">
        <div class="section-title">WORK EXPERIENCE</div>
        <div class="section-content" style="white-space: pre-line;">${experience}</div>
      </div>
      ` : ''}

      ${education ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="section-content" style="white-space: pre-line;">${education}</div>
      </div>
      ` : ''}

      ${skills ? `
      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="section-content">${skills}</div>
      </div>
      ` : ''}

      ${strengths ? `
      <div class="section">
        <div class="section-title">STRENGTHS</div>
        <div class="section-content">${strengths}</div>
      </div>
      ` : ''}

      ${projects ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        <div class="section-content" style="white-space: pre-line;">${projects}</div>
      </div>
      ` : ''}

      ${certifications ? `
      <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        <div class="section-content" style="white-space: pre-line;">${certifications}</div>
      </div>
      ` : ''}
    `;
  }

  private generateResumeText(): string {
    const { personalInfo, summary, experience, education, skills, strengths, projects, certifications } = this.resumeData;
    
    let content = '';
    
    // Header
    content += `${personalInfo.name || 'Your Name'}\n`;
    content += `${personalInfo.email || 'email@example.com'}`;
    if (personalInfo.phone) content += ` • ${personalInfo.phone}`;
    if (personalInfo.location) content += ` • ${personalInfo.location}`;
    content += '\n\n';
    
    // Professional Summary
    if (summary) {
      content += 'PROFESSIONAL SUMMARY\n';
      content += '='.repeat(20) + '\n';
      content += `${summary}\n\n`;
    }
    
    // Work Experience
    if (experience) {
      content += 'WORK EXPERIENCE\n';
      content += '='.repeat(15) + '\n';
      content += `${experience}\n\n`;
    }
    
    // Education
    if (education) {
      content += 'EDUCATION\n';
      content += '='.repeat(9) + '\n';
      content += `${education}\n\n`;
    }
    
    // Skills
    if (skills) {
      content += 'SKILLS\n';
      content += '='.repeat(6) + '\n';
      content += `${skills}\n\n`;
    }
    
    // Strengths
    if (strengths) {
      content += 'STRENGTHS\n';
      content += '='.repeat(9) + '\n';
      content += `${strengths}\n\n`;
    }
    
    // Projects
    if (projects) {
      content += 'PROJECTS\n';
      content += '='.repeat(8) + '\n';
      content += `${projects}\n\n`;
    }
    
    // Certifications
    if (certifications) {
      content += 'CERTIFICATIONS\n';
      content += '='.repeat(14) + '\n';
      content += `${certifications}\n\n`;
    }
    
    return content;
  }
}
