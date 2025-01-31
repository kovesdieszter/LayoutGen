import geopandas as gpd
import rasterio
from rasterio.mask import mask
from shapely.geometry import box, mapping, MultiPolygon
import os
import glob
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw
from dotenv import dotenv_values

# GLOBAL VARIABLES
ENV_PATH = '.env'
config = dotenv_values(ENV_PATH)
print(config['CURRENT_POLY_BATCH'])

# Read polygon data from shp file
def read_polygons():
    polygons = gpd.read_file(config['CURRENT_POLY_BATCH'])
    return polygons


# Create cropped images from the polygons and save them into a new folder
def create_images():
    polygons = read_polygons()
    output_dir = config['OUTPUT_DIRECTORY']
    sentinel_image_dir = config['SENTINEL_IMAGES']
    sentinel_images = [f for f in glob.glob(os.path.join(sentinel_image_dir, "*_T32_sl_rgb.tif")) if not f.endswith("tif.aux")]

    for sentinel_path in sentinel_images:
        with rasterio.open(sentinel_path) as src:
            raster_bbox = box(*src.bounds)  # Create a bounding box from the raster
            basename = os.path.basename(sentinel_path)
            date = basename.split("_")[0]

            # Process each polygon
            for index, row in polygons.iterrows():
                geometry = row['geometry']
                jn_id = row['jn_id']
                code = row['code']

                if isinstance(geometry, MultiPolygon):
                    polygons_to_process = geometry.geoms
                else:
                    polygons_to_process = [geometry]

                for polygon in polygons_to_process:
                    if raster_bbox.intersects(polygon):
                        enlarged_bbox = polygon.buffer(50).envelope
                        if raster_bbox.contains(enlarged_bbox):
                            out_image, out_transform = mask(src, [mapping(enlarged_bbox)], crop=True)
                            out_meta = src.meta.copy()
                            out_meta.update({
                                "driver": "JPEG",
                                "height": 800,
                                "width": 500,
                                "transform": out_transform,
                                "dpi": 500
                            })

                            # Save the clipped image
                            output_path = os.path.join(output_dir, f"{date}_{jn_id}_{code}.jpg")
                            with rasterio.open(output_path, "w", **out_meta) as dest:
                                dest.write(out_image)
                            
                            # Open the image to draw
                            # img = Image.open(output_path)
                            img = Image.fromarray(out_image.transpose(1, 2, 0))
                            img = img.resize((500, 800), resample=Image.BICUBIC)
                            draw = ImageDraw.Draw(img)
                            
                            # Transform polygon coordinates to the image coordinate system
                            polygon_image_coords = [(int((x - out_transform[2]) / out_transform[0] * 500 / out_image.shape[2]),
                                                    int((y - out_transform[5]) / out_transform[4] * 800 / out_image.shape[1]))
                                                    for x, y in polygon.exterior.coords]

                            # Draw the polygon
                            draw.polygon(polygon_image_coords, outline="yellow", width=4)
                            img.save(output_path, format="JPEG", dpi=(500,800))
                            print(f"Processed and saved {output_path}")
                        else:
                            print(f"Enlarged polygon {jn_id} is out of raster bounds {basename}, skipping...")
                    else:
                        print(f"Polygon {jn_id} does not overlap with raster {basename}, skipping...")
    print("Processing completed.")


def main():
    create_images()


if __name__ == '__main__':
    main()

