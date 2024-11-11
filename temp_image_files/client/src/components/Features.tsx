import React from 'react';
import { Bot, Lock, Share2, Cpu } from 'lucide-react';

interface FeaturesProps {
  t: {
    features: {
      title: string;
      smart: { title: string; description: string; };
      secure: { title: string; description: string; };
      collab: { title: string; description: string; };
      auto: { title: string; description: string; };
    };
  };
}

export function Features({ t }: FeaturesProps) {
  return (
    <section id="features" className="py-24 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600/10 text-red-500">
                <Bot className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{t.features.smart.title}</h3>
              <p className="mt-2 text-gray-400">{t.features.smart.description}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600/10 text-red-500">
                <Lock className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{t.features.secure.title}</h3>
              <p className="mt-2 text-gray-400">{t.features.secure.description}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600/10 text-red-500">
                <Share2 className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{t.features.collab.title}</h3>
              <p className="mt-2 text-gray-400">{t.features.collab.description}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600/10 text-red-500">
                <Cpu className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{t.features.auto.title}</h3>
              <p className="mt-2 text-gray-400">{t.features.auto.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
