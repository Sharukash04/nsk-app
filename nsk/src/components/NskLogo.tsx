export default function NskLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center bg-gradient-to-br from-nsk-crimson to-nsk-crimsonDim shadow-glow shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none">
        <path
          d="M5 18V6h2.2l7.8 9.4V6H17v12h-2.2L7 8.6V18H5z"
          fill="white"
        />
      </svg>
    </div>
  );
}
