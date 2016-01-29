# MOBILE-ASSET-WEBAPP(v0.1)
A sample webapp which displays data from asset service.

## Configuration

Update `userName` and `assetZoneID` variables in index.html.

## Installation

Checkout this repository, open the folder in a terminal window, and execute:

```
pm publish
```

## Usage
When running on device/simulator it shows three buttons and a text area (in landscape mode atleast).
* [Refresh] - Sends a request to SDK and gets the asset results and updates text area.
* [PUT] - TODO: Sends changes wrapped in a command document and command-processor will update it in asset service.
* [Watch Changes] - Start watching for changes on asset document and update the text area with new results.
