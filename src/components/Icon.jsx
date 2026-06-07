import { motion } from 'framer-motion'
import { CATEGORIES } from '../lib/constants'

// A generic rounded SVG icon we use across the app
export const Icon = ({ name, className = 'w-4 h-4' }) => {
  const icons = {
    flame: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4-.5 2 .5 3 1.5 3C9 8 12 6 12 2z" />
      </svg>
    ),
    bolt: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    ),
    gem: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6 2h12l4 6-10 14L2 8l4-6zm.5 2L4 8h5L8 4H6.5zm9 0H10l1 4h6l-1.5-4zM3.5 10l7.5 10V10h-8zm9 0v10L20 10h-7.5z" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
      </svg>
    ),
    trophy: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 4h10v3a5 5 0 0 1-10 0V4zm-3 1h2v3a3 3 0 0 1-2-3zm14 0h2a3 3 0 0 1-2 3V5zM9 14h6l-1 7h-4l-1-7zM7 22h10v2H7z" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
        <path d="M5 12l5 5L20 7" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    ),
    leaf: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5 21c10 0 14-7 14-17C9 4 5 10 5 21zm2-2c1-5 4-9 9-11-1 6-4 10-9 11z" />
      </svg>
    ),
    map: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2zm0 2.2l6 2v15.6l-6-2V5.2z" />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9z" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
    shop: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M3 7h18l-2 12H5L3 7zM8 7V5a4 4 0 0 1 8 0v2" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M4 4h7v16H4zM13 4h7v16h-7z" />
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    cloud: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 18a5 5 0 0 1 0-10 6 6 0 0 1 11 2 4 4 0 0 1 0 8H7z" />
      </svg>
    ),
    rain: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M7 14a4 4 0 0 1 0-8 5 5 0 0 1 10 1 3 3 0 0 1 0 7H7zm1 2l-1 4M11 16l-1 4M15 16l-1 4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    fire: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2c0 4 4 5 4 9a4 4 0 1 1-8 0c0-2 1-3 2-4-.5 2 .5 3 1.5 3C9 8 12 6 12 2z" />
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l1.5 5L18 8.5 13.5 10 12 15l-1.5-5L6 8.5 10.5 7 12 2zM5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14zm14 2l.5 1.5L21 18l-1.5.5L19 20l-.5-1.5L17 18l1.5-.5L19 16z" />
      </svg>
    ),
  }
  return icons[name] || null
}

export const CategoryIcon = ({ category, className }) => {
  const c = CATEGORIES[category] || CATEGORIES.growth
  return <span style={{ color: c.color }} className={className}>{c.icon}</span>
}
