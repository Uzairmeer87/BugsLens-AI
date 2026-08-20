from fastapi import APIRouter
from app.schemas.models import (
    CodeAnalysisRequest, CodeAnalysisResponse,
    TestGenerationRequest, TestGenerationResponse,
    RootCauseRequest, RootCauseResponse,
    FixGenerationRequest, FixGenerationResponse,
    ChatRequest, ChatResponse
)
from app.services.llm_client import llm_client

router = APIRouter(prefix="/api/ai", tags=["AI Operations"])

@router.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(req: CodeAnalysisRequest):
    return await llm_client.analyze_code(req)

@router.post("/generate-tests", response_model=TestGenerationResponse)
async def generate_tests(req: TestGenerationRequest):
    return await llm_client.generate_tests(req)

@router.post("/root-cause", response_model=RootCauseResponse)
async def analyze_root_cause(req: RootCauseRequest):
    return await llm_client.analyze_root_cause(req)

@router.post("/generate-fix", response_model=FixGenerationResponse)
async def generate_fix(req: FixGenerationRequest):
    return await llm_client.generate_fix(req)

@router.post("/chat", response_model=ChatResponse)
async def chat_assistant(req: ChatRequest):
    return await llm_client.chat(req)
