# Quick Setup Guide for Click Nova Admin Panel

## Step 1: Install Dependencies

Run the following command if you haven't already:

```bash
npm install firebase tailwindcss postcss autoprefixer
```

## Step 2: Firebase Setup

### Enable Authentication:
1. Go to https://console.firebase.google.com/
2. Select "click-nova" project
3. Click on "Authentication" in the left sidebar
4. Click "Get Started" if not already set up
5. Click on "Sign-in method" tab
6. Enable "Email/Password" provider
7. Click "Save"

### Create Admin User:
1. Still in Authentication section
2. Click on "Users" tab
3. Click "Add user" button
4. Enter email: `admin@clicknova.com` (or your preferred email)
5. Enter password: Create a strong password
6. Click "Add user"

### Enable Firestore Database:
1. Click on "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode" (we'll set rules later)
4. Choose your preferred location (e.g., asia-south1 for India)
5. Click "Enable"

### Set Firestore Security Rules (Important for Production):
1. In Firestore Database, click on "Rules" tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 3: Run the Application

```bash
npm run dev
```

## Step 4: Login

1. Open http://localhost:5173 in your browser
2. You'll be redirected to login page
3. Use the admin credentials you created in Firebase Authentication
4. After login, you'll see the dashboard

## Features Overview

### Dashboard
- Overview of total leads, customers, and employees
- Quick statistics

### Leads Management
- Add new leads
- Edit existing leads
- Delete leads
- Track lead status (New, Contacted, Qualified, Lost)

### Customers Management
- Add new customers
- Edit customer information
- Delete customers
- Track customer status (Active, Inactive)

### Employees Management
- Add new employees
- Edit employee information
- Delete employees
- Track employee details (position, department, salary)

## Security Features

✅ Protected Routes - All dashboard routes require authentication
✅ Auto-redirect to login if not authenticated
✅ Firebase Authentication
✅ Firestore real-time database
✅ Secure environment variables

## Troubleshooting

### Issue: Can't login
- Verify you created a user in Firebase Authentication
- Check that Email/Password sign-in method is enabled
- Verify .env file has correct Firebase credentials

### Issue: Data not saving
- Check that Firestore Database is enabled
- Verify Firestore security rules allow authenticated users

### Issue: Toast notifications not appearing
- Check browser console for errors
- Toasts auto-close after 1500ms (1.5 seconds)

## Next Steps

1. Add more admin users in Firebase Authentication as needed
2. Customize the dashboard statistics
3. Add more fields to leads/customers/employees as needed
4. Set up Firebase hosting for deployment
5. Configure production security rules

## Support

For issues or questions, contact your development team.
