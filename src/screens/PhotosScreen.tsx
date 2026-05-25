import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image,
  StyleSheet, ActivityIndicator, Modal, Dimensions, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Typography, Spacing, Radii } from '../constants/typography';

interface Photo {
  url: string;
  pathname: string;
  uploadedAt: string;
  size: number;
}

const COLUMN_COUNT = 3;
const GAP = 4;

function getThumbSize() {
  const screenWidth = Dimensions.get('window').width;
  return (screenWidth - Spacing.marginMobile * 2 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function openFilePicker(capture: boolean, onFile: (file: File) => void) {
  if (Platform.OS !== 'web') return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  if (capture) {
    input.setAttribute('capture', 'environment');
  }
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) onFile(file);
  };
  input.click();
}

export function PhotosScreen() {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const thumbSize = getThumbSize();

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/photos');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      await fetchPhotos();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [fetchPhotos]);

  const handleDelete = useCallback(async (photo: Photo) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/delete?url=${encodeURIComponent(photo.url)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      setSelectedPhoto(null);
      await fetchPhotos();
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }, [fetchPhotos]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={[styles.scroll, { paddingTop: insets.top }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>旅行相册</Text>
          <Text style={styles.subtitle}>记录新西兰冬日之旅的精彩瞬间</Text>
        </View>

        {/* Upload buttons */}
        <View style={styles.uploadRow}>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => openFilePicker(true, handleUpload)}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={22} color={Colors.onPrimary} />
            <Text style={styles.uploadBtnText}>拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadBtn, styles.uploadBtnSecondary]}
            onPress={() => openFilePicker(false, handleUpload)}
            disabled={uploading}
            activeOpacity={0.7}
          >
            <Ionicons name="images" size={22} color={Colors.primary} />
            <Text style={[styles.uploadBtnText, styles.uploadBtnTextSecondary]}>选择照片</Text>
          </TouchableOpacity>
        </View>

        {/* Upload progress */}
        {uploading && (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.statusText}>正在上传...</Text>
          </View>
        )}

        {/* Error message */}
        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="warning-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}

        {/* Photo count */}
        {!loading && photos.length > 0 && (
          <Text style={styles.photoCount}>{photos.length} 张照片</Text>
        )}

        {/* Photo grid */}
        {loading && photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="camera-outline" size={64} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>还没有照片</Text>
            <Text style={styles.emptySubtitle}>
              点击上方按钮拍照或从相册选择照片上传
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {photos.map((photo) => (
              <TouchableOpacity
                key={photo.url}
                onPress={() => setSelectedPhoto(photo)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: photo.url }}
                  style={[styles.thumb, { width: thumbSize, height: thumbSize }]}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Setup note */}
        {error?.includes('BLOB_READ_WRITE_TOKEN') && (
          <View style={styles.setupNote}>
            <Text style={styles.setupTitle}>配置 Vercel Blob 存储</Text>
            <Text style={styles.setupStep}>1. 在 Vercel 控制台创建 Blob Store</Text>
            <Text style={styles.setupStep}>2. 复制 BLOB_READ_WRITE_TOKEN</Text>
            <Text style={styles.setupStep}>3. 添加到项目环境变量中</Text>
          </View>
        )}
      </ScrollView>

      {/* Full-size photo modal */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setSelectedPhoto(null)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={28} color={Colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.modalInfo}>
              {selectedPhoto && (
                <>
                  <Text style={styles.modalDate}>{formatDate(selectedPhoto.uploadedAt)}</Text>
                  <Text style={styles.modalSize}>{formatSize(selectedPhoto.size)}</Text>
                </>
              )}
            </View>
            <TouchableOpacity
              onPress={() => selectedPhoto && handleDelete(selectedPhoto)}
              style={styles.modalDeleteBtn}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={Colors.error} />
              ) : (
                <Ionicons name="trash-outline" size={22} color={Colors.error} />
              )}
            </TouchableOpacity>
          </View>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto.url }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.marginMobile,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  header: { gap: 4, paddingBottom: Spacing.xs },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  uploadRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryContainer,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  uploadBtnSecondary: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: Colors.cardStroke,
  },
  uploadBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
    fontSize: 14,
  },
  uploadBtnTextSecondary: {
    color: Colors.primary,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  statusText: {
    ...Typography.bodySm,
    color: Colors.primary,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorContainer + '33',
    padding: Spacing.sm + 2,
    borderRadius: Radii.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.error + '44',
  },
  errorText: {
    ...Typography.bodySm,
    color: Colors.error,
    flex: 1,
    fontSize: 13,
  },

  photoCount: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  thumb: {
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceContainerHigh,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurfaceVariant,
  },
  emptySubtitle: {
    ...Typography.bodySm,
    color: Colors.outlineVariant,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },

  setupNote: {
    backgroundColor: Colors.surfaceContainerHigh,
    padding: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardStroke,
  },
  setupTitle: {
    ...Typography.labelMd,
    color: Colors.onSurface,
  },
  setupStep: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfo: {
    alignItems: 'center',
    gap: 2,
  },
  modalDate: {
    ...Typography.labelSm,
    color: Colors.onSurface,
  },
  modalSize: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  modalDeleteBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    flex: 1,
    width: '100%',
  },
});
