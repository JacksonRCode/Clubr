from queries import *

print("=== TEST SIGN UP ===")
user = create_user(
    email="testing@example.com",
    password="password123",
    name="Some User",
    profiledescription="I'm some user."
)
print("Result:", user)
print()

print("=== TEST SIGNING UP SAME USER ===")
user2 = create_user(
    email="testing@example.com",
    password="password123",
    name="Some User",
    profiledescription="I'm some user."
)
print("Result:", user)
print()


print("=== TEST LOGIN (CORRECT PASSWORD) ===")
login_user = check_existing_user("testing@example.com", "password123")
print("Result:", login_user)
print()


print("=== TEST LOGIN (WRONG PASSWORD) ===")
login_user_wrong = check_existing_user("testing@example.com", "wrongpass")
print("Result:", login_user_wrong)
print()

print("=== TEST CREATING NEW TAGS ===")
tag = create_tags(
    tagname="science"
)
print("Result:", tag)
print()

print("=== TEST CREATING NEW CLUBS ===")
club = create_clubs(
    clubname="Queen's Chess Club",
    description="This is a chess club."
)
print("Result:", club)
print()
