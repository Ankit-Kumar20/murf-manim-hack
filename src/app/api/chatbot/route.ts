import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Initialize the OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Message interface
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Session storage to maintain conversation context
type SessionData = {
  messages: Message[];
  topic: string;
};

// In-memory session store (replace with a database in production)
const sessions = new Map<string, SessionData>();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, topic } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get or create session
    let session = sessions.get(sessionId);
    const isNewSession = !session;

    if (isNewSession) {
      if (!topic) {
        return NextResponse.json(
          { error: 'Topic is required for a new session' },
          { status: 400 }
        );
      }
      
      // Create new session with system prompt
      session = {
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant engaging in a conversation about "${topic}". 
                      Provide informative, accurate, and engaging responses related to this topic.`
          }
        ],
        topic
      };
      
      sessions.set(sessionId, session);
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Failed to create or retrieve session' },
        { status: 500 }
      );
    }

    if (message) {
      // Add user message to history
      session.messages.push({
        role: 'user',
        content: message
      });
    } else if (isNewSession) {
      // For a new session without a message, generate an introduction based on the topic
      session.messages.push({
        role: 'user',
        content: `Let's talk about ${topic}`
      });
    } else {
      return NextResponse.json(
        { error: 'Message is required for existing sessions' },
        { status: 400 }
      );
    }

    // Convert message format for OpenRouter
    const promptMessages = session.messages.map(msg => {
      return {
        role: msg.role,
        content: msg.content
      };
    });

    // Get AI response using OpenRouter
    const { text: responseText } = await generateText({
      model: openrouter("anthropic/claude-3.5-sonnet"),
      messages: promptMessages
    });
    
    // Add assistant response to history
    session.messages.push({
      role: 'assistant',
      content: responseText
    });

    // Keep history from getting too long (optional)
    if (session.messages.length > 100) {
      // Keep system message and last 50 messages
      const systemMessage = session.messages.find(msg => msg.role === 'system');
      session.messages = systemMessage 
        ? [systemMessage, ...session.messages.slice(-50)] 
        : session.messages.slice(-50);
    }

    return NextResponse.json({
      message: responseText,
      sessionId,
      topic: session.topic,
      history: session.messages,
      isNewSession
    });

  } catch (error) {
    console.error('Error in chatbot conversation:', error);
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    );
  }
}
