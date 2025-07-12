import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.3,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, summaryType = 'general' } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create summarization prompt based on type
    let promptTemplate: string;

    switch (summaryType) {
      case 'meeting':
        promptTemplate = `You are an expert meeting summarizer. Analyze the following meeting transcript and provide a comprehensive summary.\n\nTranscript: {transcript}\n\nPlease provide:\n1. A concise executive summary (2-3 sentences)\n2. Key discussion points (bullet points)\n3. Action items and next steps\n4. Important decisions made\n5. Follow-up items\n\nFormat your response as JSON with the following structure:\n{{\n  "summary": "executive summary here",\n  "keyPoints": ["point 1", "point 2", "point 3"],\n  "actionItems": ["action 1", "action 2"],\n  "decisions": ["decision 1", "decision 2"],\n  "followUps": ["follow-up 1", "follow-up 2"]\n}}`;
        break;

      case 'technical':
        promptTemplate = `You are a technical documentation expert. Analyze the following technical discussion and provide a structured summary.\n\nTranscript: {transcript}\n\nPlease provide:\n1. Technical overview\n2. Key technical points\n3. Implementation details\n4. Technical decisions\n5. Next technical steps\n\nFormat your response as JSON with the following structure:\n{{\n  "summary": "technical overview here",\n  "keyPoints": ["technical point 1", "technical point 2"],\n  "technicalDetails": ["detail 1", "detail 2"],\n  "decisions": ["technical decision 1"],\n  "nextSteps": ["next step 1", "next step 2"]\n}}`;
        break;

      default: // general
        promptTemplate = `You are an expert content summarizer. Create a clear and concise summary of the following transcript.\n\nTranscript: {transcript}\n\nPlease provide:\n1. Main summary (3-4 sentences)\n2. Key points (bullet points)\n3. Important takeaways\n\nFormat your response as JSON with the following structure:\n{{\n  "summary": "main summary here",\n  "keyPoints": ["key point 1", "key point 2", "key point 3"],\n  "takeaways": ["takeaway 1", "takeaway 2"]\n}}`;
    }

    const prompt = PromptTemplate.fromTemplate(promptTemplate);
    console.log('Prompt input variables:', prompt.inputVariables);
    const chain = new LLMChain({ llm: openai, prompt });

    // Debug log for input
    console.log('Prompt input:', { transcript });
    const result = await chain.call({ transcript });

    // Try to parse JSON response, fallback to text if parsing fails
    let summaryData;
    try {
      summaryData = JSON.parse(result.text);
    } catch {
      // If JSON parsing fails, create a structured response from text
      summaryData = {
        summary: result.text,
        keyPoints: [],
        actionItems: [],
        summaryType: summaryType
      };
    }

    return NextResponse.json({
      success: true,
      summary: summaryData,
      message: 'Summarization completed successfully'
    });

  } catch (error) {
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: `Failed to summarize transcript. Details: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Summarize API endpoint' },
    { status: 200 }
  );
} 