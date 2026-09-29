import sys
sys.path.insert(0, r'D:\projects\YourCareer Buddy')

class MockProvider:
    def search(self, q, f):
        return [{
            "title": "AI Engineer",
            "company": "Acme",
            "application_url": "https://example.com/job/1",
            "location": "Remote"
        }]

from backend.ai_agents.job_discovery import JobDiscoveryAgent

agent = JobDiscoveryAgent()
agent.serp = MockProvider()
agent.apify = MockProvider()

result = agent.discover("remote AI engineer", {"professional":{"title":"Engineer"}})
assert result["intent"]["filters"].get("remote") == True
assert len(result["results"]) >= 1
print("Job Discovery wired test passed")
