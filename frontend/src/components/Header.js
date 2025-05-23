import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, 
  AcademicCapIcon, 
  SunIcon, 
  MoonIcon,
  CommandLineIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { useThemeStore } from '../store/themeStore';

function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-16 bg-cyber-dark/90 backdrop-blur-sm border-b border-cyber-cyan/30 relative"
    >
      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-pulse" />
      
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <CpuChipIcon className="h-8 w-8 text-cyber-cyan animate-pulse-glow" />
            <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-cyber font-bold text-cyber-cyan">
              GIT.NEURAL
            </h1>
            <p className="text-xs text-cyber-cyan/60 font-code">
              v2.0.77_CYBER
            </p>
          </div>
        </motion.div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <motion.a
            whileHover={{ scale: 1.1, color: '#00ffff' }}
            href="#"
            className="text-cyber-cyan/70 hover:text-cyber-cyan font-code text-sm transition-colors"
          >
            &gt; REPOSITORIES
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, color: '#00ff41' }}
            href="#"
            className="text-cyber-green/70 hover:text-cyber-green font-code text-sm transition-colors"
          >
            &gt; BRANCHES
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, color: '#ff0080' }}
            href="#"
            className="text-cyber-pink/70 hover:text-cyber-pink font-code text-sm transition-colors"
          >
            &gt; COMMITS
          </motion.a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-cyber-yellow/70 hover:text-cyber-yellow transition-colors relative"
          >
            <AcademicCapIcon className="h-5 w-5" />
            <div className="absolute inset-0 bg-cyber-yellow/10 rounded blur-lg opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 text-cyber-cyan/70 hover:text-cyber-cyan transition-colors relative"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <div className="absolute inset-0 bg-cyber-cyan/10 rounded blur-lg opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-cyber-pink/70 hover:text-cyber-pink transition-colors relative"
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <div className="absolute inset-0 bg-cyber-pink/10 rounded blur-lg opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-pink rounded-lg flex items-center justify-center">
              <CommandLineIcon className="h-4 w-4 text-cyber-dark" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/30 to-cyber-pink/30 rounded-lg blur-md animate-pulse" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;