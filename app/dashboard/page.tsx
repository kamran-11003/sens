"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard, BookOpen, FileText, Users, Calendar, MessageSquare,
  Plus, Pencil, Trash2, Download, X, Check, Loader2, LogOut, Bot, GraduationCap, Tag, Menu,
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

const TABS = [
  { id: "overview",     label: "Overview",     icon: LayoutDashboard },
  { id: "programs",     label: "Programs",     icon: BookOpen },
  { id: "categories",  label: "Categories",   icon: Tag },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "faculty",      label: "Faculty",      icon: Users },
  { id: "events",       label: "Events",       icon: Calendar },
  { id: "contact",      label: "Contact",      icon: MessageSquare },
  { id: "teaching",     label: "Teaching Jobs", icon: GraduationCap },
  { id: "bot",          label: "Bot & RAG",    icon: Bot },
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

function OverviewTab({ programs, applications, faculty, events, contacts }: {
  programs: Program[]; applications: Application[]; faculty: Faculty[]
  events: Event[]; contacts: Contact[]
}) {
  const stats = [
    { label: "Programs",     value: programs.length,     color: "#1E3A8A" },
    { label: "Applications", value: applications.length, color: "#10B981" },
    { label: "Faculty",      value: faculty.length,      color: "#7C3AED" },
    { label: "Events",       value: events.length,       color: "#F59E0B" },
    { label: "Contacts",     value: contacts.length,     color: "#EF4444" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0a1128] mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-sm text-slate-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-[#0a1128] mb-4">Recent Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
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
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editing, setEditing] = useState<Faculty | null>(null)
  const [form, setForm] = useState<Partial<Faculty>>({})
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch("/api/faculty").then(r => r.json()).then(d => { setFaculty(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Faculty</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#7C3AED]/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" /></div> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{["Name","Title","Department","Director","Order",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {faculty.map(m => (
                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-[#0a1128]">{m.name}</td>
                  <td className="py-3 px-4 text-slate-500">{m.title}</td>
                  <td className="py-3 px-4 text-slate-500">{m.department}</td>
                  <td className="py-3 px-4">{m.isDirector ? <Check className="w-4 h-4 text-green-600" /> : "—"}</td>
                  <td className="py-3 px-4 text-slate-500">{m.displayOrder}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => del(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === "add" ? "Add Faculty Member" : "Edit Faculty Member"} onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Name"><input className={inputCls} value={form.name ?? ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
            <Field label="Title"><input className={inputCls} value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Professor" /></Field>
            <Field label="Department"><input className={inputCls} value={form.department ?? ""} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></Field>
            <Field label="Bio"><textarea className={`${inputCls} min-h-[80px]`} value={form.bio ?? ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></Field>
            <Field label="Specializations (comma-separated)"><input className={inputCls} value={Array.isArray(form.specializations) ? form.specializations.join(", ") : (form.specializations ?? "")} onChange={e => setForm(f => ({ ...f, specializations: e.target.value as any }))} /></Field>
            <div className="grid grid-cols-3 gap-4">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
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
            <div className="grid grid-cols-2 gap-4">
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
  const [subTab, setSubTab] = useState<"documents" | "rules">("documents")

  // Documents state
  const [docs, setDocs] = useState<BotDocument[]>([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [docModal, setDocModal] = useState<"add" | "edit" | null>(null)
  const [editingDoc, setEditingDoc] = useState<BotDocument | null>(null)
  const [docForm, setDocForm] = useState<Partial<BotDocument>>({})
  const [docSaving, setDocSaving] = useState(false)

  // Rules state
  const [rules, setRules] = useState<BotRule[]>([])
  const [rulesLoading, setRulesLoading] = useState(true)
  const [ruleModal, setRuleModal] = useState<"add" | "edit" | null>(null)
  const [editingRule, setEditingRule] = useState<BotRule | null>(null)
  const [ruleForm, setRuleForm] = useState<Partial<BotRule>>({})
  const [ruleSaving, setRuleSaving] = useState(false)

  const loadDocs = useCallback(() => {
    setDocsLoading(true)
    fetch("/api/bot/documents").then(r => r.json()).then(d => { setDocs(d); setDocsLoading(false) }).catch(() => setDocsLoading(false))
  }, [])
  const loadRules = useCallback(() => {
    setRulesLoading(true)
    fetch("/api/bot/rules").then(r => r.json()).then(d => { setRules(d); setRulesLoading(false) }).catch(() => setRulesLoading(false))
  }, [])

  useEffect(() => { loadDocs(); loadRules() }, [loadDocs, loadRules])

  // Document CRUD
  const openAddDoc = () => { setDocForm({ active: true, category: "general" }); setDocModal("add") }
  const openEditDoc = (d: BotDocument) => { setEditingDoc(d); setDocForm(d); setDocModal("edit") }
  const closeDocModal = () => { setDocModal(null); setEditingDoc(null); setDocForm({}) }
  const saveDoc = async () => {
    setDocSaving(true)
    const url = docModal === "edit" ? `/api/bot/documents/${editingDoc!.id}` : "/api/bot/documents"
    const method = docModal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(docForm) })
    setDocSaving(false); closeDocModal(); loadDocs()
  }
  const delDoc = async (id: string) => {
    if (!confirm("Delete this document?")) return
    await fetch(`/api/bot/documents/${id}`, { method: "DELETE" }); loadDocs()
  }

  // Rule CRUD
  const openAddRule = () => { setRuleForm({ active: true, priority: 0 }); setRuleModal("add") }
  const openEditRule = (r: BotRule) => { setEditingRule(r); setRuleForm(r); setRuleModal("edit") }
  const closeRuleModal = () => { setRuleModal(null); setEditingRule(null); setRuleForm({}) }
  const saveRule = async () => {
    setRuleSaving(true)
    const url = ruleModal === "edit" ? `/api/bot/rules/${editingRule!.id}` : "/api/bot/rules"
    const method = ruleModal === "edit" ? "PUT" : "POST"
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(ruleForm) })
    setRuleSaving(false); closeRuleModal(); loadRules()
  }
  const delRule = async (id: string) => {
    if (!confirm("Delete this rule?")) return
    await fetch(`/api/bot/rules/${id}`, { method: "DELETE" }); loadRules()
  }

  const BOT_CATEGORIES = ["general", "programs", "admissions", "fees", "faculty", "events", "contact"]

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#0a1128]">Bot &amp; RAG Management</h2>
      </div>
      <p className="text-slate-500 text-sm mb-6">Manage the knowledge base and behavior rules for the RIC Assistant chatbot.</p>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-100">
        {(["documents", "rules"] as const).map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px capitalize ${subTab === t ? "border-[#1E3A8A] text-[#1E3A8A]" : "border-transparent text-slate-500 hover:text-[#0a1128]"}`}
          >
            {t === "documents" ? "Knowledge Base (Documents)" : "Bot Rules & Instructions"}
          </button>
        ))}
      </div>

      {subTab === "documents" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">Documents are searched to answer user questions.</p>
            <button onClick={openAddDoc} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#1E3A8A]/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Document
            </button>
          </div>
          {docsLoading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" /></div> : docs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
              <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No documents yet. Add knowledge base content for the bot.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>{["Title","Category","File","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-[#0a1128]">{d.title}</td>
                      <td className="py-3 px-4 text-slate-500">{d.category}</td>
                      <td className="py-3 px-4 text-slate-500">{d.fileName || "—"}</td>
                      <td className="py-3 px-4">{d.active ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-400" />}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditDoc(d)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => delDoc(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {docModal && (
            <Modal title={docModal === "add" ? "Add Document" : "Edit Document"} onClose={closeDocModal}>
              <div className="space-y-4">
                <Field label="Title *"><input className={inputCls} value={docForm.title ?? ""} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Programs Overview" /></Field>
                <Field label="Category">
                  <select className={inputCls} value={docForm.category ?? "general"} onChange={e => setDocForm(f => ({ ...f, category: e.target.value }))}>
                    {BOT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="File Name (optional)"><input className={inputCls} value={docForm.fileName ?? ""} onChange={e => setDocForm(f => ({ ...f, fileName: e.target.value }))} placeholder="e.g. programs.pdf" /></Field>
                <Field label="Content * (text the bot will search through)">
                  <textarea className={`${inputCls} min-h-[160px]`} value={docForm.content ?? ""} onChange={e => setDocForm(f => ({ ...f, content: e.target.value }))} placeholder="Paste or type the full text content here..." />
                </Field>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="doc-active" checked={docForm.active ?? true} onChange={e => setDocForm(f => ({ ...f, active: e.target.checked }))} />
                  <label htmlFor="doc-active" className="text-sm font-medium text-slate-700">Active (bot will use this document)</label>
                </div>
                <button onClick={saveDoc} disabled={docSaving} className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-60">
                  {docSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Document"}
                </button>
              </div>
            </Modal>
          )}
        </div>
      )}

      {subTab === "rules" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">Rules define how the bot behaves and responds.</p>
            <button onClick={openAddRule} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#7C3AED]/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>
          {rulesLoading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#7C3AED]" /></div> : rules.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
              <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No rules yet. Add behavior rules for the bot.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>{["Title","Rule","Priority","Active",""].map(h => <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rules.map(r => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-[#0a1128]">{r.title}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{r.rule}</td>
                      <td className="py-3 px-4 text-slate-500">{r.priority}</td>
                      <td className="py-3 px-4">{r.active ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-400" />}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditRule(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="w-4 h-4" /></button>
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
            <Modal title={ruleModal === "add" ? "Add Rule" : "Edit Rule"} onClose={closeRuleModal}>
              <div className="space-y-4">
                <Field label="Title *"><input className={inputCls} value={ruleForm.title ?? ""} onChange={e => setRuleForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Default Response" /></Field>
                <Field label="Rule Text *">
                  <textarea className={`${inputCls} min-h-[100px]`} value={ruleForm.rule ?? ""} onChange={e => setRuleForm(f => ({ ...f, rule: e.target.value }))} placeholder="e.g. Always be polite and professional..." />
                </Field>
                <Field label="Priority (higher = more important)">
                  <input type="number" className={inputCls} value={ruleForm.priority ?? 0} onChange={e => setRuleForm(f => ({ ...f, priority: Number(e.target.value) }))} />
                </Field>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="rule-active" checked={ruleForm.active ?? true} onChange={e => setRuleForm(f => ({ ...f, active: e.target.checked }))} />
                  <label htmlFor="rule-active" className="text-sm font-medium text-slate-700">Active</label>
                </div>
                <button onClick={saveRule} disabled={ruleSaving} className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#7C3AED]/90 transition-colors disabled:opacity-60">
                  {ruleSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Rule"}
                </button>
              </div>
            </Modal>
          )}
        </div>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [allData, setAllData] = useState({
    programs: [] as Program[], applications: [] as Application[],
    faculty: [] as Faculty[], events: [] as Event[],
    contacts: [] as Contact[],
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
    ]).then(([programs, applications, faculty, events, contacts]) => {
      setAllData({
        programs:     Array.isArray(programs)     ? programs     : [],
        applications: Array.isArray(applications) ? applications : [],
        faculty:      Array.isArray(faculty)      ? faculty      : [],
        events:       Array.isArray(events)       ? events       : [],
        contacts:     Array.isArray(contacts)     ? contacts     : [],
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
          {activeTab === "faculty"      && <FacultyTab />}
          {activeTab === "events"       && <EventsTab />}
          {activeTab === "contact"      && <ContactTab />}
          {activeTab === "teaching"     && <TeachingTab />}
          {activeTab === "bot"          && <BotTab />}
        </main>
      </div>
    </div>
  )
}
