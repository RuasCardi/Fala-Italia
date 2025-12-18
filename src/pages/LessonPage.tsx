import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Volume2 } from 'lucide-react'
import TranslationExercise from '../components/exercises/TranslationExercise'
import MultipleChoiceExercise from '../components/exercises/MultipleChoiceExercise'
import { lessons } from '../data/lessons'
import useUserStore from '../store/userStore'

export default function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = id ? lessons[id] : null
  const { completeLesson } = useUserStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    if (!lesson) {
      navigate('/')
    }
  }, [lesson, navigate])

  if (!lesson) return <div className="container mx-auto px-4 py-8 text-center">Lição não encontrada</div>

  const currentExercise = lesson.exercises[currentIndex]
  const progress = ((currentIndex + 1) / lesson.exercises.length) * 100

  const handleComplete = (correct: boolean) => {
    if (correct) setCorrectCount(prev => prev + 1)
    setShowExplanation(true)
    
    setTimeout(() => {
      setShowExplanation(false)
      if (currentIndex < lesson.exercises.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        const perfectScore = correctCount + 1 === lesson.exercises.length
        completeLesson(lesson.id, lesson.xpReward, perfectScore)
        setCompleted(true)
      }
    }, 3000)
  }

  const speakText = (text: string, lang: string = 'it-IT') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  if (completed) {
    const perfectBonus = correctCount === lesson.exercises.length ? 50 : 0
    const totalXP = lesson.xpReward + perfectBonus
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Lição Completa!</h2>
          <div className="text-4xl font-bold text-green-600 mb-2">+{totalXP} XP</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Acertos: {correctCount}/{lesson.exercises.length}
          </p>
          {correctCount === lesson.exercises.length && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-yellow-700 dark:text-yellow-300 font-bold">
                Perfeito! Bônus de {perfectBonus} XP!
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button onClick={() => navigate('/')} className="btn-primary w-full">
              Continuar Aprendendo
            </button>
            <button onClick={() => window.location.reload()} className="btn-secondary w-full">
              Repetir Lição
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          aria-label="Voltar"
        >
          <X size={24} />
        </button>
        <div className="flex-1 mx-4">
          <h2 className="text-lg font-semibold text-center">{lesson.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Nível {lesson.level}
          </p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="mb-8">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} de {lesson.exercises.length}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentExercise.type === 'translation' ? '🔤 Tradução' : '✔️ Múltipla Escolha'}
          </span>
          {currentExercise.type === 'translation' && (
            <button
              onClick={() => speakText(currentExercise.correctAnswer)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Ouvir pronúncia"
            >
              <Volume2 size={20} className="text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {currentExercise.type === 'translation' && (
        <TranslationExercise exercise={currentExercise} onComplete={handleComplete} />
      )}
      {currentExercise.type === 'multiple_choice' && (
        <MultipleChoiceExercise exercise={currentExercise} onComplete={handleComplete} />
      )}

      {showExplanation && currentExercise.explanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-fade-in">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Dica:</strong> {currentExercise.explanation}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>✅ {correctCount} corretos</span>
        <span>🎯 {lesson.xpReward} XP disponível</span>
      </div>
    </div>
  )
}