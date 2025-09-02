import { z } from "zod";
import { blobStorage } from "./blobStorage";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Initialize the OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});


// Schema for structured Manim code generation
const manimCodeSchema = z.object({
  imports: z
    .array(z.string())
    .describe("All necessary import statements for Manim"),
  class_name: z
    .string()
    .describe("Name of the Scene class (e.g., 'PythagoreanTheorem')"),
  class_definition: z.object({
    name: z.string(),
    docstring: z.string().optional(),
    methods: z.array(
      z.object({
        name: z.string(),
        parameters: z.array(z.string()),
        body: z
          .string()
          .describe("Complete method body with proper 4-space indentation"),
        docstring: z.string().optional(),
      })
    ),
  }),
  complete_script: z
    .string()
    .describe(
      "Full executable Manim Python script with proper PEP 8 formatting"
    ),
});

/**
 * Advanced formatter that uses AI to generate structured, production-ready Manim code
 */
export async function generateStructuredManimCode(
  topic: string
): Promise<string> {
  try {
    // Check storage first
    console.log(`Checking storage for Manim code: ${topic}`);
    const cachedCode = await blobStorage.getManimCode(topic);

    if (cachedCode) {
      console.log(`🎯 Storage HIT - Using stored Manim code for: ${topic}`);
      return cachedCode.validatedCode;
    }

    console.log(`🔄 Storage MISS - Generating new Manim code for: ${topic}`);

// Generate AI-powered Manim code

    let object;
    try {
      const result = await generateObject({
        model: openrouter("anthropic/claude-3.5-sonnet"),
        schema: manimCodeSchema,
        prompt: `You are an expert educational content creator and Manim developer specializing in creating highly explanatory mathematical and scientific animations. Your goal is to create videos that build deep conceptual understanding through clear, step-by-step visual explanations.

🎯 **VIDEO LENGTH REQUIREMENT: Create animations that run approximately 28 seconds total**

Generate a comprehensive JSON object with Manim Python code for the educational topic: "${topic}"

IMPORTANT: Respond ONLY with a valid JSON object that matches this exact structure:
{
  "imports": ["from manim import *"],
  "class_name": "SceneName",
  "class_definition": {
    "name": "SceneName",
    "methods": [
      {
        "name": "construct",
        "parameters": ["self"],
        "body": "    def construct(self):\\n        # Complete method body here"
      }
    ]
  },
  "complete_script": "from manim import *\\n\\nclass SceneName(Scene):\\n    def construct(self):\\n        # Complete code here"
}

CRITICAL: Ensure the JSON is perfectly valid - no trailing commas, proper escaping, and complete structure.

DOUBLE-CHECK: Before responding, validate that your JSON is properly formatted and complete.

=== EDUCATIONAL VIDEO REQUIREMENTS ===

**STRUCTURE YOUR EXPLANATION IN THESE PHASES:**

1. **HOOK & CONTEXT (10-15% of video time)**
   - Start with a real-world problem or question that motivates the topic
   - Show why this concept matters in practical applications
   - Use engaging visuals that grab attention

2. **CONCEPTUAL FOUNDATION (20-25% of video time)**
   - Break down the core idea into fundamental building blocks
   - Use analogies and visual metaphors to explain abstract concepts
   - Show the "big picture" before diving into details

3. **STEP-BY-STEP BREAKDOWN (40-50% of video time)**
   - Present information progressively - don't overwhelm with details
   - Use color coding to highlight important relationships
   - Include intermediate checkpoints with "pause and reflect" moments
   - Show common mistakes and how to avoid them

4. **VISUAL DEMONSTRATIONS (15-20% of video time)**
   - Create dynamic examples that students can follow along
   - Use animations to show transformations and relationships
   - Include multiple perspectives (zoom in/out, rotate, etc.)

5. **SUMMARY & CONNECTIONS (10-15% of video time)**
   - Recap key takeaways with visual summaries
   - Connect back to the original problem/question
   - Show how this concept relates to other topics

**PEDAGOGICAL BEST PRACTICES:**

- **Progressive Disclosure**: Reveal information gradually, building complexity
- **Dual Coding**: Combine visual animations with clear text explanations
- **Analogies**: Use familiar concepts to explain unfamiliar ones
- **Chunking**: Break complex ideas into digestible pieces
- **Active Learning**: Include moments where viewers can predict outcomes
- **Error Prevention**: Address common misconceptions explicitly

**VISUAL DESIGN PRINCIPLES:**

- Use consistent color schemes (e.g., blue for main concepts, green for examples)
- Include clear labels and annotations on all important elements
- Use smooth transitions between concepts
- Employ spatial relationships to show connections
- Add visual cues for emphasis (arrows, highlights, zooms)
- Include scale references for mathematical concepts

**TIMING & PACING:**

VIDEO LENGTH TARGET: Create animations that total approximately 28 seconds in duration.

- **Total Duration Goal: 26-30 seconds** for optimal viewer engagement
- **Hook & Context**: 4-5 seconds (15% of video time)
- **Conceptual Foundation**: 6-7 seconds (20-25% of video time)
- **Step-by-Step Breakdown**: 11-14 seconds (40-50% of video time)
- **Visual Demonstrations**: 4-5 seconds (15-20% of video time)
- **Summary & Connections**: 3-4 seconds (10-15% of video time)

- Allow time for viewers to process information (1.5-2.5 second pauses after key points)
- Use slower animations for complex transformations (rate_functions=smooth)
- Include brief pauses before revealing solutions to problems
- Add "processing time" after introducing new terminology
- Optimize animation speeds to fit within the 28-second target

**CONTENT ENHANCEMENT:**

- Include real-world applications and examples
- Address common misconceptions with "myth-busting" animations
- Show the evolution of concepts historically where relevant
- Include interactive elements like "what if" scenarios
- Provide multiple representations of the same idea

**TECHNICAL REQUIREMENTS:**

- Use proper 4-space indentation
- Use MathTex() for mathematical expressions, Text() for explanatory text
- Follow Manim best practices for smooth animations
- Include detailed comments explaining each section's educational purpose
- Ensure animations are neither too fast nor too slow
- Use appropriate camera movements (zoom, pan, rotate) to focus attention
- Do NOT include render commands

**EXAMPLE STRUCTURE FOR A MATH CONCEPT:**

1. Start with a practical problem (e.g., "Why do bridges need this math?")
2. Build intuition with visual analogies
3. Show step-by-step derivation with color-coded elements
4. Demonstrate with concrete examples
5. Connect to real-world applications
6. End with a conceptual summary

Generate the JSON now with a comprehensive, pedagogically sound Manim animation that will create an engaging and deeply explanatory educational video:`
      });
      object = result.object;
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      // Try with a simpler prompt as fallback
      console.log("Attempting fallback with simplified prompt...");
      const fallbackResult = await generateObject({
        model: openrouter("anthropic/claude-3.5-sonnet"),
        schema: manimCodeSchema,
        prompt: `Generate a 28-second Manim educational video for "${topic}". Return ONLY valid JSON:

TARGET: Create engaging content that runs approximately 28 seconds total.

Structure:
- Hook (4-5s): Introduce the topic engagingly
- Conceptual Foundation (6-7s): Build understanding of key concepts
- Main content (11-14s): Show detailed concepts with animations
- Summary (3-4s): Recap what was learned

Timing Guidelines:
- Use smooth animations
- Include appropriate pauses for comprehension
- Total duration should be 26-30 seconds

Return ONLY valid JSON with this structure:
{
  "imports": ["from manim import *"],
  "class_name": "EducationalScene",
  "class_definition": {
    "name": "EducationalScene",
    "methods": [{"name": "construct", "parameters": ["self"], "body": "    def construct(self):\\n        # 20-second educational animation here\\n        pass"}]
  },
  "complete_script": "from manim import *\\n\\nclass EducationalScene(Scene):\\n    def construct(self):\\n        # 20-second educational animation\\n        pass"
}`
      });
      object = fallbackResult.object;
    }

    const rawCode = object.complete_script;
    const validatedCode = validateAndFixManimCode(rawCode);

    // Store the results
    await blobStorage.storeManimCode(topic, rawCode, validatedCode);
    console.log(`💾 Stored Manim code for future use: ${topic}`);

    return validatedCode;

  } catch (error) {
    console.error("Error generating structured Manim code:", error);
    throw new Error(`Failed to generate Manim code for topic: ${topic}. Original error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Function that validates and fixes common issues in AI-generated Manim code
 */
export function validateAndFixManimCode(code: string): string {
  let fixedCode = code;

  // Ensure proper imports
  if (!fixedCode.includes("from manim import *")) {
    fixedCode =
      "from manim import *\n\n" +
      fixedCode.replace(/^.*from manim import \*.*\n?/gm, "");
  }

  // Fix common Manim syntax issues
  fixedCode = fixedCode
    // Fix MathMathTex which doesn't exist (duplicated Math prefix) - more robust pattern
    .replace(/MathMathTex/g, "MathTex")

    // Fix Line.label() which doesn't exist
    .replace(
      /(\w+) = Line\(([^)]*)\)\.label\(([^,]+),?\s*buff=([^)]+)\)/g,
      "$1 = Line($2)\n    $1_label = MathTex($3).next_to($1, UP, buff=$4)"
    )

    // Fix any Tex to MathTex for mathematical content
    .replace(/Tex\(("[^"]*[\\^_].*?"|'[^']*[\\^_].*?')\)/g, "MathTex($1)")

    // Fix set_opacity without arguments
    .replace(/(\w+)\.set_opacity\(\)/g, "$1.set_opacity(0.5)")

    // Fix Square constructor with keyword argument
    .replace(/Square\(side_length=([^,)]+)/g, "Square($1")

    // Fix Circle constructor with keyword argument
    .replace(/Circle\(radius=([^,)]+)/g, "Circle($1")

    // Fix animation syntax for FadeOut all
    .replace(
      /self\.play\(\*\[FadeOut\(mob\) for mob in self\.mobjects\]\)/g,
      "self.play(*[FadeOut(mob) for mob in self.mobjects])"
    )

    // Fix calls to non-existent label method on geometric objects
    .replace(/(\w+)\.label\(([^)]+)\)/g, "MathTex($2).next_to($1, UP)")

    // Fix common animation sequencing issues
    .replace(
      /self\.play\(([^)]+)\.animate\.([^)]+)\)/g,
      "self.play($1.animate.$2)"
    )

    // Fix missing arguments in Create animation
    .replace(/Create\(\)/g, "Create()")

    // Fix Vector constructor with missing arguments
    .replace(/Vector\(\)/g, "Vector(RIGHT)")

    // Fix ValueTracker initialization without value
    .replace(/ValueTracker\(\)/g, "ValueTracker(0)")

    // Fix incorrect MathTex formatting for fractions
    .replace(
      /MathTex\("(.*?)\\frac\{(.*?)\}\{(.*?)\}"(.*?)\)/g,
      'MathTex(r"$1\\frac{$2}{$3}"$4)'
    )

    // Ensure r prefix for complex math expressions
    .replace(/MathTex\("(.*?[\\^_\{\}].*?)"\)/g, 'MathTex(r"$1")')

    // Fix \text{} usage - convert to Text() objects for plain text
    .replace(/MathTex\(r?"\\text\{([^}]+)\}"\)/g, 'Text("$1")')
    .replace(/MathTex\("\\text\{([^}]+)\}"\)/g, 'Text("$1")')

    // Educational enhancement: Ensure clear labeling for mathematical objects
    .replace(/MathTex\(([^)]+)\)\.next_to\(([^,]+),\s*UP\)/g,
             (match, tex, obj) => `MathTex(${tex}).next_to(${obj}, UP, buff=0.3)`)

    // Improve text readability with better font size and positioning
    .replace(/Text\("([^"]+)"\)/g, (match, text) => {
      // Use larger font for educational explanations
      if (text.length > 20) {
        return `Text("${text}", font_size=32)`;
      }
      return `Text("${text}", font_size=36)`;
    })

    // Ensure educational color coding
    .replace(/\.set_color\((BLUE|GREEN|RED|PURPLE|ORANGE)\)/g,
             (match, color) => `.set_color(${color})`); // Keep existing colors

  // Validate structure
  if (!/class \w+\(Scene\):/.test(fixedCode)) {
    throw new Error("No valid Scene class found in the generated code");
  }

  if (!/def construct\(self\):/.test(fixedCode)) {
    throw new Error("No construct method found in the Scene class");
  }

  // Educational validation: Ensure minimum educational elements are present
  const textElements = (fixedCode.match(/Text\(/g) || []).length;
  const mathElements = (fixedCode.match(/MathTex\(/g) || []).length;
  const waitElements = (fixedCode.match(/self\.wait\(/g) || []).length;
  const playElements = (fixedCode.match(/self\.play\(/g) || []).length;

  if (textElements < 2) {
    console.warn("⚠️  Low text elements detected. Adding educational text placeholder.");
    // This is a warning, not an error, as the AI might handle this in the prompt
  }

  if (waitElements < 3) {
    console.warn("⚠️  Low wait elements detected. Educational pacing may be rushed.");
  }

  // Calculate final estimated duration
  const finalWaitCalls = fixedCode.match(/self\.wait\(([^)]+)\)/g);
  const finalTotalWait = finalWaitCalls ? finalWaitCalls.reduce((sum, call) => {
    const match = call.match(/self\.wait\(([^)]+)\)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0) : 0;

  const finalEstimatedDuration = finalTotalWait + (playElements * 1.5);

  console.log(`📊 Educational validation: ${textElements} text elements, ${mathElements} math elements`);
  console.log(`⏱️  Final Duration Estimate: ${finalEstimatedDuration.toFixed(1)} seconds (${playElements} animations + ${finalTotalWait.toFixed(1)}s waits)`);
  console.log(`✅ 28-Second Target Status: ${finalEstimatedDuration >= 26 && finalEstimatedDuration <= 32 ? 'ACHIEVED' : 'NEEDS ADJUSTMENT'}`);

  // Ensure proper indentation
  const lines = fixedCode.split("\n");
  const properlyIndentedLines = [];
  let inClass = false;
  let inMethod = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      properlyIndentedLines.push("");
      continue;
    }

    // Check for class definition
    if (trimmedLine.startsWith("class ") && trimmedLine.includes("(Scene):")) {
      inClass = true;
      inMethod = false;
      properlyIndentedLines.push(trimmedLine);
      continue;
    }

    // Check for method definition within class
    if (inClass && trimmedLine.startsWith("def ")) {
      inMethod = true;
      properlyIndentedLines.push("    " + trimmedLine);
      continue;
    }

    // Handle indentation based on context
    if (inMethod) {
      properlyIndentedLines.push("        " + trimmedLine);
    } else if (inClass) {
      properlyIndentedLines.push("    " + trimmedLine);
    } else {
      properlyIndentedLines.push(trimmedLine);
    }
  }

  // Join lines back into a string
  fixedCode = properlyIndentedLines.join("\n");

  // Check if there are self.wait() calls in the code, and add them if needed
  // This is crucial for rendering videos properly
  if (!fixedCode.includes("self.wait(")) {
    // Find the end of the construct method to add a wait call
    const constructPattern =
      /def construct\(self\):[\s\S]*?\n(\s+)(?:[^\n]*$|$)/;
    const match = fixedCode.match(constructPattern);

    if (match) {
      const indentation = match[1];
      // Add a wait call at the end of the construct method
      fixedCode = fixedCode.replace(
        constructPattern,
        `def construct(self):\n$&\n${indentation}# Ensure we have enough time to render the final state\n${indentation}self.wait(2)`
      );
    }
  }

  // Fix duplicate construct method definitions
  fixedCode = fixedCode.replace(
    /def construct\(self\):\s*\n\s*def construct\(self\):/g,
    "def construct(self):"
  );

  // Enhanced educational timing: Add strategic wait calls for better comprehension
  const playLines = fixedCode.match(/self\.play\(.*?\)/g);
  if (playLines && playLines.length > 0) {
    // Categorize animations for different timing strategies
    let animationIndex = 0;
    for (const playLine of playLines) {
      const playLineEscaped = playLine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const hasWaitAfterPlay = new RegExp(
        `${playLineEscaped}[\\s\\S]*?self\\.wait\\(`,
        "m"
      ).test(fixedCode);

      if (!hasWaitAfterPlay) {
        // 28-second optimized educational timing strategy
        let waitTime = "2.2"; // Optimized default for 28-second videos

        // Adjust timing based on animation type for optimal 28-second pacing
        if (playLine.includes("animate") || playLine.includes("Transform") || playLine.includes("ReplacementTransform")) {
          waitTime = "2.8"; // Balanced pause for complex transformations
        } else if (playLine.includes("FadeIn") || playLine.includes("Write")) {
          waitTime = "2.4"; // Medium pause for introductions (optimized for pacing)
        } else if (playLine.includes("Create") || playLine.includes("DrawBorderThenFill")) {
          waitTime = "3.2"; // Moderate pause for step-by-step constructions
        } else if (playLine.includes("FadeOut") || playLine.includes("Uncreate")) {
          waitTime = "1.6"; // Shorter pause for transitions
        }

        fixedCode = fixedCode.replace(
          playLineEscaped,
          `${playLine}\n        # 28-second optimized educational pause\n        self.wait(${waitTime})`
        );
      }
      animationIndex++;
    }
  }

  // Ensure 28-second video duration with optimal educational pacing
  const waitCalls = fixedCode.match(/self\.wait\(([^)]+)\)/g);
  if (waitCalls) {
    const totalWaitTime = waitCalls.reduce((sum, call) => {
      const match = call.match(/self\.wait\(([^)]+)\)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);

    // Count animation calls to estimate total video duration
    const playCalls = fixedCode.match(/self\.play\(/g) || [];
    const animationCount = playCalls.length;

    // Estimate animation duration (each play call typically takes 1-2 seconds)
    const estimatedAnimationTime = animationCount * 1.5;

    // Total estimated video duration
    const estimatedTotalDuration = totalWaitTime + estimatedAnimationTime;

    console.log(`⏱️  Video Duration Analysis: ${animationCount} animations (${estimatedAnimationTime.toFixed(1)}s) + ${totalWaitTime.toFixed(1)}s waits = ${estimatedTotalDuration.toFixed(1)}s total`);

    // Adjust timing to reach 28-second target
    if (estimatedTotalDuration < 26) {
      const timeNeeded = 28 - estimatedTotalDuration;
      console.log(`📈 Extending video duration by ${timeNeeded.toFixed(1)} seconds to reach 28-second target`);

      // Distribute additional time across existing wait calls
      let timeDistributed = 0;
      const waitReplacements = waitCalls.map((call, index) => {
        const match = call.match(/self\.wait\(([^)]+)\)/);
        if (match) {
          const currentWait = parseFloat(match[1]);
          const additionalTime = index === waitCalls.length - 1 ?
            timeNeeded - timeDistributed : // Add remaining time to last wait
            Math.min(timeNeeded * 0.3, 2.0); // Distribute across earlier waits

          timeDistributed += additionalTime;
          const newWait = Math.min(currentWait + additionalTime, 4.0); // Cap at 4 seconds

          return {
            original: call,
            replacement: `self.wait(${newWait.toFixed(1)})`
          };
        }
        return null;
      }).filter(Boolean);

      // Apply the replacements
      waitReplacements.forEach((item) => {
        if (item) {
          const escapedOriginal = item.original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          fixedCode = fixedCode.replace(new RegExp(escapedOriginal, 'g'), item.replacement);
        }
      });

      // If still short, add final wait
      if (timeDistributed < timeNeeded) {
        const finalWaitTime = timeNeeded - timeDistributed;
        fixedCode = fixedCode.replace(
          /self\.wait\([^)]+\)$/m,
          `self.wait(${finalWaitTime.toFixed(1)})\n        # Final extension to reach 28-second target\n        self.wait(${Math.max(0, finalWaitTime - 2).toFixed(1)})`
        );
      }

    } else if (estimatedTotalDuration > 32) {
      console.log(`⚡ Video too long (${estimatedTotalDuration.toFixed(1)}s), optimizing for 28-second target`);

      // Reduce excessive wait times
      fixedCode = fixedCode.replace(/self\.wait\((4\.?\d*)\)/g, (match, time) => {
        const reducedTime = Math.max(2.0, parseFloat(time) * 0.7);
        return `self.wait(${reducedTime.toFixed(1)})`;
      });
    }
  }

  return fixedCode;
}

export { manimCodeSchema };
