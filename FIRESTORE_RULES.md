# Firebase Firestore Security Rules

Copy these rules to your Firebase Console → Firestore Database → Rules

## Production Rules (Secure)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Leads collection - only authenticated users can access
    match /leads/{leadId} {
      allow read, write: if isAuthenticated();
    }
    
    // Customers collection - only authenticated users can access
    match /customers/{customerId} {
      allow read, write: if isAuthenticated();
    }
    
    // Employees collection - only authenticated users can access
    match /employees/{employeeId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

## Development Rules (Less Restrictive - Use Only for Testing)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## How to Apply Rules

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your "click-nova" project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab at the top
5. Copy and paste one of the rule sets above
6. Click "Publish" button
7. Wait for confirmation message

## ⚠️ Important Security Notes

- **Never** use rules that allow unauthenticated access in production
- **Always** test your rules before deploying
- **Regularly** review and update security rules
- **Monitor** Firestore usage in Firebase Console

## Testing Rules

You can test your security rules in the Firebase Console:
1. Go to Rules tab
2. Click on "Rules playground" button
3. Test different scenarios (authenticated, unauthenticated)
4. Verify only authenticated users can access data

## Advanced Rules (Optional)

If you want to add more security, you can add validation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Leads with validation
    match /leads/{leadId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
        && request.resource.data.name is string
        && request.resource.data.email is string
        && request.resource.data.email.matches('.*@.*');
      allow update, delete: if isAuthenticated();
    }
    
    // Customers with validation
    match /customers/{customerId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated()
        && request.resource.data.name is string
        && request.resource.data.email is string;
      allow update, delete: if isAuthenticated();
    }
    
    // Employees with validation
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated()
        && request.resource.data.name is string
        && request.resource.data.email is string
        && request.resource.data.salary is number;
      allow update, delete: if isAuthenticated();
    }
  }
}
```

## Recommended: Start with Basic Rules

For now, use the **Production Rules (Secure)** shown at the top of this file. You can always enhance them later as your needs grow.
