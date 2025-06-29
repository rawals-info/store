"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"

interface ContactPageProps {
  params: {
    countryCode: string
  }
}

export default function ContactPage({ params }: ContactPageProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    })
  }

  return (
    <div className="content-container py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-4">
          Contact Us
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto">
          Our team of specialists is here to assist you with any inquiries about our marble collections,
          custom commissions, or care and maintenance of your pieces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Send Us a Message</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          
          {isSubmitted ? (
            <div className="bg-luxury-cream/30 p-8 text-center">
              <svg className="w-16 h-16 text-luxury-gold mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="font-display text-xl text-luxury-charcoal mb-2">Thank You for Contacting Us</h3>
              <p className="text-serif-regular text-luxury-charcoal/80">
                We've received your message and will respond within 24 hours.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="luxury-btn-outline mt-6 px-6 py-3"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-small-semi text-luxury-charcoal mb-2">
                    Your Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-luxury-lightgold/50 bg-luxury-ivory p-3 focus:border-luxury-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-small-semi text-luxury-charcoal mb-2">
                    Your Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-luxury-lightgold/50 bg-luxury-ivory p-3 focus:border-luxury-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-small-semi text-luxury-charcoal mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full border border-luxury-lightgold/50 bg-luxury-ivory p-3 focus:border-luxury-gold focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-small-semi text-luxury-charcoal mb-2">
                    Subject*
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-luxury-lightgold/50 bg-luxury-ivory p-3 focus:border-luxury-gold focus:outline-none transition-colors duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Custom Commission">Custom Commission</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Care & Maintenance">Care & Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-small-semi text-luxury-charcoal mb-2">
                  Your Message*
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border border-luxury-lightgold/50 bg-luxury-ivory p-3 focus:border-luxury-gold focus:outline-none transition-colors duration-300"
                ></textarea>
              </div>
              
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="luxury-btn px-8 py-4 w-full sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          )}
        </div>
        
        {/* Contact Information */}
        <div>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Information</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Studio & Showroom</h3>
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-luxury-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div className="text-serif-regular text-luxury-charcoal/80">
                  <p className="mb-1">1234 Luxury Avenue</p>
                  <p className="mb-1">Marble District, Suite 100</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-luxury-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div className="text-serif-regular text-luxury-charcoal/80">
                    <p>contact@imperialcraftofindia.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-luxury-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div className="text-serif-regular text-luxury-charcoal/80">
                    <p>+1 (212) 555-1234</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Hours of Operation</h3>
              <div className="space-y-2 text-serif-regular text-luxury-charcoal/80">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
            
            <div className="bg-luxury-cream/30 p-6">
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Private Appointments</h3>
              <p className="text-serif-regular text-luxury-charcoal/80 mb-4">
                We offer exclusive private appointments for clients interested in our high-end collections or custom commissions.
              </p>
              <div className="luxury-btn-outline inline-block px-6 py-3 cursor-pointer">
                Schedule an Appointment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 