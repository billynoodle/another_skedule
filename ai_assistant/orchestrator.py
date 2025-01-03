import os
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from autogen.agentchat.contrib.agent_builder import AgentBuilder
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration for the agents
llm_config = {
    'config_list': [{
        'model': 'claude-3-5-sonnet-20241022',
        'api_key': os.getenv('ANTHROPIC_API_KEY')
    }]
}

# Create specialized agents for your tech stack
project_manager = AssistantAgent(
    name="project_manager",
    llm_config=llm_config,
    system_message="""You are a project manager specialized in React/TypeScript applications with expertise in:
    1. Construction plan viewing applications
    2. PDF handling and manipulation with react-pdf and fabric.js
    3. Supabase integration for data storage
    4. State management with Zustand
    5. UI components with Tailwind CSS
    
    Your role is to:
    1. Understand feature requirements
    2. Break down tasks into manageable components
    3. Coordinate between different specialists
    4. Provide clear, non-technical updates
    5. Ensure best practices in React/TypeScript development
    
    Focus on concrete, actionable insights. Avoid meta-discussions about being an AI. End your response when the technical discussion is complete.
    """
)

react_specialist = AssistantAgent(
    name="react_specialist",
    llm_config=llm_config,
    system_message="""You are a React/TypeScript specialist who:
    1. Creates reusable React components
    2. Implements PDF viewing with react-pdf
    3. Handles canvas manipulation with fabric.js
    4. Manages complex state with Zustand
    5. Implements drag-and-drop with @dnd-kit/core
    6. Follows TypeScript best practices
    
    Focus on technical implementation details and code architecture. Avoid meta-discussions about being an AI.
    If the technical discussion is complete, end your response with 'DISCUSSION_COMPLETE'.
    """
)

supabase_specialist = AssistantAgent(
    name="supabase_specialist",
    llm_config=llm_config,
    system_message="""You are a Supabase specialist who:
    1. Designs efficient database schemas
    2. Implements user authentication
    3. Creates optimized database queries
    4. Sets up real-time subscriptions
    5. Manages PDF file storage
    6. Handles concurrent annotations
    
    Focus on database design, queries, and real-time features. Avoid meta-discussions about being an AI.
    If the technical discussion is complete, end your response with 'DISCUSSION_COMPLETE'.
    """
)

ui_specialist = AssistantAgent(
    name="ui_specialist",
    llm_config=llm_config,
    system_message="""You are a UI/UX specialist who:
    1. Creates responsive layouts with Tailwind CSS
    2. Designs intuitive PDF viewing interfaces
    3. Implements accessible annotation tools
    4. Optimizes for different screen sizes
    5. Creates smooth zoom/pan experiences
    
    Focus on user interface design and implementation details. Avoid meta-discussions about being an AI.
    If the technical discussion is complete, end your response with 'DISCUSSION_COMPLETE'.
    """
)

# Create a user proxy for interaction
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    system_message="""Your role is to initiate and oversee technical discussions.
    End the conversation when you see 'DISCUSSION_COMPLETE' or when the technical discussion naturally concludes."""
)

def discuss_feature(feature_description):
    """Start a discussion about implementing a new feature."""
    try:
        # Initialize a group chat with all specialists
        groupchat = GroupChat(
            agents=[project_manager, react_specialist, supabase_specialist, ui_specialist],
            messages=[],
            max_round=8  # Limit the number of rounds to avoid endless discussions
        )
        
        manager = GroupChatManager(groupchat=groupchat)
        
        # Start the discussion
        user_proxy.initiate_chat(
            manager,
            message=f"""Please analyze and break down this feature request:
            {feature_description}
            
            Provide:
            1. Technical requirements
            2. Component breakdown
            3. Database schema updates
            4. UI/UX considerations
            5. Implementation steps
            6. Potential challenges
            
            End the discussion when all key points have been addressed.
            """
        )
    except Exception as e:
        print(f"Error during feature discussion: {str(e)}")
        raise

def review_code(code_snippet, context=""):
    """Review a specific piece of code."""
    try:
        # Create a focused chat for code review
        react_specialist.initiate_chat(
            user_proxy,
            message=f"""Please review this code in the context of our construction plan viewer:
            
            Context: {context}
            
            Code:
            ```
            {code_snippet}
            ```
            
            Provide:
            1. Code quality assessment
            2. Potential improvements
            3. Performance considerations
            4. TypeScript type safety checks
            5. Best practices alignment
            """
        )
    except Exception as e:
        print(f"Error during code review: {str(e)}")
        raise

def design_component(component_description):
    """Get help designing a new component."""
    try:
        # Create a focused chat for component design
        groupchat = GroupChat(
            agents=[react_specialist, ui_specialist],
            messages=[],
            max_round=6  # Limit rounds for focused component design
        )
        
        manager = GroupChatManager(groupchat=groupchat)
        
        user_proxy.initiate_chat(
            manager,
            message=f"""Please help design this component:
            {component_description}
            
            Provide:
            1. Component structure
            2. TypeScript interfaces
            3. State management approach
            4. UI/UX considerations
            5. Example implementation
            
            End the discussion when the design is complete.
            """
        )
    except Exception as e:
        print(f"Error during component design: {str(e)}")
        raise

if __name__ == "__main__":
    # Test feature request
    test_feature = """
    We need to implement a new feature that allows users to:
    1. Upload construction plans in PDF format
    2. Add annotations to specific areas
    3. Save annotations to Supabase in real-time
    4. Share annotated plans with other users
    5. Support concurrent editing
    """
    discuss_feature(test_feature)