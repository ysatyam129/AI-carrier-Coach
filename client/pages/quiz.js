import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { BookOpen, Play, Trophy, Clock, Target, Star, ArrowRight, Brain, Zap } from 'lucide-react'
import api from '../lib/auth'
import toast from 'react-hot-toast'

export default function Quiz({ user }) {
  const [categories, setCategories] = useState([])
  const [quizStats, setQuizStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchQuizData()
  }, [user, router])

  const fetchQuizData = async () => {
    try {
      const [categoriesRes, statsRes] = await Promise.all([
        api.get('/quiz/categories'),
        api.get('/quiz/stats')
      ])
      
      setCategories(categoriesRes.data?.categories || [])
      setQuizStats(statsRes.data || {})
    } catch (error) {
      console.error('Quiz data fetch error:', error)
      toast.error('Failed to fetch quiz data')
      setCategories([])
      setQuizStats({})
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const startQuiz = (categoryName) => {
    // Navigate to the quiz page for the specific category
    router.push(`/quiz/${encodeURIComponent(categoryName)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading quiz data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Practice Quizzes 🧠
                    </h1>
                    <p className="text-indigo-100 text-lg font-medium">
                      Test your knowledge and improve your skills
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">{quizStats?.totalQuestions || 0} Questions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-medium">{categories?.length || 0} Categories</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <Trophy className="h-16 w-16 text-yellow-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-indigo-100">Average Score</p>
                    <p className="text-3xl font-bold">{quizStats?.averageScore || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Questions</p>
                    <p className="text-3xl font-bold text-blue-600">{quizStats?.totalQuestions || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Categories</p>
                    <p className="text-3xl font-bold text-green-600">{categories.length}</p>
                  </div>
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completed Today</p>
                    <p className="text-3xl font-bold text-purple-600">{quizStats?.completedToday || 0}</p>
                  </div>
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Average Score</p>
                    <p className="text-3xl font-bold text-orange-600">{quizStats?.averageScore || 0}%</p>
                  </div>
                  <div className="p-3 bg-orange-500 rounded-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quiz Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Quiz Categories</h2>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              {categories?.length || 0} Available
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.length > 0 ? categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                      onClick={() => startQuiz(category.name)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <CardTitle className="text-xl font-bold text-slate-800">
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600">
                            {category.questionCount} questions available
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {category.difficulties.map((difficulty) => (
                          <Badge 
                            key={difficulty} 
                            className={`text-xs ${getDifficultyColor(difficulty)} border-0`}
                          >
                            {difficulty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{category.questionCount} Questions</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 group-hover:scale-105 transition-transform duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            startQuiz(category.name)
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start Quiz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 mb-4">No quiz categories available. Please seed the quiz data first.</p>
                <Button 
                  onClick={async () => {
                    try {
                      const response = await api.post('/seed-quiz')
                      if (response.data.success) {
                        toast.success('Quiz data seeded successfully!')
                        fetchQuizData() // Refresh the data
                      }
                    } catch (error) {
                      toast.error('Failed to seed quiz data')
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Seed Quiz Data
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        {quizStats?.recentQuizzes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span>Recent Quiz Activity</span>
                </CardTitle>
                <CardDescription>Your latest quiz performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizStats.recentQuizzes.map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{quiz.category} Quiz</p>
                          <p className="text-sm text-slate-600">{quiz.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{quiz.score}%</p>
                        <p className="text-xs text-slate-500">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}