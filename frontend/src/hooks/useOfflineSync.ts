"use client";

import { useState, useEffect, useCallback } from "react";

interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingOperations, setPendingOperations] = useState<OfflineOperation[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addOfflineOperation = useCallback((
    type: OfflineOperation['type'],
    data: any
  ) => {
    const operation: OfflineOperation = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: Date.now()
    };

    setPendingOperations(prev => [...prev, operation]);

    // Store in IndexedDB for persistence
    if ('indexedDB' in window) {
      const request = indexedDB.open('edumyles-offline', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['operations'], 'readwrite');
        const store = transaction.objectStore('operations');
        store.add(operation);
      };
    }
  }, []);

  const syncPendingOperations = useCallback(async () => {
    if (!isOnline || pendingOperations.length === 0) return;

    setSyncStatus('syncing');

    try {
      // Get stored operations from IndexedDB
      const operations: OfflineOperation[] = [];
      
      if ('indexedDB' in window) {
        const request = indexedDB.open('edumyles-offline', 1);
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['operations'], 'readonly');
          const store = transaction.objectStore('operations');
          
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = (e) => {
            operations.push(...e.target.result);
            
            // Process each operation
            for (const operation of operations) {
              // Here you would make API calls to sync the operations
              console.log('Syncing operation:', operation);
              
              // Simulate API call delay
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Clear synced operations
            const clearTransaction = db.transaction(['operations'], 'readwrite');
            const clearStore = clearTransaction.objectStore('operations');
            const clearRequest = clearStore.clear();
            clearRequest.onsuccess = () => {
              setPendingOperations([]);
              setSyncStatus('idle');
            };
          };
        };
      };
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
    }
  }, [isOnline, pendingOperations]);

  const clearPendingOperations = useCallback(() => {
    setPendingOperations([]);
    
    if ('indexedDB' in window) {
      const request = indexedDB.open('edumyles-offline', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['operations'], 'readwrite');
        const store = transaction.objectStore('operations');
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          console.log('Cleared pending operations');
        };
      };
    }
  }, []);

  useEffect(() => {
    // Load pending operations on mount
    if ('indexedDB' in window) {
      const request = indexedDB.open('edumyles-offline', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames().contains('operations')) {
          db.createObjectStore('operations', { keyPath: 'id' });
        }
        
        const transaction = db.transaction(['operations'], 'readonly');
        const store = transaction.objectStore('operations');
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = (e) => {
          setPendingOperations(e.target.result || []);
        };
      };
    }
  }, []);

  return {
    isOnline,
    pendingOperations,
    syncStatus,
    addOfflineOperation,
    syncPendingOperations,
    clearPendingOperations
  };
}
