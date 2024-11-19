import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages)

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      // {role: "system", content: "You are a helpful assistant who answers questions"},
      ...messages
    ],
  });

  return result.toDataStreamResponse();
}