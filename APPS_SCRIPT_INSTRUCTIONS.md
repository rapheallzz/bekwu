# Form Integration Instructions

Follow these steps to connect your website forms to your Google Spreadsheet and receive email notifications.

## Step 1: Prepare the Google Spreadsheet

1. Open your Google Spreadsheet: [https://docs.google.com/spreadsheets/d/1n3TAOTl9HXg74KkUNAFIeppE7XL7O2CF_wcXTO8Af8c/](https://docs.google.com/spreadsheets/d/1n3TAOTl9HXg74KkUNAFIeppE7XL7O2CF_wcXTO8Af8c/)
2. Create two tabs (sheets) at the bottom if they don't exist:
   - Rename one tab to **Connect Submissions**
   - Rename the other tab to **Report Downloads**
3. (Optional) You can add the headers in the first row of each sheet:
   - **Connect Submissions**: `Timestamp`, `Name`, `Company`, `Role`, `Email`, `Company Type`, `Solve For`, `Challenge`, `Outcome`, `Timeline`
   - **Report Downloads**: `Timestamp`, `First Name`, `Last Name`, `Email`, `Company`, `Role`, `Industry`, `Interest`

## Step 2: Set up the Google Apps Script

1. In your spreadsheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the editor and paste the following code:

```javascript
/**
 * Configuration
 */
var TO_EMAIL = 'info@bekwuconsults.com';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var data = e.parameter;
    var formType = data.formType;
    var targetSheetName = "";
    var rowData = [];
    var emailSubject = "";
    var emailBody = "New form submission details:\n\n";

    if (formType === 'connect-form') {
      targetSheetName = "Connect Submissions";
      rowData = [
        new Date(),
        data.name || "",
        data.company || "",
        data.role || "",
        data.email || "",
        data['company-type'] || "",
        data.solve || "",
        data.challenge || "",
        data.outcome || "",
        data.timeline || ""
      ];
      emailSubject = "New Connect Form Submission: " + (data.name || "Unknown");

      emailBody += "Name: " + (data.name || "") + "\n";
      emailBody += "Company: " + (data.company || "") + "\n";
      emailBody += "Role: " + (data.role || "") + "\n";
      emailBody += "Email: " + (data.email || "") + "\n";
      emailBody += "Company Type: " + (data['company-type'] || "") + "\n";
      emailBody += "Looking to solve: " + (data.solve || "") + "\n";
      emailBody += "Challenge: " + (data.challenge || "") + "\n";
      emailBody += "Outcome: " + (data.outcome || "") + "\n";
      emailBody += "Timeline: " + (data.timeline || "") + "\n";

    } else if (formType === 'modal-download-form') {
      targetSheetName = "Report Downloads";
      rowData = [
        new Date(),
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.company || "",
        data.role || "",
        data.industry || "",
        data.interest || ""
      ];
      emailSubject = "New Report Download: " + (data.firstName || "") + " " + (data.lastName || "");

      emailBody += "First Name: " + (data.firstName || "") + "\n";
      emailBody += "Last Name: " + (data.lastName || "") + "\n";
      emailBody += "Email: " + (data.email || "") + "\n";
      emailBody += "Company: " + (data.company || "") + "\n";
      emailBody += "Role: " + (data.role || "") + "\n";
      emailBody += "Industry: " + (data.industry || "") + "\n";
      emailBody += "Interest: " + (data.interest || "") + "\n";
    }

    if (targetSheetName !== "") {
      var targetSheet = sheet.getSheetByName(targetSheetName);
      if (!targetSheet) {
        targetSheet = sheet.insertSheet(targetSheetName);
        // Add headers if new sheet was created
        if (formType === 'connect-form') {
          targetSheet.appendRow(["Timestamp", "Name", "Company", "Role", "Email", "Company Type", "Solve For", "Challenge", "Outcome", "Timeline"]);
        } else {
          targetSheet.appendRow(["Timestamp", "First Name", "Last Name", "Email", "Company", "Role", "Industry", "Interest"]);
        }
      }
      targetSheet.appendRow(rowData);

      // Send Email Notification
      MailApp.sendEmail(TO_EMAIL, emailSubject, emailBody);
    }

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

3. Click the **Save** icon (disk) and name it "Békwu Form Handler".

## Step 3: Deploy the Script as a Web App

1. Click the blue **Deploy** button at the top right > **New deployment**.
2. Select type: **Web app**.
3. Description: "Békwu Website Form Submission".
4. Execute as: **Me** (your email).
5. Who has access: **Anyone** (this is necessary so the website can send data without the user logging in).
6. Click **Deploy**.
7. If prompted, click **Authorize access**, choose your account, and click **Allow**. (Note: You might see a "Google hasn't verified this app" screen; click "Advanced" and then "Go to Békwu Form Handler (unsafe)" to proceed).
8. Once deployed, copy the **Web App URL**. It will look something like `https://script.google.com/macros/s/.../exec`.

## Step 4: Link the Web App URL to the Website

1. Open the `script.js` file in your website code.
2. Find the line:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_APPS_SCRIPT_URL_HERE'` with the URL you copied in Step 3.
4. Save and upload the updated `script.js` to your server.

**Note:** After making changes to the Apps Script code in the future, you must create a **New Deployment** (or Manage Deployments and update the version) for the changes to take effect.
