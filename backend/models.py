from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Users(Base):
    __tablename__ = "users"

    userid = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255), index=True)
    name = Column(String(255))
    profiledescription = Column(Text)

class Tags(Base):
    __tablename__ = "tags"

    tagid = Column(Integer, primary_key=True, index=True)
    tagname = Column(String(255), unique=True, index=True)

class Clubs(Base):
    __tablename__ = "clubs"

    clubid = Column(Integer, primary_key=True, index=True)
    clubname = Column(String(255), unique=True, index=True)
    description = Column(Text)

class ClubTags(Base):
    __tablename__ = "clubtags"

    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    tagid = Column(Integer, ForeignKey("tags.tagid"), primary_key=True)

class UserTags(Base):
    __tablename__ = "usertags"

    userid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    tagid = Column(Integer, ForeignKey("tags.tagid"), primary_key=True)

class ClubMembership(Base):
    __tablename__ = "clubmembership"

    userid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    role = Column(String(255), index=True)

class Coversations(Base):
    __tablename__ = "conversations"

    conversationid = Column(Integer, primary_key=True, index=True)
    user1id = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    user2id = Column(Integer, ForeignKey("users.userid"), primary_key=True)

class Messages(Base):
    __tablename__ = "messages"

    messageid = Column(Integer, primary_key=True, index=True)
    conversationid = Column(Integer, ForeignKey("conversations.conversationid"), primary_key=True)
    senderid = Column(Integer, ForeignKey("users.userid"), primary_key=True)
    content = Column(Text)
    timestamp = Column(TIMESTAMP, default=datetime.now())

class Posts(Base):
    __tablename__ = "posts"

    postid = Column(Integer, primary_key=True, index=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    title = Column(String(255))
    content = Column(Text)
    timestamp = Column(TIMESTAMP, default=datetime.now())

class Events(Base):
    __tablename__ = "events"

    eventid = Column(Integer, primary_key=True, index=True)
    clubid = Column(Integer, ForeignKey("clubs.clubid"), primary_key=True)
    title = Column(String(255))
    description = Column(Text)
    startdatetime = Column(TIMESTAMP)
    enddatetime = Column(TIMESTAMP)
    location = Column(String(255))
