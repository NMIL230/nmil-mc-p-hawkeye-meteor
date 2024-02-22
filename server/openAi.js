import axios from 'axios';
import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';

const openAiSecretKey = process.env.OPENAI_SECRET_KEY;

const OPENAI_API_BASE = "https://openai-biomedical-prod.openai.azure.com/";
const OPENAI_API_VERSION = "2023-07-01-preview";
const OPENAI_API_Type = "azure";
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint = "https://openai-biomedical-prod.openai.azure.com/";
// const azureApiKey = process.env["AZURE_OPENAI_KEY"] ;

Meteor.methods({
  async getChatGPTCheck() {
    try{
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
        { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI" },
        { role: "user", content: "Do other Azure AI services support this too" },
      ];
      const client = new OpenAIClient(endpoint, new AzureKeyCredential("e409ce30e8914a478912497601f58624"));
      const deploymentId = "gpt4";
      const result = await client.getChatCompletions(deploymentId, messages);
      for (const choice of result.choices) {
        console.log(choice.message);
      }
      return result.choices.map(choice => choice.message.content).join('\n');
    }
    catch (error) {
      console.error('OpenAI API error:', error);
      throw new Meteor.Error('api-error', 'OpenAI API error');
    }

  },

  async getChatGPTResponse(input) {
    try {
      const response = await axios.post("https://openai-biomedical-prod.openai.azure.com/openai/deployments/gpt4/chat/completions?api-version=2023-07-01-preview ", {
        messages: [{ role: 'system', content: input }],
        model: 'gpt-4',
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          'api-key': `e409ce30e8914a478912497601f58624`,
          'Content-Type': 'application/json',
        }
      });
      // console.log(response.data.choices[0].message)
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Meteor.Error('api-error', 'OpenAI API error');
    }
  }
});
