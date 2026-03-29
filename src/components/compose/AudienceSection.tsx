import React, { useMemo } from 'react';
import { GraduationCap, BookOpen, Users, Check } from 'lucide-react';
import type { ComposeFormState, ComposeAction, AudienceRole } from '@/types/notification';
import { ALL_GRADES, ALL_CLASSES } from '@/types/notification';

interface Props {
  form: ComposeFormState;
  dispatch: React.Dispatch<ComposeAction>;
}

const ROLE_OPTIONS: { role: AudienceRole; label: string; icon: React.FC<{ className?: string }>; baseCount: number }[] = [
  { role: 'student', label: 'Students', icon: GraduationCap, baseCount: 960 },
  { role: 'teacher', label: 'Teachers', icon: BookOpen, baseCount: 40 },
  { role: 'parent', label: 'Parents', icon: Users, baseCount: 800 },
];

export const AudienceSection: React.FC<Props> = ({ form, dispatch }) => {
  const { audience } = form;

  const toggleRole = (role: AudienceRole) => {
    const has = audience.roles.includes(role);
    const newRoles = has ? audience.roles.filter(r => r !== role) : [...audience.roles, role];
    dispatch({ type: 'UPDATE_AUDIENCE', payload: { roles: newRoles } });
  };

  const toggleGrade = (grade: string) => {
    const has = audience.grades.includes(grade);
    const newGrades = has ? audience.grades.filter(g => g !== grade) : [...audience.grades, grade];
    dispatch({ type: 'UPDATE_AUDIENCE', payload: { grades: newGrades } });
  };

  const toggleClass = (cls: string) => {
    const has = audience.classes.includes(cls);
    const newClasses = has ? audience.classes.filter(c => c !== cls) : [...audience.classes, cls];
    dispatch({ type: 'UPDATE_AUDIENCE', payload: { classes: newClasses } });
  };

  const selectAllGrades = () => {
    dispatch({ type: 'UPDATE_AUDIENCE', payload: { grades: audience.grades.length === ALL_GRADES.length ? [] : [...ALL_GRADES] } });
  };

  const estimatedCount = useMemo(() => {
    let total = 0;
    const hasGradeFilter = audience.grades.length > 0;
    const gradeMultiplier = hasGradeFilter ? audience.grades.length / 12 : 1;
    const hasClassFilter = audience.classes.length > 0;
    const classMultiplier = hasClassFilter ? audience.classes.length / 4 : 1;

    audience.roles.forEach(role => {
      const opt = ROLE_OPTIONS.find(r => r.role === role);
      if (!opt) return;
      if (role === 'student' || role === 'parent') {
        total += Math.round(opt.baseCount * gradeMultiplier * classMultiplier);
      } else {
        total += opt.baseCount;
      }
    });
    return total;
  }, [audience.roles, audience.grades, audience.classes]);

  React.useEffect(() => {
    if (audience.estimatedCount !== estimatedCount) {
      dispatch({ type: 'UPDATE_AUDIENCE', payload: { estimatedCount } });
    }
  }, [estimatedCount, audience.estimatedCount, dispatch]);

  const showFilters = audience.roles.some(r => r === 'student' || r === 'parent');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Audience Targeting</h3>
        <p className="text-sm text-slate-500 mt-1">Choose who should receive this notification.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Recipients by Role</label>
        <div className="grid grid-cols-3 gap-3">
          {ROLE_OPTIONS.map(opt => {
            const selected = audience.roles.includes(opt.role);
            return (
              <button
                key={opt.role}
                onClick={() => toggleRole(opt.role)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                {selected && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <opt.icon className="w-6 h-6" />
                <span className="text-sm font-bold">{opt.label}</span>
                <span className="text-[10px] font-medium text-slate-400">{opt.baseCount.toLocaleString()} total</span>
              </button>
            );
          })}
        </div>
      </div>

      {showFilters && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">Filter by Grade</label>
              <button onClick={selectAllGrades} className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors">
                {audience.grades.length === ALL_GRADES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_GRADES.map(g => {
                const selected = audience.grades.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGrade(g)}
                    className={`w-10 h-10 rounded-xl border-2 text-sm font-bold transition-all ${
                      selected
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {audience.grades.length === 0 ? 'No filter — all grades included' : `${audience.grades.length} grade(s) selected`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Filter by Class Section</label>
            <div className="flex gap-2">
              {ALL_CLASSES.map(c => {
                const selected = audience.classes.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleClass(c)}
                    className={`w-12 h-10 rounded-xl border-2 text-sm font-bold transition-all ${
                      selected
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {audience.classes.length === 0 ? 'No filter — all sections included' : `Section(s) ${audience.classes.join(', ')} selected`}
            </p>
          </div>
        </>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 rounded-lg p-2">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Estimated Audience</p>
            <p className="text-2xl font-bold text-slate-800">
              {estimatedCount > 0 ? `~${estimatedCount.toLocaleString()} recipients` : 'Select at least one role'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
