import React from 'react';
import MainLayout from '../layouts/MainLayout';

function TermsPage() {
  return (
    <MainLayout>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-subtitle">Last updated: February 1, 2026</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="legal-content">
            <div className="legal-toc">
              <h3>Table of Contents</h3>
              <ul>
                <li>
                  <a href="#acceptance">1. Acceptance of Terms</a>
                </li>
                <li>
                  <a href="#description">2. Description of Service</a>
                </li>
                <li>
                  <a href="#accounts">3. User Accounts</a>
                </li>
                <li>
                  <a href="#acceptable-use">4. Acceptable Use</a>
                </li>
                <li>
                  <a href="#payment">5. Payment Terms</a>
                </li>
                <li>
                  <a href="#intellectual-property">6. Intellectual Property</a>
                </li>
                <li>
                  <a href="#termination">7. Termination</a>
                </li>
                <li>
                  <a href="#disclaimers">8. Disclaimers</a>
                </li>
                <li>
                  <a href="#limitation">9. Limitation of Liability</a>
                </li>
                <li>
                  <a href="#governing-law">10. Governing Law</a>
                </li>
                <li>
                  <a href="#contact">11. Contact Information</a>
                </li>
              </ul>
            </div>

            <div className="legal-body">
              <section id="acceptance">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using RentIt's videoke rental management platform ("Service"), you
                  agree to be bound by these Terms of Service ("Terms"). If you do not agree to
                  these Terms, you may not access or use the Service.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. Your continued use of the
                  Service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section id="description">
                <h2>2. Description of Service</h2>
                <p>
                  RentIt provides a cloud-based platform for managing videoke rental businesses,
                  including but not limited to:
                </p>
                <ul>
                  <li>Equipment and inventory management</li>
                  <li>Booking and reservation systems</li>
                  <li>Customer relationship management</li>
                  <li>Payment tracking and invoicing</li>
                  <li>Reporting and analytics</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Service at
                  any time.
                </p>
              </section>

              <section id="accounts">
                <h2>3. User Accounts</h2>
                <h3>Registration</h3>
                <p>To use certain features of the Service, you must register for an account. You agree to:</p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>

                <h3>Account Eligibility</h3>
                <p>
                  You must be at least 18 years old and capable of forming a binding contract to use
                  the Service. By using the Service, you represent that you meet these requirements.
                </p>
              </section>

              <section id="acceptable-use">
                <h2>4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Service for any illegal purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Upload malicious code or interfere with the Service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the Service to send spam or unsolicited communications</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect user data without consent</li>
                </ul>
              </section>

              <section id="payment">
                <h2>5. Payment Terms</h2>
                <h3>Subscription Plans</h3>
                <p>
                  The Service offers various subscription plans. By selecting a plan, you agree to
                  pay the applicable fees as described at the time of purchase.
                </p>

                <h3>Billing</h3>
                <ul>
                  <li>Subscription fees are billed in advance on a monthly or annual basis</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We may change pricing with 30 days' notice</li>
                  <li>Failure to pay may result in suspension of your account</li>
                </ul>

                <h3>Free Trial</h3>
                <p>
                  We may offer a free trial period. You will be notified before being charged at the
                  end of any trial period.
                </p>
              </section>

              <section id="intellectual-property">
                <h2>6. Intellectual Property</h2>
                <h3>Our Rights</h3>
                <p>
                  The Service, including its original content, features, and functionality, is owned
                  by RentIt and is protected by copyright, trademark, and other intellectual
                  property laws.
                </p>

                <h3>Your Content</h3>
                <p>
                  You retain ownership of any content you submit to the Service. By submitting
                  content, you grant us a license to use, modify, and display that content in
                  connection with the Service.
                </p>

                <h3>Feedback</h3>
                <p>
                  Any feedback, suggestions, or ideas you provide about the Service may be used by us
                  without any obligation to you.
                </p>
              </section>

              <section id="termination">
                <h2>7. Termination</h2>
                <p>We may terminate or suspend your account and access to the Service:</p>
                <ul>
                  <li>For any violation of these Terms</li>
                  <li>For any illegal or unauthorized use of the Service</li>
                  <li>At our sole discretion, with or without notice</li>
                </ul>
                <p>
                  Upon termination, your right to use the Service will immediately cease. You may
                  terminate your account at any time by contacting us.
                </p>
              </section>

              <section id="disclaimers">
                <h2>8. Disclaimers</h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul>
                  <li>MERCHANTABILITY</li>
                  <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                  <li>NON-INFRINGEMENT</li>
                  <li>ACCURACY OR RELIABILITY</li>
                </ul>
                <p>
                  We do not warrant that the Service will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section id="limitation">
                <h2>9. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, RENTIT SHALL NOT BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
                  NOT LIMITED TO:
                </p>
                <ul>
                  <li>Loss of profits or revenue</li>
                  <li>Loss of data</li>
                  <li>Business interruption</li>
                  <li>Any other intangible losses</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount paid by you in the twelve (12)
                  months preceding the claim.
                </p>
              </section>

              <section id="governing-law">
                <h2>10. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the
                  Philippines, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms shall be resolved through binding arbitration
                  in Manila, Philippines.
                </p>
              </section>

              <section id="contact">
                <h2>11. Contact Information</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div className="contact-box">
                  <p>
                    <strong>RentIt</strong>
                  </p>
                  <p>Email: legal@rentit.ph</p>
                  <p>Address: 123 Business Center, Manila, Philippines</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default TermsPage;
