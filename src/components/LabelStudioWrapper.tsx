import React, { useEffect, useRef, useState } from 'react';
import { Task, AnnotationResult } from '../types';
import { LabelStudioAPI } from '../utils/api';

interface LabelStudioWrapperProps {
  task: Task | null;
  config: string;
  api: LabelStudioAPI | null;
  onUpdate: (results: AnnotationResult[]) => void;
  onSubmit: (results: AnnotationResult[]) => void;
}

export const LabelStudioWrapper: React.FC<LabelStudioWrapperProps> = ({
  task,
  config: _config,
  api,
  onUpdate,
  onSubmit: _onSubmit,
}) => {
  const pollingIntervalRef = useRef<number | null>(null);
  const [labelStudioUrl, setLabelStudioUrl] = useState<string>('');
  const lastResultsRef = useRef<string>(''); // Store serialized results for comparison

  useEffect(() => {
    if (!task) return;

    // Reset comparison cache when task changes
    lastResultsRef.current = '';

    // Get Label Studio URL from environment
    const baseUrl = import.meta.env.VITE_LABEL_STUDIO_URL || 'http://localhost:8080';
    const projectId = import.meta.env.VITE_PROJECT_ID || '1';

    // Construct URL to the specific task in Label Studio
    const taskUrl = `${baseUrl}/projects/${projectId}/data?task=${task.id}`;
    setLabelStudioUrl(taskUrl);

    // Start polling for annotation updates from the API
    startPolling();

    return () => {
      stopPolling();
    };
  }, [task]);

  const startPolling = () => {
    stopPolling();

    // Poll the API every 2 seconds to get updated annotations for current task
    pollingIntervalRef.current = window.setInterval(async () => {
      if (!task || !api) return;

      try {
        // Fetch current task's annotations using API class
        const updatedTask = await api.getTask(task.id);
        console.log(`[Polling] Task ${task.id}: ${updatedTask.annotations?.length || 0} annotations`);
        if (updatedTask.annotations && updatedTask.annotations.length > 0) {
          const latestAnnotation = updatedTask.annotations[updatedTask.annotations.length - 1];
          if (latestAnnotation.result) {
            // Compare with previous results to avoid unnecessary updates
            const currentResults = JSON.stringify(latestAnnotation.result);
            if (currentResults !== lastResultsRef.current) {
              console.log(`[Polling] ✨ Data changed! Updating graph with ${latestAnnotation.result.length} results`);
              lastResultsRef.current = currentResults;
              onUpdate(latestAnnotation.result);
            } else {
              console.log(`[Polling] No changes detected, skipping update`);
            }
          }
        }
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current !== null) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  if (!task) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No task available. Please check your configuration.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>📝 Annotate in Label Studio (Task #{task.id})</span>
        <a
          href={labelStudioUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Open in New Tab →
        </a>
      </div>
      <iframe
        src={labelStudioUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        title="Label Studio Annotation Interface"
        id="label-studio-iframe"
      />
    </div>
  );
};
