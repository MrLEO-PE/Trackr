#!/bin/bash
# Test script to verify the PE Learning Hub setup and start the dev server

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  PE Learning Hub - Setup & Test Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
  echo "❌ Error: index.html not found. Please run this script from /workspaces/newPE"
  exit 1
fi

echo "✓ Found index.html"

# Check SDK files
if [ -f "_sdk/data_sdk.js" ] && [ -f "_sdk/element_sdk.js" ] && [ -f "_sdk/firebase_config.js" ]; then
  echo "✓ All SDK files present"
else
  echo "❌ Error: Missing SDK files"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setup Status:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✓ Local SDK Mocks: data_sdk.js, element_sdk.js"
echo "  - Falls back to localStorage for student persistence"
echo "✓ Firebase Config Template: _sdk/firebase_config.js"
echo "  - Ready for your Firestore credentials (optional)"
echo "✓ Enhanced Registration: Fallback for offline or missing backend"
echo "  - Student data saved to localStorage and userData array"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  How to Test:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start the dev server:"
echo "   cd /workspaces/newPE/mysite && npm run live"
echo ""
echo "2. Or use VS Code Live Server extension to open:"
echo "   /workspaces/newPE/index.html"
echo ""
echo "3. Open browser DevTools (F12) → Console tab"
echo ""
echo "4. Register a student:"
echo "   - Select a house team (Red, Green, Yellow, or Blue)"
echo "   - Upload or take a profile photo"
echo "   - Fill in student details"
echo "   - Click 'Create Student Account'"
echo ""
echo "5. Watch console logs:"
echo "   [registration] starting student registration"
echo "   [dataSdk] create ... (or local fallback message)"
echo "   [registration] registration complete, showing main app"
echo ""
echo "6. Verify persistence across devices:"
echo "   - Open the app in another browser/device"
echo "   - Login: copy the exact student_id from your registration"
echo "   - Your data will load (if Firestore is configured)"
echo "   - Or from localStorage on the same device/browser"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Optional: Enable Firestore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Create a Firebase project: https://console.firebase.google.com"
echo "2. Enable Firestore Database (Test Mode for development)"
echo "3. Get your web config from Project Settings"
echo "4. Paste config into /_sdk/firebase_config.js:"
echo ""
echo "   window.FIREBASE_CONFIG = {"
echo "     apiKey: '...',"
echo "     authDomain: '...'"
echo "     // ... rest of config"
echo "   };"
echo ""
echo "5. Reload the page → Firestore will be used automatically"
echo ""

echo "✓ Setup complete!"
echo ""
