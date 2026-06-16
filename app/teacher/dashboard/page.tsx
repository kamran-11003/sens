"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  BookOpen, LogOut, ClipboardList, Clock, CheckSquare, Square,
  MessageSquare, Upload, X, Send, FileText, Image, Video, Download,
  ChevronRight, AlertCircle, Loader2, Paperclip, ChevronLeft, Menu,
} from "lucide-react"

interface Subtask { id: string; title: string; done: boolean }
interface TaskDocument { id: string; name: string; url: string }
interface TaskMessage {
  id: string; message: string; from: string; createdAt: string
  user: { name: string | null; role: string }
}
interface TaskSubmission { id: string; name: string; url: string; fileType: string; createdAt: string }
interface Task {
  id: string; title: string; description: string; deadline: string | null
  priority: string; status: string
  subtasks: Subtask[]; documents: TaskDocument[]; messages: TaskMessage[]; submissions: TaskSubmission[]
  _count?: { messages: number; submissions: number }
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
}
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
}

function FileIcon({ type }: { type: string }) {
  if (type === "image") return <Image className="w-4 h-4" />
  if (type === "video") return <Video className="w-4 h-4" />
  if (type === "pdf") return <FileText className="w-4 h-4" />
  return <Paperclip className="w-4 h-4" />
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [loadingTask, setLoadingTask] = useState(false)
  const [activePanel, setActivePanel] = useState<"subtasks" | "messages" | "submissions">("subtasks")

  const [message, setMessage] = useState("")
  const [sendingMsg, setSendingMsg] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sidebar: collapsed on desktop, drawer on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/teacher")
    if (status === "authenticated" && (session.user as any).role !== "TEACHER")
      router.replace("/dashboard")
  }, [status, session, router])

  const loadTasks = useCallback(async () => {
    setLoadingTasks(true)
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch {
      setTasks([])
    } finally {
      setLoadingTasks(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") loadTasks()
  }, [status, loadTasks])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedTask?.messages])

  const openTask = async (taskId: string) => {
    setLoadingTask(true)
    setSelectedTask(null)
    setActivePanel("subtasks")
    setDrawerOpen(false)
    try {
      const res = await fetch(`/api/tasks/${taskId}`)
      const data = await res.json()
      setSelectedTask(data)
    } catch { /* ignore */ } finally {
      setLoadingTask(false)
    }
  }

  const closeTask = () => {
    setSelectedTask(null)
    loadTasks()
  }

  const toggleSubtask = async (subtaskId: string, done: boolean) => {
    if (!selectedTask) return
    await fetch(`/api/tasks/${selectedTask.id}/subtasks/${subtaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    })
    setSelectedTask((prev) =>
      prev ? { ...prev, subtasks: prev.subtasks.map((s) => (s.id === subtaskId ? { ...s, done } : s)) } : null
    )
  }

  const sendMessage = async () => {
    if (!message.trim() || !selectedTask) return
    setSendingMsg(true)
    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const msg = await res.json()
      setSelectedTask((prev) => prev ? { ...prev, messages: [...prev.messages, msg] } : null)
      setMessage("")
    } finally {
      setSendingMsg(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedTask) return
    setUploadingFile(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const uploadRes = await fetch("/api/upload/submission", { method: "POST", body: fd })
      const { url, name, fileType } = await uploadRes.json()
      if (!url) return
      const subRes = await fetch(`/api/tasks/${selectedTask.id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, fileType }),
      })
      const submission = await subRes.json()
      setSelectedTask((prev) => prev ? { ...prev, submissions: [submission, ...prev.submissions] } : null)
    } finally {
      setUploadingFile(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const pendingCount = tasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS").length
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && <span className="text-white font-bold text-sm">RIC LMS</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
          {sidebarOpen && <span>Collapse</span>}
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#7C3AED]/20 text-white text-sm cursor-default">
          <ClipboardList className="w-4 h-4 shrink-0" />
          {sidebarOpen && (
            <span className="flex-1 flex items-center justify-between">
              My Tasks
              {pendingCount > 0 && (
                <span className="text-xs bg-[#7C3AED] text-white rounded-full px-1.5 py-0.5 font-bold">
                  {pendingCount}
                </span>
              )}
            </span>
          )}
        </div>
      </nav>

      {/* User + sign out */}
      <div className="p-3 border-t border-white/10 shrink-0">
        {sidebarOpen && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{session?.user?.name ?? "Teacher"}</p>
            <p className="text-white/40 text-xs truncate">{session?.user?.email}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/teacher" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col ${sidebarOpen ? "w-60" : "w-16"} bg-[#0a1128] transition-all duration-300 shrink-0`}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer backdrop ───────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1128] flex flex-col md:hidden transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Force sidebar text visible in mobile drawer */}
        <div className="p-4 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">RIC LMS</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#7C3AED]/20 text-white text-sm cursor-default">
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span className="flex-1 flex items-center justify-between">
              My Tasks
              {pendingCount > 0 && (
                <span className="text-xs bg-[#7C3AED] text-white rounded-full px-1.5 py-0.5 font-bold">
                  {pendingCount}
                </span>
              )}
            </span>
          </div>
        </nav>
        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{session?.user?.name ?? "Teacher"}</p>
            <p className="text-white/40 text-xs truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/teacher" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0a1128] sticky top-0 z-30">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#7C3AED] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">RIC LMS</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="text-xs bg-[#7C3AED] text-white rounded-full px-2 py-0.5 font-bold">
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0a1128]">
              Welcome back, {session?.user?.name?.split(" ")[0] ?? "Teacher"}
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Here are your assigned tasks.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
            {[
              { label: "Total", value: tasks.length, color: "#1E3A8A" },
              { label: "Pending", value: pendingCount, color: "#F59E0B" },
              { label: "Done", value: completedCount, color: "#10B981" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 md:p-5">
                <p className="text-xs text-slate-500 mb-1 truncate">{s.label}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Task List */}
          {loadingTasks ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 sm:p-12 text-center">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-slate-400 text-sm">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const doneCount = task.subtasks.filter((s) => s.done).length
                const totalCount = task.subtasks.length
                const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
                const isOverdue =
                  task.deadline && new Date(task.deadline) < new Date() && task.status !== "COMPLETED"

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                          <h3 className="font-semibold text-[#0a1128] text-sm sm:text-base">{task.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] ?? "bg-slate-100 text-slate-600"}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] ?? "bg-slate-100 text-slate-600"}`}>
                            {task.status.replace("_", " ")}
                          </span>
                          {isOverdue && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs sm:text-sm text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400">
                          {task.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {totalCount > 0 && (
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3" />
                              {doneCount}/{totalCount}
                            </span>
                          )}
                          {(task._count?.messages ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {task._count?.messages}
                            </span>
                          )}
                        </div>

                        {totalCount > 0 && (
                          <div className="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#7C3AED] rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => openTask(task.id)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] text-xs sm:text-sm font-medium transition-colors shrink-0"
                      >
                        Open <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Task Detail Modal ─────────────────────────────────────── */}
      {(loadingTask || selectedTask) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeTask} />
          <div className="relative bg-white w-full sm:max-w-lg md:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl">
            {loadingTask ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" />
              </div>
            ) : selectedTask ? (
              <>
                {/* Task header */}
                <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
                  <div className="flex-1 min-w-0 pr-3">
                    <h2 className="font-bold text-[#0a1128] text-base sm:text-lg leading-tight">{selectedTask.title}</h2>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[selectedTask.priority] ?? ""}`}>
                        {selectedTask.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[selectedTask.status] ?? ""}`}>
                        {selectedTask.status.replace("_", " ")}
                      </span>
                      {selectedTask.deadline && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          Due {new Date(selectedTask.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {selectedTask.description && (
                      <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">{selectedTask.description}</p>
                    )}
                  </div>
                  <button onClick={closeTask} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </button>
                </div>

                {/* Panel tabs */}
                <div className="flex border-b border-slate-100 shrink-0">
                  {(["subtasks", "messages", "submissions"] as const).map((panel) => (
                    <button
                      key={panel}
                      onClick={() => setActivePanel(panel)}
                      className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${
                        activePanel === panel
                          ? "text-[#7C3AED] border-b-2 border-[#7C3AED]"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {panel === "subtasks" && (
                        <span className="flex items-center justify-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Checklist</span>
                          <span className="text-xs opacity-70">({selectedTask.subtasks.filter((s) => s.done).length}/{selectedTask.subtasks.length})</span>
                        </span>
                      )}
                      {panel === "messages" && (
                        <span className="flex items-center justify-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Q&amp;A</span>
                          <span className="text-xs opacity-70">({selectedTask.messages.length})</span>
                        </span>
                      )}
                      {panel === "submissions" && (
                        <span className="flex items-center justify-center gap-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Proof</span>
                          <span className="text-xs opacity-70">({selectedTask.submissions.length})</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Panel body */}
                <div className="flex-1 overflow-y-auto">
                  {/* Subtasks */}
                  {activePanel === "subtasks" && (
                    <div className="p-4 sm:p-5">
                      {selectedTask.subtasks.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No subtasks for this task.</p>
                      ) : (
                        <div className="space-y-1.5 sm:space-y-2">
                          {selectedTask.subtasks.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => toggleSubtask(s.id, !s.done)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                            >
                              {s.done ? (
                                <CheckSquare className="w-5 h-5 text-[#7C3AED] shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-300 shrink-0" />
                              )}
                              <span className={`text-sm ${s.done ? "line-through text-slate-400" : "text-[#0a1128]"}`}>
                                {s.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedTask.documents.length > 0 && (
                        <div className="mt-5 sm:mt-6">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Reference Documents
                          </h4>
                          <div className="space-y-2">
                            {selectedTask.documents.map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                <span className="text-sm text-[#1E3A8A] font-medium flex-1 truncate">{doc.name}</span>
                                <Download className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Messages */}
                  {activePanel === "messages" && (
                    <div className="flex flex-col h-full min-h-0">
                      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                        {selectedTask.messages.length === 0 && (
                          <p className="text-slate-400 text-sm text-center py-8">
                            No messages yet. Ask a question below.
                          </p>
                        )}
                        {selectedTask.messages.map((msg) => {
                          const isTeacher = msg.from === "TEACHER"
                          return (
                            <div key={msg.id} className={`flex ${isTeacher ? "justify-end" : "justify-start"}`}>
                              <div
                                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2.5 ${
                                  isTeacher
                                    ? "bg-[#7C3AED] text-white rounded-br-sm"
                                    : "bg-slate-100 text-[#0a1128] rounded-bl-sm"
                                }`}
                              >
                                <p className="text-xs font-semibold mb-1 opacity-70">
                                  {isTeacher ? "You" : (msg.user.name ?? "Admin")}
                                </p>
                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                <p className={`text-xs mt-1 ${isTeacher ? "opacity-60" : "text-slate-400"}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                      <div className="p-3 sm:p-4 border-t border-slate-100 shrink-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            placeholder="Ask a question or leave a note…"
                            className="flex-1 px-3 sm:px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0a1128] outline-none focus:border-[#7C3AED] transition-colors"
                          />
                          <button
                            onClick={sendMessage}
                            disabled={sendingMsg || !message.trim()}
                            className="p-2.5 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 transition-colors shrink-0"
                          >
                            {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submissions */}
                  {activePanel === "submissions" && (
                    <div className="p-4 sm:p-5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/mp4,video/quicktime,video/webm,.pdf"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#7C3AED]/40 hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 active:bg-[#7C3AED]/10 text-[#7C3AED] text-sm font-medium transition-all disabled:opacity-50 mb-4 sm:mb-5"
                      >
                        {uploadingFile ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                        ) : (
                          <><Upload className="w-4 h-4" /> Upload Proof (PDF / Image / Video)</>
                        )}
                      </button>

                      {selectedTask.submissions.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-6">No files uploaded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTask.submissions.map((sub) => (
                            <a
                              key={sub.id}
                              href={sub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                            >
                              <span className="text-[#7C3AED] shrink-0">
                                <FileIcon type={sub.fileType} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#0a1128] truncate">{sub.name}</p>
                                <p className="text-xs text-slate-400">
                                  {new Date(sub.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Download className="w-4 h-4 text-slate-400 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
