import { NextRequest, NextResponse } from "next/server";
import { executeCodeAndListFiles } from "@/utils/sandbox";
import { generateVoiceNarration } from "@/utils/voiceNarration";
import { generateStructuredManimCode } from "@/utils/structuredManimGenerator";
import { convertEscapedNewlines } from "@/utils/formatManimCode";

async function generateSingleVideo(topic: string, includeVoice: boolean) {
  console.log(`🎬 Starting single video generation for: ${topic}`);

  // 1. Generate structured Manim code directly
  const manimCode = await generateStructuredManimCode(topic);
  console.log("🤖 Manim code generated and validated.");
  
  // Log the generated code for debugging
  console.log("Generated Manim code:");
  console.log("=".repeat(50));
  console.log(manimCode);
  console.log("=".repeat(50));

  // 2. Convert escaped newlines for execution
  const formattedManimCode = convertEscapedNewlines(manimCode);

  // 3. Execute Manim code to generate video
  const executionResult = await executeCodeAndListFiles(formattedManimCode);
  
  // Enhanced error logging
  console.log("Execution result details:", {
    success: executionResult.success,
    error: executionResult.error,
    executionError: executionResult.execution?.error,
    hasVideoFiles: executionResult.videoFiles?.length > 0,
    videoFilesCount: executionResult.videoFiles?.length || 0,
    executionLogs: executionResult.execution?.logs || "No execution logs available"
  });

  if (!executionResult.success || executionResult.videoFiles.length === 0) {
    console.error("Manim execution failed:", executionResult.error || executionResult.execution?.error);
    console.error("Execution logs:", executionResult.execution?.logs || "No logs available");
    
    // Log the Manim code that failed for debugging
    console.error("Failed Manim code:");
    console.error(formattedManimCode);
    
    const errorMessage = executionResult.error || executionResult.execution?.error || "No video produced.";
    const logs = executionResult.execution?.logs || ["No logs available"];
    
    throw new Error(
      `Manim execution failed. Error: ${errorMessage}. Logs: ${JSON.stringify(logs)}`
    );
  }
  console.log("📹 Video file generated:", executionResult.videoFiles[0].path);

  // 4. The video is already uploaded by executeCodeAndListFiles, so we just get the URL.
  const videoUrl = executionResult.videoFiles[0].path;
  console.log("☁️ Video URL retrieved:", videoUrl);

  let voiceData = null;
  if (includeVoice) {
    console.log("🗣️ Generating educational voice narration...");
    // Generate a comprehensive educational script that aligns with the 5-phase structure
    const script = `Welcome to this comprehensive exploration of ${topic}. In this video, we'll start with a real-world problem that motivates why this concept matters, then build your understanding step by step through clear visual explanations. We'll address common misconceptions, explore practical applications, and connect everything back to the big picture. Let's begin this learning journey together.`;

    voiceData = await generateVoiceNarration(topic, script, {
      style: "educational",
    });
    console.log("🔊 Educational voice narration generated with pedagogical focus.");
  }

  return {
    topic,
    manimCode: formattedManimCode,
    videoUrl,
    voiceData,
    success: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { topic, includeVoice = true } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const result = await generateSingleVideo(topic, includeVoice);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in single video generation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
