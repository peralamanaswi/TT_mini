import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../services/api";
import { CheckCircle2, AlertTriangle, Zap, MessageSquareText, FileText, BrainCircuit, Mic, Upload } from "lucide-react";

function Feedback() {
  const userId = localStorage.getItem("userId");
  const targetRole = localStorage.getItem("targetRole") || "Java Developer";
  const [answers, setAnswers] = useState([]);
  const [skillGap, setSkillGap] = useState({ skills: [], recommendations: [] });
  const [resumeText, setResumeText] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [voiceMetrics, setVoiceMetrics] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploadLabel, setResumeUploadLabel] = useState("No file selected");

  useEffect(() => {
    if (!userId) {
      return;
    }

    API.get(`/answers/user/${userId}`)
      .then((res) => setAnswers(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  useEffect(() => {
    API.get("/ai/skill-gap", { params: { role: targetRole } })
      .then((res) => setSkillGap(res.data))
      .catch((err) => console.error(err));
  }, [targetRole]);

  useEffect(() => {
    setVoiceMetrics(JSON.parse(localStorage.getItem("latestInterviewVoiceMetrics") || "[]"));
  }, []);

  const metrics = useMemo(() => {
    if (answers.length === 0) {
      return {
        overallScore: 0,
        technicalAccuracy: 0,
        communication: 0,
        problemSolving: 0
      };
    }

    const total = answers.reduce((sum, item) => sum + (item.score || 0), 0);
    const averageOutOfTen = total / answers.length;
    const overallScore = Math.round(averageOutOfTen * 10);
    const averageVoiceScore = voiceMetrics.length > 0
      ? Math.round(voiceMetrics.reduce((sum, item) => sum + (item.communicationScore || 0), 0) / voiceMetrics.length)
      : Math.max(0, Math.min(100, overallScore + 6));

    return {
      overallScore,
      technicalAccuracy: overallScore,
      communication: averageVoiceScore,
      problemSolving: Math.max(0, Math.min(100, overallScore - 8))
    };
  }, [answers, voiceMetrics]);

  const voiceSummary = useMemo(() => {
    if (voiceMetrics.length === 0) {
      return null;
    }

    const totalWords = voiceMetrics.reduce((sum, item) => sum + (item.words || 0), 0);
    const avgFillers = Math.round(voiceMetrics.reduce((sum, item) => sum + (item.fillerCount || 0), 0) / voiceMetrics.length);
    const avgCommunication = Math.round(voiceMetrics.reduce((sum, item) => sum + (item.communicationScore || 0), 0) / voiceMetrics.length);
    const topPace = voiceMetrics[voiceMetrics.length - 1]?.paceLabel || "Balanced";

    return {
      totalWords,
      avgFillers,
      avgCommunication,
      topPace
    };
  }, [voiceMetrics]);

  const suggestions = useMemo(() => {
    const latestEntries = answers.slice(-3).reverse();
    if (latestEntries.length === 0) {
      return [
        { text: "Complete a mock interview to unlock personalized AI feedback here.", icon: <MessageSquareText size={20} color="var(--electric-blue)" /> }
      ];
    }

    return latestEntries.map((entry, index) => ({
      text: entry.feedback,
      icon: index === 0
        ? <CheckCircle2 size={20} color="var(--soft-mint)" />
        : index === 1
          ? <AlertTriangle size={20} color="#F59E0B" />
          : <Zap size={20} color="var(--electric-blue)" />
    }));
  }, [answers]);

  const handleResumeAnalysis = async () => {
    if (!resumeText.trim()) {
      return;
    }

    setIsAnalyzingResume(true);
    try {
      const res = await API.post("/ai/resume-analysis", {
        role: targetRole,
        resumeText
      });
      setResumeAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Resume analysis failed");
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      return;
    }

    setIsAnalyzingResume(true);
    try {
      const formData = new FormData();
      formData.append("role", targetRole);
      formData.append("file", resumeFile);

      const res = await API.post("/ai/resume-analysis/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setResumeAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert(typeof err?.response?.data === "string" ? err.response.data : "Resume upload failed");
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  const scoreRows = [
    { label: "Technical Accuracy", score: metrics.technicalAccuracy, color: "var(--soft-mint)" },
    { label: "Communication", score: metrics.communication, color: "var(--electric-blue)" },
    { label: "Problem Solving", score: metrics.problemSolving, color: "#F59E0B" }
  ];

  return (
    <DashboardLayout title="Deep AI Feedback">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Score Overview Panel */}
        <div className="glass-panel floating-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '120px', height: '120px', 
              borderRadius: '50%', 
              border: '8px solid var(--electric-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--corporate-navy)' }}>{metrics.overallScore}%</span>
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Overall Match</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
              {answers.length > 0 ? `${answers.length} AI-evaluated answers analyzed for ${targetRole}.` : "Take an interview to start building your AI profile."}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {scoreRows.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{s.label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{s.score}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.score}%`, background: s.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Detailed Insights Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel floating-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MessageSquareText size={20} color="var(--electric-blue)" />
              AI Analysis & Suggestions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '1.25rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.8)'
                }}>
                  <div style={{ flexShrink: 0 }}>{s.icon}</div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel floating-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <BrainCircuit size={20} color="var(--electric-blue)" />
              Skill Gap Recommendations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {skillGap.skills.map((skill) => (
                <div key={skill} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.6)' }}>
                  <strong>{skill}</strong>
                </div>
              ))}
            </div>
            {skillGap.recommendations.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {skillGap.recommendations.map((item) => (
                  <div key={item} style={{ color: 'var(--text-secondary)' }}>{item}</div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel floating-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Mic size={20} color="var(--electric-blue)" />
              Voice Interview Performance
            </h3>
            {voiceSummary ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Communication Score</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{voiceSummary.avgCommunication}%</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Total Spoken Words</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{voiceSummary.totalWords}</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Average Fillers</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{voiceSummary.avgFillers}</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Current Pace</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--corporate-navy)' }}>{voiceSummary.topPace}</div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>
                Use voice mode in a mock interview to unlock communication analytics here.
              </div>
            )}
          </div>

          <div className="glass-panel floating-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={20} color="var(--electric-blue)" />
              Resume Analyzer
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <label
                htmlFor="resume-upload"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  padding: '0.85rem 1rem'
                }}
              >
                <Upload size={16} />
                Upload Resume
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setResumeFile(file);
                  setResumeUploadLabel(file ? file.name : "No file selected");
                }}
                style={{ display: 'none' }}
              />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {resumeUploadLabel}
              </div>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Supported files: PDF, DOCX, TXT
            </div>
            <button
              className="btn-primary"
              onClick={handleResumeUpload}
              disabled={isAnalyzingResume || !resumeFile}
              style={{ marginBottom: '1rem' }}
            >
              {isAnalyzingResume ? 'Uploading...' : 'Upload & Analyze Resume'}
            </button>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste your resume text here for AI review..."
              style={{
                width: '100%',
                minHeight: '180px',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: '1rem'
              }}
            />
            <button className="btn-primary" onClick={handleResumeAnalysis} disabled={isAnalyzingResume}>
              {isAnalyzingResume ? 'Analyzing...' : 'Analyze Resume'}
            </button>

            {resumeAnalysis && (
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{resumeAnalysis.summary}</div>
                <div>
                  <strong>Strengths</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {resumeAnalysis.strengths.map((item) => <div key={item}>{item}</div>)}
                  </div>
                </div>
                <div>
                  <strong>Improvements</strong>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {resumeAnalysis.improvements.map((item) => <div key={item}>{item}</div>)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {resumeAnalysis.keywords.map((keyword) => (
                    <span key={keyword} style={{ padding: '0.45rem 0.85rem', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--electric-blue)', fontWeight: '600' }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel floating-card" style={{ background: 'linear-gradient(135deg, var(--corporate-navy), var(--corporate-navy-light))', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Recommended Next Step</h3>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>
              Based on your recent answers, focus next on {voiceSummary && voiceSummary.avgFillers > 3 ? "reducing filler words and sharpening delivery" : (skillGap.skills[0] || "role-specific fundamentals")} for {targetRole} interviews.
            </p>
            <button className="btn-primary" style={{ background: 'var(--electric-blue)', border: 'none' }}>Start Recommended Practice</button>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default Feedback;
