from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

print("Passlib loaded successfully")
print(pwd_context.hash("EcoVerzz123"))