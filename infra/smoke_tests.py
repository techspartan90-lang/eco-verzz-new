import sys
import urllib.request
import json

def test_endpoint(url, name):
    print(f"Checking {name} at {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'SmokeTestAgent'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"[-] {name} is healthy! Response: {data}")
                return True
            else:
                print(f"[x] {name} failed with status code: {response.status}")
    except Exception as e:
        print(f"[x] Could not connect to {name}: {e}")
    return False

def main():
    endpoints = [
        ("http://localhost/api/common/health/", "API Health (Nginx Gateway)"),
        ("http://localhost:8000/api/common/health/", "Django Backend API Health Direct"),
        ("http://localhost:8080/health", "FastAPI AI Service Health Direct"),
    ]

    all_passed = True
    for url, name in endpoints:
        success = test_endpoint(url, name)
        if not success:
            all_passed = False

    if all_passed:
        print("Smoke tests passed successfully!")
        sys.exit(0)
    else:
        print("Smoke tests failed! Deployment rollback should be initiated.")
        sys.exit(1)

if __name__ == "__main__":
    main()
