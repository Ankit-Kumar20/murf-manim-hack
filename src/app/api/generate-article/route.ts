import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateMurfTTS } from '@/utils/murfTTS';

// Initialize the OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

interface ArticleSection {
  title: string;
  content: string;
}

interface ParsedArticle {
  title: string;
  introduction: string;
  sections: ArticleSection[];
  conclusion: string;
}

interface GenerateArticleResponse {
  topic: string;
  title: string;
  introduction: string;
  sections: ArticleSection[];
  conclusion: string;
  paragraph: string;
  characterCount: number;
  audioUrl?: string;
  audioLengthInSeconds?: number;
  audioGenerated: boolean;
  success: boolean;
}

// Request deduplication - prevent multiple simultaneous requests for same topic
const activeRequests = new Map<string, Promise<GenerateArticleResponse>>();

export async function POST(request: NextRequest) {
  try {
    const {
      topic,
      length = 'medium',
      style = 'educational',
      includeAudio = false,
      voiceId = 'en-US-natalie',
      audioRate = 0,
      audioPitch = 0
    } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Validate length parameter
    const validLengths = ['short', 'medium', 'long'];
    if (!validLengths.includes(length)) {
      return NextResponse.json(
        { error: 'Length must be one of: short, medium, long' },
        { status: 400 }
      );
    }

    // Validate style parameter
    const validStyles = ['educational', 'academic', 'casual', 'technical'];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: 'Style must be one of: educational, academic, casual, technical' },
        { status: 400 }
      );
    }

    // Check if there's already an active request for this topic
    const requestKey = `${topic}_${length}_${style}_${includeAudio}`;
    if (activeRequests.has(requestKey)) {
      console.log(`Waiting for active request: ${requestKey}`);
      const result = await activeRequests.get(requestKey);
      return NextResponse.json(result);
    }

    // Create and store the promise for this request
    const requestPromise = generateArticleContent(topic, length, style, includeAudio, {
      voiceId,
      rate: audioRate,
      pitch: audioPitch
    });
    activeRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return NextResponse.json(result);
    } finally {
      // Clean up the active request
      activeRequests.delete(requestKey);
    }

  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}

async function generateArticleContent(
  topic: string,
  length: string,
  style: string,
  includeAudio: boolean = false,
  audioOptions: {
    voiceId?: string;
    rate?: number;
    pitch?: number;
  } = {}
): Promise<GenerateArticleResponse> {

  // Define character count target - always 2600 characters
  const characterCountTarget = '2600';

  // Define style guidelines
  const styleGuidelines: Record<string, string> = {
    educational: 'Write in a clear, accessible manner suitable for students. Use examples and analogies to explain complex concepts.',
    academic: 'Use formal academic language with proper citations and scholarly tone. Include technical terminology where appropriate.',
    casual: 'Write in a conversational, friendly tone that\'s easy to read. Use everyday language and relatable examples.',
    technical: 'Focus on technical details and specifications. Use precise terminology and include implementation details where relevant.'
  };

  const systemPrompt = `You are an expert writer tasked with creating a comprehensive article about "${topic}".

REQUIREMENTS:
- Length: EXACTLY ${characterCountTarget} characters (including spaces and punctuation)
- Style: ${styleGuidelines[style]}
- Structure: Introduction, 4-6 main sections, and conclusion
- Format: Return ONLY a valid JSON object with the specified structure

The article should be informative, well-researched, and engaging. Cover the topic thoroughly from multiple angles including:
- Basic concepts and definitions
- Historical context or background
- Key principles or mechanisms
- Applications or examples
- Current developments or future prospects
- Practical implications

CRITICAL CHARACTER COUNT REQUIREMENT:
- The total character count of all content (title + introduction + all section titles + all section content + conclusion) must be EXACTLY ${characterCountTarget} characters
- Count every character including spaces, punctuation, and line breaks
- Adjust content length to meet this exact requirement

IMPORTANT JSON FORMATTING RULES:
1. Return ONLY the JSON object, no additional text or markdown
2. Ensure all quotes inside content are properly escaped as \"
3. Use \\n for line breaks within content
4. Do not use any special characters that could break JSON parsing
5. Keep content flowing naturally without unnecessary escaping

Return the response as a JSON object with this exact structure:
{
  "title": "An engaging title for the article",
  "introduction": "A compelling introduction that hooks the reader and outlines what will be covered",
  "sections": [
    {
      "title": "Section Title",
      "content": "Detailed content for this section"
    }
  ],
  "conclusion": "A strong conclusion that summarizes key points and provides final thoughts"
}

Make sure each section is substantial and the total content meets the EXACT character count requirement of ${characterCountTarget} characters. Use clear, logical flow between sections.`;

  try {
    // Generate the article content
    const { text: articleJson } = await generateText({
      model: openrouter("anthropic/claude-3.5-sonnet"),
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate a comprehensive article about: ${topic}. Return ONLY valid JSON without any markdown formatting or additional text.`
        }
      ],
      temperature: 0.3 // Lower temperature for more consistent JSON formatting
    });

    // Parse the JSON response
    let parsedArticle;
    try {
      console.log('Parsing AI response...');
      parsedArticle = extractArticleFromText(articleJson);
      console.log('Successfully parsed article JSON');
    } catch (parseError) {
      console.error('Failed to parse article JSON:', parseError);
      console.error('Raw response length:', articleJson.length);
      console.error('Raw response preview:', articleJson.substring(0, 500) + '...');
      throw new Error('Failed to parse generated article content');
    }

    // Validate the structure
    if (!parsedArticle.title || !parsedArticle.introduction || !parsedArticle.sections || !parsedArticle.conclusion) {
      throw new Error('Generated article missing required fields');
    }

    // Calculate character count
    const characterCount = calculateCharacterCount(parsedArticle);

    // Create merged paragraph content
    const paragraph = createMergedParagraph(parsedArticle);

    const result: GenerateArticleResponse = {
      topic,
      title: parsedArticle.title,
      introduction: parsedArticle.introduction,
      sections: parsedArticle.sections,
      conclusion: parsedArticle.conclusion,
      paragraph,
      characterCount,
      audioGenerated: false,
      success: true
    };

    // Generate audio if requested
    if (includeAudio) {
      try {
        console.log('Generating audio for article paragraph...');
        const audioResult = await generateParagraphAudio(
          parsedArticle.title,
          paragraph,
          {
            voiceId: audioOptions.voiceId,
            rate: audioOptions.rate,
            pitch: audioOptions.pitch,
            format: 'MP3',
            includeTitle: true
          }
        );

        if (audioResult.success) {
          result.audioUrl = audioResult.audioUrl;
          result.audioLengthInSeconds = audioResult.audioLengthInSeconds;
          result.audioGenerated = true;
          console.log(`Audio generated successfully: ${audioResult.audioLengthInSeconds}s`);
        } else {
          console.warn('Audio generation failed:', audioResult.error);
          // Don't fail the entire request if audio generation fails
        }
      } catch (audioError) {
        console.error('Error generating audio:', audioError);
        // Don't fail the entire request if audio generation fails
      }
    }

    return result;

  } catch (error) {
    console.error('Error in generateArticleContent:', error);
    throw error;
  }
}

async function generateParagraphAudio(
  title: string,
  paragraph: string,
  options: {
    voiceId?: string;
    rate?: number;
    pitch?: number;
    format?: 'MP3' | 'WAV';
    includeTitle?: boolean;
  } = {}
): Promise<{
  audioUrl: string;
  audioLengthInSeconds: number;
  success: boolean;
  error?: string;
}> {
  try {
    const {
      voiceId = 'en-US-natalie',
      rate = 0,
      pitch = 0,
      includeTitle = true
    } = options;

    // Clean text for TTS
    function cleanTextForTTS(text: string): string {
      if (!text) return '';

      return text
        .replace(/[""]/g, '"')  // Replace smart quotes
        .replace(/['']/g, "'")  // Replace smart apostrophes 
        .replace(/…/g, '...')   // Replace ellipsis
        .replace(/—/g, '-')     // Replace em dash
        .replace(/–/g, '-')     // Replace en dash
        .replace(/\s+/g, ' ')   // Remove excessive whitespace
        .replace(/[\n\r\t]/g, ' ') // Remove newlines and tabs
        .trim();
    }

    // Construct the full text for TTS
    let fullText = '';

    if (includeTitle) {
      fullText += `${cleanTextForTTS(title)}. [pause 3s] `;
    }

    fullText += cleanTextForTTS(paragraph);

    console.log('Full text length:', fullText.length, 'characters');

    // Murf API has a 3000 character limit, so we need to split if necessary
    const maxLength = 2800; // Leave some buffer

    if (fullText.length <= maxLength) {
      // Text is short enough, generate single audio
      console.log('Text fits in single request, generating audio...');

      const murfRequest = {
        text: fullText,
        voiceId,
        ...(rate !== 0 && { rate }),
        ...(pitch !== 0 && { pitch })
      };

      const audioResponse = await generateMurfTTS(murfRequest);

      return {
        audioUrl: audioResponse.audioFile,
        audioLengthInSeconds: audioResponse.audioLengthInSeconds,
        success: true
      };
    } else {
      // Text is too long, truncate to fit within limits
      console.log('Text is too long, truncating...');

      const truncatedText = fullText.substring(0, maxLength - 100) + '... Thank you for listening.';

      console.log('Truncated text length:', truncatedText.length, 'characters');

      const murfRequest = {
        text: truncatedText,
        voiceId,
        ...(rate !== 0 && { rate }),
        ...(pitch !== 0 && { pitch })
      };

      const audioResponse = await generateMurfTTS(murfRequest);

      return {
        audioUrl: audioResponse.audioFile,
        audioLengthInSeconds: audioResponse.audioLengthInSeconds,
        success: true
      };
    }

  } catch (error) {
    console.error('Error generating paragraph audio:', error);
    return {
      audioUrl: '',
      audioLengthInSeconds: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate audio'
    };
  }
}

function cleanJsonString(jsonString: string): string {
  // Remove markdown code blocks
  let cleaned = jsonString.replace(/```json\s*|\s*```/g, '').trim();

  // Fix common JSON issues
  cleaned = cleaned
    // Remove any trailing commas before closing braces/brackets
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix escaped newlines and quotes in content
    .replace(/\\n/g, '\\n')
    .replace(/\\"/g, '\\"');

  return cleaned;
}

function extractArticleFromText(text: string): ParsedArticle {
  // Try to extract JSON object from the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in response');
  }

  let jsonString = jsonMatch[0];

  // Clean the JSON string
  jsonString = cleanJsonString(jsonString);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // If parsing still fails, try manual extraction
    console.log('JSON parsing failed, attempting manual extraction...');
    console.error('Parse error details:', error);

    const titleMatch = text.match(/"title"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
    const introMatch = text.match(/"introduction"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
    const conclusionMatch = text.match(/"conclusion"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);

    // Extract sections
    const sectionsMatch = text.match(/"sections"\s*:\s*\[([\s\S]*?)\]/);
    const sections = [];

    if (sectionsMatch) {
      // Extract individual sections
      const sectionPattern = /\{\s*"title"\s*:\s*"([^"]*(?:\\.[^"]*)*)"\s*,\s*"content"\s*:\s*"([^"]*(?:\\.[^"]*)*)"\s*\}/g;
      let sectionMatch;
      while ((sectionMatch = sectionPattern.exec(sectionsMatch[1])) !== null) {
        sections.push({
          title: sectionMatch[1].replace(/\\"/g, '"'),
          content: sectionMatch[2].replace(/\\"/g, '"').replace(/\\n/g, '\n')
        });
      }
    }

    if (titleMatch && introMatch && conclusionMatch && sections.length > 0) {
      return {
        title: titleMatch[1].replace(/\\"/g, '"'),
        introduction: introMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
        sections: sections,
        conclusion: conclusionMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
      };
    } else {
      throw new Error('Could not extract article content manually');
    }
  }
}

function createMergedParagraph(article: ParsedArticle): string {
  let mergedContent = '';

  // Add introduction
  mergedContent += article.introduction;

  // Add sections content with titles
  if (article.sections && Array.isArray(article.sections)) {
    article.sections.forEach((section: ArticleSection) => {
      mergedContent += '\n\n' + section.title + '\n\n' + section.content;
    });
  }

  // Add conclusion
  mergedContent += '\n\n' + article.conclusion;

  return mergedContent.trim();
}

function calculateCharacterCount(article: ParsedArticle): number {
  let totalCharacters = 0;

  // Count characters in title
  totalCharacters += countCharacters(article.title);

  // Count characters in introduction
  totalCharacters += countCharacters(article.introduction);

  // Count characters in all sections
  if (article.sections && Array.isArray(article.sections)) {
    article.sections.forEach((section: ArticleSection) => {
      totalCharacters += countCharacters(section.title);
      totalCharacters += countCharacters(section.content);
    });
  }

  // Count characters in conclusion
  totalCharacters += countCharacters(article.conclusion);

  return totalCharacters;
}

function countCharacters(text: string): number {
  if (!text) return 0;
  return text.length;
}

// GET method to retrieve article (optional - for caching if needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  if (!topic) {
    return NextResponse.json(
      { error: 'Topic query parameter is required' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: 'Use POST method to generate articles',
    example: {
      method: 'POST',
      body: {
        topic: 'Your topic here',
        length: 'medium', // optional: short, medium, long
        style: 'educational', // optional: educational, academic, casual, technical
        includeAudio: false, // optional: true to generate audio
        voiceId: 'en-US-natalie', // optional: voice for audio generation
        audioRate: 0, // optional: speech rate (-50 to 50)
        audioPitch: 0 // optional: speech pitch (-50 to 50)
      }
    }
  });
}
