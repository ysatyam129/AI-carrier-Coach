import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { BarChart3, FileText, Target, TrendingUp, User, Award, Zap, Clock, ArrowUpRight, Star, Trophy, Briefcase, BookOpen } from 'lucide-react'
import api from '../lib/auth'
import toast from 'react-hot-toast'

export default function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [skillsData, setSkillsData] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchDashboardData()
    fetchSkillsData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/dashboard')
      setDashboardData(response.data || {})
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to fetch dashboard data')
      setDashboardData({})
    }
  }

  const fetchSkillsData = async () => {
    try {
      const response = await api.get('/skills/demand')
      setSkillsData(response.data?.skills?.slice(0, 8) || [])
    } catch (error) {
      console.error('Skills fetch error:', error)
      toast.error('Failed to fetch skills data')
      setSkillsData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-t-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {}
  const recentScores = dashboardData?.recentActivity || []

  const pieData = [
    { name: 'Completed', value: stats.totalQuizzes || 0, color: '#3b82f6' },
    { name: 'Remaining', value: Math.max(0, 50 - (stats.totalQuizzes || 0)), color: '#e2e8f0' }
  ]

  const trendData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 82 },
    { month: 'Jun', score: 88 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Trophy className="h-8 w-8 text-yellow-300" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg font-medium">
                      Ready to accelerate your career journey today?
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">Level: Intermediate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-300" />
                    <span className="text-sm font-medium">Streak: 7 days</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <Award className="h-16 w-16 text-yellow-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-blue-100">Career Score</p>
                    <p className="text-3xl font-bold">{Math.round((stats.resumeScore + stats.averageInterviewScore) / 2) || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">Resume Score</CardTitle>
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.resumeScore || 0}%</div>
                <Progress value={stats.resumeScore || 0} className="mb-3 h-2" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 font-medium">ATS Compatibility</p>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">Interview Score</CardTitle>
                <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(stats.averageInterviewScore || 0)}%</div>
                <Progress value={Math.round(stats.averageInterviewScore || 0)} className="mb-3 h-2" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600 font-medium">Quiz Performance</p>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-600/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">Quizzes Taken</CardTitle>
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalQuizzes || 0}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-slate-600">This week: +3</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium">Practice Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-600/10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">Skills Tracked</CardTitle>
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.skillsCount || 0}</div>
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-slate-600 font-medium">Growing</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">In Your Profile</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Skills Demand Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <span>Industry Skill Demand</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-2">
                      Most in-demand skills in tech industry • Updated daily
                    </CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                    Live Data
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis 
                      dataKey="skill" 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        fontSize: '14px'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                    />
                    <Bar 
                      dataKey="demand" 
                      fill="url(#colorBar)" 
                      radius={[6, 6, 0, 0]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress & Trend Charts */}
          <div className="space-y-6">
            {/* Progress Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg font-bold text-slate-800">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <span>Quiz Progress</span>
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.totalQuizzes || 0}/50
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Quizzes completed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg font-bold text-slate-800">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fill="url(#colorArea)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-3">
                    <div className="text-lg font-bold text-green-600">+23% this month</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quiz Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <span>Quiz Overview</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/quiz')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  View All Quizzes
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <CardDescription className="text-slate-600">
                Practice with {dashboardData?.quizOverview?.totalQuestions || 0} questions across {dashboardData?.quizOverview?.categories?.length || 0} categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{dashboardData?.quizOverview?.totalQuestions || 0}</div>
                  <p className="text-xs text-slate-600 font-medium">Total Questions</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-1">{dashboardData?.quizOverview?.completedToday || 0}</div>
                  <p className="text-xs text-slate-600 font-medium">Completed Today</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{dashboardData?.quizOverview?.averageScore || 0}%</div>
                  <p className="text-xs text-slate-600 font-medium">Average Score</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{dashboardData?.quizOverview?.categories?.length || 0}</div>
                  <p className="text-xs text-slate-600 font-medium">Categories</p>
                </div>
              </div>
              
              {dashboardData?.quizOverview?.categories?.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-700">Available Categories:</p>
                    <Button 
                      size="sm"
                      onClick={() => router.push('/quiz')}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Start Quiz
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dashboardData.quizOverview.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => router.push(`/quiz/${encodeURIComponent(category)}`)}
                        className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">
                            {category === 'JavaScript' && '🟨'}
                            {category === 'React' && '⚛️'}
                            {category === 'Python' && '🐍'}
                            {category === 'Node.js' && '🟢'}
                            {category === 'DSA' && '🧮'}
                            {category === 'MongoDB' && '🍃'}
                            {category === 'AI' && '🤖'}
                            {category !== 'JavaScript' && category !== 'React' && category !== 'Python' && category !== 'Node.js' && category !== 'DSA' && category !== 'MongoDB' && category !== 'AI' && '📚'}
                          </div>
                          <p className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Quiz Section */}
        {dashboardData?.quizOverview?.categories?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <span>Quick Quiz</span>
                  </CardTitle>
                  <Button 
                    size="sm"
                    onClick={() => router.push('/quiz')}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
                  >
                    View All
                  </Button>
                </div>
                <CardDescription className="text-slate-600">
                  Start a quick quiz to test your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {dashboardData.quizOverview.categories.slice(0, 6).map((category) => (
                    <button
                      key={category}
                      onClick={() => router.push(`/quiz/${encodeURIComponent(category)}`)}
                      className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-green-50 hover:to-green-100 rounded-xl border border-slate-200 hover:border-green-300 transition-all duration-200 group hover:scale-105"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">
                          {category === 'JavaScript' && '🟨'}
                          {category === 'React' && '⚛️'}
                          {category === 'Python' && '🐍'}
                          {category === 'Node.js' && '🟢'}
                          {category === 'DSA' && '🧮'}
                          {category === 'MongoDB' && '🍃'}
                          {category === 'AI' && '🤖'}
                          {category !== 'JavaScript' && category !== 'React' && category !== 'Python' && category !== 'Node.js' && category !== 'DSA' && category !== 'MongoDB' && category !== 'AI' && '📚'}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-green-700">{category}</p>
                        <p className="text-xs text-slate-500 mt-1">5 Questions</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription className="text-slate-600">
                Continue your career development journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Button 
                    className="h-28 w-full flex-col space-y-3 bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => router.push('/quiz')}
                  >
                    <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="font-semibold">Take Quiz</span>
                  </Button>
                  {dashboardData?.quizOverview?.categories?.length > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                        {dashboardData.quizOverview.categories.length}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="h-28 flex-col space-y-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => router.push('/resume')}
                >
                  <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">Upload Resume</span>
                </Button>
                
                <Button 
                  className="h-28 flex-col space-y-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => router.push('/interview')}
                >
                  <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">Practice Interview</span>
                </Button>
                
                <Button 
                  className="h-28 flex-col space-y-3 bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => router.push('/cover-letter')}
                >
                  <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">Cover Letter</span>
                </Button>
                
                <Button 
                  className="h-28 flex-col space-y-3 bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => router.push('/profile')}
                >
                  <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6" />
                  </div>
                  <span className="font-semibold">Update Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}