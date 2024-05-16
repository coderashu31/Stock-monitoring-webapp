# Stock-monitoring-webapp
 The "STOCK MONITORING WEB APP" is a platform designed to allow users to create and manage their own watchlists of stock symbols. Users can easily add and remove stock symbols from their watchlists, enabling them to track the latest stock values of the symbols they are interested in.

Key features of the platform include:

1. User authentication: Secure and simple authentication mechanism allows users to register accounts and log in securely.

2. Dashboard display: The platform displays a dashboard with the latest stock values of the symbols on the user's watchlist. It retrieves real-time stock information from the TIME_SERIES_INTRADAY endpoint of the Alpha Vantage API (https://www.alphavantage.co).

3. Watchlist management: Users can create, edit, and delete their watchlists, each containing a set of stock symbols (e.g., MSFT, GOOG).

4. Concurrent user support: The platform is designed to handle multiple users concurrently, each with their own unique watchlists and account data.

5. Database integration: The platform uses a database (e.g., MongoDB) to store user account information and watchlist data, ensuring data persistence and scalability.
   
Overall, the "STOCK MONITORING WEB APP" provides users with a convenient and efficient way to monitor the latest stock prices of their chosen symbols in real-time, empowering them to make informed investment decisions.
