# SpendNod — Privacy Policy

**Last Updated:** March 27, 2026
**Effective Date:** March 27, 2026

⚠️ **DISCLAIMER: This is a template drafted by AI, not by an attorney. Have a licensed attorney review and customize this document before publishing. This does not constitute legal advice.**

---

## 1. Introduction

Stack Industries LLC ("Company," "we," "us," or "our") operates SpendNod, an authorization gateway for AI agent transactions. This Privacy Policy describes how we collect, use, store, and protect your information when you use our platform, API, SDK, dashboard, and related services (collectively, the "Service").

## 2. Information We Collect

### 2.1 Account Information
When you create an account, we collect:
- Email address
- Name (if provided)
- Password (stored as a hash, never in plaintext)

### 2.2 Agent and Configuration Data
When you use the Service, we collect:
- Agent registration details (agent names, API key hashes)
- Rule configurations (spending thresholds, vendor lists, category restrictions)
- Authorization request data (action type, amount, vendor, category, description)
- Authorization decisions (approved, denied, pending, expired)
- Approval/denial reasons provided by you

### 2.3 Audit Log Data
We automatically log:
- All authorization requests and decisions
- Rule creation, modification, and deletion events
- Agent registration and revocation events
- Timestamps and decision metadata

### 2.4 Technical Data
We may collect:
- IP addresses
- Browser type and version
- Device information
- Usage patterns and feature interactions

### 2.5 What We Do NOT Collect
SpendNod does not collect, process, or store:
- Credit card numbers, bank account numbers, or payment credentials
- Social Security numbers or government IDs
- Actual payment transaction data (we only see authorization metadata)
- Data from the AI agents themselves beyond what is submitted in authorization requests

## 3. How We Use Your Information

We use your information to:
- Provide and maintain the Service
- Process authorization requests and enforce your configured rules
- Send notifications about pending authorization requests
- Maintain audit logs for your compliance needs
- Communicate with you about your account, updates, and service changes
- Monitor and improve the Service's performance and security
- Enforce our Terms of Service

We do NOT use your information to:
- Sell to third parties
- Target advertising
- Train AI models on your authorization data
- Share with third parties except as described in this policy

## 4. How We Store and Protect Your Information

### 4.1 Data Storage
Your data is stored on:
- Supabase (PostgreSQL database) hosted in the United States
- Railway (backend hosting) in the United States
- Vercel (frontend hosting) with global CDN

### 4.2 Security Measures
We implement reasonable security measures including:
- Encryption in transit (TLS/HTTPS)
- API key storage using SHA-256 hashing
- JWT-based authentication with asymmetric key verification (ES256)
- Role-based access (agents can only access their own authorization data, users can only access their own agents)
- Rate limiting on API endpoints

### 4.3 Data Retention
- Account data: retained until you delete your account
- Audit logs: retained according to your plan tier (7 days for Free, 30 days for Starter, 90 days for Pro, 1 year for Business)
- Authorization request data: retained according to your plan tier
- After the retention period, data may be permanently deleted

## 5. Information Sharing

We may share your information only in these circumstances:

### 5.1 Service Providers
We use third-party service providers to operate the Service:
- **Supabase** — database and authentication
- **Railway** — backend hosting
- **Vercel** — frontend hosting
- **Resend** — email notifications

These providers process data on our behalf and are contractually obligated to protect your information.

### 5.2 Legal Requirements
We may disclose your information if required by law, subpoena, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.

### 5.3 Business Transfers
If Stack Industries LLC is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.

### 5.4 With Your Consent
We may share information with third parties when you explicitly consent to such sharing.

## 6. Your Rights

### 6.1 Access and Export
You can access your data through the dashboard and API at any time. Paid plans include data export functionality.

### 6.2 Correction
You can update your account information through the dashboard.

### 6.3 Deletion
You can request deletion of your account and associated data by contacting us. Upon deletion:
- Your account will be deactivated
- Your API keys will be revoked
- Your data will be permanently deleted within 30 days
- Some data may be retained as required by law

### 6.4 GDPR Rights (for EU residents)
If you are located in the European Union, you have additional rights under the General Data Protection Regulation, including:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing

To exercise these rights, contact us at the address in Section 10.

### 6.5 CCPA Rights (for California residents)
If you are a California resident, you have rights under the California Consumer Privacy Act, including:
- Right to know what personal information we collect
- Right to delete your personal information
- Right to opt-out of the sale of personal information (we do not sell personal information)
- Right to non-discrimination for exercising your rights

## 7. Cookies and Tracking

The dashboard uses essential cookies for authentication and session management. We do not use tracking cookies, advertising cookies, or third-party analytics that track you across websites.

## 8. Children's Privacy

The Service is not intended for use by anyone under the age of 18. We do not knowingly collect information from children. If we learn that we have collected information from a child, we will delete it promptly.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service at least 30 days before they take effect. Your continued use of the Service after changes take effect constitutes acceptance of the updated policy.

## 10. Contact

For privacy-related questions or to exercise your data rights, contact:

Stack Industries LLC
Email: [your-email]
Website: [your-website]

---

**By using SpendNod, you acknowledge that you have read and understood this Privacy Policy.**
