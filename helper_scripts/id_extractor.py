import geopandas as gpd
from dotenv import dotenv_values

ENV_PATH = '.env'
config = dotenv_values(ENV_PATH)

def read_polygons():
    polygons = gpd.read_file(config['CURRENT_POLY_BATCH'])
    return polygons

def extract_ids_to_js():
    polygons = read_polygons()
    ids = polygons['jn_id'].to_list()
    id_collection = [{"id": int(id)} for id in ids]

    output_path = config['OUTPUT_PATH_JS_IDS']
    with open(output_path, "w", encoding="utf-8") as file:
        file.write("export const idCollection = [\n")
        for item in id_collection:
            file.write(f"    {{ id: {item['id']} }},\n")
        file.write("];\n")

    print(f"Extracted and saved {len(id_collection)} IDs to {output_path}")

def main():
    extract_ids_to_js()

if __name__ == '__main__':
    main()
