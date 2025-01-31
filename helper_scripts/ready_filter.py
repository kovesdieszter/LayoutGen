import os
import re
from dotenv import dotenv_values

ENV_PATH = '.env'
config = dotenv_values(ENV_PATH)


js_file_path = config['JS_FILE_PATH'] 
pdf_folder_path = config['PDF_FOLDER_PATH'] 

output_js_file = config['OUTPUT_JS_FILE'] 

with open(js_file_path, "r", encoding="utf-8") as file:
    js_content = file.read()
    matches = re.findall(r"id\s*:\s*(\d+)", js_content)
    json_ids = set(matches)  

existing_pdfs = set(f.replace(".pdf", "") for f in os.listdir(pdf_folder_path) if f.endswith(".pdf"))


missing_ids = json_ids - existing_pdfs


with open(output_js_file, "w", encoding="utf-8") as out_file:
    out_file.write("export const missingIdCollection = [\n")
    for id in sorted(missing_ids):
        out_file.write(f"    {{ id: {id} }},\n")
    out_file.write("];\n")


print(f"Number of missing PDFs: {len(missing_ids)}")
print(f"Missing IDs saved in this file: {output_js_file}")