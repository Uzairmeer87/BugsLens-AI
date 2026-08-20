import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "BugLens AI" in data["service"]

def test_analyze_code_endpoint():
    payload = {
        "file_path": "src/controllers/user.controller.ts",
        "content": "const user = await User.find(req.query);",
        "language": "typescript"
    }
    response = client.post("/api/ai/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert len(data["issues"]) > 0
    assert data["quality_score"] > 80

def test_generate_tests_endpoint():
    payload = {
        "function_name": "processCheckout",
        "feature_description": "Stripe tokenized payment checkout",
        "test_types": ["functional", "security"]
    }
    response = client.post("/api/ai/generate-tests", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_generated"] > 0
    assert len(data["tests"]) > 0

def test_root_cause_endpoint():
    payload = {
        "title": "Payment Timeout Error",
        "error": "DuplicateTransactionError",
        "code_snippet": "const p = await stripe.charges.create({});"
    }
    response = client.post("/api/ai/root-cause", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "root_cause" in data
    assert data["confidence"] > 90
