from orchestrator import discuss_feature, review_code, design_component

# Test the orchestrator with a specific feature
discuss_feature("""
I need help implementing the PDF annotation feature:
1. Users should be able to draw rectangles on specific areas
2. Each annotation needs a comment/description
3. Annotations should be saved to Supabase
4. Support real-time updates when others add annotations
""")

# You can also use it to review specific code
# review_code("your code here", "context about the code")

# Or get help designing a new component
# design_component("description of the component you need")