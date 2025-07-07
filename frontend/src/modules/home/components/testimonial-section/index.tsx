"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    text: "The craftsmanship of my marble Taj Mahal is simply extraordinary. It's become the centerpiece of my home and draws admiration from every guest.",
    author: "Alexander Winston",
    title: "Art Collector",
    image: "/customer-1.jpg" // Replace with actual image path
  },
  {
    id: 2,
    text: "I've purchased luxury items from around the world, but the marble sculptures from this artisan are truly unparalleled. The attention to detail is breathtaking.",
    author: "Victoria Harding",
    title: "Interior Designer",
    image: "/customer-2.jpg" // Replace with actual image path
  },
  {
    id: 3,
    text: "The epoxy marble table I purchased is both a functional piece and a work of art. It's transformed my dining area into a space of elegance and sophistication.",
    author: "Jonathan Pierce",
    title: "Luxury Home Owner",
    image: "/customer-3.jpg" // Replace with actual image path
  }
]

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 8000)
    
    return () => clearInterval(interval)
  }, [currentIndex])
  
  const goToNext = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      setIsAnimating(false)
    }, 500)
  }
  
  const goToPrevious = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      )
      setIsAnimating(false)
    }, 500)
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-luxury-charcoal/95 z-0"></div>
      <div className="absolute inset-0 bg-[url('/marble-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 gold-gradient opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 gold-gradient opacity-10 rounded-full blur-3xl"></div>
      
      <div className="content-container relative z-10">
        <div className="text-center mb-16">
          <span className="font-serif text-sm uppercase tracking-[0.3em] text-luxury-gold">Client Testimonials</span>
          <div className="h-px w-24 bg-luxury-gold mx-auto my-6"></div>
          <h2 className="font-display text-3xl text-luxury-ivory mb-4">Words from Our Collectors</h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Testimonial carousel */}
          <div className="relative px-4 sm:px-0">
            <div 
              className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="w-20 h-20 rounded-full bg-luxury-cream/20 flex items-center justify-center">
                    <span className="text-luxury-gold font-display text-4xl">"</span>
                  </div>
                </div>
                
                <blockquote className="text-luxury-ivory font-serif text-xl italic mb-8 leading-relaxed">
                  {testimonials[currentIndex].text}
                </blockquote>
                
                <div className="mt-6">
                  <div className="h-px w-12 bg-luxury-gold mx-auto mb-4"></div>
                  <h4 className="font-display text-luxury-gold text-lg">
                    {testimonials[currentIndex].author}
                  </h4>
                  <p className="text-luxury-ivory/70 text-sm">
                    {testimonials[currentIndex].title}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <button 
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full border border-luxury-gold/30 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10 transition-colors pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <button 
                onClick={goToNext}
                className="w-12 h-12 rounded-full border border-luxury-gold/30 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/10 transition-colors pointer-events-auto"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsAnimating(false)
                  }, 500)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-luxury-gold w-8' 
                    : 'bg-luxury-gold/30 hover:bg-luxury-gold/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 