import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

const google = createGoogleGenerativeAI()
const openai = createOpenAI()
openai("gpt-3.5-turbo")

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ step }) => {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google('gemini-2.5-flash'),
                system: 'You are a helpful assistant that can generate text.',
                prompt: 'Write a vegetarian lasagna recipe for 4 people.',
                experimental_telemetry: {
                    isEnabled: true,
                    functionId: "Gemini-generate-text",
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        const { steps: opneAiSteps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-3.5-turbo"),
                system: 'You are a helpful assistant that can generate text.',
                prompt: 'Write a vegetarian lasagna recipe for 4 people.',
                experimental_telemetry: {
                    isEnabled: true,
                    functionId: "OpenAI-generate-text",
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        return {
            gemini: steps,
            openai: opneAiSteps,
        }
    }
);