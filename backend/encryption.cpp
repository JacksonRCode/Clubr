#include <cstring>
#include <string>
#include <sstream>
#include <iomanip>

// MACRO: Cross-platform fix (Windows vs Mac)
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT
#endif

extern "C" {
    // FUNCTION: Manual Hashing (DJB2 Algorithm)
    EXPORT void manual_encrypt(const char* input, char* output) {
        std::string text(input);
        
        // 1. Initialize hash with a "magic number" (standard for DJB2)
        unsigned long hash = 5381;

        // 2. Loop through each character and scramble the numbers
        // Formula: hash = (hash * 33) + character
        for (size_t i = 0; i < text.length(); i++) {
            hash = ((hash << 5) + hash) + text[i]; 
        }

        // 3. Convert the number to a Hex String (ex. "1a2b3c")
        std::stringstream ss;
        ss << std::hex << hash;
        std::string hashString = ss.str();

        // 4. Copy to output buffer
        std::strcpy(output, hashString.c_str());
    }
}