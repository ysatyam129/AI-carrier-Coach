import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { Badge } from '../../components/ui/badge'
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, Target } from 'lucide-react'
import api from '../../lib/auth'
import toast from 'react-hot-toast'

export default function QuizCategory({ user }) {
  const router = useRouter()
  const { category } = router.query
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (category) {
      fetchQuestions()
    }
  }, [user, category, router])

  useEffect(() => {
    let timer
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted, timeLeft])

  const fetchQuestions = async () => {
    try {
      const decodedCategory = decodeURIComponent(category)
      const response = await api.get(`/quiz/${decodedCategory}`)
      setQuestions(response.data.questions || [])
      setAnswers(new Array((response.data.questions || []).length).fill(null))
    } catch (error) {
      console.error('Failed to fetch questions:', error)
      toast.error('Failed to fetch questions')
      router.push('/quiz')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(300) // Reset timer
  }

  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    try {
      const timeSpent = 300 - timeLeft
      const decodedCategory = decodeURIComponent(category)
      const response = await api.post('/quiz/submit', {
        category: decodedCategory,
        answers,
        timeSpent
      })
      
      setResults(response.data)
      setQuizCompleted(true)
      toast.success(`Quiz completed! Score: ${response.data.score}%`)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      toast.error('Failed to submit quiz')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">
                  {category === 'JavaScript' && '🟨'}
                  {category === 'React' && '⚛️'}
                  {category === 'Python' && '🐍'}
                  {category === 'DSA' && '🧮'}
                  {category === 'AI' && '🤖'}
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {decodeURIComponent(category || '')} Quiz
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 mt-2">
                  Test your knowledge with {questions.length} carefully selected questions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                    <p className="text-sm text-slate-600">Questions</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">5:00</div>
                    <p className="text-sm text-slate-600">Time Limit</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">80%</div>
                    <p className="text-sm text-slate-600">Pass Score</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-3">Quiz Instructions:</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• You have 5 minutes to complete all questions</li>
                    <li>• Each question has only one correct answer</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• Your progress will be saved automatically</li>
                    <li>• Click "Submit Quiz" when you're ready to finish</li>
                  </ul>
                </div>

                <Button 
                  onClick={startQuiz}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">
                  {results.score >= 80 ? '🏆' : results.score >= 60 ? '🎯' : '📚'}
                </div>
                <CardTitle className="text-3xl font-bold">
                  Quiz Completed!
                </CardTitle>
                <CardDescription className="text-lg">
                  Here are your results for the {decodeURIComponent(category || '')} quiz
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                      {results.score}%
                    </div>
                    <p className="text-slate-600 font-medium">Final Score</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {results.correctAnswers}/{results.totalQuestions}
                    </div>
                    <p className="text-slate-600 font-medium">Correct Answers</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {formatTime(300 - timeLeft)}
                    </div>
                    <p className="text-slate-600 font-medium">Time Taken</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => router.push('/quiz')}
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Back to Quizzes
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{decodeURIComponent(category || '')} Quiz</h1>
              <p className="text-slate-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-mono font-bold text-blue-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-slate-600 mt-2">{Math.round(progress)}% Complete</p>
          </div>

          {/* Question */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQ?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {answers[currentQuestion] === index && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-slate-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-3">
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={answers.some(answer => answer === null)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}