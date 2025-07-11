'use client';
import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({
  title = 'Your Language Learning Journey Starts Here',
  subtitle = 'Expert-led courses designed for rapid language acquisition. Flexible learning paths tailored to your proficiency level and goals.',
}: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">{subtitle}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="btn btn-primary btn-lg">Get Started</button>
        <button className="btn btn-outline btn-lg">Take Placement Test</button>
      </div>
    </div>
  );
}
