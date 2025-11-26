# Clubr: _Find Your People_

## About the Project
Clubr is a web-based application designed to unify the fragmented communication channels
between Queen’s University students and campus clubs. At present, club-related information is
distributed across social media, email, and static directories like the AMS Clubs page, making it
difficult for students to discover and engage with organizations that interest them. The purpose
of Clubr is to centralize these interactions into a single, interactive platform that allows students
to explore clubs, follow updates, view upcoming events, and directly message club
administrators. For club executives, Clubr provides tools to manage their pages, create posts
and events, and collaborate with other clubs. Through this centralized system, Clubr aims to
bridge the gap between static listings and the dynamic, real-time engagement needs of the
university community.

## Reports
- [Project Proposal (PDF)](reports/Proposal.pdf)
- [Requirements Analysis Document (PDF)](reports/RAD.pdf)
- [System Design Document (PDF)](reports/SDD.pdf)

## Running the code

Run `npm i` from the frontend directory to install the dependencies.

Run `npm run dev` to start the development server.
  
### Compile code needed for C++ integration
Windows:

```g++ -shared -o encryption.dll encryption.cpp```

Mac:

```g++ -dynamiclib -o encryption.dylib encryption.cpp```

Linux:

```g++ -shared -fPIC -o encryption.so encryption.cpp```

### Run from the project root (Clubr/) backend
```uvicorn api.index:app --reload --port 8000```