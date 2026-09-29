import sys
sys.path.insert(0, 'D:\\projects\\YourCareer Buddy')
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
