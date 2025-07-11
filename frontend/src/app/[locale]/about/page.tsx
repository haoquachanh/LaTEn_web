export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              About LaTEn
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Language & Technology Enhanced Learning - Revolutionizing education through innovative technology and
              personalized learning experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-base-content/70 mb-6">
                At LaTEn, we believe that learning should be accessible, engaging, and tailored to individual needs. Our
                mission is to bridge the gap between traditional education and modern technology.
              </p>
              <p className="text-lg text-base-content/70 mb-8">
                We empower learners worldwide with cutting-edge tools, expert instructors, and a supportive community
                that fosters growth and innovation.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="badge badge-primary badge-lg">Innovation</div>
                <div className="badge badge-secondary badge-lg">Excellence</div>
                <div className="badge badge-accent badge-lg">Community</div>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Founded</div>
                    <div className="stat-value text-primary">2024</div>
                    <div className="stat-desc">Year of establishment</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Students</div>
                    <div className="stat-value text-secondary">10,000+</div>
                    <div className="stat-desc">Active learners worldwide</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Courses</div>
                    <div className="stat-value text-accent">50+</div>
                    <div className="stat-desc">Available learning paths</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              The principles that guide everything we do at LaTEn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-xl">Quality Education</h3>
                <p className="text-base-content/70">
                  We maintain the highest standards in our curriculum, ensuring every learner receives world-class
                  education.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-xl">Inclusive Community</h3>
                <p className="text-base-content/70">
                  We foster an inclusive environment where every learner feels welcomed and supported in their journey.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="card-title text-xl">Innovation</h3>
                <p className="text-base-content/70">
                  We continuously innovate our platform and teaching methods to provide the best learning experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Passionate educators and technologists working together to transform learning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">JD</span>
                  </div>
                </div>
                <h3 className="card-title justify-center">John Doe</h3>
                <p className="text-primary font-medium">Founder & CEO</p>
                <p className="text-base-content/70 text-sm">
                  Visionary leader with 15+ years in educational technology and a passion for democratizing learning.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-secondary">JS</span>
                  </div>
                </div>
                <h3 className="card-title justify-center">Jane Smith</h3>
                <p className="text-secondary font-medium">CTO</p>
                <p className="text-base-content/70 text-sm">
                  Tech innovator specializing in AI-powered learning systems and scalable educational platforms.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">MJ</span>
                  </div>
                </div>
                <h3 className="card-title justify-center">Mike Johnson</h3>
                <p className="text-accent font-medium">Head of Education</p>
                <p className="text-base-content/70 text-sm">
                  Educational expert with a PhD in Learning Sciences and 20+ years of teaching experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Start your learning journey today and become part of our growing global community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg">Get Started Free</button>
            <button className="btn btn-outline btn-lg">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}
