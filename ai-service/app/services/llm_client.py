import json
import httpx
from typing import Optional, Dict, Any
from app.config import settings
from app.schemas.models import (
    CodeAnalysisRequest, CodeAnalysisResponse,
    TestGenerationRequest, TestGenerationResponse,
    RootCauseRequest, RootCauseResponse,
    FixGenerationRequest, FixGenerationResponse,
    ChatRequest, ChatResponse
)
from app.services.mock_service import MockAIService

class LLMClient:
    def __init__(self):
        self.api_key = settings.ai_api_key
        self.api_base = settings.ai_api_base
        self.model = settings.ai_model
        self.is_demo = not bool(self.api_key)

    async def analyze_code(self, req: CodeAnalysisRequest) -> CodeAnalysisResponse:
        if self.is_demo:
            return MockAIService.analyze_code(req)
        try:
            prompt = f"Analyze this {req.language} code for bugs, security vulnerabilities, code smells, and calculate quality metrics:\n\nFile: {req.file_path}\n```\n{req.content}\n```\n\nReturn strict JSON matching CodeAnalysisResponse schema."
            response = await self._call_openai(prompt)
            data = json.loads(response)
            data["is_demo"] = False
            return CodeAnalysisResponse(**data)
        except Exception:
            return MockAIService.analyze_code(req)

    async def generate_tests(self, req: TestGenerationRequest) -> TestGenerationResponse:
        if self.is_demo:
            return MockAIService.generate_tests(req)
        try:
            prompt = f"Generate {', '.join(req.test_types)} test cases for: {req.feature_description or req.function_name}\nCode:\n{req.code_snippet or ''}\n\nReturn strict JSON matching TestGenerationResponse schema."
            response = await self._call_openai(prompt)
            data = json.loads(response)
            data["is_demo"] = False
            return TestGenerationResponse(**data)
        except Exception:
            return MockAIService.generate_tests(req)

    async def analyze_root_cause(self, req: RootCauseRequest) -> RootCauseResponse:
        if self.is_demo:
            return MockAIService.root_cause_analysis(req)
        try:
            prompt = f"Analyze test failure and root cause:\nTitle: {req.title}\nError: {req.error}\nStack Trace: {req.stack_trace}\nCode:\n{req.code_snippet}\n\nReturn strict JSON with root_cause, why_it_happened, suggested_fix, diff_before, diff_after, confidence."
            response = await self._call_openai(prompt)
            data = json.loads(response)
            data["is_demo"] = False
            return RootCauseResponse(**data)
        except Exception:
            return MockAIService.root_cause_analysis(req)

    async def generate_fix(self, req: FixGenerationRequest) -> FixGenerationResponse:
        if self.is_demo:
            return MockAIService.generate_fix(req)
        try:
            prompt = f"Generate fix for issue in {req.file_path}:\nIssue: {req.issue_description}\nCode:\n{req.code_snippet}\n\nReturn strict JSON with explanation, before_code, after_code, patch, confidence."
            response = await self._call_openai(prompt)
            data = json.loads(response)
            data["is_demo"] = False
            return FixGenerationResponse(**data)
        except Exception:
            return MockAIService.generate_fix(req)

    async def chat(self, req: ChatRequest) -> ChatResponse:
        if self.is_demo:
            return MockAIService.chat(req)
        try:
            prompt = f"You are BugLens AI Assistant, a testing and code quality expert. Answer developer query:\nQuestion: {req.question}\nContext: {json.dumps(req.context or {})}\n\nProvide clear answer, 2-3 suggestions, and relevant file names."
            response = await self._call_openai(prompt)
            data = json.loads(response)
            data["is_demo"] = False
            return ChatResponse(**data)
        except Exception:
            return MockAIService.chat(req)

    async def _call_openai(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are BugLens AI, a specialized software testing and code analysis engine. Respond with structured JSON."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(f"{self.api_base}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

llm_client = LLMClient()
