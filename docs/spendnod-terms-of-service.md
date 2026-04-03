# SpendNod — Terms of Service

**Last Updated:** March 27, 2026
**Effective Date:** March 27, 2026

⚠️ **DISCLAIMER: This is a template drafted by AI, not by an attorney. Have a licensed attorney review and customize this document before publishing. This does not constitute legal advice.**

---

## 1. Introduction and Acceptance

These Terms of Service ("Terms") govern your access to and use of the SpendNod platform, API, SDK, dashboard, and related services (collectively, the "Service") operated by Stack Industries LLC ("Company," "we," "us," or "our").

By creating an account, accessing, or using the Service, you ("User," "you," or "your") agree to be bound by these Terms. If you do not agree, do not use the Service.

If you are using the Service on behalf of a business or other legal entity, you represent that you have the authority to bind that entity to these Terms.

## 2. Description of Service

SpendNod is an authorization gateway that provides a configurable rules engine and human-in-the-loop approval workflow for AI agent transactions. The Service allows users to:

- Register AI agents and issue API credentials
- Define authorization rules (spending thresholds, vendor restrictions, category controls, velocity limits)
- Review, approve, or deny pending authorization requests
- Access audit logs of all authorization decisions

**SpendNod is NOT a payment processor, financial institution, money transmitter, bank, or financial advisor.** SpendNod does not process, hold, transfer, or have access to any funds. SpendNod does not execute transactions. SpendNod provides an authorization decision layer only — actual payment processing occurs through third-party payment providers chosen by the User.

## 3. User Accounts

### 3.1 Registration
You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.

### 3.2 API Keys
API keys issued through the Service are confidential credentials. You are solely responsible for all activity that occurs under your API keys. You must immediately notify us if you become aware of any unauthorized use of your credentials.

### 3.3 Account Security
You are responsible for maintaining the security of your account, including but not limited to: safeguarding API keys, configuring appropriate authorization rules, and monitoring agent activity through the dashboard and audit logs.

## 4. User Responsibilities — Rule Configuration

### 4.1 You Control the Rules
SpendNod provides tools for you to configure authorization rules for your AI agents. **You are solely responsible for configuring rules that are appropriate for your use case and risk tolerance.** This includes but is not limited to: setting spending thresholds, defining approved and blocked vendors, establishing daily and monthly spending limits, and configuring approval requirements.

### 4.2 Conservative Defaults
New agents registered on the platform default to requiring human approval for all requests ("pending" status) until you explicitly configure auto-approval rules. By modifying these defaults, you acknowledge and accept the risks associated with your chosen configuration.

### 4.3 Rule Configuration Warnings
The Service may display warnings when you configure rules that could result in high-value auto-approvals. These warnings are informational and do not constitute financial advice. The decision to accept or modify your rule configuration is yours alone.

### 4.4 No Guarantee of Loss Prevention
While SpendNod is designed to provide authorization controls for AI agent transactions, **we do not guarantee that the Service will prevent unauthorized, unintended, or excessive transactions.** The Service enforces rules as configured by you. If your rules permit a transaction, the Service will authorize it. Software systems may experience bugs, downtime, or other issues that could affect rule enforcement.

## 5. Prohibited Uses

You agree not to use the Service to:

- Violate any applicable law, regulation, or third-party rights
- Process, store, or transmit sensitive financial data (credit card numbers, bank account numbers) through SpendNod's API — the Service handles authorization metadata only
- Attempt to circumvent rate limits, usage quotas, or security measures
- Reverse-engineer, decompile, or attempt to derive the source code of the Service
- Use the Service to facilitate fraud, money laundering, or other financial crimes
- Resell or redistribute access to the Service without written authorization
- Transmit malicious code or attempt to gain unauthorized access to our systems

## 6. Intellectual Property

### 6.1 Our Property
The Service, including all software, APIs, documentation, dashboard interfaces, and related technology, is the property of Stack Industries LLC and is protected by intellectual property laws. These Terms do not grant you any rights to our trademarks, branding, or proprietary technology.

### 6.2 Your Data
You retain ownership of all data you submit to or generate through the Service, including agent configurations, rules, and authorization request data. We do not claim ownership of your data.

### 6.3 License to Use Your Data
You grant us a limited license to use your data solely for the purpose of providing and improving the Service. We will not sell your data to third parties.

## 7. Service Plans and Billing

### 7.1 Free Tier
The free tier provides limited access to the Service as described on our pricing page. We reserve the right to modify free tier limits at any time.

### 7.2 Paid Plans
Paid plans are billed monthly or annually as selected at the time of purchase. Features, limits, and pricing for each tier are described on our pricing page and may be updated with 30 days notice.

### 7.3 Overages
If your usage exceeds your plan's included limits, overage charges may apply at the rates specified in your plan. Your Service will not be interrupted due to overages — your agents will continue to function, and overage charges will appear on your next invoice.

### 7.4 Refunds
Subscription fees are non-refundable except as required by applicable law. If you believe there has been a billing error, contact us within 30 days.

## 8. Limitation of Liability

### 8.1 No Liability for Authorized Transactions
**SpendNod is an authorization layer, not a payment processor.** We do not execute, process, or facilitate financial transactions. If your AI agent completes a transaction that was authorized by your configured rules (whether auto-approved or human-approved), we bear no liability for that transaction, regardless of the amount.

### 8.2 No Liability for Rule Configuration
You are solely responsible for configuring authorization rules appropriate for your use case. We are not liable for any losses, damages, or costs resulting from rule configurations that you created, modified, or failed to create.

### 8.3 General Limitation
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL STACK INDUSTRIES LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION: LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:

- YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE
- ANY TRANSACTIONS AUTHORIZED OR DENIED THROUGH THE SERVICE
- ANY UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR DATA OR RULE CONFIGURATIONS
- ANY INTERRUPTION OR CESSATION OF THE SERVICE
- ANY BUGS, ERRORS, OR INACCURACIES IN THE SERVICE

### 8.4 Maximum Liability
OUR TOTAL AGGREGATE LIABILITY ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100 USD).

### 8.5 Acknowledgment
You acknowledge that SpendNod is a tool to assist with authorization decisions, not a guarantee against financial loss. You acknowledge that you are responsible for implementing additional safeguards appropriate to your use case, including but not limited to: monitoring agent activity, reviewing audit logs, setting appropriate spending limits, and maintaining your own financial controls independent of SpendNod.

## 9. Indemnification

You agree to indemnify, defend, and hold harmless Stack Industries LLC and its officers, directors, employees, and agents from any claims, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:

- Your use of the Service
- Your rule configurations and authorization decisions
- Transactions authorized through your account
- Your violation of these Terms
- Your violation of any applicable law or third-party rights

## 10. Service Availability and Disclaimers

### 10.1 Availability
We strive to maintain high availability of the Service but do not guarantee uninterrupted access. The Service may experience downtime for maintenance, updates, or unforeseen technical issues. We are not liable for any losses resulting from Service unavailability.

### 10.2 "As Is" Disclaimer
THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.

### 10.3 No Financial Advice
Nothing in the Service constitutes financial, legal, or professional advice. The rule templates, thresholds, and configurations provided by the Service are suggestions only and should not be relied upon as professional guidance.

## 11. Data and Privacy

### 11.1 Data Processing
We process data necessary to provide the Service, including: account information, agent configurations, authorization requests, and audit logs. Our processing of personal data is governed by our Privacy Policy.

### 11.2 Data Retention
Audit log retention periods vary by plan tier. Data is retained for the period specified in your plan and may be deleted after that period. You are responsible for exporting data you wish to retain beyond your plan's retention period.

### 11.3 Data Security
We implement reasonable security measures to protect your data, including encryption in transit, secure credential storage, and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.

## 12. Compliance

### 12.1 Your Compliance Obligations
You are responsible for ensuring that your use of the Service complies with all applicable laws and regulations, including but not limited to: financial regulations, data protection laws (including GDPR if applicable), consumer protection laws, and industry-specific requirements.

### 12.2 EU AI Act
SpendNod provides audit trail and human oversight capabilities that may assist with EU AI Act compliance obligations. However, **use of SpendNod does not automatically make your AI systems compliant with the EU AI Act or any other regulation.** You are responsible for ensuring your overall AI governance meets applicable regulatory requirements.

### 12.3 Export Controls
You agree not to use the Service in violation of any applicable export control laws or sanctions.

## 13. Termination

### 13.1 By You
You may terminate your account at any time by contacting us or using the account deletion feature in the dashboard. Termination does not entitle you to a refund of pre-paid fees.

### 13.2 By Us
We may suspend or terminate your account if we reasonably believe you have violated these Terms, if required by law, or if your account poses a security risk to the Service or other users. We will make reasonable efforts to notify you before termination except where prohibited by law or where immediate action is necessary.

### 13.3 Effect of Termination
Upon termination: your access to the Service will cease, your API keys will be revoked, and your agents will no longer be able to submit authorization requests. We may retain audit log data as required by law or for legitimate business purposes.

## 14. Modifications to Terms

We may update these Terms from time to time. We will notify you of material changes by email or through the Service at least 30 days before they take effect. Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.

## 15. Dispute Resolution

### 15.1 Governing Law
These Terms shall be governed by and construed in accordance with the laws of the State of Iowa, without regard to its conflict of laws provisions.

### 15.2 Informal Resolution
Before filing any formal dispute, you agree to contact us and attempt to resolve the dispute informally for at least 30 days.

### 15.3 Arbitration
Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in Des Moines, Iowa.

### 15.4 Class Action Waiver
You agree that any disputes will be resolved on an individual basis and not as part of a class, consolidated, or representative action.

## 16. General Provisions

### 16.1 Entire Agreement
These Terms, together with the Privacy Policy, constitute the entire agreement between you and Stack Industries LLC regarding the Service.

### 16.2 Severability
If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.

### 16.3 Waiver
Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision.

### 16.4 Assignment
You may not assign these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.

## 17. Contact

For questions about these Terms, contact:

Stack Industries LLC
Email: [your-email]
Website: [your-website]

---

**By using SpendNod, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.**
