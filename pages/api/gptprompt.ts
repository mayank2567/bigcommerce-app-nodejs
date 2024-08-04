import { NextApiRequest, NextApiResponse } from 'next';
import { bigcommerceClient, getSession } from '../../lib/auth';
import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-o67YTle37XghnvhMKVo0JM0k",
    apiKey: process.env.GPT_KEY,
});

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const safetySettings = [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE'
    },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE'
    }
  ];
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySettings,

  });
  // remove safty settings
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
        
  };
export default async function gptdescription(req: NextApiRequest, res: NextApiResponse) {
    try {
        debugger
        const { accessToken, storeHash } = await getSession(req);
        const bigcommerce = bigcommerceClient(accessToken, storeHash);
debugger
        // let data = {'data': 'dummy data'};
        // let data = await openai.completions.create({
        //     model: "text-curie-001",
        //     prompt: req.query.prompt,
        //     max_tokens: 100,
        //     temperature: 0.7,
        // });
        const chatSession = model.startChat({
            generationConfig,
         // safetySettings: Adjust safety settings
         // See https://ai.google.dev/gemini-api/docs/safety-settings
            history: [
            ],
          });
        
          const result = await chatSession.sendMessage(req.body.prompt);
            let data = result.response.text();
        //   console.log(result.response.text());
        // data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
            // replace ** with ''
            data = data.replace(/\*\*/g, '');
        res.status(200).json({ data });
    } catch (error) {
        const { message, response } = error;
        res.status(response?.status || 500).json({ message });
    }
}
