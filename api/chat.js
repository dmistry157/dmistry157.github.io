import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  // 1. Read your messages from the request body
  const { messages } = req.body || {};

  if (!messages) {
    return res.status(400).json({ error: "No messages provided." });
  }

  // 2. Set up OpenAI with your API key
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // store your key in Vercel environment variable
  });
  const openai = new OpenAIApi(configuration);

  try {
    // 3. Call the OpenAI Chat Completion endpoint
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or gpt-4 if you have access
      messages, 
      // Optionally add a system message to define your bot’s style:
      // messages: [
      //   { role: "system", content: "You are an orange-and-black themed chatbot." },
      //   ...messages
      // ],
      max_tokens: 200, 
      temperature: 0.7, 
    });

    // 4. Extract the assistant's reply
    const reply = response.data.choices[0].message.content;

    // 5. Send the reply back to the client
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI." });
  }
}
