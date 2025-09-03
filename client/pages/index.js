import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { BarChart3, Brain, FileText, Target, TrendingUp, Users } from 'lucide-react'
import { authAPI } from '../lib/auth'
import HeroSection from '../components/HeroSection'

export default function Home({ user }) {
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Industry Skill Tracker",
      description: "Track most in-demand skills with real-time data visualization"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "ATS Resume Score",
      description: "Get AI-powered resume analysis and improvement suggestions"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mock Interviews",
      description: "Practice with MCQ-based quizzes on DSA and development skills"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Cover Letter Generator",
      description: "Generate ATS-friendly cover letters for any job application"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Analytics",
      description: "Track your career growth with interactive dashboards"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personalized Tips",
      description: "Get AI-generated career advice tailored to your profile"
    }
  ]

  return (
    <div className="min-h-screen ">
      {/* Header */}
      {/* <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">AI Career Coach</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button onClick={() => router.push('/register')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header> */}

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-white">
            Comprehensive tools to boost your career in tech industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-foreground/80">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-whitetext-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of professionals who have accelerated their tech careers with AI Career Coach
          </p>
          <Button size="lg" onClick={() => router.push('/register')}>
            Get Started Free
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">AI Career Coach</span>
          </div>
          <p className="text-gray-400">
            © 2024 AI Career Coach. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}