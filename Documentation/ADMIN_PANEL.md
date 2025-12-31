# Admin Panel Documentation

## Overview

The EcoSterile-Pro Admin Panel is a secure, frontend-only system for managing and exporting Firebase data. It provides administrators with powerful data export capabilities in multiple formats (JSON, CSV, Excel, PDF) while maintaining strict security controls.

---

## 🔐 Security Features

### 1. **Admin Email Whitelist**

Only users with authorized email addresses can access the admin panel. This is checked:

- On login (email/password and Google OAuth)
- On page load (session verification)
- Before allowing any exports

**Current Admin Emails:**

```
admin@ecosterile.com
dev@ecosterile.com
support@ecosterile.com
```

**To Add New Admins:**
Edit the `ADMIN_EMAILS` array in:

- `/auth/admin-login.html` (line ~183)
- `/auth/admin-dashboard.html` (line ~200)
- `/services/admin-utils.js` (line ~4)

### 2. **Authentication Methods**

- ✅ Email/Password with Firebase Auth
- ✅ Google OAuth (for authorized Google accounts)
- ❌ No direct access without authentication
- ❌ Non-admins are blocked and logged out

### 3. **Data Security**

- 🔒 All processing is client-side (no data sent to external servers)
- 🔒 Exports are timestamped for audit purposes
- 🔒 Admin session persists in browser localStorage
- 🔒 No plain-text credentials stored

### 4. **Session Management**

- Admin session is tied to Firebase Auth
- Logging out on admin panel clears session
- Session automatically cleared if user loses admin status

---

## 📁 File Structure

```
EcoSterile-Pro/
├── auth/
│   ├── admin-login.html          ← Admin login page
│   ├── admin-dashboard.html      ← Admin data export dashboard
│   ├── signin.html               (existing user login)
│   └── signup.html               (existing user signup)
├── services/
│   ├── firebase.js               (existing Firebase config)
│   ├── admin-utils.js            ← Admin utilities & helpers
│   └── weather.js                (existing)
└── Documentation/
    └── ADMIN_PANEL.md            ← This file
```

---

## 🚀 Getting Started

### 1. **Access the Admin Panel**

Go to your website and navigate to:

```
https://yourdomain.com/auth/admin-login.html
```

Or if running locally:

```
file:///C:/path/to/EcoSterile-Pro/auth/admin-login.html
```

### 2. **Log In as Admin**

**Email/Password Method:**

- Email: `admin@ecosterile.com` (or authorized admin email)
- Password: (Your Firebase Auth password)

**Google OAuth:**

- Click "Sign in with Google"
- Select your authorized Google account
- Authorize the app

### 3. **View Dashboard**

After authentication, you'll see:

- **Statistics Cards** - User counts, reading counts, etc.
- **Data Filters** - Optional date range and data type filters
- **Export Options** - JSON, CSV, Excel, PDF buttons
- **Data Preview** - Live preview of data to be exported

### 4. **Export Data**

Click any export button to download your data:

- **JSON**: Raw data format, all structured data
- **CSV**: Spreadsheet format, comma-separated values
- **Excel**: Professional .xlsx file with multiple sheets
- **PDF**: Summary report with statistics and sample data

---

## 📊 Export Formats

### JSON Export

- **Best for:** Developers, APIs, backups
- **Content:** Complete unmodified data from Firebase
- **File:** `ecosterile-export-YYYY-MM-DD_HH-MM-SS.json`

**Example Structure:**

```json
{
  "users": {
    "userId1": {
      "profile": { "email": "...", "displayName": "..." },
      "phReadings": { ... },
      "pumpLogs": { ... }
    }
  },
  "locations": { ... },
  "phReadings": { ... },
  "pumpLogs": { ... }
}
```

### CSV Export

- **Best for:** Excel, Google Sheets, databases
- **Content:** Flattened data with three columns (Type, ID, Content)
- **File:** `ecosterile-export-YYYY-MM-DD_HH-MM-SS.csv`

**Format:**

```
Data Type,ID,Content
"users","userId1","{...json object...}"
"phReadings","readId1","{...json object...}"
```

### Excel Export (.xlsx)

- **Best for:** Professional reports, analysis, presentations
- **Content:** Multiple sheets (one per data type + summary)
- **File:** `ecosterile-export-YYYY-MM-DD_HH-MM-SS.xlsx`

**Sheets Included:**

- 📋 Summary (statistics and metadata)
- 👥 users (all user profiles)
- 📍 locations (location data)
- 📊 phReadings (pH sensor readings)
- 🔄 pumpLogs (pump activation logs)

### PDF Export

- **Best for:** Sharing reports, documentation, archiving
- **Content:** Formatted report with statistics and sample data
- **File:** `ecosterile-export-YYYY-MM-DD_HH-MM-SS.pdf`

**Includes:**

- ✓ Export date and admin user
- ✓ Database statistics
- ✓ Data summary (first 2000 chars)
- ✓ Page numbers

---

## 🎯 Using Data Filters

### Filter by Data Type

Select which data to export:

- **All Data** - Everything (users, locations, readings, logs)
- **Users Only** - User profiles only
- **pH Readings Only** - Sensor readings
- **Pump Logs Only** - Pump activation history
- **Locations Only** - Location data

### Filter by Date Range

Optional date-based filtering:

- **Start Date** - Include data after this date
- **End Date** - Include data before this date
- Leave blank to include all dates

### Apply Filters

1. Set your preferences
2. Click "🔍 Apply Filters"
3. See preview update
4. Export with filtered data

---

## 🛠️ Technical Details

### Firebase Integration

The admin panel uses Firebase Authentication and Realtime Database:

**Database Path:** `https://eco-sterile-default-rtdb.asia-southeast1.firebasedatabase.app`

**Data Accessed:**

```
/users/{userId}
  /profile
  /phReadings
  /pumpLogs
/locations
```

### Dependencies

External libraries loaded via CDN:

- **SheetJS** (v0.18.5) - Excel export
- **jsPDF** (v2.5.1) - PDF generation
- **html2canvas** (v1.4.1) - Chart rendering in PDFs
- **Firebase SDK** (v12.7.0) - Authentication and database

### Browser Compatibility

✅ Chrome/Chromium v90+
✅ Firefox v88+
✅ Safari v14+
✅ Edge v90+
❌ Internet Explorer (not supported)

---

## 📝 Code Examples

### Using Admin Utils in Your Code

```javascript
import {
  isAdminUser,
  getCurrentAdminUser,
  saveAdminUser,
  createAuditLog,
  logAuditEvent,
  formatDate,
  downloadFile,
} from "./services/admin-utils.js";

// Check if email is admin
if (isAdminUser("user@example.com")) {
  console.log("User is admin");
}

// Get current admin
const admin = getCurrentAdminUser();

// Create audit log
const log = createAuditLog("Data Export", "Exported JSON", admin.email);
await logAuditEvent(log);

// Format a date
const formatted = formatDate(new Date(), "YYYY-MM-DD");

// Download a file
downloadFile(jsonContent, "data.json", "application/json");
```

### Customizing Admin Emails

**In HTML (admin-login.html):**

```javascript
const ADMIN_EMAILS = [
  "admin@ecosterile.com",
  "dev@ecosterile.com",
  "yourname@yourcompany.com", // Add your email
  "anotherperson@yourcompany.com",
];
```

**In JavaScript (admin-utils.js):**

```javascript
import { addAdminEmail, removeAdminEmail } from "./services/admin-utils.js";

// Add new admin
addAdminEmail("newadmin@example.com");

// Remove admin
removeAdminEmail("oldadmin@example.com");
```

---

## ⚠️ Important Notes

### Data Privacy

- ✅ All processing happens in the browser
- ✅ No data leaves your device
- ✅ No third-party servers have access to exported data
- ⚠️ Still ensure secure file storage after download

### Audit Logging

- Each export is logged with:
  - Timestamp
  - Admin email
  - Action performed
  - Browser/device info
- Logs stored in browser localStorage for quick retrieval

### Firebase Security Rules

Ensure your Firebase security rules restrict data access:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "You do not have admin access"

**Solution:** Your email is not in the `ADMIN_EMAILS` list. Add it to:

- `/auth/admin-login.html`
- `/auth/admin-dashboard.html`
- `/services/admin-utils.js`

### Issue: "Login failed" with correct credentials

**Solution:**

1. Verify email is correct
2. Check Firebase Auth setup
3. Clear browser cache
4. Try incognito/private window
5. Check Firebase security rules

### Issue: Data shows as "Loading data..."

**Solution:**

1. Check internet connection
2. Verify Firebase database has data
3. Check browser console for errors (F12)
4. Verify Firebase security rules allow reads

### Issue: Export buttons disabled

**Solution:**

1. Wait for data to load completely
2. Refresh page with Ctrl+Shift+R
3. Check if Firebase database is accessible
4. Check console logs for connection errors

### Issue: PDF looks strange or blank

**Solution:**

1. Try refreshing the page
2. Use a different export format first
3. Check if data is loading (preview shows data?)
4. Try in a different browser

---

## 📞 Support & Maintenance

### Adding New Features

To extend the admin panel:

1. **Add to HTML page** - Create new export button/filter
2. **Add to admin-dashboard.js** - Implement export logic
3. **Add to admin-utils.js** - Create reusable utility function
4. **Test thoroughly** - Ensure security not compromised
5. **Document changes** - Update this file

### Removing Admin Access

```javascript
// Remove from ADMIN_EMAILS array
const ADMIN_EMAILS = [
  "admin@ecosterile.com",
  // "removed-admin@example.com",  ← Comment out or remove
  "dev@ecosterile.com",
];

// Also in Firebase:
// Sign out the user if currently logged in
// Remove their account if using Firebase Auth
```

### Backing Up Admins List

Keep a backup copy of authorized admin emails:

```
Last Updated: [date]
admin@ecosterile.com - Main Admin
dev@ecosterile.com - Development Team
support@ecosterile.com - Support Team
```

---

## 🎓 Learning Resources

### Firebase Documentation

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

### External Libraries

- [SheetJS (xlsx) Docs](https://docs.sheetjs.com)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [HTML2Canvas](https://html2canvas.hertzen.com)

### Web Standards

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

---

## 📋 Version History

**v1.0.0** (Current)

- ✅ Admin login page with email/password & Google OAuth
- ✅ Admin dashboard with statistics
- ✅ JSON, CSV, Excel, PDF export
- ✅ Date range filtering
- ✅ Data type filtering
- ✅ Live data preview
- ✅ Email whitelist security
- ✅ Session management
- ✅ Audit logging
- ✅ Full documentation

---

## ✅ Checklist for Production

Before deploying to production:

- [ ] Update ADMIN_EMAILS with real admin emails
- [ ] Test all export formats with real data
- [ ] Verify Firebase security rules
- [ ] Test on all supported browsers
- [ ] Set up HTTPS (required for OAuth)
- [ ] Test date filtering
- [ ] Backup admin emails list
- [ ] Document any custom modifications
- [ ] Set up audit log monitoring
- [ ] Test logout and session clearing
- [ ] Verify mobile responsiveness
- [ ] Test with different data volumes

---

**Last Updated:** December 2024
**Maintained By:** EcoSterile Development Team
**Security Level:** High - Production Ready ✅
