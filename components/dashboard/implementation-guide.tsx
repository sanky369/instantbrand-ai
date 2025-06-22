import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Copy,
  Globe,
  Shield,
  FileText,
  ExternalLink,
  Rocket,
  Calendar,
  DollarSign,
  Users,
  Code,
  Mail,
  Megaphone,
  Package,
  Square,
  CheckSquare
} from 'lucide-react';
import { BrandStrategy } from '@/lib/types';

interface ImplementationGuideProps {
  strategy: BrandStrategy;
  onCopy: (text: string, itemId: string) => void;
  copiedItem: string | null;
}

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
  completed: boolean;
}

export default function ImplementationGuide({ strategy, onCopy, copiedItem }: ImplementationGuideProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'domain',
      task: 'Register Domain Name',
      description: `Choose from: ${strategy.domain_suggestions.join(', ')}`,
      priority: 'high',
      link: 'https://namecheap.com',
      completed: false
    },
    {
      id: 'trademark',
      task: 'Trademark Search',
      description: `Search for "${strategy.company_name}" availability`,
      priority: 'high',
      link: 'https://www.uspto.gov/trademarks/search',
      completed: false
    },
    {
      id: 'social',
      task: 'Secure Social Handles',
      description: 'Register username across all platforms',
      priority: 'high',
      completed: false
    },
    {
      id: 'email',
      task: 'Set Up Business Email',
      description: `Create professional email @${strategy.domain_suggestions[0] || 'yourdomain.com'}`,
      priority: 'high',
      link: 'https://workspace.google.com',
      completed: false
    },
    {
      id: 'website',
      task: 'Launch Website',
      description: 'Use the mockup as reference for development',
      priority: 'medium',
      completed: false
    },
    {
      id: 'analytics',
      task: 'Set Up Analytics',
      description: 'Install Google Analytics and tracking pixels',
      priority: 'medium',
      link: 'https://analytics.google.com',
      completed: false
    },
    {
      id: 'content',
      task: 'Create Content Calendar',
      description: 'Plan first month of social media posts',
      priority: 'medium',
      completed: false
    },
    {
      id: 'pr',
      task: 'Prepare Press Kit',
      description: 'Create media kit with logo, description, and images',
      priority: 'low',
      completed: false
    }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const CopyButton = ({ text, itemId }: { text: string; itemId: string }) => (
    <button
      onClick={() => onCopy(text, itemId)}
      className="p-1 hover:bg-gray-100 rounded transition-colors"
    >
      {copiedItem === itemId ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <div className="space-y-8">
      {/* Launch Checklist */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-purple-600" />
          Launch Checklist
        </h3>
        
        <div className="space-y-3">
          {checklist.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`
                p-4 rounded-lg border transition-all cursor-pointer
                ${item.completed ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-sm'}
              `}
              onClick={() => toggleChecklistItem(item.id)}
            >
              <div className="flex items-start gap-3">
                <button className="mt-0.5">
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                      {item.task}
                    </h4>
                    <span className={`
                      px-2 py-1 text-xs rounded-full border
                      ${priorityColors[item.priority]}
                    `}>
                      {item.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {item.link && !item.completed && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:text-purple-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Get started
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <strong>Progress:</strong> {checklist.filter(item => item.completed).length} of {checklist.length} tasks completed
          </p>
        </div>
      </div>

      {/* Domain & Social Availability */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Domain & Social Availability
        </h3>
        
        <div className="space-y-4">
          {/* Domain Suggestions */}
          <div>
            <h4 className="font-medium mb-2">Suggested Domains</h4>
            <div className="space-y-2">
              {strategy.domain_suggestions.map((domain, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm">{domain}</span>
                  <div className="flex items-center gap-2">
                    <CopyButton text={domain} itemId={`domain-${index}`} />
                    <a
                      href={`https://namecheap.com/domains/registration/results/?domain=${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      Check <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Handles */}
          <div>
            <h4 className="font-medium mb-2">Social Media Handles</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(strategy.social_handles_availability).map(([platform, available]) => (
                <div key={platform} className="flex items-center gap-2">
                  {available ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                  )}
                  <span className="text-sm capitalize">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Guidelines Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Quick Brand Guidelines
        </h3>
        
        <div className="space-y-6">
          {/* Logo Usage */}
          <div>
            <h4 className="font-medium mb-2">Logo Usage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-700 mb-1">DO:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Use on white/light backgrounds</li>
                  <li>• Maintain clear space around logo</li>
                  <li>• Use provided color versions</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-700 mb-1">DON'T:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Distort or rotate the logo</li>
                  <li>• Change colors arbitrarily</li>
                  <li>• Add effects or shadows</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Voice & Tone */}
          <div>
            <h4 className="font-medium mb-2">Voice & Tone</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Speak as if you are: {strategy.brand_personality.join(', ')}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Example:</strong> Instead of "Buy our product", say "{strategy.tagline}"
              </p>
            </div>
          </div>

          {/* Email Signature */}
          <div>
            <h4 className="font-medium mb-2">Email Signature Template</h4>
            <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
              <div className="space-y-1">
                <p>Best regards,</p>
                <p>[Your Name]</p>
                <p>[Your Title] | {strategy.company_name}</p>
                <p className="text-purple-600">{strategy.tagline}</p>
                <p>[email] | [phone]</p>
                <p>[website]</p>
              </div>
              <CopyButton 
                text={`Best regards,\n[Your Name]\n[Your Title] | ${strategy.company_name}\n${strategy.tagline}\n[email] | [phone]\n[website]`} 
                itemId="email-signature" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Ready to Launch? 🚀</h3>
        <p className="mb-4">
          You now have everything needed to launch {strategy.company_name}. 
          Here's your 30-day roadmap:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Calendar className="w-6 h-6 mb-2" />
            <h4 className="font-medium mb-1">Week 1</h4>
            <p className="text-sm opacity-90">Domain, legal, social setup</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Code className="w-6 h-6 mb-2" />
            <h4 className="font-medium mb-1">Week 2-3</h4>
            <p className="text-sm opacity-90">Website development & content</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <Megaphone className="w-6 h-6 mb-2" />
            <h4 className="font-medium mb-1">Week 4</h4>
            <p className="text-sm opacity-90">Launch & marketing push</p>
          </div>
        </div>
      </div>
    </div>
  );
}