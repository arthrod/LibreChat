import os

def insert_exports_at_top(file_path):
    """Insert exports at the top of the file while preserving the rest."""
    try:
        # Read existing content
        with open(file_path, 'r') as f:
            existing_content = f.read()

        # Define the exports we need to add
        exports_to_add = """import type { AssistantsEndpoint } from './schemas';
import { EModelEndpoint, KnownEndpoints } from './schemas';

export const modularEndpoints = [
  EModelEndpoint.openAI,
  EModelEndpoint.assistants,
  EModelEndpoint.azureAssistants,
  EModelEndpoint.azureOpenAI,
  EModelEndpoint.bingAI,
  EModelEndpoint.anthropic,
  EModelEndpoint.google,
  EModelEndpoint.gptPlugins,
  EModelEndpoint.custom,
];

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

export const defaultAssistantsVersion = {
  [EModelEndpoint.assistants as AssistantsEndpoint]: 'v2',
  [EModelEndpoint.azureAssistants as AssistantsEndpoint]: 'v1',
};

export const alternateName = {
  [EModelEndpoint.cicero]: 'Cicero',
  [EModelEndpoint.openAI]: 'OpenAI',
  [EModelEndpoint.assistants as AssistantsEndpoint]: 'Assistants',
  [EModelEndpoint.agents]: 'Agents',
  [EModelEndpoint.azureAssistants as AssistantsEndpoint]: 'Azure Assistants',
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

export const EndpointURLs = {
  [EModelEndpoint.cicero]: 'https://api.runpod.ai/v2/vllm-mbmzi1dxmcu1g1/openai/v1',
  [EModelEndpoint.openAI]: `/api/ask/${EModelEndpoint.openAI}`,
  [EModelEndpoint.bingAI]: `/api/ask/${EModelEndpoint.bingAI}`,
  [EModelEndpoint.google]: `/api/ask/${EModelEndpoint.google}`,
  [EModelEndpoint.custom]: `/api/ask/${EModelEndpoint.custom}`,
  [EModelEndpoint.anthropic]: `/api/ask/${EModelEndpoint.anthropic}`,
  [EModelEndpoint.gptPlugins]: `/api/ask/${EModelEndpoint.gptPlugins}`,
  [EModelEndpoint.azureOpenAI]: `/api/ask/${EModelEndpoint.azureOpenAI}`,
  [EModelEndpoint.chatGPTBrowser]: `/api/ask/${EModelEndpoint.chatGPTBrowser}`,
  [EModelEndpoint.azureAssistants as AssistantsEndpoint]: '/api/assistants/v1/chat',
  [EModelEndpoint.assistants as AssistantsEndpoint]: '/api/assistants/v2/chat',
  [EModelEndpoint.agents]: `/api/${EModelEndpoint.agents}/chat`,
  [EModelEndpoint.bedrock]: `/api/${EModelEndpoint.bedrock}/chat`,
};

export const isAgentsEndpoint = (endpoint: string) => {
  return endpoint === EModelEndpoint.agents;
};
"""

        # Find the start of initialModelsConfig
        init_models_start = existing_content.find('export const initialModelsConfig')
        if init_models_start == -1:
            init_models_start = existing_content.find('const initialModelsConfig')

        if init_models_start != -1:
            # Combine new exports with existing initialModelsConfig
            new_content = exports_to_add + '\n' + existing_content[init_models_start:]
            
            # Write the combined content
            with open(file_path, 'w') as f:
                f.write(new_content)
            
            print(f'Successfully updated {file_path}')
            return True
        else:
            print('Could not find initialModelsConfig in the file')
            return False

    except Exception as e:
        print(f'Error updating {file_path}: {e!s}')
        return False

if __name__ == '__main__':
    config_path = 'packages/data-provider/src/config.ts'
    insert_exports_at_top(config_path)
