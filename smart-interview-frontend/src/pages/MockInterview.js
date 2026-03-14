import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../services/api";
import { PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";

function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    API.get("/questions/all").then(res => setQuestions(res.data));
  }, []);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    try {
      // API call to submit answer would go here
      const userId = localStorage.getItem("userId");
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer("");
      } else {
        setIsFinished(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <DashboardLayout title="Mock Interview">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <AlertCircle size={20} /> Loading questions...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mock Interview">
      
      {!isStarted && !isFinished && (
        <div className="glass-panel floating-card" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' 
          }}>
            <PlayCircle size={32} color="var(--electric-blue)" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Ready to begin?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            You will be asked {questions.length} technical questions based on your selected role. Take your time and provide detailed answers in the text area provided.
          </p>
          <button onClick={handleStart} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Start Interview
          </button>
        </div>
      )}

      {isStarted && !isFinished && (
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--corporate-navy)' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', flex: 1, margin: '0 1.5rem', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                background: 'var(--electric-blue)', 
                width: `${((currentQuestionIndex) / questions.length) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div className="glass-panel floating-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--electric-blue)' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', lineHeight: '1.6' }}>
              {questions[currentQuestionIndex].questionText}
            </h3>
          </div>

          <div className="glass-panel floating-card" style={{ padding: '1rem' }}>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your detailed answer here..."
              style={{
                width: '100%',
                minHeight: '250px',
                padding: '1rem',
                border: 'none',
                background: 'transparent',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                lineHeight: '1.6'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              onClick={handleSubmitAnswer} 
              className="btn-primary"
              disabled={isSubmitting || !answer.trim()}
              style={{ padding: '0.875rem 2rem' }}
            >
              {isSubmitting ? 'Submitting...' : (currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Submit & Next')}
            </button>
          </div>
        </div>
      )}

      {isFinished && (
        <div className="glass-panel floating-card" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' 
          }}>
            <CheckCircle2 size={32} color="var(--soft-mint)" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Interview Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Great job! Your answers have been submitted for AI evaluation. You can view your detailed feedback shortly.
          </p>
          <a href="/feedback" className="btn-primary" style={{ padding: '1rem 3rem', textDecoration: 'none' }}>
            View Feedback
          </a>
        </div>
      )}

    </DashboardLayout>
  );
}

export default MockInterview;