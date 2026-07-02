"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard, BookOpen, FileText, Users, Calendar, MessageSquare,
  Plus, Pencil, Trash2, Download, X, Check, Loader2, LogOut, Bot, GraduationCap, Tag, Menu,
  Award, Settings, ClipboardList, Key, Eye, EyeOff, Send, Square, CheckSquare,
  Paperclip, Image, Video, Link2, Ticket,
} from "lucide-react"
import { signOut } from "next-auth/react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Program {
  id: string; title: string; category: string; shortDesc: string; fullDesc: string
  duration: string; highlights: string[]; iconName: string; color: string; active: boolean
}
interface Application {
  id: string; name: string; email: string; phone: string; status: string; createdAt: string
  programId: string; program?: { title: string }
}
interface Faculty {
  id: string; name: string; title: string; department: string; bio: string
  specializations: string[]; publications: number | null; awards: number | null
  students: number | null; image: string; isDirector: boolean; displayOrder: number
  userId: string | null
  user: { id: string; email: string; name: string | null } | null
}
interface Event {
  id: string; title: string; type: string; date: string; time: string | null
  location: string; description: string; attendees: number | null; image: string | null; active: boolean
}
interface Contact {
  id: string; name: string; email: string; phone: string | null; subject: string; message: string
  status: string; createdAt: string
}
interface BotDocument {
  id: string; title: string; category: string; content: string; fileName: string; active: boolean; createdAt: string
}
interface BotRule {
  id: string; title: string; rule: string; priority: number; active: boolean; createdAt: string
}
interface TeachingApplication {
  id: string; name: string; email: string; phone: string; subject: string; experience: string; qualification: string; message: string; cvUrl: string; status: string; createdAt: string
}
interface ProgramCategory {
  id: string; slug: string; label: string; active: boolean
}
interface EventRegistration {
  id: string; name: string; phone: string; email: string; note: string; createdAt: string
  event: { title: string; type: string; date: string } | null
}
interface ScholarshipApplication {
  id: string; scholarshipName: string; firstName: string; lastName: string
  phone: string; documentUrl: string; documentType: string; status: string; createdAt: string
}
interface Teacher {
  id: string; name: string | null; email: string; createdAt: string
  facultyProfile: { id: string; name: string; title: string; department: string; image: string } | null
}
interface AdminTask {
  id: string; title: string; description: string; deadline: string | null
  priority: string; status: string; createdAt: string
  teacher: { id: string; name: string | null; email: string }
  subtasks: { id: string; title: string; done: boolean }[]
  documents: { id: string; name: string; url: string }[]
  messages: { id: string; message: string; from: string; createdAt: string; user: { name: string | null; role: string } }[]
  submissions: { id: string; name: string; url: string; fileType: string; createdAt: string }[]
  _count?: { messages: number; submissions: number }
}

const TABS = [
  { id: "overview",     label: "Overview",     icon: LayoutDashboard },
  { id: "programs",     label: "Programs",     icon: BookOpen },
  { id: "categories",  label: "Categories",   icon: Tag },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "scholarships", label: "Scholarships", icon: Award },
  { id: "faculty",      label: "Faculty",      icon: Users },
  { id: "tasks",        label: "LMS Tasks",    icon: ClipboardList },
  { id: "events",       label: "Events",       icon: Calendar },
  { id: "registrations", label: "Event Signups", icon: Ticket },
  { id: "contact",      label: "Contact",      icon: MessageSquare },
  { id: "teaching",     label: "Teaching Jobs", icon: GraduationCap },
  { id: "bot",          label: "FAQ Bot",      icon: Bot },
  { id: "settings",    label: "Settings",     icon: Settings },
]

// Categories loaded dynamically from API in ProgramsTab and CategoriesTab
const EVENT_TYPES = ["Open House","Workshop","Career Fair","Seminar","Sports","Cultural","Academic"]
const APP_STATUSES = ["PENDING","REVIEWED","ACCEPTED","REJECTED"]
const CONTACT_STATUSES = ["NEW","READ","REPLIED"]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Badge({ value, colors }: { value: string; colors: Record<string, string> }) {
  const color = colors[value] ?? "bg-slate-100 text-slate-600"
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{value}</span>
}

const APP_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
}
const CONTACT_STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  READ: "bg-slate-100 text-slate-600",
  REPLIED: "bg-green-100 text-green-700",
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-[#0a1128]">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] focus:bg-white outline-none text-sm text-[#0a1128] transition-colors"

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function OverviewTab({ programs, applications, faculty, events, contacts, scholarships }: {
  programs: Program[]; applications: Application[]; faculty: Faculty[]
  events: Event[]; contacts: Contact[]; scholarships: ScholarshipApplication[]
}) {
  const stats = [
    { label: "Programs",     value: programs.length,     color: "#1E3A8A" },
    { label: "Applications", value: applications.length, color: "#10B981" },
    { label: "Scholarships", value: scholarships.length, color: "#EF4444" },
    { label: "Faculty",      value: faculty.length,      color: "#7C3AED" },
    { label: "Events",       value: events.length,       color: "#F59E0B" },
    { label: "Contacts",     value: contacts.length,     color: "#64748B" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0a1128] mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
            <p className="text-sm text-slate-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-[#0a1128] mb-4">Recent Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead><tr className="border-b border-slate-100">{["Name","Email","Status","Date"].map(h => <th key={h} className="text-left py-2 px-3 text-slate-500 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {applications.slice(0, 5).map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium text-[#0a1128]">{a.name}</td>
                  <td className="py-2 px-3 text-slate-500">{a.email}</td>
                  <td className="py-2 px-3"><Badge value={a.status} colors={APP_STATUS_COLORS} /></td>
                  <td className="py-2 px-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProgramsTab() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [categories, setCategories] = useState<ProgramCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editing, setEditing] = useState<Program | null>(null)
  const [form, setForm] = useState<Partial<Program>>({})
  const [saving, setSaving] = useState(false)

  const loadCategories = useCallback(() => {
    fetch("/api/program-categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])
  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/programs").then(r => r.json()).then(d => { setPrograms(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load(); loadCategories() }, [load, loadCategories])

  const openAdd = () => { setForm({ active: true, highlights: [] }); setModal("add") }
  const openEdit = (p: Program) => { setEditing(p); setForm(p); setModal("edit") }
  const closeModal = () => { setModal(null); setEditing(null); setForm({}) }

  const save = async () => {
    setSaving(true)
    const body = { ...form, highlights: typeof form.highlights === "string" ? (form.highlights as string).split(",").map((s: string) => s.trim()) : form.highlights }
    const url = modal === "edit" ? `/api/programs/${editing!.id}` : "/api/programs"
    const method = modal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    setSaving(false); closeModal(); load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this program?")) return
    await fetch(`/api/programs/${id}`, { method: "DELETE" }); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Programs</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Title","Category","Duration","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {programs.map(p => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{p.title}</td>
                  <td className="py-3 px-4 text-slate-500">{p.category}</td>
                  <td className="py-3 px-4 text-slate-500">{p.duration}</td>
                  <td className="py-3 px-4"><span className={`w-5 h-5 rounded-full flex items-center justify-center ${p.active ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>{p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => del(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add Program" : "Edit Program"} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Title"><input className={inputCls} value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Program title" /></Field>
            <Field label="Category">
              <select className={inputCls} value={form.category ?? ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Short Description"><input className={inputCls} value={form.shortDesc ?? ""} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} /></Field>
            <Field label="Full Description"><textarea className={`${inputCls} min-h-[80px]`} value={form.fullDesc ?? ""} onChange={e => setForm(f => ({ ...f, fullDesc: e.target.value }))} /></Field>
            <Field label="Duration"><input className={inputCls} value={form.duration ?? ""} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 2 Years" /></Field>
            <Field label="Highlights (comma-separated)"><input className={inputCls} value={Array.isArray(form.highlights) ? form.highlights.join(", ") : (form.highlights ?? "")} onChange={e => setForm(f => ({ ...f, highlights: e.target.value as any }))} /></Field>
            <Field label="Icon Name"><input className={inputCls} value={form.iconName ?? ""} onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))} placeholder="e.g. Briefcase, Code, Stethoscope" /></Field>
            <Field label="Color"><input type="color" className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer" value={form.color ?? "#1E3A8A"} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></Field>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="prog-active" checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <label htmlFor="prog-active" className="text-sm font-medium text-slate-700">Active</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Program"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/applications").then(r => r.json()).then(d => { setApplications(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Applications</h2>
        <a href="/api/applications/export" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#10B981]/90 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Email","Phone","Program","Status","Date"].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{a.name}</td>
                  <td className="py-3 px-4 text-slate-500">{a.email}</td>
                  <td className="py-3 px-4 text-slate-500">{a.phone}</td>
                  <td className="py-3 px-4 text-slate-500">{a.program?.title ?? a.programId}</td>
                  <td className="py-3 px-4">
                    <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white">
                      {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FacultyTab() {
  // ── Faculty state ─────────────────────────────────────────────────────────────
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editing, setEditing] = useState<Faculty | null>(null)
  const [form, setForm] = useState<Partial<Faculty>>({})
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  // ── Login credential state (per-faculty modal) ────────────────────────────────
  const [loginTarget, setLoginTarget] = useState<Faculty | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginSaving, setLoginSaving] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showPwd, setShowPwd] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/faculty")
      .then(r => r.json())
      .then(d => { setFaculty(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const openAdd = () => { setForm({ isDirector: false, displayOrder: 0 }); setModal("add") }
  const openEdit = (m: Faculty) => { setEditing(m); setForm(m); setModal("edit") }
  const closeModal = () => { setModal(null); setEditing(null); setForm({}); setImageUploading(false) }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    const fd = new FormData()
    fd.append("image", file)
    const res = await fetch("/api/upload/faculty", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, image: data.url }))
    setImageUploading(false)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, specializations: typeof form.specializations === "string" ? (form.specializations as string).split(",").map((s: string) => s.trim()) : form.specializations }
    const url = modal === "edit" ? `/api/faculty/${editing!.id}` : "/api/faculty"
    const method = modal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    setSaving(false); closeModal(); load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this faculty member?")) return
    await fetch(`/api/faculty/${id}`, { method: "DELETE" }); load()
  }

  // Open credential modal for a specific faculty member
  const openLogin = (m: Faculty) => {
    setLoginTarget(m)
    setLoginForm({ email: m.user?.email ?? "", password: "" })
    setLoginError("")
    setShowPwd(false)
  }
  const closeLogin = () => { setLoginTarget(null); setLoginError("") }

  const saveLogin = async () => {
    if (!loginTarget) return
    if (!loginForm.email) { setLoginError("Email is required."); return }
    if (!loginTarget.userId && !loginForm.password) { setLoginError("Password is required for a new account."); return }
    setLoginSaving(true)
    setLoginError("")
    try {
      if (loginTarget.userId) {
        // Update existing teacher user credentials
        const body: Record<string, string> = { email: loginForm.email }
        if (loginForm.password) body.password = loginForm.password
        const res = await fetch(`/api/teachers/${loginTarget.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) { const j = await res.json(); setLoginError(j.error ?? "Failed to update."); return }
      } else {
        // Create new teacher account linked to this faculty member
        const res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: loginTarget.name, email: loginForm.email, password: loginForm.password, facultyMemberId: loginTarget.id }),
        })
        if (!res.ok) { const j = await res.json(); setLoginError(j.error ?? "Failed to create account."); return }
      }
      closeLogin()
      load()
    } finally {
      setLoginSaving(false)
    }
  }

  const removeLogin = async (m: Faculty) => {
    if (!m.userId) return
    if (!confirm(`Remove portal access for ${m.name}? They will no longer be able to sign in.`)) return
    await fetch(`/api/teachers/${m.userId}`, { method: "DELETE" })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1128]">Faculty</h2>
          <p className="text-sm text-slate-500 mt-0.5">Click <Key className="w-3.5 h-3.5 inline -mt-0.5" /> on any row to assign or update their teacher portal login.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#7C3AED]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" /></div>
      ) : faculty.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No faculty members yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Title","Department","Director","Portal Access",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {faculty.map(m => (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {m.image ? (
                        <img src={m.image} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0 text-[#7C3AED] text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-[#0a1128]">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{m.title}</td>
                  <td className="py-3 px-4 text-slate-500">{m.department}</td>
                  <td className="py-3 px-4">{m.isDirector ? <Check className="w-4 h-4 text-green-600" /> : "—"}</td>
                  <td className="py-3 px-4">
                    {m.user ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                          <Check className="w-3 h-3" /> {m.user.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No portal access</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openLogin(m)}
                        title={m.user ? "Edit login credentials" : "Set login credentials"}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${m.user ? "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200" : "bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/20"}`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        {m.user ? "Edit Login" : "Set Login"}
                      </button>
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      {m.user && (
                        <button onClick={() => removeLogin(m)} title="Remove portal access" className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-400 transition-colors"><Link2 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => del(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit / Add faculty member modal ── */}
      {modal && (
        <Modal title={modal === "add" ? "Add Faculty Member" : "Edit Faculty Member"} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Name"><input className={inputCls} value={form.name ?? ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Title"><input className={inputCls} value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Professor" /></Field>
            <Field label="Department"><input className={inputCls} value={form.department ?? ""} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></Field>
            <Field label="Bio"><textarea className={`${inputCls} min-h-[80px]`} value={form.bio ?? ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></Field>
            <Field label="Specializations (comma-separated)"><input className={inputCls} value={Array.isArray(form.specializations) ? form.specializations.join(", ") : (form.specializations ?? "")} onChange={e => setForm(f => ({ ...f, specializations: e.target.value as any }))} /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Publications"><input type="number" className={inputCls} value={form.publications ?? ""} onChange={e => setForm(f => ({ ...f, publications: Number(e.target.value) || null }))} /></Field>
              <Field label="Awards"><input type="number" className={inputCls} value={form.awards ?? ""} onChange={e => setForm(f => ({ ...f, awards: Number(e.target.value) || null }))} /></Field>
              <Field label="Students"><input type="number" className={inputCls} value={form.students ?? ""} onChange={e => setForm(f => ({ ...f, students: Number(e.target.value) || null }))} /></Field>
            </div>
            <Field label="Photo">
              <input type="file" accept="image/*" onChange={handleImageUpload} className={inputCls} />
              {imageUploading && <p className="text-xs text-slate-400 mt-1 animate-pulse">Uploading…</p>}
              {form.image && <img src={form.image} alt="preview" className="w-16 h-16 rounded-full object-cover mt-2 border border-slate-200" />}
            </Field>
            <Field label="Display Order"><input type="number" className={inputCls} value={form.displayOrder ?? 0} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} /></Field>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is-director" checked={form.isDirector ?? false} onChange={e => setForm(f => ({ ...f, isDirector: e.target.checked }))} />
              <label htmlFor="is-director" className="text-sm font-medium text-slate-700">Is Director / Principal</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#7C3AED]/90 transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Member"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Set / Edit login credentials modal ── */}
      {loginTarget && (
        <Modal
          title={loginTarget.user ? `Edit Login — ${loginTarget.name}` : `Set Login — ${loginTarget.name}`}
          onClose={closeLogin}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2">
              {loginTarget.image ? (
                <img src={loginTarget.image} alt={loginTarget.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] font-bold text-sm">{loginTarget.name.charAt(0)}</div>
              )}
              <div>
                <p className="font-semibold text-[#0a1128] text-sm">{loginTarget.name}</p>
                <p className="text-xs text-slate-400">{loginTarget.title} · {loginTarget.department}</p>
              </div>
            </div>

            <Field label="Login Email">
              <input
                type="email"
                className={inputCls}
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                placeholder="e.g. teacher@ric.edu.pk"
              />
            </Field>

            <Field label={loginTarget.user ? "New Password (leave blank to keep current)" : "Password *"}>
              <div className="relative flex items-center">
                <input
                  type={showPwd ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={loginTarget.user ? "Leave blank to keep current password" : "Min 6 characters"}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            {loginError && <p className="text-sm text-red-500">{loginError}</p>}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              <strong>How to share:</strong> Give {loginTarget.name} these credentials and tell them to sign in at <strong>/teacher</strong> on the website.
            </div>

            <button
              onClick={saveLogin}
              disabled={loginSaving}
              className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#7C3AED]/90 transition-colors disabled:opacity-60"
            >
              {loginSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : loginTarget.user ? "Update Credentials" : "Create Teacher Login"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function EventsTab() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState<Partial<Event>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/events").then(r => r.json()).then(d => { setEvents(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const openAdd = () => { setForm({ active: true }); setModal("add") }
  const openEdit = (ev: Event) => { setEditing(ev); setForm(ev); setModal("edit") }
  const closeModal = () => { setModal(null); setEditing(null); setForm({}) }

  const save = async () => {
    setSaving(true)
    const url = modal === "edit" ? `/api/events/${editing!.id}` : "/api/events"
    const method = modal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaving(false); closeModal(); load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this event?")) return
    await fetch(`/api/events/${id}`, { method: "DELETE" }); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Events</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B] text-white text-sm font-semibold hover:bg-[#F59E0B]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#F59E0B]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Title","Type","Date","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{ev.title}</td>
                  <td className="py-3 px-4 text-slate-500">{ev.type}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{ev.active ? <Check className="w-4 h-4 text-green-600" /> : "—"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => del(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add Event" : "Edit Event"} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Title"><input className={inputCls} value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
            <Field label="Type">
              <select className={inputCls} value={form.type ?? ""} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="">Select type</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Date"><input type="date" className={inputCls} value={form.date ? form.date.split("T")[0] : ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></Field>
              <Field label="Time"><input type="time" className={inputCls} value={form.time ?? ""} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></Field>
            </div>
            <Field label="Location"><input className={inputCls} value={form.location ?? ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></Field>
            <Field label="Description"><textarea className={`${inputCls} min-h-[80px]`} value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
            <Field label="Expected Attendees"><input type="number" className={inputCls} value={form.attendees ?? ""} onChange={e => setForm(f => ({ ...f, attendees: Number(e.target.value) || null }))} /></Field>
            <Field label="Image URL"><input className={inputCls} value={form.image ?? ""} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." /></Field>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="ev-active" checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <label htmlFor="ev-active" className="text-sm font-medium text-slate-700">Active</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-[#F59E0B] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#F59E0B]/90 transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Event"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function RegistrationsTab() {
  const [regs, setRegs] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [eventFilter, setEventFilter] = useState("all")

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/event-registrations").then(r => r.json()).then(d => { setRegs(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const eventTitles = Array.from(new Set(regs.map(r => r.event?.title).filter(Boolean))) as string[]
  const filtered = eventFilter === "all" ? regs : regs.filter(r => r.event?.title === eventFilter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1128]">Event Signups</h2>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} registration{filtered.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white max-w-[220px]">
            <option value="all">All events</option>
            {eventTitles.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <a href="/api/event-registrations/export" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#10B981]/90 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </a>
        </div>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-16 text-center text-slate-400 text-sm">No registrations yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Phone","Email","Event","Note","Date"].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 align-top">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{r.name}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{r.phone}</td>
                  <td className="py-3 px-4 text-slate-500">{r.email || "—"}</td>
                  <td className="py-3 px-4 text-slate-500">{r.event?.title ?? "—"}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-[220px]">{r.note || "—"}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ContactTab() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [viewContact, setViewContact] = useState<Contact | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/contact").then(r => r.json()).then(d => { setContacts(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/contact/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    load()
  }

  const CONTACT_STATUS_COLORS: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    READ: "bg-slate-100 text-slate-700",
    REPLIED: "bg-green-100 text-green-700",
    ARCHIVED: "bg-gray-100 text-gray-500",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Contact Submissions</h2>
        <a href="/api/contact/export" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#10B981]/90 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Email","Subject","Message","Status","Date",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{c.name}</td>
                  <td className="py-3 px-4 text-slate-500">{c.email}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-[160px] truncate">{c.subject}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{c.message}</td>
                  <td className="py-3 px-4">
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white">
                      {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setViewContact(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewContact && (
        <Modal title="Contact Details" onClose={() => setViewContact(null)}>
          <div className="space-y-3 text-sm">
            {([["Name", viewContact.name], ["Email", viewContact.email], ["Phone", viewContact.phone ?? "—"], ["Subject", viewContact.subject]] as [string,string][]).map(([label, val]) => (
              <div key={label}><span className="font-semibold text-slate-700">{label}: </span><span className="text-slate-600">{val}</span></div>
            ))}
            <div>
              <span className="font-semibold text-slate-700">Message: </span>
              <p className="text-slate-600 mt-1 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{viewContact.message}</p>
            </div>
            <div><span className="font-semibold text-slate-700">Status: </span><Badge value={viewContact.status} colors={CONTACT_STATUS_COLORS} /></div>
            <div><span className="font-semibold text-slate-700">Date: </span><span className="text-slate-600">{new Date(viewContact.createdAt).toLocaleString()}</span></div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function TeachingTab() {
  const [apps, setApps] = useState<TeachingApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [viewApp, setViewApp] = useState<TeachingApplication | null>(null)
  const TEACH_STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]
  const TEACH_STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    REVIEWED: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  }

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/teaching-applications").then(r => r.json()).then(d => { setApps(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/teaching-applications/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this application?")) return
    await fetch(`/api/teaching-applications/${id}`, { method: "DELETE" }); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Teaching Job Applications</h2>
        <a href="/api/teaching-applications/export" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#10B981]/90 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : apps.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No teaching applications yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Email","Subject","Experience","Qualification","Status","Date",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{a.name}</td>
                  <td className="py-3 px-4 text-slate-500">{a.email}</td>
                  <td className="py-3 px-4 text-slate-500">{a.subject}</td>
                  <td className="py-3 px-4 text-slate-500">{a.experience}</td>
                  <td className="py-3 px-4 text-slate-500">{a.qualification}</td>
                  <td className="py-3 px-4">
                    <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)} className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white">
                      {TEACH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewApp(a)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors text-xs">View</button>
                      <button onClick={() => del(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {viewApp && (
        <Modal title="Application Details" onClose={() => setViewApp(null)}>
          <div className="space-y-3 text-sm">
            {[["Name", viewApp.name], ["Email", viewApp.email], ["Phone", viewApp.phone], ["Subject", viewApp.subject], ["Experience", viewApp.experience], ["Qualification", viewApp.qualification]].map(([label, val]) => (
              <div key={label}><span className="font-semibold text-slate-700">{label}: </span><span className="text-slate-600">{val}</span></div>
            ))}
            {viewApp.message && <div><span className="font-semibold text-slate-700">Message: </span><p className="text-slate-600 mt-1 whitespace-pre-wrap">{viewApp.message}</p></div>}
            {viewApp.cvUrl && (
              <div><span className="font-semibold text-slate-700">CV: </span>
                <a href={viewApp.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Download CV</a>
              </div>
            )}
            <div><span className="font-semibold text-slate-700">Status: </span><Badge value={viewApp.status} colors={{ PENDING: "bg-yellow-100 text-yellow-700", REVIEWED: "bg-blue-100 text-blue-700", ACCEPTED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" }} /></div>
            <div><span className="font-semibold text-slate-700">Date: </span><span className="text-slate-600">{new Date(viewApp.createdAt).toLocaleString()}</span></div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function BotTab() {
  const [rules, setRules] = useState<BotRule[]>([])
  const [loading, setLoading] = useState(true)
  const [ruleModal, setRuleModal] = useState<"add" | "edit" | null>(null)
  const [editingRule, setEditingRule] = useState<BotRule | null>(null)
  const [ruleForm, setRuleForm] = useState<Partial<BotRule>>({})
  const [ruleSaving, setRuleSaving] = useState(false)

  const loadRules = useCallback(() => {
    setLoading(true)
    fetch("/api/bot/rules").then(r => r.json()).then(d => { setRules(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { loadRules() }, [loadRules])

  const openAdd = () => { setRuleForm({ active: true, priority: 0 }); setRuleModal("add") }
  const openEdit = (r: BotRule) => { setEditingRule(r); setRuleForm(r); setRuleModal("edit") }
  const closeModal = () => { setRuleModal(null); setEditingRule(null); setRuleForm({}) }
  const saveRule = async () => {
    setRuleSaving(true)
    const url = ruleModal === "edit" ? `/api/bot/rules/${editingRule!.id}` : "/api/bot/rules"
    const method = ruleModal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(ruleForm) })
    setRuleSaving(false); closeModal(); loadRules()
  }
  const delRule = async (id: string) => {
    if (!confirm("Delete this FAQ item?")) return
    await fetch(`/api/bot/rules/${id}`, { method: "DELETE" }); loadRules()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0a1128] mb-2">FAQ Bot Management</h2>
      <p className="text-slate-500 text-sm mb-6">
        Manage the chatbot&apos;s FAQ items. The <strong>Question</strong> is displayed as a button in the chat widget; the <strong>Answer</strong> is shown when the user taps it.
      </p>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">Showing {rules.length} FAQ item{rules.length !== 1 ? "s" : ""}</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add FAQ Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
          <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No FAQ items yet. Click &quot;Add FAQ Item&quot; to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Question","Answer","Order","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128] max-w-[200px] truncate">{r.title}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{r.rule}</td>
                  <td className="py-3 px-4 text-slate-500">{r.priority}</td>
                  <td className="py-3 px-4">{r.active ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-400" />}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => delRule(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {ruleModal && (
        <Modal title={ruleModal === "add" ? "Add FAQ Item" : "Edit FAQ Item"} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Question (shown as button in chatbot) *">
              <input className={inputCls} value={ruleForm.title ?? ""} onChange={e => setRuleForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. What are the admission requirements?" />
            </Field>
            <Field label="Answer *">
              <textarea className={`${inputCls} min-h-[120px]`} value={ruleForm.rule ?? ""} onChange={e => setRuleForm(f => ({ ...f, rule: e.target.value }))} placeholder="Type the answer to this question..." />
            </Field>
            <Field label="Display Order (lower = higher priority)">
              <input type="number" className={inputCls} value={ruleForm.priority ?? 0} onChange={e => setRuleForm(f => ({ ...f, priority: Number(e.target.value) }))} />
            </Field>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rule-active" checked={ruleForm.active ?? true} onChange={e => setRuleForm(f => ({ ...f, active: e.target.checked }))} />
              <label htmlFor="rule-active" className="text-sm font-medium text-slate-700">Active (visible in chatbot)</label>
            </div>
            <button onClick={saveRule} disabled={ruleSaving} className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-60">
              {ruleSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save FAQ Item"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function CategoriesTab() {
  const [categories, setCategories] = useState<ProgramCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editing, setEditing] = useState<ProgramCategory | null>(null)
  const [form, setForm] = useState<{ slug: string; label: string; active: boolean }>({ slug: "", label: "", active: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/program-categories").then(r => r.json()).then(d => { setCategories(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const openAdd = () => { setForm({ slug: "", label: "", active: true }); setModal("add") }
  const openEdit = (c: ProgramCategory) => { setEditing(c); setForm({ slug: c.slug, label: c.label, active: c.active }); setModal("edit") }
  const closeModal = () => { setModal(null); setEditing(null); setForm({ slug: "", label: "", active: true }) }

  const save = async () => {
    if (!form.label.trim()) return
    setSaving(true)
    if (modal === "edit" && editing) {
      await fetch(`/api/program-categories/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: form.label, active: form.active }) })
    } else {
      await fetch("/api/program-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    }
    setSaving(false); closeModal(); load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete this category? Programs using it will keep the slug but the category won't appear in dropdowns.")) return
    await fetch(`/api/program-categories/${id}`, { method: "DELETE" }); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Program Categories</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-6">Categories are used to organise programs. The <strong>slug</strong> is the URL-safe key used in the database; the <strong>label</strong> is what's shown to users.</p>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Slug","Label","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">{c.slug}</td>
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{c.label}</td>
                  <td className="py-3 px-4">{c.active ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-400" />}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => del(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add Category" : "Edit Category"} onClose={closeModal}>
          <div className="space-y-4">
            {modal === "add" && (
              <Field label="Slug (URL-safe, auto-generated from label if left blank)">
                <input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))} placeholder="e.g. adp-business" />
              </Field>
            )}
            <Field label="Label *"><input className={inputCls} value={form.label} onChange={e => {
              const label = e.target.value
              setForm(f => ({ ...f, label, ...(modal === "add" && !f.slug ? { slug: label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}) }))
            }} placeholder="e.g. ADP — Business & Social Sciences" /></Field>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="cat-active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <label htmlFor="cat-active" className="text-sm font-medium text-slate-700">Active (shown in program dropdowns)</label>
            </div>
            <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-60">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Category"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ScholarshipsTab() {
  const [apps, setApps] = useState<ScholarshipApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [viewApp, setViewApp] = useState<ScholarshipApplication | null>(null)
  
  const STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]
  
  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/scholarship-applications")
      .then(r => r.json())
      .then(d => {
        setApps(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/scholarship-applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    load()
  }

  const del = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship application?")) return
    await fetch(`/api/scholarship-applications/${id}`, {
      method: "DELETE",
    })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Scholarship Applications</h2>
        <a 
          href="/api/scholarship-applications/export" 
          target="_blank" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] text-white text-sm font-semibold hover:bg-[#10B981]/90 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
          <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No scholarship applications yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Name", "Scholarship", "Phone", "Doc Type", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{a.firstName} {a.lastName}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{a.scholarshipName}</td>
                  <td className="py-3 px-4 text-slate-500">{a.phone}</td>
                  <td className="py-3 px-4 text-slate-500 capitalize">{a.documentType}</td>
                  <td className="py-3 px-4">
                    <select 
                      value={a.status} 
                      onChange={e => updateStatus(a.id, e.target.value)} 
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white cursor-pointer"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewApp(a)} 
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0a1128] text-xs font-semibold cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => del(a.id)} 
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewApp && (
        <Modal title="Scholarship Application Details" onClose={() => setViewApp(null)}>
          <div className="space-y-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-500 text-xs uppercase block">Applied Scholarship</span>
              <span className="font-bold text-[#0a1128] text-base">{viewApp.scholarshipName}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-semibold text-slate-500 text-xs uppercase block">First Name</span> <span className="text-[#0a1128] font-medium">{viewApp.firstName}</span></div>
              <div><span className="font-semibold text-slate-500 text-xs uppercase block">Last Name</span> <span className="text-[#0a1128] font-medium">{viewApp.lastName}</span></div>
              <div className="col-span-2"><span className="font-semibold text-slate-500 text-xs uppercase block">Phone Number</span> <span className="text-[#0a1128]">{viewApp.phone}</span></div>
            </div>

            <hr className="border-slate-100" />

            <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#1E3A8A] text-xs uppercase block">Uploaded Document</span>
                <span className="text-xs text-slate-500 capitalize">{viewApp.documentType} Document</span>
              </div>
              {viewApp.documentUrl ? (
                <a
                  href={viewApp.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> View File
                </a>
              ) : (
                <span className="text-xs text-slate-400">No document attached</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-slate-500 text-xs uppercase block">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1 ${
                  viewApp.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                  viewApp.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  viewApp.status === "REVIEWED" ? "bg-blue-100 text-blue-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>{viewApp.status}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 text-xs uppercase block">Submitted</span>
                <span className="text-slate-600 text-xs mt-1 inline-block">{new Date(viewApp.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

const TASK_PRIORITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
}
const TASK_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
}

function TasksTab() {
  const [tasks, setTasks] = useState<AdminTask[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailPanel, setDetailPanel] = useState<"subtasks" | "messages" | "submissions">("subtasks")

  // Create form state
  const [form, setForm] = useState({ title: "", description: "", teacherId: "", deadline: "", priority: "MEDIUM" })
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>([""])
  const [docFiles, setDocFiles] = useState<{ name: string; url: string }[]>([])
  const [docUploading, setDocUploading] = useState(false)
  const [creating, setCreating] = useState(false)

  // Admin message reply
  const [replyMsg, setReplyMsg] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      fetch("/api/tasks").then(r => r.json()),
      fetch("/api/teachers").then(r => r.json()),
    ]).then(([t, teach]) => {
      setTasks(Array.isArray(t) ? t : [])
      setTeachers(Array.isArray(teach) ? teach : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openDetail = async (taskId: string) => {
    setLoadingDetail(true)
    setSelectedTask(null)
    setDetailPanel("subtasks")
    try {
      const res = await fetch(`/api/tasks/${taskId}`)
      setSelectedTask(await res.json())
    } finally {
      setLoadingDetail(false)
    }
  }

  const closeDetail = () => { setSelectedTask(null); load() }

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setDocUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload/task-doc", { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) setDocFiles(prev => [...prev, { name: data.name ?? file.name, url: data.url }])
    setDocUploading(false)
    e.target.value = ""
  }

  const createTask = async () => {
    if (!form.title || !form.teacherId) return
    setCreating(true)
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        subtasks: subtaskInputs.filter(Boolean),
        documentUrls: docFiles,
      }),
    })
    setCreating(false)
    setCreateModal(false)
    setForm({ title: "", description: "", teacherId: "", deadline: "", priority: "MEDIUM" })
    setSubtaskInputs([""])
    setDocFiles([])
    load()
  }

  const delTask = async (id: string) => {
    if (!confirm("Delete this task?")) return
    await fetch(`/api/tasks/${id}`, { method: "DELETE" }); load()
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    load()
  }

  const sendReply = async () => {
    if (!replyMsg.trim() || !selectedTask) return
    setSendingReply(true)
    const res = await fetch(`/api/tasks/${selectedTask.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyMsg }),
    })
    const msg = await res.json()
    setSelectedTask(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : null)
    setReplyMsg("")
    setSendingReply(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">LMS Tasks</h2>
        <button onClick={() => setCreateModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#7C3AED]/90 transition-colors">
          <Plus className="w-4 h-4" /> Assign Task
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" /></div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No tasks yet. Assign one to a teacher.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Title","Teacher","Deadline","Priority","Progress","Status",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const doneCount = task.subtasks.filter(s => s.done).length
                const total = task.subtasks.length
                return (
                  <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-[#0a1128] max-w-[160px] truncate">{task.title}</td>
                    <td className="py-3 px-4 text-slate-500">{task.teacher.name ?? task.teacher.email}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority] ?? ""}`}>{task.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      {total > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${Math.round((doneCount / total) * 100)}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{doneCount}/{total}</span>
                        </div>
                      ) : <span className="text-xs text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={task.status}
                        onChange={e => updateTaskStatus(task.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white"
                      >
                        {["PENDING","IN_PROGRESS","COMPLETED","OVERDUE"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(task.id)} className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#0a1128]">View</button>
                        <button onClick={() => delTask(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Task Modal */}
      {createModal && (
        <Modal title="Assign New Task" onClose={() => setCreateModal(false)}>
          <div className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title" /></Field>
            <Field label="Description"><textarea className={`${inputCls} min-h-[70px]`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What should the teacher do?" /></Field>
            <Field label="Assign To *">
              <select className={inputCls} value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
                <option value="">{teachers.length === 0 ? "⚠ No teacher accounts yet" : "Select a teacher…"}</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.facultyProfile?.name ?? t.name ?? t.email}
                    {t.facultyProfile ? ` — ${t.facultyProfile.department}` : ` (${t.email})`}
                  </option>
                ))}
              </select>
              {teachers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Go to <strong>Faculty</strong> tab → click <strong>Set Login</strong> on a faculty member first.
                </p>
              )}
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Deadline"><input type="date" className={inputCls} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} /></Field>
              <Field label="Priority">
                <select className={inputCls} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </Field>
            </div>
            <Field label="Subtasks (checklist)">
              <div className="space-y-2">
                {subtaskInputs.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      value={v}
                      placeholder={`Subtask ${i + 1}`}
                      onChange={e => { const a = [...subtaskInputs]; a[i] = e.target.value; setSubtaskInputs(a) }}
                    />
                    {subtaskInputs.length > 1 && (
                      <button type="button" onClick={() => setSubtaskInputs(a => a.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setSubtaskInputs(a => [...a, ""])} className="text-xs text-[#7C3AED] hover:underline">
                  + Add subtask
                </button>
              </div>
            </Field>
            <Field label="Reference Documents">
              <input type="file" onChange={handleDocUpload} disabled={docUploading} className={inputCls} />
              {docUploading && <p className="text-xs text-slate-400 mt-1 animate-pulse">Uploading…</p>}
              {docFiles.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <Paperclip className="w-3 h-3" /> {d.name}
                  <button onClick={() => setDocFiles(f => f.filter((_, j) => j !== i))} className="text-red-400"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </Field>
            <button onClick={createTask} disabled={creating || !form.title || !form.teacherId} className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#7C3AED]/90 transition-colors disabled:opacity-60">
              {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Assign Task"}
            </button>
          </div>
        </Modal>
      )}

      {/* Task Detail Modal */}
      {(loadingDetail || selectedTask) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" /></div>
            ) : selectedTask ? (
              <>
                <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0">
                  <div className="flex-1 min-w-0 pr-4">
                    <h2 className="font-bold text-[#0a1128] text-lg">{selectedTask.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="text-xs text-slate-400">Assigned to: <strong>{selectedTask.teacher.name ?? selectedTask.teacher.email}</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[selectedTask.priority] ?? ""}`}>{selectedTask.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[selectedTask.status] ?? ""}`}>{selectedTask.status.replace("_"," ")}</span>
                    </div>
                    {selectedTask.description && <p className="text-sm text-slate-500 mt-2">{selectedTask.description}</p>}
                  </div>
                  <button onClick={closeDetail} className="p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"><X className="w-5 h-5 text-slate-400" /></button>
                </div>

                <div className="flex border-b border-slate-100 shrink-0">
                  {(["subtasks", "messages", "submissions"] as const).map(panel => (
                    <button key={panel} onClick={() => setDetailPanel(panel)} className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${detailPanel === panel ? "text-[#7C3AED] border-b-2 border-[#7C3AED]" : "text-slate-400 hover:text-slate-600"}`}>
                      {panel === "subtasks" && (
                        <span className="flex items-center justify-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Checklist</span>
                          <span className="text-xs opacity-70">({selectedTask.subtasks.filter(s => s.done).length}/{selectedTask.subtasks.length})</span>
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
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Proof</span>
                          <span className="text-xs opacity-70">({selectedTask.submissions.length})</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {detailPanel === "subtasks" && (
                    <div className="p-5">
                      {selectedTask.subtasks.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No subtasks.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTask.subtasks.map(s => (
                            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                              {s.done ? <CheckSquare className="w-5 h-5 text-[#7C3AED] shrink-0" /> : <Square className="w-5 h-5 text-slate-300 shrink-0" />}
                              <span className={`text-sm ${s.done ? "line-through text-slate-400" : "text-[#0a1128]"}`}>{s.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedTask.documents.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Reference Documents</h4>
                          <div className="space-y-2">
                            {selectedTask.documents.map(doc => (
                              <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                                <Paperclip className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                                <span className="text-sm text-[#1E3A8A] font-medium flex-1 truncate">{doc.name}</span>
                                <Download className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {detailPanel === "messages" && (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 p-5 space-y-3">
                        {selectedTask.messages.length === 0 && <p className="text-slate-400 text-sm text-center py-8">No messages yet.</p>}
                        {selectedTask.messages.map(msg => {
                          const isAdmin = msg.from === "ADMIN"
                          return (
                            <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isAdmin ? "bg-[#1E3A8A] text-white rounded-br-sm" : "bg-slate-100 text-[#0a1128] rounded-bl-sm"}`}>
                                <p className="text-xs font-semibold mb-1 opacity-70">{isAdmin ? "You (Admin)" : msg.user.name ?? "Teacher"}</p>
                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                <p className={`text-xs mt-1 ${isAdmin ? "opacity-60" : "text-slate-400"}`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="p-4 border-t border-slate-100 shrink-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyMsg}
                            onChange={e => setReplyMsg(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
                            placeholder="Reply to teacher…"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0a1128] outline-none focus:border-[#1E3A8A] transition-colors"
                          />
                          <button onClick={sendReply} disabled={sendingReply || !replyMsg.trim()} className="p-2.5 rounded-xl bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 disabled:opacity-50 transition-colors">
                            {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailPanel === "submissions" && (
                    <div className="p-5">
                      {selectedTask.submissions.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">No proof submitted yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTask.submissions.map(sub => (
                            <a key={sub.id} href={sub.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                              <span className="text-[#7C3AED]">
                                {sub.fileType === "image" ? <Image className="w-4 h-4" /> : sub.fileType === "video" ? <Video className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#0a1128] truncate">{sub.name}</p>
                                <p className="text-xs text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</p>
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

function SettingsTab() {
  const FORM_KEYS = [
    { key: "admission_form_enabled",   label: "Admission Form",           desc: "Allow students to submit admission applications" },
    { key: "teaching_form_enabled",    label: "Teaching Job Applications", desc: "Allow applicants to apply for teaching positions" },
    { key: "scholarship_form_enabled", label: "Scholarship Applications",  desc: "Allow students to apply for scholarships" },
  ]

  const [values, setValues] = useState<Record<string, boolean>>({
    admission_form_enabled:   true,
    teaching_form_enabled:    true,
    scholarship_form_enabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        setValues({
          admission_form_enabled:   d.admission_form_enabled   !== "false",
          teaching_form_enabled:    d.teaching_form_enabled    !== "false",
          scholarship_form_enabled: d.scholarship_form_enabled !== "false",
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggle = async (key: string) => {
    setSaving(key)
    const next = !values[key]
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: String(next) }),
    })
    setValues(prev => ({ ...prev, [key]: next }))
    setSaving(null)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0a1128] mb-2">Form Settings</h2>
      <p className="text-slate-500 text-sm mb-8">
        Enable or disable public-facing application forms. Disabled forms show a &quot;currently closed&quot; notice to visitors.
      </p>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {FORM_KEYS.map(({ key, label, desc }) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold text-[#0a1128]">{label}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                disabled={saving === key}
                aria-label={`Toggle ${label}`}
                className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${values[key] ? "bg-[#10B981]" : "bg-slate-200"} ${saving === key ? "opacity-60" : "cursor-pointer"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${values[key] ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [allData, setAllData] = useState({
    programs: [] as Program[], applications: [] as Application[],
    faculty: [] as Faculty[], events: [] as Event[],
    contacts: [] as Contact[], scholarships: [] as ScholarshipApplication[],
  })

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin")
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated") return
    Promise.all([
      fetch("/api/programs").then(r => r.json()),
      fetch("/api/applications").then(r => r.json()),
      fetch("/api/faculty").then(r => r.json()),
      fetch("/api/events").then(r => r.json()),
      fetch("/api/contact").then(r => r.json()),
      fetch("/api/scholarship-applications").then(r => r.json()),
    ]).then(([programs, applications, faculty, events, contacts, scholarships]) => {
      setAllData({
        programs:     Array.isArray(programs)     ? programs     : [],
        applications: Array.isArray(applications) ? applications : [],
        faculty:      Array.isArray(faculty)      ? faculty      : [],
        events:       Array.isArray(events)       ? events       : [],
        contacts:     Array.isArray(contacts)     ? contacts     : [],
        scholarships: Array.isArray(scholarships) ? scholarships : [],
      })
    }).catch(() => {})
  }, [status])

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
    </div>
  )

  if (status === "unauthenticated") return null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a1128] text-white flex flex-col shrink-0 h-screen transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-[#f5b041]">RIC Admin</div>
            <div className="text-xs text-slate-400 mt-1 truncate max-w-[160px]">{(session?.user as any)?.name ?? session?.user?.email}</div>
          </div>
          <button className="md:hidden p-1 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-[#1E3A8A] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut({ callbackUrl: "/admin" })} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0a1128] text-white sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-[#f5b041] text-base">RIC Admin</span>
          <span className="ml-auto text-xs text-slate-400 truncate max-w-[140px]">
            {TABS.find(t => t.id === activeTab)?.label}
          </span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {activeTab === "overview"     && <OverviewTab {...allData} />}
          {activeTab === "programs"     && <ProgramsTab />}
          {activeTab === "categories"   && <CategoriesTab />}
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "scholarships" && <ScholarshipsTab />}
          {activeTab === "faculty"      && <FacultyTab />}
          {activeTab === "tasks"        && <TasksTab />}
          {activeTab === "events"       && <EventsTab />}
          {activeTab === "registrations" && <RegistrationsTab />}
          {activeTab === "contact"      && <ContactTab />}
          {activeTab === "teaching"     && <TeachingTab />}
          {activeTab === "bot"          && <BotTab />}
          {activeTab === "settings"     && <SettingsTab />}
        </main>
      </div>
    </div>
  )
}
