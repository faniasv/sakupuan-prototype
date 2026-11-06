"use client";

export default function TaskCard({ task, onToggle }) {
  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
        task.completed
          ? "bg-sakuIvory border-sakuGreen-light opacity-60 line-through"
          : "bg-white border-sakuGreen-light shadow-soft hover:border-sakuGreen"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
          task.completed
            ? "bg-sakuGreen border-sakuGreen text-white"
            : "border-gray-300 bg-white"
        }`}
      >
        {task.completed && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-xs font-bold ${task.completed ? "text-sakuText-muted" : "text-sakuText"}`}>
          {task.title}
        </p>
        <p className="text-[11px] text-sakuText-muted mt-0.5">{task.desc}</p>
      </div>
    </div>
  );
}