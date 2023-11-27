import axios from 'axios';
import { Meteor } from 'meteor/meteor';
import OpenAI from 'openai';
const openAiSecretKey = process.env.OPENAI_SECRET_KEY;

Meteor.methods({
  async getChatGPTList() {
    try {
      const openai = new OpenAI({
        apiKey: openAiSecretKey
      });
      // const response = await openai.createCompletion({
      //   model: "gpt-4", // 指定模型为 GPT-4
      //   prompt: promptText, // 你的输入文本
      //   max_tokens: 150, // 或者你想要的令牌数量
      //   // 可以根据需要添加更多参数，如 temperature, n, stop 等
      // });
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-4',
      });
      return chatCompletion
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Meteor.Error('api-error', 'OpenAI API error');
    }

  },
  async getChatGPTResponse(input) {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: input,
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${openAiSecretKey}`
        }
      });

      return response.data.choices[0].text;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Meteor.Error('api-error', 'OpenAI API error');
    }
  }
});
