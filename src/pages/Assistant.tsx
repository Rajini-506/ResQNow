import React from 'react';
import {
  Bot,
  Shield,
  Activity,
  PhoneCall,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Flame,
  Heart,
  Droplet,
} from 'lucide-react';
import AIChat from '../components/AIChat';

export const Assistant: React.FC = () => {
  return (
    <div id="ai-assistant-page" className="min-h-screen bg-slate-50 py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ResQ AI Emergency Assistant
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI-driven situational guidance, rapid first-aid steps, and emergency triage support
              </p>
            </div>
          </div>

          <a
            id="assistant-call-911-btn"
            href="tel:911"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911 / 112</span>
          </a>
        </div>

        {/* 2-Column layout: Chat on left/center, Reference protocols on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AIChat />
          </div>

          <div className="lg:col-span-4 space-y-4">
            {/* Quick First-Aid Quick Cards */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>Instant Life-Safety Protocols</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Protocol 1: CPR */}
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-950">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Adult Hands-Only CPR</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    Push hard and fast in the center of the chest to the beat of 100–120 bpm (e.g.
                    song "Stayin' Alive"). Allow full chest recoil.
                  </p>
                </div>

                {/* Protocol 2: Bleeding */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Droplet className="w-4 h-4 text-amber-600" />
                    <span>Severe Hemorrhage Control</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    Apply firm, continuous direct pressure with a clean cloth or bandage. Do not
                    remove dressing if soaked; add more layers on top.
                  </p>
                </div>

                {/* Protocol 3: Burns */}
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-orange-950">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>Thermal Burns Protocol</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    Cool burn immediately under cool running tap water for 10–20 minutes. Never
                    apply ice, butter, or oil to burned tissue.
                  </p>
                </div>

                {/* Protocol 4: Choking */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-950">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>Conscious Choking (Heimlich)</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    Stand behind the person, wrap arms around waist, make a fist above navel, and
                    give quick inward and upward thrusts until object clears.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Disclaimer Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-2 text-xs">
              <span className="font-bold text-rose-400 block uppercase tracking-wider text-[11px]">
                Medical &amp; Legal Boundary Notice
              </span>
              <p className="text-slate-300 leading-relaxed">
                ResQ AI is an automated guidance system grounded in standard first-responder
                protocols. It does not provide medical diagnoses or replace licensed clinical or
                emergency dispatch personnel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
