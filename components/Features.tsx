"use client";

import { motion } from "framer-motion";
import { Images, Sparkles, PackageSearch, BadgeCheck } from "lucide-react";
import { SUPPORTED_FEATURES } from "@/lib/constants";

const iconMap = {
  Images,
  Sparkles,
  PackageSearch,
  BadgeCheck,
};

function Features() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            Everything you need to convert your images efficiently
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTED_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative p-6 bg-white rounded-xl shadow-sm border border-orange-100/20 transition duration-300 group-hover:border-orange-200">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200 transition duration-300">
                    <Icon className="h-8 w-8 text-orange-500 group-hover:scale-110 transition duration-300" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;