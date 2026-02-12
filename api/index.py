"""
Main entry point for Vercel deployment
Routes all API requests to the FastAPI backend
"""
import sys
import os

# Set up path for imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

backend_path = os.path.join(project_root, "Backend")
sys.path.insert(0, backend_path)

# Mark as production environment
os.environ['ENVIRONMENT'] = 'production'

try:
    # Import the FastAPI app for Vercel
    from Backend.main import app
    
    # Export as 'app' for Vercel Python runtime
    # Vercel's Python runtime auto-detects 'app' variable
    
    print("✓ Vercel serverless function initialized successfully", flush=True)
    
except ImportError as e:
    print(f"✗ Import Error: Missing dependency - {e}", flush=True)
    raise
except Exception as e:
    print(f"✗ Fatal Error during initialization: {e}", flush=True)
    import traceback
    traceback.print_exc()
    raise
