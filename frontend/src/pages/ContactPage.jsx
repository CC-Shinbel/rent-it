import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';

const BASE_URL = 'http://localhost/rent-it';

function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mirror the simple behavior from contactus.html
    alert('Thank you for your message! We will get back to you soon.');
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <MainLayout>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon
            as possible.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-wrapper">
              <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help..."
                    required
                    value={formState.message}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">
                  Send Message
                  <span className="btn-icon">→</span>
                </button>
              </form>
            </div>

            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email Us</h3>
                <p>For general inquiries and support</p>
                <a href="mailto:support@rentit.ph">support@rentit.ph</a>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Call Us</h3>
                <p>Mon-Fri from 8am to 5pm</p>
                <a href="tel:+639123456789">+63 912 345 6789</a>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Visit Us</h3>
                <p>Come say hello at our office</p>
                <address>
                  123 Business Center
                  <br />
                  Manila, Philippines
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Quick answers to common questions.</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do I get started?</h4>
              <p>
                Simply create a free account and you can start managing your rentals right away. No
                credit card required.
              </p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>
                Yes! We offer a 14-day free trial with full access to all features. No commitment
                required.
              </p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>
                We accept all major credit cards, GCash, Maya, and bank transfers.
              </p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>
                Absolutely. You can cancel your subscription at any time with no penalties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ContactPage;
