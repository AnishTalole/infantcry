👶 Infant Cry Detector (Expo React Native App)
This project is a modular, multi-screen mobile application built with React Native and Expo, simulating an infant cry detector and providing parenting guidance.

The application follows a standard modular structure to ensure maintainability and scalability:

src/screens/: Contains all screen components (Login, Signup, Welcome, History, etc.).

src/components/: Reusable UI elements (Buttons, Headers, Cards).

src/navigation/: Manages the screen routing stack.

src/theme/: Holds global styles, colors, and constants.

🚀 Getting Started
Follow these instructions to set up and run the project locally.

Prerequisites
You must have the following software installed:

Node.js & npm: (We recommend a stable version like Node 18+)

Expo Go App: Installed on your iOS or Android mobile device (download from App Store or Google Play).

Git: To clone the repository.

1. Clone the Repository
Clone this repository to your local machine:

git clone [YOUR_REPO_URL] infantcry
cd infantcry

2. Install Dependencies Safely (Crucial Step)
This project uses a specific combination of package versions (Expo SDK 54 and React Native 0.73.6) to ensure stability and avoid low-level native errors. We use the --legacy-peer-deps flag to force a successful installation despite minor dependency warnings.

Run the following command in your terminal:

npm install --legacy-peer-deps

3. Launch the Application
Use the local npx expo command to start the Metro server and generate the QR code. The --clear flag ensures no broken or cached files interfere with the launch.

npx expo start --clear

4. Run on Mobile Device
QR Code: The command above will display a QR Code in your terminal and browser window.

Open Expo Go: Launch the Expo Go app on your phone.

Scan: Use the app to scan the QR code.

The application will bundle and load directly onto your device, starting at the Login Screen.

🛠️ Troubleshooting & Debugging
If you encounter persistent loading issues (like the "PlatformConstants could not be found" red screen), please perform a full environment reset:

Stop the running server (Ctrl + C).

Run the following commands sequentially to clear all caches and modules:

rm -rf node_modules
rm package-lock.json
npm cache clean --force

Reinstall the dependencies and start the server again (Steps 2 and 3 above).