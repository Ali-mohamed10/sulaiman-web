# Firestore Security Rules

## Setup Instructions

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sulaiman-3833f`
3. Navigate to **Firestore Database** → **Rules**
4. Copy and paste the rules from `firestore.rules` file
5. Click **Publish** to deploy the rules

## Rules Explanation

The security rules ensure that:
- Users must be authenticated to read/write keyword searches
- Users can only access their own documents (where `uid == request.auth.uid`)
- All other collections are denied by default

### Testing

After deploying the rules, test them in the Firebase Console using the Rules Playground:
1. Go to Firestore Database → Rules → Rules Playground
2. Test read/write operations for different user scenarios

## Important Notes

- These rules must be deployed in the Firebase Console
- The rules file (`firestore.rules`) is for reference only
- Make sure to create a composite index for queries with `uid` and `searchDate` if you encounter indexing errors

## Common Issues & Solutions

### Issue 1: "Permission denied" error
**Solution:** Make sure the security rules are published in Firebase Console

### Issue 2: "Index required" error
**Solution:** 
1. Check the browser console for the index creation link
2. Click the link to create the composite index automatically
3. Or manually create it in Firebase Console → Firestore → Indexes

### Issue 3: Query returns empty results
**Solution:** 
- Make sure you have created some keyword searches while logged in
- Verify the `uid` field matches your current user's UID
- Check that the data structure matches: `uid`, `searchDate`, `averageSEOScore`, `length`, `relatedKeywords`

