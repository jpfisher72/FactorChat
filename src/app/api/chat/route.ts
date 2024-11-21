import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

type message = {
  'display text': string //how to parse markdown?
  'files': {description: string, url: string}[]
  'figures': {type: string, data: {}}[] //Need to give felix the format of dat this needs
}

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