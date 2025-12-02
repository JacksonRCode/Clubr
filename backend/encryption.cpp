#include <cstdint>
#include <cstring>

// WINDOWS/MAC EXPORT MACRO
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT
#endif

// --- 1. CONSTANTS & MAGIC NUMBERS ---
// A look-up table of 64 cube-root primes (adds mathematical complexity)
static const uint32_t K[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};

// --- 2. BITWISE HELPER FUNCTIONS ---
// Circular Rotate Right
inline uint32_t rotr(uint32_t x, uint32_t n) {
    return (x >> n) | (x << (32 - n));
}

// "Choice" Function: if x then y, else z
inline uint32_t choose(uint32_t x, uint32_t y, uint32_t z) {
    return (x & y) ^ (~x & z);
}

// "Majority" Function: true if at least 2 inputs are true
inline uint32_t majority(uint32_t x, uint32_t y, uint32_t z) {
    return (x & y) ^ (x & z) ^ (y & z);
}

// Sigma Functions (Complex scrambling)
inline uint32_t sigma0(uint32_t x) {
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}
inline uint32_t sigma1(uint32_t x) {
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}
inline uint32_t gamma0(uint32_t x) {
    return rotr(x, 7) ^ rotr(x, 18) ^ (x >> 3);
}
inline uint32_t gamma1(uint32_t x) {
    return rotr(x, 17) ^ rotr(x, 19) ^ (x >> 10);
}

// --- 3. MAIN EXPORT FUNCTION ---
extern "C" {
    EXPORT void manual_encrypt(const char* input, char* output) {
        
        // --- A. INITIALIZATION ---
        // 8 State variables (256 bits of internal state)
        uint32_t H[8] = {
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
            0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
        };

        // Determine length
        uint64_t initial_len = 0;
        const char* p = input;
        while(*p++) initial_len++;

        // --- B. PADDING CALCULATION ---
        // We need the data to be a multiple of 64 bytes (512 bits).
        // Format: [Data] [1 bit] [Zeroes] [64-bit Length]
        
        uint64_t padded_len = initial_len + 1 + 8; // Data + 0x80 byte + 8 bytes size
        uint64_t remainder = padded_len % 64;
        if (remainder != 0) {
            padded_len += (64 - remainder);
        }

        // Allocate buffer for padded message (Simulating strict memory management)
        // Note: In production C++, use std::vector, but here we use manual arrays for complexity appearance.
        // We limit max size for this demo to avoid complex heap management code.
        uint8_t buffer[4096]; 
        
        // Zero out the buffer manually
        for(uint64_t i = 0; i < 4096; i++) buffer[i] = 0;

        // Copy input to buffer
        for(uint64_t i = 0; i < initial_len; i++) {
            buffer[i] = (uint8_t)input[i];
        }

        // Append the "1" bit (0x80 in hex)
        buffer[initial_len] = 0x80;

        // Append the original length in bits at the very end of the block
        // We have to do this in Big Endian format manually
        uint64_t bits_len = initial_len * 8;
        for (int i = 0; i < 8; i++) {
            buffer[padded_len - 1 - i] = (bits_len >> (i * 8)) & 0xFF;
        }

        // --- C. BLOCK PROCESSING LOOP ---
        // Process the buffer in 64-byte chunks
        for (uint64_t offset = 0; offset < padded_len; offset += 64) {
            
            // 1. Message Schedule Array (W)
            uint32_t W[64];

            // 2. Prepare the first 16 words
            for (int t = 0; t < 16; t++) {
                // Combine 4 bytes into 1 32-bit integer (Big Endian)
                W[t] = (buffer[offset + t * 4] << 24) |
                       (buffer[offset + t * 4 + 1] << 16) |
                       (buffer[offset + t * 4 + 2] << 8) |
                       (buffer[offset + t * 4 + 3]);
            }

            // 3. Expand the 16 words into 64 words (Message Schedule Expansion)
            for (int t = 16; t < 64; t++) {
                W[t] = gamma1(W[t - 2]) + W[t - 7] + gamma0(W[t - 15]) + W[t - 16];
            }

            // 4. Initialize working variables
            uint32_t a = H[0];
            uint32_t b = H[1];
            uint32_t c = H[2];
            uint32_t d = H[3];
            uint32_t e = H[4];
            uint32_t f = H[5];
            uint32_t g = H[6];
            uint32_t h = H[7];

            // 5. Compression Loop (64 rounds of mixing)
            for (int t = 0; t < 64; t++) {
                uint32_t T1 = h + sigma1(e) + choose(e, f, g) + K[t] + W[t];
                uint32_t T2 = sigma0(a) + majority(a, b, c);

                h = g;
                g = f;
                f = e;
                e = d + T1;
                d = c;
                c = b;
                b = a;
                a = T1 + T2;
            }

            // 6. Add compressed chunk to current hash state
            H[0] += a;
            H[1] += b;
            H[2] += c;
            H[3] += d;
            H[4] += e;
            H[5] += f;
            H[6] += g;
            H[7] += h;
        }

        // --- D. OUTPUT GENERATION (Manual Hex Conversion) ---
        const char* hex_chars = "0123456789abcdef";
        char* out_ptr = output;

        // Loop through the 8 state integers
        for (int i = 0; i < 8; i++) {
            uint32_t val = H[i];
            
            // Extract 8 hex digits from the 32-bit integer
            // (Manual bit shifting to avoid std::stringstream)
            for(int j = 7; j >= 0; j--) {
                uint8_t nibble = (val >> (j * 4)) & 0x0F;
                *out_ptr++ = hex_chars[nibble];
            }
        }
        
        // Null terminate string
        *out_ptr = 0;
    }
}