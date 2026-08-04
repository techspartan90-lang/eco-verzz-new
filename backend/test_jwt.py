from app.core.auth import create_access_token, verify_token

token = create_access_token({
    "sub": "guru@ecoverzz.ai",
    "role": "Admin"
})

print("Generated Token:")
print(token)

print("\nDecoded Payload:")
print(verify_token(token))