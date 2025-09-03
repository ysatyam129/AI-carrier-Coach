import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2, Target, TrendingUp } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Resume({ user }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a resume file')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDescription)

    try {
      toast.loading('Analyzing your resume...', { id: 'resume-analysis' })
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/resume/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      setAnalysis(response.data)
      toast.success('Resume analysis completed!', { id: 'resume-analysis' })
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to analyze resume. Please try again.', { id: 'resume-analysis' })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <AlertCircle className="h-5 w-5 text-yellow-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <FileText className="h-7 w-7 text-blue-600" />
                <span>Resume ATS Analyzer</span>
              </h1>
              <p className="text-gray-600">Upload your resume for AI-powered analysis and get instant feedback</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                  <CardDescription>
                    Upload your resume (PDF or DOCX) and optionally add a job description for targeted analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50 scale-105' 
                          : file 
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {file ? (
                        <div className="space-y-4">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-green-700">
                              {file.name}
                            </p>
                            <p className="text-sm text-green-600">
                              File ready for analysis • {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFile(null)}
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                          <div className="space-y-2">
                            <p className="text-xl font-semibold text-gray-700">
                              Drop your resume here or click to browse
                            </p>
                            <p className="text-sm text-gray-500">
                              Supports PDF and DOCX files up to 5MB
                            </p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileChange}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label 
                            htmlFor="resume-upload"
                            className="inline-flex items-center justify-center px-4 py-2 mt-4 border-2 border-blue-300 text-blue-700 bg-white hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200 font-medium"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Job Description */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <label className="text-sm font-semibold text-gray-700">
                          Job Description (Optional but Recommended)
                        </label>
                      </div>
                      <textarea
                        className="w-full min-h-[140px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Paste the job description here for targeted analysis and better keyword matching...

Example:
- Looking for a Full Stack Developer with 2+ years experience
- Must have skills in React, Node.js, MongoDB
- Experience with AWS and Docker preferred
- Strong problem-solving skills required"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Adding a job description provides more targeted suggestions and keyword analysis
                        </p>
                        <span className="text-xs text-gray-400">
                          {jobDescription.length} characters
                        </span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg" 
                      disabled={!file || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Resume...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* ATS Score */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <span>ATS Compatibility Score</span>
                  </CardTitle>
                  <CardDescription>
                    How well your resume passes Applicant Tracking Systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`text-7xl font-bold ${getScoreColor(analysis.atsScore)} mb-4`}>
                      {analysis.atsScore}%
                    </div>
                    <Progress value={analysis.atsScore} className="h-3 mb-4" />
                    <div className="flex items-center justify-center space-x-2">
                      {getScoreIcon(analysis.atsScore)}
                      <p className="text-lg font-semibold text-gray-700">
                        {analysis.atsScore >= 80 ? 'Excellent - Ready to apply!' : 
                         analysis.atsScore >= 60 ? 'Good - Minor improvements needed' : 'Needs Improvement - Requires optimization'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <span>Improvement Suggestions</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations to boost your ATS score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.suggestions?.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 font-medium">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              {analysis.missingKeywords?.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <span>Missing Keywords</span>
                    </CardTitle>
                    <CardDescription>
                      Consider adding these relevant keywords to improve ATS compatibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-full text-sm font-semibold border border-red-200 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <span>Resume Strengths</span>
                    </CardTitle>
                    <CardDescription>
                      What your resume does exceptionally well
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => setAnalysis(null)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze Another Resume
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}