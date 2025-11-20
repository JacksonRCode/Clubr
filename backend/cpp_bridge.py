import ctypes
import os
import platform

# 1. Detect the Operating System
system_name = platform.system()

if system_name == "Windows":
    lib_name = "encryption.dll"
elif system_name == "Darwin":
    # "Darwin" is the internal name for macOS
    lib_name = "encryption.dylib"
else:
    # Linux (Ubuntu, Fedora, Debian, etc.)
    lib_name = "encryption.so"

# 2. Construct the absolute path to the library
# This ensures it works even if you run the server from a different folder
current_dir = os.path.dirname(os.path.abspath(__file__))
lib_path = os.path.join(current_dir, lib_name)

try:
    # 3. Load the C++ library
    cpp_lib = ctypes.CDLL(lib_path)

    # 4. Define the function arguments
    # Argument 1: Input String (char*)
    # Argument 2: Output Buffer (char*)
    cpp_lib.manual_encrypt.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
    cpp_lib.manual_encrypt.restype = None 

    def encrypt_password(password: str) -> str:
        """
        Sends the password to C++, gets a Hash back.
        """
        input_bytes = password.encode('utf-8')
        
        # Create a fixed-size buffer (256 bytes)
        # This is safer for Hashing than using len(input)
        output_buffer = ctypes.create_string_buffer(256)
        
        # Call C++
        cpp_lib.manual_encrypt(input_bytes, output_buffer)
        
        # Decode result
        return output_buffer.value.decode('utf-8', errors='ignore')

except OSError:
    # This block runs if the compiled file is missing
    print(f"\nWARNING: Could not find '{lib_name}' at:")
    print(f"  {lib_path}")
    print("  Please run the compile command for your OS.\n")
    
    # Fallback function so the app doesn't crash during testing
    def encrypt_password(password: str) -> str:
        return f"Unencrypted_{password}"