import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.tsx'
// import VideoCall from './videoCall.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* <VideoCall /> */}
  </StrictMode>
);
