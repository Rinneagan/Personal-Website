'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import React from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.1, 0.25, 1] as const,
  duration: 0.4
};

const pageStyle = {
  position: 'relative' as const,
  width: '100%',
  minHeight: '100vh'
};

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        style={pageStyle}
        className={className}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface TabTransitionProps {
  children: ReactNode;
  isActive: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const tabVariants = {
  initial: (direction: string) => ({
    opacity: 0,
    x: direction === 'right' ? 100 : direction === 'left' ? -100 : 0,
    y: direction === 'down' ? 100 : direction === 'up' ? -100 : 0,
    scale: 0.95
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1
  },
  exit: (direction: string) => ({
    opacity: 0,
    x: direction === 'right' ? -100 : direction === 'left' ? 100 : 0,
    y: direction === 'down' ? -100 : direction === 'up' ? 100 : 0,
    scale: 1.05
  })
};

const tabTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  duration: 0.3
};

export function TabTransition({ children, isActive, direction = 'right' }: TabTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          custom={direction}
          variants={tabVariants}
          transition={tabTransition}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SectionTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
}

const sectionVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 }
  }
};

const sectionTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  duration: 0.6
};

export function SectionTransition({ 
  children, 
  delay = 0, 
  className = '', 
  animation = 'fadeIn' 
}: SectionTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={sectionVariants[animation]}
      transition={{ ...sectionTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerTransitionProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  }
};

export function StaggerTransition({ 
  children, 
  staggerDelay = 0.1, 
  className = '', 
  animation = 'fadeIn' 
}: StaggerTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={containerVariants}
      transition={{ staggerChildren: staggerDelay }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants[animation]}
          transition={{ delay: index * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
