// The DARTER mark: a glossy little blob with eyes, lit like golden hour.
export default function BlobMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="blobmark-fill" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#fff1cf" />
          <stop offset="42%" stopColor="#ffc061" />
          <stop offset="100%" stopColor="#ff6f5c" />
        </radialGradient>
      </defs>
      <path
        d="M20 4C30.5 4 36 12 36 22.5C36 31.5 29 36 20 36C11 36 4 31.5 4 22.5C4 12 9.5 4 20 4Z"
        fill="url(#blobmark-fill)"
      />
      <ellipse cx="13.5" cy="11.5" rx="4.5" ry="2.6" fill="#fff" opacity="0.45" transform="rotate(-25 13.5 11.5)" />
      <circle cx="14.6" cy="20" r="4.4" fill="#fff" />
      <circle cx="25.4" cy="20" r="4.4" fill="#fff" />
      <circle cx="15.4" cy="20.8" r="2.4" fill="#120a1f" />
      <circle cx="26.2" cy="20.8" r="2.4" fill="#120a1f" />
      <circle cx="16.2" cy="19.9" r="0.85" fill="#fff" />
      <circle cx="27" cy="19.9" r="0.85" fill="#fff" />
      <path d="M17 27.5Q20 30.5 23 27.5" stroke="#120a1f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
