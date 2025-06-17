"use client";

import React, { useState } from "react";
import HikmahChat2 from '@/components/chat/HikmahChat2';

/**
 * Main Chat Page - Migrated to use the new HikmahChat2 component
 * 
 * The original implementation has been backed up to /src/app/chat/page.tsx.backup
 * This new implementation uses the context-based, modular chat architecture
 * with proper separation of concerns.
 */
export default function ChatPage() {
  // Generate a random user ID for this chat session
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  
  // Debug mode - uncomment to show debug panel
  const [showDebug, setShowDebug] = useState(false);

  return (
    <>
      {/* Debug Panel - Hidden by default */}
      {showDebug && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 9999, background: 'yellow', color: 'black', padding: 10, borderBottom: '2px solid red', fontWeight: 'bold'}}>
          <span>DEBUG PANEL: </span>
          <button style={{fontSize: 18, padding: 8, background: 'red', color: 'white', border: '2px solid black', borderRadius: 8, marginRight: 20}}>TEST BUTTON</button>
          <button style={{marginLeft: 20, fontSize: 14}} onClick={() => setShowDebug((v) => !v)}>Hide Debug</button>
        </div>
      )}
      
      {/* Main Chat Component */}
      <HikmahChat2 userId={userId} />
    </>
  );
}
