/* eslint-disable max-len */
import { z } from 'zod';
import type { ZodError } from 'zod';
import { EModelEndpoint, eModelEndpointSchema, KnownEndpoints } from './schemas';
import { fileConfigSchema } from './file-config';
import { specsConfigSchema } from './models';
import { FileSources } from './types/files';
import { TModelsConfig } from './types';

const sharedOpenAIModels = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'gpt-4-turbo',
  'gpt-4-turbo-2024-04-09',
  'gpt-4-0125-preview',
  'gpt-4-turbo-preview',
  'gpt-4-1106-preview',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k-0314',
  'gpt-4-0613',
  'gpt-3.5-turbo-0613',
];

const sharedAnthropicModels = [
  'claude-3-5-haiku-20241022',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-latest',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-2.1',
  'claude-2',
  'claude-1.2',
  'claude-1',
  'claude-1-100k',
  'claude-instant-1',
  'claude-instant-1-100k',
];

export const bedrockModels = [
  'anthropic.claude-3-5-sonnet-20241022-v2:0',
  'anthropic.claude-3-5-sonnet-20240620-v1:0',
  'anthropic.claude-3-haiku-20240307-v1:0',
  'anthropic.claude-3-opus-20240229-v1:0',
  'anthropic.claude-3-sonnet-20240229-v1:0',
  'anthropic.claude-v2',
  'anthropic.claude-v2:1',
  'anthropic.claude-instant-v1',
  'cohere.command-r-v1:0',
  'cohere.command-r-plus-v1:0',
  'meta.llama2-13b-chat-v1',
  'meta.llama2-70b-chat-v1',
  'meta.llama3-8b-instruct-v1:0',
  'meta.llama3-70b-instruct-v1:0',
  'meta.llama3-1-8b-instruct-v1:0',
  'meta.llama3-1-70b-instruct-v1:0',
  'meta.llama3-1-405b-instruct-v1:0',
  'mistral.mistral-7b-instruct-v0:2',
  'mistral.mixtral-8x7b-instruct-v0:1',
  'mistral.mistral-large-2402-v1:0',
  'mistral.mistral-large-2407-v1:0',
  'mistral.mistral-small-2402-v1:0',
  'ai21.jamba-instruct-v1:0',
  'amazon.titan-text-lite-v1',
  'amazon.titan-text-express-v1',
  'amazon.titan-text-premier-v1:0',
];

export const defaultModels = {
  [EModelEndpoint.cicero]: ['cicero-3-0'],
  [EModelEndpoint.azureAssistants]: sharedOpenAIModels,
  [EModelEndpoint.assistants]: ['chatgpt-4o-latest', ...sharedOpenAIModels],
  [EModelEndpoint.agents]: sharedOpenAIModels,
  [EModelEndpoint.google]: [
    'gemini-pro',
    'gemini-pro-vision',
    'chat-bison',
    'chat-bison-32k',
    'codechat-bison',
    'codechat-bison-32k',
    'text-bison',
    'text-bison-32k',
    'text-unicorn',
    'code-gecko',
    'code-bison',
    'code-bison-32k',
  ],
  [EModelEndpoint.anthropic]: sharedAnthropicModels,
  [EModelEndpoint.openAI]: [
    'chatgpt-4o-latest',
    ...sharedOpenAIModels,
    'gpt-4-vision-preview',
    'gpt-3.5-turbo-instruct-0914',
    'gpt-3.5-turbo-instruct',
  ],
  [EModelEndpoint.bedrock]: bedrockModels,
};

const filterAssistantModels = (str: string) => {
  return /gpt-4|gpt-3\.5/i.test(str) && !/vision|instruct/i.test(str);
};

const openAIModels = defaultModels[EModelEndpoint.openAI];

export const defaultEndpoints: EModelEndpoint[] = [
  EModelEndpoint.cicero,
  EModelEndpoint.openAI,
  EModelEndpoint.assistants,
  EModelEndpoint.azureAssistants,
  EModelEndpoint.azureOpenAI,
  EModelEndpoint.agents,
  EModelEndpoint.bingAI,
  EModelEndpoint.chatGPTBrowser,
  EModelEndpoint.gptPlugins,
  EModelEndpoint.google,
  EModelEndpoint.anthropic,
  EModelEndpoint.custom,
  EModelEndpoint.bedrock,
];

export const alternateName = {
  [EModelEndpoint.cicero]: 'Cicero',
  [EModelEndpoint.openAI]: 'OpenAI',
  [EModelEndpoint.assistants]: 'Assistants',
  [EModelEndpoint.agents]: 'Agents',
  [EModelEndpoint.azureAssistants]: 'Azure Assistants',
  [EModelEndpoint.azureOpenAI]: 'Azure OpenAI',
  [EModelEndpoint.bingAI]: 'Bing',
  [EModelEndpoint.chatGPTBrowser]: 'ChatGPT',
  [EModelEndpoint.gptPlugins]: 'Plugins',
  [EModelEndpoint.google]: 'Google',
  [EModelEndpoint.anthropic]: 'Anthropic',
  [EModelEndpoint.custom]: 'Custom',
  [EModelEndpoint.bedrock]: 'AWS Bedrock',
  [KnownEndpoints.ollama]: 'Ollama',
};

export const initialModelsConfig: TModelsConfig = {
  initial: [],
  [EModelEndpoint.cicero]: ['cicero-3-0'],
  [EModelEndpoint.openAI]: openAIModels,
  [EModelEndpoint.assistants]: openAIModels.filter(filterAssistantModels),
  [EModelEndpoint.agents]: openAIModels,
  [EModelEndpoint.gptPlugins]: openAIModels,
  [EModelEndpoint.azureOpenAI]: openAIModels,
  [EModelEndpoint.bingAI]: ['BingAI', 'Sydney'],
  [EModelEndpoint.chatGPTBrowser]: ['text-davinci-002-render-sha'],
  [EModelEndpoint.google]: defaultModels[EModelEndpoint.google],
  [EModelEndpoint.anthropic]: defaultModels[EModelEndpoint.anthropic],
  [EModelEndpoint.bedrock]: defaultModels[EModelEndpoint.bedrock],
};

export const EndpointURLs: { [key in EModelEndpoint]: string } = {
  [EModelEndpoint.cicero]: 'https://api.runpod.ai/v2/vllm-mbmzi1dxmcu1g1/openai/v1',
  [EModelEndpoint.openAI]: `/api/ask/${EModelEndpoint.openAI}`,
  [EModelEndpoint.bingAI]: `/api/ask/${EModelEndpoint.bingAI}`,
  [EModelEndpoint.google]: `/api/ask/${EModelEndpoint.google}`,
  [EModelEndpoint.custom]: `/api/ask/${EModelEndpoint.custom}`,
  [EModelEndpoint.anthropic]: `/api/ask/${EModelEndpoint.anthropic}`,
  [EModelEndpoint.gptPlugins]: `/api/ask/${EModelEndpoint.gptPlugins}`,
  [EModelEndpoint.azureOpenAI]: `/api/ask/${EModelEndpoint.azureOpenAI}`,
  [EModelEndpoint.chatGPTBrowser]: `/api/ask/${EModelEndpoint.chatGPTBrowser}`,
  [EModelEndpoint.azureAssistants]: '/api/assistants/v1/chat',
  [EModelEndpoint.assistants]: '/api/assistants/v2/chat',
  [EModelEndpoint.agents]: `/api/${EModelEndpoint.agents}/chat`,
  [EModelEndpoint.bedrock]: `/api/${EModelEndpoint.bedrock}/chat`,
};

// Rest of the file remains unchanged...
