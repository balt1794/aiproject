//Author: Bryam Loaiza

import { POST } from "@/app/api/analyze-image/route";

describe('API Logic', () => {
    test('handles valid input and returns response', async () => {
        const requestMock = {
            json: jest.fn().mockResolvedValueOnce({ image: 'base64-image-data' }),
        } as unknown as Request;

        const response = await POST(requestMock as Request);

        // Assert response status
        expect(response.status).toBe(200);

        // Mock response stream
        const responseStream = {
            read: async () => ({ done: true, value: undefined }),
        };

        // Mock OpenAI API
        const openaiMock = {
            createChatCompletion: jest.fn().mockResolvedValueOnce(responseStream),
        };

        jest.mock('openai-edge', () => ({
            Configuration: jest.fn(),
            OpenAIApi: jest.fn(() => openaiMock),
            OpenAIStream: jest.fn(),
            StreamingTextResponse: jest.fn(),
        }));
    });

    test('handles missing image data in the request', async () => {
        const requestMock = {
            json: jest.fn().mockResolvedValueOnce({}),
        } as unknown as Request;

        const response = await POST(requestMock as Request);

        // Assert response status
        expect(response.status).toBe(400);
    });

    test('handles internal server error', async () => {
        const requestMock = {
            json: jest.fn().mockRejectedValueOnce('Some error'),
        } as unknown as Request;

        const response = await POST(requestMock as Request);

        // Assert response status
        expect(response.status).toBe(500);
    });
});
