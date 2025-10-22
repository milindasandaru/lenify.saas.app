import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

type Voices = typeof voices;
type GenderKey = keyof Voices; // 'male' | 'female'
type StyleKey = keyof Voices[GenderKey]; // 'casual' | 'formal'

export interface ElevenLabsVoiceConfig {
  provider: "11labs";
  voiceId: string;
  stability: number;
  similarityBoost: number;
  speed: number;
  style: number;
  useSpeakerBoost: boolean;
}

export type AssistantWithVoice = CreateAssistantDTO & {
  voice?: ElevenLabsVoiceConfig;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (
  subject: string,
  topic: string,
  voice: string,
  style: string
): AssistantWithVoice => {
  const gender = voice as GenderKey;
  const styleKey = style as StyleKey;
  const voiceGroup = voices[gender];
  const voiceId = voiceGroup ? voiceGroup[styleKey] : undefined;

  // Build a minimal, broadly-compatible assistant config.
  const base: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      `Hello, let's start the session. Today we'll be talking about ${topic}.`,
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

- Stick to the given topic - ${topic} and subject - ${subject} and teach the student about it.
- Keep the conversation flowing smoothly while maintaining control.
- Occasionally confirm the student is following along.
- Break down the topic into smaller parts and teach step by step.
- Keep your style of conversation ${style}.
- Keep responses short for a real-time voice conversation.
- Do not include any special characters in your responses.
          `,
        },
      ],
    },
  };

  // Only set voice if it looks like a valid ElevenLabs voice id (avoid simple names like 'sarah').
  if (voiceId && /[A-Za-z0-9]{10,}/.test(String(voiceId))) {
    const withVoice: AssistantWithVoice = {
      ...base,
      voice: {
        provider: "11labs",
        voiceId,
        stability: 0.4,
        similarityBoost: 0.8,
        speed: 1,
        style: 0.5,
        useSpeakerBoost: true,
      },
    };
    return withVoice;
  }

  return base as AssistantWithVoice;
};