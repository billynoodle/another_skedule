import os
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration for the agents using Anthropic API
llm_config = {
    'config_list': [{
        'model': 'claude-3-5-sonnet-20241022',
        'api_key': os.getenv('ANTHROPIC_API_KEY'),
        'api_provider': 'anthropic'  # Specify Anthropic as provider
    }]
}

# Rest of the code remains the same...
