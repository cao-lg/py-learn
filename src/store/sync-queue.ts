import { storage } from './idb';
import type { SyncPayload } from '../types';
import { uumsClient, getStoredUserId } from '../utils/uums-api';

class SyncQueue {
  private isOnline: boolean = navigator.onLine;
  private syncInterval: number | null = null;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  startAutoSync(intervalMs: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline) {
        this.processQueue();
      }
    }, intervalMs);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async enqueue(payload: SyncPayload): Promise<void> {
    await storage.addToSyncQueue(payload);
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    const queue = await storage.getSyncQueue();
    if (queue.length === 0) return;

    const failedItems: unknown[] = [];

    for (const item of queue) {
      try {
        const success = await this.syncToUUMS(item as SyncPayload);
        if (!success) {
          failedItems.push(item);
        }
      } catch {
        failedItems.push(item);
      }
    }

    if (failedItems.length > 0) {
      await storage.clearSyncQueue();
      for (const item of failedItems) {
        await storage.addToSyncQueue(item);
      }
    } else {
      await storage.clearSyncQueue();
    }
  }

  private async syncToUUMS(payload: SyncPayload): Promise<boolean> {
    const userId = getStoredUserId();
    if (!userId) return false;

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) return false;

    if (payload.practice && Object.keys(payload.practice).length > 0) {
      for (const [chapterId, record] of Object.entries(payload.practice)) {
        const result = await uumsClient.recordStudyRecord({
          user_id: userIdNum,
          class_id: undefined,
          exercise_title: chapterId,
          exercise_type: record.exercise_type || 'practice',
          score: record.score,
          total_score: record.totalQuestions,
          duration: 0,
          completed_at: new Date(record.completedAt).toISOString().replace('T', ' ').substring(0, 19),
        });
        if (!result || result.code !== 0) {
          return false;
        }
      }
    }

    if (payload.exam && Object.keys(payload.exam).length > 0) {
      for (const [examId, record] of Object.entries(payload.exam)) {
        const result = await uumsClient.recordExamRecord({
          user_id: userIdNum,
          class_id: undefined,
          exam_title: examId,
          exam_type: 'exam',
          score: record.score,
          total_score: record.totalQuestions,
          status: 'submitted',
          submitted_at: new Date(record.completedAt).toISOString().replace('T', ' ').substring(0, 19),
        });
        if (!result || result.code !== 0) {
          return false;
        }
      }
    }

    return true;
  }
}

export const syncQueue = new SyncQueue();
