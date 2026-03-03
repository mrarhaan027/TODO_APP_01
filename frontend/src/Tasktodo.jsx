import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Plus, Trash2, CheckCircle2, Circle, X, 
  Loader2, Edit2, Sun, Moon, Inbox, AlertTriangle, Calendar, Clock 
} from 'lucide-react';

const API_URL = 'https://todo-app-01-1.onrender.com/api';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLeft, setTasksLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [filter, setFilter] = useState('all'); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [modalCategory, setModalCategory] = useState('Work'); 
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', desc: '', dueDate: '', time: ''
  });

  const categories = [{ name: 'All' }, { name: 'Banana' }, { name: 'Graps' }, { name: 'Papaya' }, { name: 'Watermelon' }];

  const toastStyle = {
    style: { background: '#f59e0b', color: '#000', fontSize: '14px', fontWeight: '800', borderRadius: '8px', border: '1px solid #000' },
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        params: { status: filter, category: selectedCategory === 'All' ? null : selectedCategory }
      });
      setTasks(response.data.tasks);
      setTasksLeft(response.data.tasksLeft);
    } catch (err) { console.error("Fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [filter, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { ...formData, category: modalCategory };
      if (editTaskId) {
        await axios.put(`${API_URL}/tasks/${editTaskId}`, taskData);
        toast.success('TASK UPDATED', toastStyle);
      } else {
        await axios.post(`${API_URL}/tasks`, taskData);
        toast.success('TASK CREATED', toastStyle);
      }
      closeModal();
      fetchTasks();
    } catch (err) { toast.error("ACTION FAILED", toastStyle); }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
    await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
    fetchTasks();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/tasks/${deleteModal.id}`);
      toast.success('TASK DELETED', toastStyle);
      setDeleteModal({ show: false, id: null });
      fetchTasks();
    } catch (err) { toast.error("DELETE FAILED", toastStyle); }
  };

  const openEditModal = (task) => {
    setEditTaskId(task._id);
    setFormData({ title: task.title, desc: task.desc, dueDate: task.dueDate, time: task.time });
    setModalCategory(task.category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTaskId(null);
    setFormData({ title: '', desc: '', dueDate: '', time: '' });
    setModalCategory('Work');
  };

  const themeClass = isDarkMode ? "bg-black text-slate-100" : "bg-slate-50 text-slate-900";
  const cardClass = isDarkMode ? "bg-[#111111] border-white/5" : "bg-white border-slate-200 shadow-sm";
  const inputClass = isDarkMode ? "bg-white/5 border-white/10 text-white placeholder-slate-500" : "bg-slate-100 border-slate-300 text-black placeholder-slate-400";

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClass} p-4 md:p-8 pb-40`}>
      <Toaster position="bottom-center" />

      {/* Navbar */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-[#f59e0b] p-1.5 rounded-lg">
            <CheckCircle2 size={22} className="text-black" strokeWidth={3} />
          </div>
          <span className={`font-black text-2xl tracking-tighter ${!isDarkMode && 'text-black'}`}>Reminds.</span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full border transition-colors ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}>
          {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-slate-600" />}
        </button>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif italic mb-2">My Tasks</h1>
            <p className="text-amber-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{new Date().toDateString()}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#f59e0b] text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`whitespace-nowrap px-5 md:px-6 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border-2 transition-all ${selectedCategory === cat.name ? 'bg-[#f59e0b] border-[#f59e0b] text-black' : isDarkMode ? 'border-white/10 text-slate-500' : 'border-slate-300 text-slate-500'}`}>{cat.name}</button>
          ))}
        </div>
      </header>

      {/* Task List */}
      <main className="max-w-4xl mx-auto space-y-5">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className={`flex items-start gap-4 md:gap-5 p-5 md:p-6 rounded-3xl border transition-all ${cardClass} ${task.status === 'completed' ? 'opacity-40 grayscale' : ''}`}>
               <div className="mt-1 cursor-pointer" onClick={() => toggleTaskStatus(task._id, task.status)}>
                  {task.status === 'completed' ? <div className="bg-amber-500 rounded-lg p-1"><CheckCircle2 size={18} className="text-black" strokeWidth={3} /></div> : <Circle size={22} className={isDarkMode ? "text-white/20" : "text-slate-300"} />}
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg md:text-xl font-bold tracking-tight ${!isDarkMode && 'text-black'}`}>{task.title}</h3>
                    <div className="flex gap-4">
                      <Edit2 size={16} className="cursor-pointer text-slate-500 hover:text-amber-500" onClick={() => openEditModal(task)} />
                      <Trash2 size={16} className="cursor-pointer text-red-600" onClick={() => setDeleteModal({ show: true, id: task._id })} />
                    </div>
                  </div>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">{task.desc}</p>
                  <div className="flex items-center gap-4 mt-5">
                    <span className="px-3 py-0.5 rounded-lg text-[9px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">{task.category}</span>
                    {task.dueDate && <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}><Calendar size={12}/> {task.dueDate}</span>}
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center opacity-50">
            <Inbox size={60} className="text-amber-500/20 mb-4" />
            <p className="text-slate-500 font-serif italic text-lg">Nothing scheduled.</p>
          </div>
        )}
      </main>

      {/* Footer Filter */}
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 px-4 md:px-6 flex justify-center z-40">
        <footer className={`w-full max-w-2xl flex justify-between items-center p-2 px-4 rounded-2xl border backdrop-blur-xl ${isDarkMode ? 'bg-black/80 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
          <div className={`flex rounded-xl p-1 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
            {['all', 'active', 'completed'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 md:px-5 py-2 rounded-lg text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-amber-500 text-black' : 'text-slate-500'}`}>{f}</button>
            ))}
          </div>
          <span className="text-[10px] md:text-[11px] font-black text-amber-500 uppercase tracking-widest px-2">{tasksLeft} LEFT</span>
        </footer>
      </div>

      {/* Custom Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
          <div className={`w-full max-w-sm rounded-[2rem] border p-8 text-center ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'}`}>
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
            <h2 className={`text-xl font-bold mb-2 ${!isDarkMode && 'text-black'}`}>Delete Task?</h2>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 py-3 text-slate-500 font-black uppercase text-[10px]">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black text-[10px]">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (Edit/Create) - Fixed Light Mode Visibility */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <form onSubmit={handleSubmit} className={`relative w-full max-w-lg rounded-[2.5rem] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>
            <div className="flex justify-between items-center p-6 md:p-8">
              <h2 className={`text-2xl font-serif italic ${!isDarkMode && 'text-black'}`}>{editTaskId ? 'Edit' : 'New'} Task</h2>
              <X className="cursor-pointer text-slate-500" onClick={closeModal} />
            </div>
            <div className="p-6 md:p-8 pt-0 space-y-5">
              <input type="text" placeholder="Title" required className={`w-full border p-4 rounded-2xl outline-none focus:border-amber-500 font-bold ${inputClass}`} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              <textarea placeholder="Details..." rows="2" className={`w-full border p-4 rounded-2xl outline-none focus:border-amber-500 resize-none ${inputClass}`} value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className={`w-full border p-4 rounded-2xl text-xs outline-none focus:border-amber-500 ${inputClass}`} value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
                <input type="time" className={`w-full border p-4 rounded-2xl text-xs outline-none focus:border-amber-500 ${inputClass}`} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.name !== 'All').map((cat) => (
                  <button key={cat.name} type="button" onClick={() => setModalCategory(cat.name)} className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${modalCategory === cat.name ? 'border-amber-500 bg-amber-500/10 text-amber-500' : isDarkMode ? 'border-white/5 text-slate-600' : 'border-slate-200 text-slate-400'}`}>{cat.name}</button>
                ))}
              </div>
            </div>
            <div className={`p-6 md:p-8 flex gap-4 border-t ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <button type="button" onClick={closeModal} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px]">Cancel</button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg">Save Task</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskApp;