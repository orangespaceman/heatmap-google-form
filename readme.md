# Heatmap with Google Forms

A custom HTML form that stores data in a Google Form, and uses this information to generate a heatmap using [Leaflet](https://leafletjs.com/) and [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat).


## Set-up

Create a config file by duplicating the file `config.sample.js` and calling it `config.js`.

Customise the three blocks of values:


### Map

 - `lat`, `lon` and `zoom`: These are the default position for the map.
 - `minOpacity`, `radius` and `max`: These values change how the heatmap is rendered - see the [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) docs for an explanation.


### Form

Create a new Google Form.

The `id` field in the config should come from the URL of the form.

The form should have four fields:

 - Postcode: This should be a text field
 - Lat and Lon: These fields should be optional. They won't be filled in by any users. Instead, [Postcodes.io](https://postcodes.io/) is used to geocode the postcode and retrieve a latitude and longitude.
 - Attendees: This will be a number, probably between 1-10.

The four inputs *must* be in this order: postcode, lat, lon, attendees.

Find out the IDs for these four input fields to add to the config. The easiest way to do this is to use the browser's webdev inspector. See [this link](https://github.com/jsdevel/google-form) for detail. They will probably be named `entry.xxxxx`.


### Spreadsheet

Create a Google Spreadsheet from the Google Form responses.

Make the spreadsheet visible publicly - read only.

The `id` field in the config should come from the URL of the spreadsheet.

Sign up for a new Google Spreadsheet API key - see [their documentation](https://developers.google.com/sheets/api/quickstart/js) for detail. You don't need a Client ID, just the [API key](https://console.developers.google.com/apis/credentials).

While setting this up, it's worth restricting its use to specific domains, and only the _Google Sheets API_.

The `sheet` field in the config should come from the name of the spreadsheet tab - this will be created automatically by the Google Form. Replace any spaces with _%20_, for example the value may be `Form%20Responses%201`.

The `range` field in the config should include the fields that are populated by the form, for example `C2:E10000`.

### Logo

Add an image file in the root called `logo.png` in order to add a logo to the front page of the form.
