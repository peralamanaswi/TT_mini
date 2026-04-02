import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../services/api";
import { PlayCircle, CheckCircle2, AlertCircle, Sparkles, Bot, Mic, MicOff, Volume2, Radio, Wand2, TimerReset, Activity } from "lucide-react";

function MockInterview() {
  const QUESTION_TIME_LIMIT = 120;
  const [questions, setQuestions] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [role] = useState(localStorage.getItem("targetRole") || "Java Developer");
  const [questionSource, setQuestionSource] = useState("Loading");
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Voice mode off");
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [autoSubmitVoice, setAutoSubmitVoice] = useState(true);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [speechMetrics, setSpeechMetrics] = useState({
    words: 0,
    fillerCount: 0,
    clarityScore: 0,
    paceLabel: "Waiting"
  });
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const questionStartedAtRef = useRef(null);
  const finalAnswerRef = useRef("");
  const autoSubmitPendingRef = useRef(false);
  const answerRef = useRef("");
  const autoSubmitVoiceRef = useRef(autoSubmitVoice);
  const isSubmittingRef = useRef(false);
  const submitAnswerRef = useRef(null);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const recognitionSupported = typeof window !== "undefined"
    && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        const aiResponse = await API.get("/ai/generate-questions", {
          params: { role }
        });

        if (!isMounted) {
          return;
        }

        const aiQuestions = (aiResponse.data.questions || []).map((questionText, index) => ({
          id: null,
          tempId: `ai-${index}`,
          questionText
        }));

        if (aiQuestions.length > 0) {
          setQuestions(aiQuestions);
          setQuestionSource("AI-generated");
          return;
        }
      } catch (error) {
        console.error("AI question generation failed", error);
      }

      try {
        const endpoint = role ? `/questions/role/${encodeURIComponent(role)}` : "/questions/all";
        const response = await API.get(endpoint);
        if (!isMounted) {
          return;
        }

        if (response.data.length > 0) {
          setQuestions(response.data);
          setQuestionSource("Question bank");
          return;
        }
      } catch (error) {
        console.error("Role-based question fetch failed", error);
      }

      const fallbackResponse = await API.get("/questions/all");
      if (isMounted) {
        setQuestions(fallbackResponse.data);
        setQuestionSource("Question bank");
      }
    };

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, [role]);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    autoSubmitVoiceRef.current = autoSubmitVoice;
  }, [autoSubmitVoice]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    if (!recognitionSupported) {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("Listening to your answer...");
      autoSubmitPendingRef.current = false;
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = transcriptRef.current;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const snippet = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += `${snippet.trim()} `;
        } else {
          interimTranscript += snippet;
        }
      }

      transcriptRef.current = finalTranscript;
      const combinedTranscript = `${finalTranscript}${interimTranscript}`.trim();
      setAnswer(combinedTranscript);
      finalAnswerRef.current = combinedTranscript;
      updateSpeechMetrics(combinedTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus("Mic capture stopped. You can try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
      const latestAnswer = finalAnswerRef.current || answerRef.current;
      if (voiceMode && autoSubmitVoiceRef.current && autoSubmitPendingRef.current && latestAnswer.trim()) {
        autoSubmitPendingRef.current = false;
        setVoiceStatus("Mic stopped. Auto-submitting your answer...");
        window.setTimeout(() => {
          submitAnswerRef.current?.(latestAnswer.trim(), true);
        }, 300);
        return;
      }
      setVoiceStatus(voiceMode ? "Voice mode ready" : "Voice mode off");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [recognitionSupported, voiceMode]);

  useEffect(() => {
    if (!isStarted || isFinished) {
      return undefined;
    }

    setTimeLeft(QUESTION_TIME_LIMIT);
    questionStartedAtRef.current = Date.now();
    finalAnswerRef.current = answerRef.current;
    setSpeechMetrics({
      words: 0,
      fillerCount: 0,
      clarityScore: 0,
      paceLabel: "Waiting"
    });
    setCommunicationScore(0);
    finalAnswerRef.current = answerRef.current;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          if (!isSubmittingRef.current && finalAnswerRef.current.trim()) {
            setVoiceStatus("Time is up. Submitting your answer...");
            submitAnswerRef.current?.(finalAnswerRef.current.trim(), false);
          }
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isStarted, isFinished, currentQuestionIndex]);

  useEffect(() => {
    if (!voiceMode || !isStarted || isFinished || !questions[currentQuestionIndex]) {
      return;
    }

    if (!speechSupported) {
      setVoiceStatus("Read aloud is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex].questionText);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus("AI interviewer is asking the question...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus("Voice mode ready");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus("Unable to read the question aloud.");
    };
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [voiceMode, isStarted, isFinished, currentQuestionIndex, questions, speechSupported]);

  useEffect(() => () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
  }, [speechSupported]);

  const handleStart = () => {
    localStorage.removeItem("latestInterviewFeedback");
    localStorage.removeItem("latestInterviewVoiceMetrics");
    setIsStarted(true);
    setVoiceStatus(voiceMode ? "Voice interviewer ready" : "Voice mode off");
  };

  const handleSubmitAnswer = async (overrideAnswer, triggeredByVoice = false) => {
    const answerToSubmit = (overrideAnswer ?? finalAnswerRef.current ?? answer).trim();
    if (!answerToSubmit || isSubmitting) return;
    
    setIsSubmitting(true);
    stopListening();
    try {
      const userId = localStorage.getItem("userId");
      const currentQuestion = questions[currentQuestionIndex];

      const response = await API.post("/answers/submit", {
        userId,
        questionId: currentQuestion.id ?? null,
        answerText: answerToSubmit
      });

      const voiceSnapshot = {
        question: currentQuestion.questionText,
        communicationScore,
        durationSeconds: Math.max(1, QUESTION_TIME_LIMIT - timeLeft),
        words: speechMetrics.words,
        fillerCount: speechMetrics.fillerCount,
        clarityScore: speechMetrics.clarityScore,
        paceLabel: speechMetrics.paceLabel,
        mode: triggeredByVoice ? "voice-auto-submit" : (voiceMode ? "voice" : "text")
      };

      const evaluation = {
        question: currentQuestion.questionText,
        score: response.data.score,
        feedback: response.data.feedback,
        communicationScore
      };

      const savedEvaluations = JSON.parse(localStorage.getItem("latestInterviewFeedback") || "[]");
      savedEvaluations.push(evaluation);
      localStorage.setItem("latestInterviewFeedback", JSON.stringify(savedEvaluations));
      const savedVoiceMetrics = JSON.parse(localStorage.getItem("latestInterviewVoiceMetrics") || "[]");
      savedVoiceMetrics.push(voiceSnapshot);
      localStorage.setItem("latestInterviewVoiceMetrics", JSON.stringify(savedVoiceMetrics));
      setLastEvaluation(evaluation);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer("");
        transcriptRef.current = "";
        finalAnswerRef.current = "";
      } else {
        setIsFinished(true);
        stopSpeaking();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    submitAnswerRef.current = handleSubmitAnswer;
  });

  const speakQuestion = (text) => {
    if (!speechSupported || !text) {
      setVoiceStatus("Read aloud is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus("AI interviewer is asking the question...");
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus(voiceMode ? "Voice mode ready" : "Voice mode off");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus("Unable to read the question aloud.");
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!recognitionSupported || !recognitionRef.current) {
      setVoiceStatus("Speech recognition is not supported in this browser.");
      return;
    }

    transcriptRef.current = answer ? `${answer.trim()} ` : "";
    finalAnswerRef.current = transcriptRef.current.trim();
    autoSubmitPendingRef.current = autoSubmitVoice;
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleVoiceMode = () => {
    const next = !voiceMode;
    setVoiceMode(next);
    if (!next) {
      stopListening();
      stopSpeaking();
      setVoiceStatus("Voice mode off");
    } else {
      setVoiceStatus("Voice mode ready");
    }
  };

  const updateSpeechMetrics = (text) => {
    const normalized = text.trim();
    const words = normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
    const fillerMatches = normalized.match(/\b(um|uh|like|you know|actually|basically)\b/gi) || [];
    const elapsedSeconds = questionStartedAtRef.current
      ? Math.max(1, Math.round((Date.now() - questionStartedAtRef.current) / 1000))
      : 1;
    const wordsPerMinute = Math.round((words / elapsedSeconds) * 60);
    const paceLabel = wordsPerMinute < 70 ? "Slow" : wordsPerMinute > 155 ? "Fast" : "Balanced";
    const fillerPenalty = Math.min(20, fillerMatches.length * 4);
    const lengthBonus = Math.min(25, words * 0.35);
    const paceBonus = paceLabel === "Balanced" ? 25 : 12;
    const clarityScore = Math.max(0, Math.min(100, Math.round(50 + lengthBonus + paceBonus - fillerPenalty)));

    setSpeechMetrics({
      words,
      fillerCount: fillerMatches.length,
      clarityScore,
      paceLabel
    });
    setCommunicationScore(clarityScore);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.08)',
            color: 'var(--corporate-navy)',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} color="var(--electric-blue)" />
            {questionSource} questions for {role}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              onClick={toggleVoiceMode}
              className="btn-primary"
              style={{
                padding: '0.85rem 1.4rem',
                background: voiceMode ? 'var(--corporate-navy)' : 'var(--electric-blue)'
              }}
            >
              <Radio size={16} />
              {voiceMode ? "Voice Mode On" : "Enable Voice Mode"}
            </button>
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.65)',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              {recognitionSupported && speechSupported
                ? "Voice Q&A supported in this browser"
                : "Voice features depend on browser support"}
            </div>
          </div>
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 0.9rem',
              borderRadius: '999px',
              background: timeLeft <= 20 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(59, 130, 246, 0.08)',
              color: timeLeft <= 20 ? '#B91C1C' : 'var(--corporate-navy)',
              fontWeight: '700'
            }}>
              <TimerReset size={16} />
              {formatTime(timeLeft)}
            </div>
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

          <div className="glass-panel floating-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--corporate-navy)' }}>
                  <Wand2 size={18} color="var(--electric-blue)" />
                  AI Voice Interviewer
                </div>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)' }}>{voiceStatus}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => speakQuestion(questions[currentQuestionIndex].questionText)}
                  className="btn-primary"
                  disabled={!speechSupported || isSpeaking}
                  style={{ padding: '0.75rem 1rem', background: 'var(--corporate-navy)' }}
                >
                  <Volume2 size={16} />
                  {isSpeaking ? "Speaking..." : "Read Question"}
                </button>
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className="btn-primary"
                  disabled={!recognitionSupported}
                  style={{ padding: '0.75rem 1rem', background: isListening ? '#DC2626' : 'var(--electric-blue)' }}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? "Stop Mic" : "Start Mic"}
                </button>
                <button
                  type="button"
                  onClick={() => setAutoSubmitVoice((previous) => !previous)}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 1rem',
                    background: autoSubmitVoice ? 'var(--soft-mint)' : '#94A3B8',
                    color: autoSubmitVoice ? 'var(--corporate-navy)' : 'white'
                  }}
                >
                  <Radio size={16} />
                  {autoSubmitVoice ? "Auto Submit On" : "Auto Submit Off"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--electric-blue)' }}>
                <Activity size={16} />
                Communication
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{communicationScore}%</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live speaking confidence</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--corporate-navy)', marginBottom: '0.4rem' }}>Word Count</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{speechMetrics.words}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current response length</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--corporate-navy)', marginBottom: '0.4rem' }}>Pace</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{speechMetrics.paceLabel}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Speech rhythm estimate</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontWeight: '700', color: 'var(--corporate-navy)', marginBottom: '0.4rem' }}>Fillers</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{speechMetrics.fillerCount}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Um, uh, like, basically</div>
            </div>
          </div>

          <div className="glass-panel floating-card" style={{ padding: '1rem' }}>
            <textarea 
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                finalAnswerRef.current = e.target.value;
                updateSpeechMetrics(e.target.value);
              }}
              placeholder={voiceMode ? "Speak with the mic or type your answer here..." : "Type your detailed answer here..."}
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

          {voiceMode && (
            <div style={{
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '999px',
              background: isListening ? 'rgba(220, 38, 38, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: isListening ? '#B91C1C' : 'var(--soft-mint)',
              fontWeight: '600'
            }}>
              {isListening ? <Mic size={16} /> : <Bot size={16} />}
              {isListening ? "Live transcript is being captured" : "Voice mode ready for the next response"}
            </div>
          )}

          {lastEvaluation && (
            <div className="glass-panel floating-card" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--soft-mint)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                <Bot size={18} color="var(--soft-mint)" />
                Latest AI feedback
              </h4>
              <p style={{ margin: 0, whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {lastEvaluation.feedback}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button 
              onClick={() => handleSubmitAnswer()} 
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
