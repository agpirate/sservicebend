import sys
import urllib.parse

# Get command line arguments
params = sys.argv[2]
encmessage = sys.argv[1]

# Decode UTF-16BE
def decodeUTF16BE(hex_string):
    decoded_string = bytes.fromhex(hex_string).decode('utf-16be')
    return decoded_string

# encoded_string = "%12%E8%12p%(1250)12%95%12%E8%12%0D%12%93%00%2C%00%20%00T%00h%00a%00n%00k%00%20%00y%00o%00u%00!%00%20%002%000%002%004%00-%000%006%00-%000%006%00%2C%00%20%005%00%3A%003%001%00%3A%000%007%00%20%00p%00.%00m%00.".replace('%','')
encoded_string = ""# "%12%00%12%A0%12%F0%12%00%12%A8%13I%12p%12%CE%12%00%12%F0%13%08%00T"#.replace('%','')
#\x12\x00
codecList = encmessage.split("%")[1:] #creating arrays by separating %
# if len(codecList) == 0:
#     codecList = [part for part in encmessage.split(r'\x') if part] #creating arrays by separating %
#     # codecList=codecList[1:]
# else:
#     codecList = codecList[1:]

decoded_list = []
# Loop through each element in the split list
for element in codecList:
    # Check if the element is a hexadecimal representation

    if len(element) == 2 :#check character is firstByte or second Byte(correctlly with no confusing)
        decoded_list.append( element)
    else: #ascii or geeze+ascii bad data formating
        if element.startswith("00"): #is ascii formating with nullbyte
            decoded_list.append('00'+hex(ord(element[-1]))[2:].upper())
        elif element.startswith("12"):#is geeze starting unicode prefixe 12
            decoded_list.append('12'+hex(ord(element[-1]))[2:].upper())#change the ascii codec Error to normal Ascii(2digit) ++ append 12
        elif element.startswith("13"):#is geeze starting unicode prefixe 13
            decoded_list.append('13'+hex(ord(element[-1]))[2:].upper()) #change the ascii codec Error to normal Ascii(2digit) ++ append 13
        else:
            decoded_list.append(element)

encoded_string =''.join(decoded_list) #after reversing the codec decode by utf16
try:
    decoded_utf16be_string = decodeUTF16BE(encoded_string)
    print(decoded_utf16be_string)
except ValueError as e:
    print("Error decoding UTF-16BE encoding:", e,decoded_url_string,encoded_string)

