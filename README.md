# 👶 Infant Cry Detector (Expo React Native App)

The **Infant Cry Detector** is a modular, multi-screen mobile application built using **React Native** and **Expo**.  
It simulates an infant cry detection system and provides helpful parenting guidance, following a clean and scalable project structure.

---

## 🧭 Project Structure

```
infantcry/
├── src/
│   ├── screens/        # All screen components (Login, Signup, Welcome, History, etc.)
│   ├── components/     # Reusable UI elements (Buttons, Headers, Cards)
│   ├── navigation/     # Manages screen routing stack
│   └── theme/          # Global styles, colors, and constants
```

This structure ensures **modularity**, **maintainability**, and **scalability** as the project grows.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your development machine.

### ✅ Prerequisites

Make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** (Recommended: Node 18+)
- **npm** (comes with Node)
- **Expo Go App** on your iOS or Android device (download from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Git** for cloning the repository

---

### 1️⃣ Clone the Repository

```bash
git clone [YOUR_REPO_URL] infantcry
cd infantcry
```

---

### 2️⃣ Install Dependencies Safely (⚡ Crucial Step)

This project is designed for **Expo SDK 54** and **React Native 0.73.6** to avoid compatibility issues.  
Use the `--legacy-peer-deps` flag to ensure correct dependency installation:

```bash
npm install --legacy-peer-deps
```

---

### 3️⃣ Launch the Application

Start the Metro bundler with a clear cache to avoid broken files:

```bash
npx expo start --clear
```

---

### 4️⃣ Run on Mobile Device

1. **Scan QR Code:** The above command will display a QR Code in the terminal and browser.
2. **Open Expo Go:** Launch the Expo Go app on your device.
3. **Scan & Run:** Use the app to scan the QR code. The app should load directly, starting from the **Login Screen**.

---

## 🛠️ Troubleshooting & Debugging

If you encounter errors such as:

```
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found.
```

Follow these steps to **reset your environment**:

```bash
# Stop Metro bundler
Ctrl + C

# Remove cached and installed dependencies
rm -rf node_modules
rm package-lock.json
npm cache clean --force

# Reinstall and restart
npm install --legacy-peer-deps
npx expo start --clear
```

This should fix most compatibility or bundling issues.

---

## 📝 License

This project is licensed under the **MIT License**. Feel free to modify and use it for educational or personal projects.

---

## ✨ Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Go](https://expo.dev/client)

---
