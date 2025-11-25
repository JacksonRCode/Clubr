from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, TIMESTAMP
# from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

# DB model for users
class Users(Base):
    __tablename__ = "users"

    userid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    name = Column(String(255))
    profiledescription = Column(Text)

# DB model for tags
class Tags(Base):
    __tablename__ = "tags"

    tagid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tagname = Column(String(255), unique=True, index=True)

# DB model for clubs
class Clubs(Base):
    __tablename__ = "clubs"

    clubid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clubname = Column(String(255), unique=True, index=True)
    description = Column(Text)

# DB model for club's tags/interests
class ClubTags(Base):
    __tablename__ = "clubtags"

    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    tagid = Column(Integer, ForeignKey("tags.tagid"), primary_key=True)

# DB model for user's tags/interests
class UserTags(Base):
    __tablename__ = "usertags"

    userid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    tagid = Column(Integer, ForeignKey("tags.tagid"), primary_key=True)

# DB model for membership between user and club
class ClubMembership(Base):
    __tablename__ = "clubmembership"

    userid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    role = Column(String(255))

# DB model for membership between club to club (for admin mode)
class ClubToClubMembership(Base):
    __tablename__ = "clubtoclubmembership"

    club1id = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    club2id = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)

# DB model for conversations
class Conversations(Base):
    __tablename__ = "conversations"

    conversationid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user1id = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    user2id = Column(Integer, ForeignKey("users.userid"), primary_key=True)

# DB model for messages
class Messages(Base):
    __tablename__ = "messages"

    messageid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    conversationid = Column(Integer, ForeignKey("conversations.conversationid"), primary_key=True)
    senderid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    content = Column(Text)
    timestamp = Column(TIMESTAMP, default=datetime.now(timezone.utc))

# DB model for posts
class Posts(Base):
    __tablename__ = "posts"

    postid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    title = Column(String(255))
    content = Column(Text)
    timestamp = Column(TIMESTAMP, default=datetime.now(timezone.utc))

# DB model for events
class Events(Base):
    __tablename__ = "events"

    eventid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    title = Column(String(255))
    description = Column(Text)
    startdatetime = Column(TIMESTAMP)
    enddatetime = Column(TIMESTAMP)
    location = Column(String(255))
