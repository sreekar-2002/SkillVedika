"use client";

import {
  ClipboardList,
  BarChart3,
  Headphones,
  ClipboardCheck,
} from "lucide-react";

export default function HrGuide({
  title,
  subtitle,
  steps,
}: {
  title: { part1?: string; part2?: string };
  subtitle: string;
  steps: {
    step: string;
    title: string;
    description: string;
  }[];
}) {
  // Static icon mapping based on index
  const icons = [ClipboardList, ClipboardCheck, BarChart3, Headphones];

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
              {title?.part1}
            </span>{" "}
            {title?.part2}
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* DESKTOP TIMELINE */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-accent/20" />

          <div className="grid grid-cols-4 gap-8">
            {steps?.map((guide, idx) => {
              const Icon = icons[idx] || ClipboardList;

              return (
                <div
                  key={idx}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Step Number Circle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      {/* Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                      {/* Main Circle */}
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-teal-600 p-0.5 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg">
                        {guide.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  {/* Arrow (not last item) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-24 -right-4 w-8 h-8 flex items-center justify-center">
                      <div className="w-3 h-3 border-t-2 border-r-2 border-primary rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE/TABLET TIMELINE */}
        <div className="lg:hidden space-y-8">
          {steps?.map((guide, idx) => {
            const Icon = icons[idx] || ClipboardList;

            return (
              <div
                key={idx}
                className="relative flex gap-6 animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Left side */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                    {/* Main circle */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {guide.step}
                    </div>
                  </div>

                  {/* Vertical Connector */}
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[80px] bg-gradient-to-b from-primary/50 to-accent/20 mt-4" />
                  )}
                </div>

                {/* Right Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
