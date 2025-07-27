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
    
    // Actual form submission to FormSubmit
    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      await fetch("https://formsubmit.co/support@tajpetha.in", {
        method: "POST",
        body: formData
      })
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-container py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-4">
          Contact Us
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto">
          Our team of specialists is here to assist you with any inquiries about our petha varieties, 
          special orders, bulk purchases, or taste preferences. We're committed to providing 
          the sweetest experience possible!
        </p>
        
        {/* WhatsApp Button */}
        <div className="mt-8">
          <a 
            href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I'm%20interested%20in%20your%20products%20and%20would%20like%20to%20know%20more."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5C] text-white px-6 py-3 rounded-md transition-colors duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>
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
                We've received your sweet message and will respond within 24 hours.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="luxury-btn-outline mt-6 px-6 py-3"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form action="https://formsubmit.co/support@tajpetha.in" method="POST" onSubmit={handleSubmit} className="space-y-6">
              {/* FormSubmit configurations */}
              <input type="hidden" name="_subject" value="New Taj Petha Contact Form Submission" />
              <input type="hidden" name="_next" value="https://tajpetha.in/thank-you" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="_honey" style={{ display: "none" }} />
              
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
                    <option value="Bulk Orders">Bulk Orders</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Shipping & Delivery">Shipping & Delivery</option>
                    <option value="Product Feedback">Product Feedback</option>
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
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Shop Location</h3>
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-luxury-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div className="text-serif-regular text-luxury-charcoal/80">
                  <p className="mb-1">Shop No-1, Pratap Nagar</p>
                  <p>Agra, 282010</p>
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
                    <p>support@tajpetha.in</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-luxury-gold mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div className="text-serif-regular text-luxury-charcoal/80">
                    <p>+91-92594-18994</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Hours of Operation</h3>
              <div className="space-y-2 text-serif-regular text-luxury-charcoal/80">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Festivals & Holidays</span>
                  <span>9:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-luxury-ivory flex items-center justify-center border border-luxury-gold/20 hover:bg-luxury-gold hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-luxury-ivory flex items-center justify-center border border-luxury-gold/20 hover:bg-luxury-gold hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-luxury-ivory flex items-center justify-center border border-luxury-gold/20 hover:bg-luxury-gold hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="https://wa.me/919259418994?text=Hello%20Taj%20Petha%2C%20I'd%20like%20to%20know%20how%20you%20can%20assist%20me%20today."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#25D366] hover:bg-[#20BD5C] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Chat with us on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </a>
      </div>
    </div>
  )
} 