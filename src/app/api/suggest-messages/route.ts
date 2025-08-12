import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
	const model = google("gemini-2.5-flash");
	const prompt =
		"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

	try {
		const { text } = await generateText({
			model,
			prompt,
			providerOptions: {
				google: {
					safetySettings: [
						{
							category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
							threshold: "BLOCK_LOW_AND_ABOVE",
						},
					],
					responseModalities: ["TEXT"],
				},
			},
		});

		return Response.json(
			{
				success: true,
				text,
			},
			{ status: 200 }
		);
	} catch {
		return Response.json(
			{
				success: false,
				message: "Failed to generate suggestions",
			},
			{ status: 500 }
		);
	}
}
