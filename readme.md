# LayoutGenerator web application

## About

LayoutGenerator is a web application designed to automatically create layouts ("yearbooks") from any type of image. It streamlines the process of generating yearly layouts from satellite images, offering a faster and more efficient alternative to traditional tools like QGIS.

## Current Use and Goals

The application was developed to address the need for a faster solution for generating yearly layouts from Sentinel images compared to QGIS. While QGIS took 45 minutes to generate 23 layouts, LayoutGenerator can produce **500 layouts in significantly less time**, achieving the primary goal of improving efficiency.

## Sturcture of the Code Base

### `helper_scripts` Folder

This folder contains preparatory scripts used before the layout generation process. Its main tasks include:

- Extracting images from Sentinel data based on a given polygon's geometry and ID.

- Generating cropped images for each day of the year when satellite imagery is available.

- Saving these cropped images into a designated folder.

Key Files:

- `extract.py`: Handles cropping Sentinel images.

- `id_extractor.py`: Creates a list of IDs for processing.

- `.env.example`: Contains file and folder paths for configuration

### layout_gen Folder

- The application starts upon issuing the `npm start` command, sequentially building the React components. 
- The process is fully automated; the user only needs to press the `Start` button in the browser.
- The application processes the contents of `idCollection.js`, retrieves the corresponding cropped images from a Cloud Storage (via API) based on the parcel ID, and populates the empty "yearbook" with them.
- It monitors the upload process and generates a PDF (using canvas), which is then downloaded to the user's predefined local download location.
- To handle large volumes of data, a 0.5-second delay (setTimeOut) is implemented between PDF creation and download for safety reasons.
- After successfully generating 500 layouts, an alert appears in the browser, indicating that the process is complete.

## Versions

### Storing Images in Google Cloud

For smaller-scale use or free storage, images can be stored locally in the React application's `assets` folder. However, this approach has limitations, such as high RAM usage when handling large datasets. Use `DataCardContainer.jsx` for this setup.

### Storing Images Locally

Free storage choice could be the local storage in the react application assets folder. Unfortunately, there are some disadvantages in case a large amount of data (using a lot of RAM). For this run, use the `DataCardContainerLocal.jsx`.


## Technology

- **Python**: Vversion 3.12.8
- **React**: Version 18.3.1 

## Getting Started

To run the preparatory Python scripts, use the command: `python <filename>.py`.
For the React application, after succesful `npm install`, the application starts up with `npm start` command. 
