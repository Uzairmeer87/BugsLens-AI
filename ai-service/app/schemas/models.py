from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CodeAnalysisRequest(BaseModel):
    project_id: Optional[str] = None
    file_path: str = Field(..., description="File path within project")
    content: str = Field(..., description="Source code content")
    language: Optional[str] = "typescript"

class DetectedIssue(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    severity: str = Field(..., description="critical | high | medium | low")
    priority: str = Field("medium", description="critical | high | medium | low")
    category: str = Field(..., description="bug | security | performance | code_smell | vulnerability")
    line: int
    code_snippet: str
    confidence: float
    suggested_fix: Optional[str] = None
    root_cause: Optional[str] = None

class CodeAnalysisResponse(BaseModel):
    status: str = "completed"
    file_path: str
    quality_score: int
    maintainability_score: int
    reliability_score: int
    security_score: int
    performance_score: int
    testability_score: int
    issues: List[DetectedIssue]
    total_lines: int
    metrics: Dict[str, Any] = {}
    is_demo: bool = False

class TestGenerationRequest(BaseModel):
    project_id: Optional[str] = None
    function_name: Optional[str] = None
    file_path: Optional[str] = None
    code_snippet: Optional[str] = None
    feature_description: Optional[str] = None
    test_types: List[str] = ["functional", "boundary", "negative", "security"]

class GeneratedTestCase(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    type: str
    preconditions: str
    steps: List[str]
    expected_result: str
    generated_by_ai: bool = True
    code_sample: Optional[str] = None

class TestGenerationResponse(BaseModel):
    tests: List[GeneratedTestCase]
    total_generated: int
    is_demo: bool = False

class RootCauseRequest(BaseModel):
    bug_id: Optional[str] = None
    title: str
    error: str
    stack_trace: Optional[str] = ""
    file: Optional[str] = ""
    line: Optional[int] = 0
    code_snippet: Optional[str] = ""
    test_case_title: Optional[str] = ""

class RootCauseResponse(BaseModel):
    root_cause: str
    why_it_happened: str
    impact_analysis: str
    suggested_fix: str
    diff_before: str
    diff_after: str
    confidence: float
    is_demo: bool = False

class FixGenerationRequest(BaseModel):
    file_path: str
    code_snippet: str
    issue_description: str
    severity: str = "medium"

class FixGenerationResponse(BaseModel):
    explanation: str
    before_code: str
    after_code: str
    patch: str
    confidence: float
    is_demo: bool = False

class ChatRequest(BaseModel):
    project_id: Optional[str] = None
    question: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    suggestions: List[str] = []
    relevant_files: List[str] = []
    is_demo: bool = False
