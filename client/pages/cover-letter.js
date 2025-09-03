import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { FileText, Sparkles, Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CoverLetter({ user }) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: ''
  })
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      setTimeout(() => {
        const sampleLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.company}. With my background in software development and passion for technology, I am excited about the opportunity to contribute to your team.

My experience includes working with modern technologies and frameworks that align well with your requirements. I am particularly drawn to ${formData.company}'s mission and would love to bring my skills to help achieve your goals.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success.

Best regards,
${user.name}`

        setGeneratedLetter(sampleLetter)
        setLoading(false)
        toast.success('Cover letter generated successfully!')
      }, 2000)
    } catch (error) {
      toast.error('Failed to generate cover letter')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Cover Letter Generator ✨
                    </h1>
                    <p className="text-purple-100 text-lg font-medium">
                      Create professional cover letters with AI assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>Job Details</span>
                </CardTitle>
                <CardDescription>
                  Provide job information to generate a personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Job Title</label>
                    <Input
                      type="text"
                      name="jobTitle"
                      placeholder="e.g. Frontend Developer"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                      className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <Input
                      type="text"
                      name="company"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Job Description</label>
                    <Textarea
                      name="jobDescription"
                      placeholder="Paste the job description here..."
                      value={formData.jobDescription}
                      onChange={handleChange}
                      rows={6}
                      className="border-slate-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Cover Letter</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Letter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Generated Cover Letter</span>
                  </CardTitle>
                  {generatedLetter && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  Your personalized cover letter will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLetter ? (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-medium leading-relaxed">
                      {generatedLetter}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-12 border border-slate-200 text-center">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">
                      Fill out the job details and click "Generate Cover Letter" to create your personalized cover letter
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}