import sys
sys.path.insert(0, r'D:\projects\YourCareer Buddy')

class MockExtractor:
    def extract(self, url):
        return {"title": "Enriched Title", "description": "Enriched description"}

class MockProvider:
    def search(self, q, f):
        return [{"title": "Raw", "application_url": "https://example.com/job", "company": "Acme"}]

from backend.ai_agents.job_discovery import JobDiscoveryAgent

agent = JobDiscoveryAgent()
agent.serp = MockProvider()
agent.apify = MockProvider()
agent.extractor = MockExtractor()

result = agent.discover("test", {})
jobs = result["results"]
assert len(jobs) == 1
job = jobs[0]
# normalized title should be enriched
assert job["title"] == "Enriched Title"
assert job.get("extraction_provenance") is not None
print("Enrichment test passed")
