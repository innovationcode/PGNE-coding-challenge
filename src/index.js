const express = require("express");
const app = express();

const cors = require("cors");
const fetch = require("cross-fetch");
// var fs = require("fs");
const BUCKET_NAME = "pgne-coding-challenge1-dev--uploads";

const AWS = require("aws-sdk");

const ID = process.env.ID;
const SECRET = process.env.ID;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

app.use(cors());
app.use(express.json());

const uploadFileToS3 = (csv) => {
  // Setting up S3 upload parameters
  const filename = `Stations_Info_${Date.now()}.csv`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename, // File name you want to save as in S3
    Body: csv,
  };
  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
  });
};

const renameKey = (obj, oldKey, newKey) => {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
};

app.get("/", async (req, res) => {
  const url = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
  const options = { method: "GET" };

  const response = await fetch(url, options)
    .then((response) => response.json())
    .catch((err) => console.log(err));

  var newFilteredData = response.data.stations.filter((station) => {
    for (let key in station) {
      delete station["rental_uris"];
      delete station["rental_methods"];

      if (key === "external_id") {
        renameKey(station, "external_id", "externalId");
      }
      if (key === "station_id") {
        renameKey(station, "station_id", "stationId");
      }
      if (key === "legacy_id") {
        renameKey(station, "legacy_id", "legacyId");
      }
    }
    return station["capacity"] < 12;
  });
  var json = newFilteredData;
  var fields = Object.keys(json[0]);
  var replacer = function (key, value) {
    return value === null ? "" : value;
  };
  var csv = json.map(function (row) {
    return fields
      .map(function (fieldName) {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  csv.unshift(fields.join(",")); // add header column
  csv = csv.join("\r\n");

  uploadFileToS3(csv);
  res.status(200).json(newFilteredData);
});

module.exports = app;
