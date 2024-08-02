Instagram Profile API
=========================

This project is a API for Instagram profiles, developed with Node.js and TypeScript, using Axios for API requests. The scraper collects information about media posts from Instagram profiles.

Features
--------

*   **Profile Media Collection:** Retrieves media posts of an Instagram profile.
*   **Post Details:** Extracts information about each post, including title, views, comments, likes, and description.
*   **Rate Limiting Handling:** Includes retry mechanism with exponential backoff to handle rate limits.

Requirements
------------

*   Node.js (v14 or higher)
*   TypeScript
*   Axios (for HTTP requests)
*   dotenv (for environment variable management)
*   `PORT` environment variable (optional)a  Instagram Profile Scraper

Instagram Profile Scraper
=========================

This project is a scraper for Instagram profiles, developed with Node.js and TypeScript, using Axios for API requests. The scraper collects information about media posts from Instagram profiles.

Features
--------

*   **Profile Media Collection:** Retrieves media posts of an Instagram profile.
*   **Post Details:** Extracts information about each post, including title, views, comments, likes, and description.
*   **Rate Limiting Handling:** Includes retry mechanism with exponential backoff to handle rate limits.

Requirements
------------

*   Node.js (v14 or higher)
*   TypeScript
*   Axios (for HTTP requests)
*   dotenv (for environment variable management)
*   `PORT` environment variable (optional)

Installation
------------

Clone the repository and install the dependencies:

    git clone https://github.com/your-repo/instagram-profile-scraper.git
    cd instagram-profile-scraper
    npm install
        

Running the Project
-------------------

To run the project, use the following command:

    npm start
        

Available Scripts
-----------------

*   `start`: Runs the TypeScript code using Node.js.

API Endpoints
-------------

### 1\. Get Media for a Profile

Endpoint: `/all-media/:username`

Method: `GET`

Example Request:

    GET http://localhost:3000/all-media/herobase
        

Example Response:

    
    {
      "success": true,
      "data": [
        {
          "title": "Beautiful Sunset",
          "views": 123456,
          "comments": 789,
          "date": 1625574461,
          "likes": 65432,
          "is_video": false,
          "id": "1234567890123456789",
          "description": "A beautiful sunset over the mountains."
        },
        {
          "title": "Vacation Highlights",
          "views": "isPhoto",
          "comments": 234,
          "date": 1625568461,
          "likes": 54321,
          "is_video": true,
          "id": "9876543210987654321",
          "description": "Highlights from my recent vacation trip."
        }
      ]
    }
        

The response will include details of the media posts from the specified Instagram profile. If the profile has no media or does not exist, the response will include an appropriate error message.

Contributing
------------

Contributions are welcome! If you wish to contribute to this project, please fork the repository and submit a pull request with your changes.

License
-------

This project is licensed under the [MIT License](LICENSE).

Installation
------------

Clone the repository and install the dependencies:

    git clone https://github.com/your-repo/instagram-profile-scraper.git
    cd instagram-profile-scraper
    npm install
        

Running the Project
-------------------

To run the project, use the following command:

    npm start
        

Available Scripts
-----------------

*   `start`: Runs the TypeScript code using Node.js.

API Usage
---------

Send a GET request to the `/all-media/:username` endpoint with the Instagram username as a parameter:

    GET http://localhost:3000/all-media/herobase
        

The response will include details of the media posts from the specified Instagram profile.

Contributing
------------

Contributions are welcome! If you wish to contribute to this project, please fork the repository and submit a pull request with your changes.

License
-------

This project is licensed under the [MIT License](LICENSE).
