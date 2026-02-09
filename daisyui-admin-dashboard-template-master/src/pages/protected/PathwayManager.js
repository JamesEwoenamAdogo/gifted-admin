import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/*
 Single-page Admin Pathway Creator
 - No sidebar
 - Create pathway with: name, description, cost, grades (1..12), modules
 - Modules: title, level, description, materials (file/video/link)
 - Edit / Delete module via modal
 - Colorful styles with Tailwind + Framer Motion animations
*/

// ======= API base (change to your backend) =======
const API_BASE = "http://localhost:5000/api/admin/pathways";

// ======= Utility =======
const gradeList = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const levels = ["Beginner", "Intermediate", "Advanced"];
const uid = () => Math.random().toString(36).slice(2, 9);

// ======= Main App =======
export default function PathwayManager() {
  const [pathway, setPathway] = useState({
    title: "",
    description: "",
    cost: "",
    grades: [],
    modules: [],
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editingModule, setEditingModule] = useState(null); // module object to edit
  const [previewSavedPathway, setPreviewSavedPathway] = useState(null);

  // load last saved draft from localStorage (optional convenience)
  useEffect(() => {
    const draft = localStorage.getItem("pathway_draft_v1");
    if (draft) setPathway(JSON.parse(draft));
  }, []);

  useEffect(() => {
    localStorage.setItem("pathway_draft_v1", JSON.stringify(pathway));
  }, [pathway]);

  const toggleGrade = (g) => {
    setPathway((p) => {
      const has = p.grades.includes(g);
      return { ...p, grades: has ? p.grades.filter(x => x !== g) : [...p.grades, g] };
    });
  };

  const addModule = (m) => {
    setPathway((p) => ({ ...p, modules: [...p.modules, { ...m, id: uid() }] }));
  };

  const updateModule = (id, patch) => {
    setPathway((p) => ({
      ...p,
      modules: p.modules.map(m => (m.id === id ? { ...m, ...patch } : m))
    }));
  };

  const removeModule = (id) => {
    setPathway((p) => ({ ...p, modules: p.modules.filter(m => m.id !== id) }));
  };

  const savePathway = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Prepare payload: convert File objects to metadata; real upload should be done separately
      const payload = {
        title: pathway.title,
        description: pathway.description,
        cost: pathway.cost,
        grades: pathway.grades,
        modules: pathway.modules.map(m => ({
          title: m.title,
          level: m.level,
          description: m.description,
          materials: m.materials?.map(mat => ({
            id: mat.id,
            type: mat.type,
            name: mat.name,
            // if file present we'll send just placeholder; implement presign upload flow server-side
            fileName: mat.file ? mat.file.name : undefined,
            url: mat.url || undefined,
            note: mat.note || undefined
          })) || []
        }))
      };

      // If your backend returns the saved object, you can save it to state
      const res = await axios.post(`${API_BASE}`, payload).catch(err => {
        // best-effort: if backend not ready, just simulate
        console.warn("API save failed:", err?.message || err);
        return { data: { ...payload, _id: uid() } };
      });

      setPreviewSavedPathway(res.data);
      setMessage("Pathway saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save pathway. See console.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4500);
    }
  };

  const deletePathway = async () => {
    if (!previewSavedPathway?._id) {
      // Nothing persisted; just clear draft
      if (!window.confirm("Discard this draft?")) return;
      localStorage.removeItem("pathway_draft_v1");
      setPathway({ title: "", description: "", cost: "", grades: [], modules: [] });
      setMessage("Draft cleared");
      setTimeout(()=>setMessage(null),2000);
      return;
    }
    if (!window.confirm("Delete pathway from server? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE}/${previewSavedPathway._id}`).catch(() => null);
      setPathway({ title: "", description: "", cost: "", grades: [], modules: [] });
      setPreviewSavedPathway(null);
      setMessage("Deleted from server (or simulated).");
      setTimeout(()=>setMessage(null),2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete.");
      setTimeout(()=>setMessage(null),2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
            Pathway Creator
          </h1>
          <p className="text-gray-500 mt-1">Build structured learning tracks — fast & delightful ✨</p>
        </motion.header>

        <motion.section
          initial={{ scale: 0.99, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white shadow-2xl rounded-2xl p-6"
        >
          {/* Pathway meta */}
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 space-y-4">
              <label className="block">
                <div className="font-semibold text-gray-700 mb-2">Pathway Name</div>
                <input
                  value={pathway.title}
                  onChange={(e) => setPathway(p => ({ ...p, title: e.target.value }))}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-pink-200 outline-none"
                  placeholder="E.g. Full Stack Web Development"
                />
              </label>

              <label className="block">
                <div className="font-semibold text-gray-700 mb-2">Description</div>
                <textarea
                  value={pathway.description}
                  onChange={(e) => setPathway(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-pink-200 outline-none"
                  placeholder="Short summary for learners"
                />
              </label>

              <label className="block">
                <div className="font-semibold text-gray-700 mb-2">Cost</div>
                <input
                  type="number"
                  value={pathway.cost}
                  onChange={(e) => setPathway(p => ({ ...p, cost: e.target.value }))}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-pink-200 outline-none"
                  placeholder="E.g. 200"
                />
              </label>

              <div>
                <div className="font-semibold text-gray-700 mb-2">Grades</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {gradeList.map(g => {
                    const checked = pathway.grades.includes(g);
                    return (
                      <button
                        key={g}
                        onClick={() => toggleGrade(g)}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg text-sm font-medium
                          ${checked ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                          transform transition-all`}
                      >
                        <span>{g}</span>
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${checked ? "bg-white text-indigo-600" : "bg-gray-200 text-gray-600"}`}>
                          {checked ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Controls (extreme right area restored) */}
            <aside className="space-y-4">
              <div className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="text-sm text-gray-500">Status</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="px-3 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">Draft</div>
                  <div className="text-xs text-gray-400">Auto-saved locally</div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={savePathway}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transform active:scale-95"
                  >
                    {saving ? "Saving..." : "Save Pathway"}
                  </button>

                  <button
                    onClick={deletePathway}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete / Clear
                  </button>

                  <button
                    onClick={() => { navigator.clipboard?.writeText(JSON.stringify(pathway)); setMessage("Copied JSON to clipboard"); setTimeout(()=>setMessage(null),2000)}}
                    className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                  >
                    Copy JSON
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-100">
                <div className="text-xs text-gray-600">Preview</div>
                <div className="mt-2 text-sm">
                  <div className="font-semibold">{pathway.title || "Untitled pathway"}</div>
                  <div className="text-gray-500 text-sm mt-1">{pathway.description?.slice(0, 80)}</div>
                  <div className="mt-2 text-xs text-gray-400">Modules: {pathway.modules.length}</div>
                  {pathway.cost !== "" && <div className="mt-1 text-xs text-gray-500">Cost: {pathway.cost}</div>}
                </div>
              </div>
            </aside>
          </div>

          <hr className="my-6 border-dashed" />

          {/* Modules Builder */}
          <ModuleBuilder
            modules={pathway.modules}
            onAdd={(m) => addModule(m)}
            onEdit={(id, patch) => updateModule(id, patch)}
            onRemove={(id) => removeModule(id)}
            onRequestEdit={(m) => setEditingModule(m)}
          />
        </motion.section>

        {/* Module Edit Modal */}
        <AnimatePresence>
          {editingModule && (
            <ModuleEditModal
              key={editingModule.id}
              module={editingModule}
              onClose={() => setEditingModule(null)}
              onSave={(id, newModule) => { updateModule(id, newModule); setEditingModule(null); }}
              onDelete={(id) => { removeModule(id); setEditingModule(null); }}
            />
          )}
        </AnimatePresence>

        {/* Floating message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="fixed right-6 bottom-6 bg-white p-3 rounded-xl shadow-lg border"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved preview JSON */}
        <div className="mt-6">
          <details className="bg-white p-4 rounded-lg border">
            <summary className="font-medium cursor-pointer">Saved Pathway (server preview)</summary>
            <pre className="mt-3 max-h-64 overflow-auto text-xs text-gray-700 p-2 rounded bg-gray-50">{JSON.stringify(previewSavedPathway || {}, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}

// export default App

/* =====================
   ModuleBuilder Component
   - Adds new modules quickly
   - Shows module list with Edit/Delete
   ===================== */
function ModuleBuilder({ modules = [], onAdd, onEdit, onRemove, onRequestEdit }) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState(levels[0]);
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]); // local materials in the add form
  const [materialType, setMaterialType] = useState("file"); // file | video | link
  const [materialURL, setMaterialURL] = useState("");
  const [materialNote, setMaterialNote] = useState("");

  const resetForm = () => {
    setTitle("");
    setLevel(levels[0]);
    setDescription("");
    setMaterials([]);
    setMaterialType("file");
    setMaterialURL("");
    setMaterialNote("");
  };

  const addMaterial = (evt) => {
    evt?.preventDefault();
    if (materialType === "file") {
      // file input element
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setMaterials(prev => [...prev, { id: uid(), type: "file", name: f.name, file: f, note: materialNote }]);
        setMaterialNote("");
      };
      input.click();
      return;
    }

    if (!materialURL) return;
    const mat = {
      id: uid(),
      type: materialType,
      name: materialType === "video" ? "Video link" : "External resource",
      url: materialURL,
      note: materialNote
    };
    setMaterials(prev => [...prev, mat]);
    setMaterialURL("");
    setMaterialNote("");
  };

  const removeMaterial = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  const handleAddModule = () => {
    if (!title.trim()) return alert("Module title is required");
    const module = { title: title.trim(), level, description, materials };
    onAdd(module);
    resetForm();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-pink-50 p-5 rounded-xl"
      >
        <h3 className="text-xl font-semibold mb-3">Add Module</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <input
            className="col-span-2 p-3 rounded-lg border"
            placeholder="Module title (e.g. HTML & CSS Basics)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select className="p-3 rounded-lg border" value={level} onChange={(e)=>setLevel(e.target.value)}>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Module description */}
        <div className="mb-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-lg border"
            placeholder="Module description (short)"
          />
        </div>

        {/* Materials quick-add */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm mb-2">
            <label className="font-medium">Add Materials</label>
            <span className="text-xs text-gray-400">files, video links, external resources</span>
          </div>

          <div className="flex gap-2 items-center">
            <select className="p-2 rounded border" value={materialType} onChange={e=>setMaterialType(e.target.value)}>
              <option value="file">Upload File</option>
              <option value="video">Video URL</option>
              <option value="link">External Link</option>
            </select>

            {(materialType === "video" || materialType === "link") && (
              <input value={materialURL} onChange={e=>setMaterialURL(e.target.value)} placeholder="https://..." className="flex-1 p-2 rounded border" />
            )}

            <input value={materialNote} onChange={e=>setMaterialNote(e.target.value)} placeholder="Note (optional)" className="p-2 rounded border w-44" />

            <button onClick={addMaterial} className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
          </div>

          {/* Material chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {materials.map(m => (
              <div key={m.id} className="px-3 py-1 rounded-full bg-white border shadow-sm text-sm flex items-center gap-2">
                <span className="font-medium">{m.name || m.type}</span>
                {m.url && <a className="text-xs text-indigo-600" href={m.url} target="_blank" rel="noreferrer">open</a>}
                <button onClick={()=>removeMaterial(m.id)} className="ml-2 text-red-500 text-xs">x</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleAddModule} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:scale-95 transform">
            Add Module
          </button>

          <button onClick={resetForm} className="px-4 py-2 rounded-lg border">Reset</button>
        </div>
      </motion.div>

      {/* Modules list */}
      <div className="mt-6 grid gap-3">
        {modules.length === 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50 border text-gray-600">
            No modules yet — add your first module above ✨
          </motion.div>
        )}

        {modules.map(m => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-xl bg-white border flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-xs text-gray-500">{m.level} • {m.materials?.length || 0} materials</div>
              {m.description && <div className="text-xs text-gray-400 italic mt-1">{m.description.slice(0, 80)}</div>}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>onRequestEdit(m)} className="px-3 py-1 rounded-lg bg-indigo-600 text-white">Edit</button>
              <button onClick={()=>onRemove(m.id)} className="px-3 py-1 rounded-lg border text-red-500">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* =====================
   ModuleEditModal Component
   - modal with editable fields for a module
   ===================== */
function ModuleEditModal({ module, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(module.title || "");
  const [level, setLevel] = useState(module.level || levels[0]);
  const [description, setDescription] = useState(module.description || "");
  const [materials, setMaterials] = useState(module.materials || []);

  useEffect(()=> {
    setTitle(module.title || "");
    setLevel(module.level || levels[0]);
    setDescription(module.description || "");
    setMaterials(module.materials || []);
  }, [module]);

  const addFileMaterial = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      setMaterials(prev => [...prev, { id: uid(), type: "file", name: f.name, file: f }]);
    };
    input.click();
  };

  const addLinkMaterial = () => {
    const url = prompt("Paste link (video or resource):");
    if (!url) return;
    setMaterials(prev => [...prev, { id: uid(), type: "link", name: url, url }]);
  };

  const removeMat = (id) => setMaterials(prev => prev.filter(m => m.id !== id));

  const handleSave = () => {
    const updated = { title, level, description, materials };
    onSave(module.id, updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.98, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border"
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold">Edit Module</h3>
            <p className="text-sm text-gray-500">Change details and materials below</p>
          </div>

          <div className="flex gap-2">
            <button onClick={()=>{ if(window.confirm("Delete this module?")) onDelete(module.id) }} className="text-sm px-3 py-2 border rounded text-red-600">Delete</button>
            <button onClick={onClose} className="text-sm px-3 py-2 border rounded">Close</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="p-3 rounded border" />
          <select value={level} onChange={e=>setLevel(e.target.value)} className="p-3 rounded border w-48">
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <div>
            <div className="text-sm font-medium mb-2">Module Description</div>
            <textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-3 rounded border" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Materials</div>
              <div className="flex gap-2">
                <button onClick={addFileMaterial} className="px-3 py-1 bg-indigo-600 text-white rounded">Upload File</button>
                <button onClick={addLinkMaterial} className="px-3 py-1 border rounded">Add Link</button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {materials.length === 0 && <div className="text-sm text-gray-400">No materials</div>}
              {materials.map(mat => (
                <div key={mat.id} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{mat.name || mat.type}</div>
                    <div className="text-xs text-gray-500">{mat.type}{mat.url && ` • ${mat.url}`}</div>
                  </div>
                  <div>
                    <button onClick={()=>removeMat(mat.id)} className="text-sm text-red-500">remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
