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
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
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
        
          const result = await chatSession.sendMessage(`Add with html tags line ul li br h1 h2 p etc for formatting to be to be redered on website, Enrich plagiarism free persuasive product description for 
            "${req.body.prompt}" with model number "WALGWP-INFM".
            The description should demonstrate Expertise, Authoritativeness and Trustworthiness. The description should be comprehensive and should have a transactional intent. The description should be in an engaging format. Highlight Key features, offer detailed specifications, include factual ballistics and performance analysis. Add sections such as Overview, Key Features, Detailed Specifications with actual values, Ballistics and Performance Analysis, Benefits of this particular ammunition, Usage scenarios of this ammunition, Compatibility, Quality Assurance followed by the manufacturer, Accuracy and Precision metrics of this ammunition and Finally Expert Insights. To allow the product description is detailed enough, please include any other external information that may not be requested here to reach to a total word length of at least 1500 words and maximum of 3000 words. Include a compelling call to action encouraging customers to purchase now!`);
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
