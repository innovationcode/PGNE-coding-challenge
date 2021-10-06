# PG&E - MRAD Node.js Coding Challenge

## Task :-- You need to create an AWS lambda function to do the following:

1. Create a RESTful API which executes the following steps for every request

- Using `Serverless` framework here, which allows you to build Serverless applications.

  - Requirements :---

    - node v15.4.0

    - `npm install -g serverless` which helps you to create boilerplate for serverless applications.

    - `serverless.yml` - The entry point file. Without it, Serverless won't run. It has three sections - provider, functions, resources, plugins, etc. Used provider AWS as per specification

- Pull data from this url: https://gbfs.divvybikes.com/gbfs/en/station_information.json

  - Pulling api using `cross-fetch` in './src/index.js'

- Make some changes to the output from the url above:

  1. Remove rental_methods and rental_uris from the output - COMPLETE
  2. Rename: external_id, station_id, and legacy_id into externalId, stationId, and
     legacyId - COMPLETE
  3. Return the data when the capacity is less - COMPLETE

  4. Convert your JSON output into CSV. - COMPLETE
  5. Write your output into a filesystem as a .csv file. - COMPLETE
  6. Upload your file to S3. (overwrite or create a new file) - CREATING NEW FILE and uploading csv data

## To run at local environment

1.  git clone this repository
2.  `npm install` - to install all dependencies.
3.  Need AWS-cli [install](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
    - configure IAM `aws configue` after aws-cli installation need access-id and secret-key.
4.  run `serverless offline start`
    - can check locally `http://localhost:3000/dev` the response will be filtered data with above specifications.
    - You can see here CSV file uploaded to s3 bucket.
5.  Unit-test added using `JEST and SUPERTEST` for the API call.
    - Run `npm test` for unit testing.
6.  Deployed endpoints-
    - https://cpdhnpbrtg.execute-api.us-east-1.amazonaws.com/dev/
7.  s3 bucket CSV - Object URL
    - https://pgne-coding-challenge1-dev--uploads.s3.amazonaws.com/Stations_Info_1633480332308.csv
     
