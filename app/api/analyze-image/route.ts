import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Define the runtime
export const runtime = 'edge';

// Create configuration object with OpenAI API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "", 
});

// Create an instance of OpenAIApi
const openai = new OpenAIApi(configuration);

//Define route handler for the POST request to /api/analyze-image
export async function POST(request: Request) {
    try {
        // Extract the image data from the request body
        const { image } = await request.json();

        // Check if the image data is valid
        if (!image) {
            return new Response("Invalid input: Image data is missing", { status: 400 });
        }

        // Make a request to OpenAI API for image analysis
        const response = await openai.createChatCompletion({
            model: "gpt-4-vision-preview",
            stream: true,
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    //@ts-ignore
                    content: [
                        { type: "text", text: "Give me a description of this image" },
                        {
                            type: "image_url",
                            image_url: image
                        }
                    ]
                }
            ]
        });

        // Create a streaming text response
        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error in API logic:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}