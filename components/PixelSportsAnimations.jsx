import React from 'react';

const pixelStyle = { 
  shapeRendering: 'crispEdges', 
  imageRendering: 'pixelated' 
};

const svgStyles = `
  @keyframes pixelFloatBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12%); }
  }
  @keyframes pixelSpinBounce {
    0% { transform: rotate(0deg) translateY(0); }
    25% { transform: rotate(90deg) translateY(-6%); }
    50% { transform: rotate(180deg) translateY(0); }
    75% { transform: rotate(270deg) translateY(-6%); }
    100% { transform: rotate(360deg) translateY(0); }
  }
  @keyframes pixelHoverLift {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10%) scale(1.05); }
  }
  @keyframes pixelShimmer {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.82; transform: scale(1.06); }
  }
  @keyframes pixelTilt {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg); }
    75% { transform: rotate(8deg); }
  }
  @keyframes pixelFlicker {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.85; transform: scale(1.08); }
  }
`;

export const PixelSoccerBall = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelFloatBounce 2.5s ease-in-out infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#000" d="M5 1h6v1h2v2h2v6h-2v2h-2v1h-6v-1h-2v-2h-2v-6h2v-2h2v-1z"/>
    <path fill="#FFF" d="M6 2h4v1h3v3h1v4h-1v3h-3v1h-4v-1h-3v-3h-1v-4h1v-3h3v-1z"/>
    <path fill="#000" d="M6 3h4v1h-1v2h-2v-2h-1v-1zm-3 4h1v2h1v1h-2v-3zm9 0h-2v3h-1v1h1v-1h2v-3zm-5 4h2v2h-2v-2z"/>
  </svg>
);

export const PixelBasketball = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelSpinBounce 4s linear infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#000" d="M5 1h6v1h2v2h2v6h-2v2h-2v1h-6v-1h-2v-2h-2v-6h2v-2h2v-1z"/>
    <path fill="#E67E22" d="M6 2h4v1h3v3h1v4h-1v3h-3v1h-4v-1h-3v-3h-1v-4h1v-3h3v-1z"/>
    <path fill="#000" d="M7 2h1v12h-1zM2 7h12v1h-12z"/>
    <path fill="#000" d="M4 3h1v2h-1zm7 0h-1v2h1zM4 11h1v2h-1zm7 0h-1v2h1z"/>
  </svg>
);

export const PixelCleat = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelHoverLift 2.5s ease-in-out infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#000" d="M2 5h4v1h1v1h2v1h4v3h-11v-6z"/>
    <path fill="#FFF" d="M6 7h2v1h-2z"/>
    <path fill="#000" d="M3 11h1v2h-1zm3 0h1v2h-1zm3 0h1v2h-1zm3 0h1v2h-1z"/>
    <path fill="#E74C3C" d="M2 6h4v1h-4zM8 8h5v2h-5z"/>
  </svg>
);

export const PixelTrophy = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelShimmer 2s ease-in-out infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#F1C40F" d="M4 2h8v5h-1v2h-2v2h-2v-2h-2v-2h-1v-5z"/>
    <path fill="#D4AC0D" d="M12 3h2v3h-2zm-10 0h2v3h-2z"/>
    <path fill="#000" d="M7 11h2v1h-2zm-2 1h6v2h-6z"/>
  </svg>
);

export const PixelDumbbell = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelTilt 3s ease-in-out infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#95A5A6" d="M2 4h3v8h-3zm9 0h3v8h-3zM5 7h6v2h-6z"/>
    <path fill="#7F8C8D" d="M3 5h1v6h-1zm9 0h1v6h-1z"/>
  </svg>
);

export const PixelFlame = ({ size = 36, className = '', animated = true }) => (
  <svg 
    width={size} height={size} viewBox="0 0 16 16" 
    className={`inline-block align-middle ${className}`}
    style={{ ...pixelStyle, animation: animated ? 'pixelFlicker 1.5s ease-in-out infinite' : 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{svgStyles}</style>
    <path fill="#E74C3C" d="M8 1h1v2h1v2h1v2h1v4h-1v2h-2v1h-3v-1h-2v-2h-1v-4h1v-2h1v-2h1v2h1v-2z"/>
    <path fill="#E67E22" d="M8 4h1v2h1v3h-1v2h-2v-2h-1v-3h1v-1h1v-1z"/>
    <path fill="#F1C40F" d="M8 7h1v2h-1v1h-1v-2h1v-1z"/>
  </svg>
);
