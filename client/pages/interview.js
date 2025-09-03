import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ArrowLeft, Clock, CheckCircle, XCircle, Brain, Target } from 'lucide-react'
import api from '../lib/auth'

export default function Interview({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [quizStarted, setQuizStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const categories = [
    { id: 'DSA', name: 'Data Structures & Algorithms', icon: '🧮' },
    { id: 'Development', name: 'Web Development', icon: '💻' },
    { id: 'AI', name: 'Artificial Intelligence', icon: '🤖' },
    { id: 'Cloud', name: 'Cloud Computing', icon: '☁️' }
  ]

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    let timer
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitAnswer()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, showResult])

  const startQuiz = async (category) => {
    setLoading(true)
    try {
      const response = await api.get(`/interview/quiz/${category}?limit=5`)
      setQuestions(response.data)
      setSelectedCategory(category)
      setCurrentQuestion(0)
      setQuizStarted(true)
      setTimeLeft(60)
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (questions.length === 0) return

    const question = questions[currentQuestion]
    
    try {
      const response = await api.post('/interview/quiz/submit', {
        quizId: question._id,
        selectedAnswer: selectedAnswer,
        timeSpent: 60 - timeLeft
      })
      
      setQuizResult(response.data)
      setShowResult(true)
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(60)
    } else {
      // Quiz completed
      router.push('/dashboard')
    }
  }

  const resetQuiz = () => {
    setSelectedCategory('')
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizStarted(false)
    setTimeLeft(60)
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mock Interview Practice</h1>
                <p className="text-gray-600">Choose a category to start practicing</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">Ready to Practice?</CardTitle>
                  <CardDescription>
                    Select a category below to start your mock interview session. 
                    Each session contains 5 questions with 60 seconds per question.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="card-hover cursor-pointer h-full" onClick={() => startQuiz(category.id)}>
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-4">{category.icon}</div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          Practice questions related to {category.name.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Button className="w-full" disabled={loading}>
                          {loading ? 'Loading...' : 'Start Practice'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  if (!question) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={resetQuiz}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedCategory} Practice
                </h1>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-700'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {!showResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{question.question}</CardTitle>
                  <CardDescription>
                    Select the best answer from the options below
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAnswer(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </div>
                    </div>
                  ))}

                  <Button 
                    className="w-full mt-6" 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mb-4">
                    {quizResult?.isCorrect ? (
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                    )}
                  </div>
                  <CardTitle className={quizResult?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {quizResult?.isCorrect ? 'Correct!' : 'Incorrect'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Correct Answer:</p>
                    <p>{question.options[quizResult?.correctAnswer]}</p>
                  </div>

                  {quizResult?.explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Explanation:</p>
                      <p>{quizResult.explanation}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    {currentQuestion < questions.length - 1 ? (
                      <Button className="flex-1" onClick={nextQuestion}>
                        Next Question
                      </Button>
                    ) : (
                      <Button className="flex-1" onClick={() => router.push('/dashboard')}>
                        Complete Quiz
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetQuiz}>
                      End Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}