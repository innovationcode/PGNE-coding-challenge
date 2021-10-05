const express = require("express");
const app = express();

const cors = require("cors");
const fetch = require("cross-fetch");
var fs = require("fs");
const BUCKET_NAME = "pgne-coding-challenge1-dev--uploads";

const local = false;
const AWS = require("aws-sdk");

const ID = process.env.ID;
const SECRET = process.env.ID;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  // console.log("fetch-api get endpoint ***");

  const url = "https://gbfs.divvybikes.com/gbfs/en/station_information.json";
  const options = { method: "GET" };

  const response = await fetch(url, options)
    .then((response) => response.json())
    .catch((err) => console.log(err));

  //Iterate and  Filtrer received data
  //1. To delete rental_uris and rental_methos
  //2. To rename ID's
  //3. To return data which is less than capacity 12
  var newFilteredData = response.data.stations.filter((station) => {
    for (let key in station) {
      delete station["rental_uris"];
      delete station["rental_methods"];

      if (key === "external_id") {
        var temp = station[key];
        station["externalId"] = temp;
        delete station["external_id"];
      }
      if (key === "station_id") {
        var temp = station[key];
        station["stationId"] = temp;
        delete station["station_id"];
      }
      if (key === "legacy_id") {
        var temp = station[key];
        station["legacyId"] = temp;
        delete station["legacy_id"];
      }
    }
    // console.log("***  ", station["capacity"]);
    return station["capacity"] < 12;
  });

  /// Save part and JSON to CSV
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

  //Filename with timestamp .csv
  const filename = `Stations_Info_${Date.now()}.csv`;
  console.log("now uploading file ...  ", filename);
  const uploadFile = (fileName) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename, // File name you want to save as in S3
      Body: csv,
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
    });
  };
  uploadFile(filename);
  res.status(200).json(newFilteredData);
});

module.exports = app;
