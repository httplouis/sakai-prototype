"use client";

type Props = { onGoogle?: () => void; onFacebook?: () => void; onApple?: () => void };

export default function SocialLoginButtons({ onGoogle, onFacebook, onApple }: Props) {
  return (
    <div className="flex gap-3">
      <button onClick={onGoogle}
        className="flex-1 h-12 flex items-center justify-center gap-2 border border-gray-200 rounded-btn bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
        <GoogleIcon />
        <span className="text-sm font-medium text-text-primary">Google</span>
      </button>
      <button onClick={onFacebook}
        className="flex-1 h-12 flex items-center justify-center gap-2 border border-gray-200 rounded-btn bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
        <FacebookIcon />
        <span className="text-sm font-medium text-text-primary">Facebook</span>
      </button>
      <button onClick={onApple}
        className="flex-1 h-12 flex items-center justify-center gap-2 border border-gray-200 rounded-btn bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
        <AppleIcon />
        <span className="text-sm font-medium text-text-primary">Apple</span>
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#1877F2"/>
      <path d="M16 8h-2.5C12.67 8 12 8.67 12 9.5V12h4l-.5 4h-3.5v8H8v-8H5v-4h3V9.5C8 6.46 10.46 4 13.5 4H16v4z" fill="white"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.05 12.536c-.03-2.764 2.26-4.097 2.363-4.16-1.286-1.88-3.288-2.14-4.003-2.168-1.7-.173-3.326 1.003-4.19 1.003-.866 0-2.19-.98-3.6-.953-1.848.027-3.557 1.07-4.507 2.714-1.93 3.34-.494 8.273 1.385 10.977.923 1.327 2.02 2.81 3.46 2.756 1.396-.056 1.921-.896 3.608-.896 1.688 0 2.169.896 3.641.868 1.496-.025 2.44-1.35 3.353-2.68.67-.97 1.163-2.054 1.46-3.206-3.22-1.217-3.96-6.256-.97-7.255z" fill="#000"/>
      <path d="M14.328 4.37C15.07 3.47 15.57 2.22 15.42 1c-1.068.044-2.365.713-3.134 1.614-.688.795-1.294 2.076-1.13 3.297 1.19.09 2.405-.605 3.172-1.541z" fill="#000"/>
    </svg>
  );
}
