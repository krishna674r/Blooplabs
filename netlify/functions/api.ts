import express from 'express';
import serverless from 'serverless-http';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'netlify' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      problemArea, 
      targetAudience, 
      gradeLevel, 
      category 
    } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as a student innovation assistant for BloopLabs. Convert the following rough project idea into a structured, competition-ready project output. Use simple English. Keep it realistic and useful for school-level projects.
Do not use unnecessary jargon.

CRITICAL INSTRUCTION: Ensure the generated ideas are highly innovative, address real-world, compelling problems, and offer the best, most practical solutions. Avoid boring, trivial, or "unsexy" problems. Focus on impactful, modern, and exciting real-world challenges.

Input Idea:
- Title: ${title || 'N/A'}
- Description: ${description || 'N/A'}
- Problem Area: ${problemArea || 'N/A'}
- Target Audience: ${targetAudience || 'N/A'}
- Grade Level: ${gradeLevel || 'N/A'}
- Category: ${category || 'N/A'}
`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'An improved, catchy title for the project' },
        problem_statement: { type: Type.STRING, description: 'A clear, meaningful problem statement' },
        solution_summary: { type: Type.STRING, description: 'How the project solves the problem' },
        why_it_matters: { type: Type.STRING, description: 'The potential impact of this project' },
        uniqueness: { type: Type.STRING, description: 'What makes this approach unique' },
        feasibility: { type: Type.STRING, description: 'How realistic is it for a student to build this?' },
        materials: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'A list of potential materials or tools needed'
        },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 to 5 high-level steps to execute the project'
        },
        expected_outcome: { type: Type.STRING, description: 'What the final result should be' },
        pitch: { type: Type.STRING, description: 'A 2-sentence elevator pitch' },
        improvements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2 to 3 ways to make the project even better or more advanced'
        }
      },
      required: [
        'title', 'problem_statement', 'solution_summary', 'why_it_matters', 
        'uniqueness', 'feasibility', 'materials', 'steps', 'expected_outcome', 'pitch', 'improvements'
      ]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) { 
       throw new Error("No response text from Gemini API.");
    }
      
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating project:', error);
    res.status(500).json({ error: error.message || 'Failed to generate project details' });
  }
});

app.post('/api/generate-pitch', async (req, res) => {
  try {
    const { project } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as a pitch coach. Based on the following project details, write two engaging elevator pitches: a short 30-second pitch and a detailed 1-minute pitch. They should highlight the project's value proposition clearly, targeting judges or investors.

Project Details:
Title: ${project.title}
Problem: ${project.problem_statement}
Solution: ${project.solution_summary}
Why it matters: ${project.why_it_matters}
Uniqueness: ${project.uniqueness}`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        pitch30s: { type: Type.STRING, description: 'A 30-second elevator pitch' },
        pitch60s: { type: Type.STRING, description: 'A 1-minute elevator pitch' }
      },
      required: ['pitch30s', 'pitch60s']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) { 
       throw new Error("No response text from Gemini API.");
    }
      
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating pitches:', error);
    res.status(500).json({ error: error.message || 'Failed to generate pitches' });
  }
});

app.post('/api/mentor', async (req, res) => {
  try {
    const { toolId, input } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = '';
    let schema: any = null;

    if (toolId === 'idea-generator') {
      const { topic, audience, constraints } = input;
      prompt = `Act as an innovation mentor for students. Generate 3 highly innovative, practical, and exciting project ideas based on the following:
Field of Interest/Problem: ${topic || 'Open'}
Target Audience: ${audience || 'General public'}
Constraints: ${constraints || 'None'}`;
      
      schema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Idea name/title' },
            description: { type: Type.STRING, description: 'Brief description of the idea' },
            why_strong: { type: Type.STRING, description: 'Why it is a strong project' }
          },
          required: ['title', 'description', 'why_strong']
        },
        description: 'A list of 3 project ideas'
      };
    } else {
      const prompts: Record<string, string> = {
        'pitch-perfect': 'Act as a pitch coach. Review the following project pitch or concept and provide specific, actionable advice on how to improve its delivery, value proposition, and clarity. Make it more compelling.',
        'project-critique': 'Act as a critical but constructive judge for a science fair or innovation competition. Review the following project concept. Identify potential weaknesses, blind spots, or areas for improvement. Provide actionable suggestions.',
        'feasibility-check': 'Act as a technical advisor. Review the following project idea. Assess its technical and practical feasibility for a student project. Identify potential roadblocks (materials, skills, time) and suggest ways to overcome them or simplify the project.'
      };

      const basePrompt = prompts[toolId] || 'Act as a general innovation mentor for students. Respond to the following request.';
      prompt = `${basePrompt}\n\nStudent Input/Concept:\n${input}\n\nPlease provide constructive, actionable, and encouraging feedback.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        ...(schema ? { responseMimeType: 'application/json', responseSchema: schema } : {})
      }
    });

    const text = response.text;
    if (!text) { 
       throw new Error("No response text from Gemini API.");
    }

    res.json({ result: schema ? JSON.parse(text) : text });
  } catch (error: any) {
    console.error('Error in mentor tool:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
});

app.post('/api/project-mentor-feedback', async (req, res) => {
  try {
    const { project } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as an expert AI Innovation Mentor for a student science fair project. Review the following project details and provide concise, highly actionable, and encouraging feedback in three specific areas:
1. Structural Feedback: How to improve the methodology or project structure.
2. Feasibility Tip: A practical tip regarding materials, skills, or execution.
3. Pitch Refinement: A punchy, improved hook or sentence for their pitch.

Project Details:
Title: ${project.title}
Problem: ${project.problem_statement}
Solution: ${project.solution_summary}
Methodology Steps: ${project.steps ? project.steps.join(', ') : 'N/A'}
Materials: ${project.materials ? project.materials.join(', ') : 'N/A'}
Pitch: ${project.pitch}`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        structuralFeedback: { type: Type.STRING, description: 'Specific feedback on the methodology or structure' },
        feasibilityTip: { type: Type.STRING, description: 'A practical tip on execution or materials' },
        pitchRefinement: { type: Type.STRING, description: 'A suggested punchy hook or sentence for the pitch' }
      },
      required: ['structuralFeedback', 'feasibilityTip', 'pitchRefinement']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) { 
       throw new Error("No response text from Gemini API.");
    }
      
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating mentor feedback:', error);
    res.status(500).json({ error: error.message || 'Failed to generate mentor feedback' });
  }
});

export const handler = serverless(app);
