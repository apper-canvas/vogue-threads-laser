import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            About Vogue Threads
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Crafting timeless elegance and contemporary style for the modern wardrobe
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At Vogue Threads, we believe that fashion is more than just clothing – it's a form of self-expression, 
              confidence, and art. We curate exceptional pieces that blend timeless sophistication with contemporary 
              trends, ensuring every customer finds their perfect style.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-surface rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Sparkles" size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Quality First</h3>
              <p className="text-gray-600">
                We source only the finest materials and partner with skilled artisans to create 
                pieces that stand the test of time.
              </p>
            </div>
            <div className="text-center p-6 bg-surface rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Heart" size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Sustainable Fashion</h3>
              <p className="text-gray-600">
                We're committed to ethical practices and sustainable fashion that respects 
                both people and the planet.
              </p>
            </div>
            <div className="text-center p-6 bg-surface rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Customer Centric</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide exceptional service and 
                personalized styling advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            Our passionate team of fashion experts, designers, and stylists work tirelessly to bring you 
            the latest trends and timeless classics. With years of experience in the fashion industry, 
            we understand what makes great style.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="User" size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Sarah Chen</h3>
              <p className="text-gray-600 mb-2">Creative Director</p>
              <p className="text-sm text-gray-500">10+ years in luxury fashion design</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="User" size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Marcus Rivera</h3>
              <p className="text-gray-600 mb-2">Head Stylist</p>
              <p className="text-sm text-gray-500">Fashion consultant and trend forecaster</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Discover Your Style?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Explore our curated collection of premium fashion pieces and find your perfect look today.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.location.href = '/products'}
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-3"
          >
            Shop Collection
          </Button>
        </div>
      </section>
    </div>
  );
}

export default About;