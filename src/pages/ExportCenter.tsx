import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProjects } from '../hooks/useProjects';
import { Download, FileText, Printer } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } from 'docx';
import { saveAs } from 'file-saver';
import { SavedProject } from '../types';

export function ExportCenter() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || null);

  const activeProject = projects.find(p => p.id === selectedProject);

  const handleExportDocx = async (project: SavedProject) => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          new Paragraph({
            text: project.output.title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Problem Statement",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          new Paragraph({ text: project.output.problem_statement, spacing: { after: 200 } }),
          
          new Paragraph({
            text: "Solution Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          new Paragraph({ text: project.output.solution_summary, spacing: { after: 200 } }),

          new Paragraph({
            text: "Why It Matters",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          new Paragraph({ text: project.output.why_it_matters, spacing: { after: 200 } }),

          new Paragraph({
            text: "Materials",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          ...(project.output.materials || []).map(mat => new Paragraph({
            text: mat,
            bullet: { level: 0 }
          })),

          new Paragraph({
            text: "Steps",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          ...(project.output.steps || []).map((step, idx) => new Paragraph({
            text: `${idx + 1}. ${step}`,
            spacing: { after: 120 }
          })),
          
          new Paragraph({
            text: "Expected Outcome",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 120 },
          }),
          new Paragraph({ text: project.output.expected_outcome, spacing: { after: 200 } }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${project.output.title || 'Project'}.docx`);
  };

  const handlePrintPdf = (project: SavedProject) => {
    // Open a new window and write printable HTML
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups for this site to print or save as PDF.");
      return;
    }

    const materialsHtml = (project.output.materials || []).map(m => `<li>${m}</li>`).join('');
    const stepsHtml = (project.output.steps || []).map(s => `<li>${s}</li>`).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${project.output.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
            h1 { text-align: center; color: #111; margin-bottom: 40px; }
            h2 { color: #222; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-top: 40px; }
            p { margin-bottom: 16px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 8px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${project.output.title}</h1>
          
          <h2>Problem Statement</h2>
          <p>${project.output.problem_statement}</p>
          
          <h2>Solution Summary</h2>
          <p>${project.output.solution_summary}</p>
          
          <h2>Why It Matters</h2>
          <p>${project.output.why_it_matters}</p>
          
          <h2>Materials</h2>
          <ul>${materialsHtml}</ul>
          
          <h2>Steps</h2>
          <ol>${stepsHtml}</ol>
          
          <h2>Expected Outcome</h2>
          <p>${project.output.expected_outcome}</p>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Export Center</h1>
          <p className="text-muted-foreground">Generate clear, formatted reports for your finalized projects.</p>
        </div>
        <select 
          className="bg-surface border border-surface-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
          value={selectedProject || ''}
          onChange={e => setSelectedProject(e.target.value)}
        >
          <option value="" disabled>Select a project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.output.title}</option>
          ))}
        </select>
      </div>

      {!activeProject ? (
        <div className="text-center py-20 bg-surface/50 rounded-2xl border border-surface-border border-dashed">
          <p className="text-muted-foreground">No projects available for export. Create one first!</p>
        </div>
      ) : (
        <div className="max-w-2xl">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <CardTitle>Project Report Exporter</CardTitle>
              <CardDescription>A comprehensive formatted document suitable for science fair judges, teachers, or grant applications. Uses clean, professional formatting.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleExportDocx(activeProject)} className="flex-1 gap-2">
                <Download size={16} /> Export DOCX
              </Button>
              <Button onClick={() => handlePrintPdf(activeProject)} variant="outline" className="flex-1 gap-2">
                <Printer size={16} /> Print / Save as PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
