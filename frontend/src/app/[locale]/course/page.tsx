'use client';
import React from 'react';
import HeroSection from '@/components/Course/HeroSection';
import CourseCatalog from '@/components/Course/CourseCatalog';
import LearningMethodology from '@/components/Course/LearningMethodology';
import Testimonials from '@/components/Course/Testimonials';
import CallToAction from '@/components/Course/CallToAction';

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-base-200 pt-10 pb-20">
      <div className="container mx-auto px-4">
        {/* 1. Hero Section */}
        <HeroSection
          title="Your Language Learning Journey Starts Here"
          subtitle="Expert-led courses designed for rapid language acquisition. Flexible learning paths tailored to your proficiency level and goals."
        />

        {/* 2. Course Catalog */}
        <CourseCatalog />

        {/* 3. Learning Methodology */}
        <LearningMethodology />

        {/* 4. Testimonials */}
        <Testimonials />

        {/* 5. Call to Action with Pricing */}
        <CallToAction />
      </div>
    </div>
  );
}
