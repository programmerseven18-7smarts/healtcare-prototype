'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Milestone, RSUD } from '@/lib/data-model';
import { useDisplayMode } from './display-mode-context';
import { DesktopUploadModal } from './desktop-upload-modal';
import { MobileUploadModal } from './mobile-upload-modal';

interface UploadModalProps {
  rsudList: RSUD[];
  defaultRsudId?: string;
  defaultMilestone?: Milestone;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'form' | 'preview' | 'success';
type LocationState = 'loading' | 'ready' | 'error';
const MAX_UPLOAD_IMAGE_DIMENSION = 1600;
const UPLOAD_IMAGE_QUALITY = 0.72;

export function UploadModal({
  rsudList,
  defaultRsudId,
  defaultMilestone,
  onClose,
  onSuccess,
}: UploadModalProps) {
  const { displayMode } = useDisplayMode();
  const [step, setStep] = useState<Step>('form');
  const [rsudId, setRsudId] = useState(defaultRsudId ?? '');
  const [milestone, setMilestone] = useState<Milestone>(defaultMilestone ?? 'Site Preparation');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('Mendapatkan lokasi...');
  const [locationState, setLocationState] = useState<LocationState>('loading');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const timestamp = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const requestLocation = useCallback(async () => {
    setLocationState('loading');
    setLocation('Mendapatkan lokasi...');

    if (!navigator.geolocation) {
      setLocation('Geolokasi tidak didukung');
      setLocationState('error');
      return;
    }

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          setLocationState('ready');
          resolve();
        },
        (geoError) => {
          const message =
            geoError.code === geoError.PERMISSION_DENIED
              ? 'Izin lokasi ditolak'
              : 'Lokasi belum bisa didapat';
          setLocation(message);
          setLocationState('error');
          resolve();
        }
      );
    });
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const stampPhotoWithLocation = useCallback(async (sourceFile: File, locationLabel: string, timeLabel: string) => {
    const imageUrl = URL.createObjectURL(sourceFile);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Gagal memuat gambar'));
        img.src = imageUrl;
      });

      const scale = Math.min(
        1,
        MAX_UPLOAD_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
      );
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas tidak tersedia');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const paddingX = Math.max(36, Math.round(canvas.width * 0.045));
      const paddingY = Math.max(42, Math.round(canvas.height * 0.08));
      const badgeHeight = Math.max(48, Math.round(canvas.height * 0.065));
      const fontSize = Math.max(18, Math.round(badgeHeight * 0.36));
      const iconSize = Math.max(18, Math.round(badgeHeight * 0.42));
      const radius = Math.round(badgeHeight / 2);
      const stampText = `${locationLabel}  |  ${timeLabel}`;

      ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
      const textWidth = ctx.measureText(stampText).width;
      const badgeWidth = Math.min(
        canvas.width - paddingX * 2,
        Math.max(180, Math.round(textWidth + iconSize + 42))
      );

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      drawRoundedRect(ctx, paddingX, paddingY, badgeWidth, badgeHeight, radius);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      drawPinIcon(ctx, paddingX + 18, paddingY + (badgeHeight - iconSize) / 2, iconSize);
      ctx.textBaseline = 'middle';
      ctx.fillText(stampText, paddingX + 18 + iconSize + 12, paddingY + badgeHeight / 2);

      const stampedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Gagal membuat foto bertag lokasi'));
          },
          'image/jpeg',
          UPLOAD_IMAGE_QUALITY
        );
      });

      return new File(
        [stampedBlob],
        `${sourceFile.name.replace(/\.[^/.]+$/, '')}_taglokasi.jpg`,
        { type: stampedBlob.type }
      );
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }, []);

  const handleFileSelect = useCallback(async (selected: File) => {
    if (locationState !== 'ready') {
      setError('Lokasi harus berhasil didapat sebelum memilih foto.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const stampedFile = await stampPhotoWithLocation(selected, location, timestamp);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(stampedFile);
      setPreviewUrl(URL.createObjectURL(stampedFile));
      setStep('preview');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyiapkan foto');
    } finally {
      setProcessing(false);
    }
  }, [location, locationState, previewUrl, stampPhotoWithLocation, timestamp]);

  const handleInputPick =
    (source: 'camera' | 'gallery') => () => {
      if (!rsudId || !milestone) {
        setError('Pilih RSUD dan Milestone terlebih dahulu.');
        return;
      }
      if (locationState !== 'ready') {
        setError(
          locationState === 'loading'
            ? 'Tunggu sampai lokasi berhasil didapat sebelum memilih foto.'
            : 'Lokasi harus aktif. Izinkan akses lokasi lalu coba lagi.'
        );
        return;
      }
      setError('');
      if (source === 'camera') {
        cameraInputRef.current?.click();
      } else {
        fileInputRef.current?.click();
      }
    };

  const handleUpload = async () => {
    if (!file || !rsudId || !milestone) {
      setError('Pilih RSUD, Milestone, dan Foto terlebih dahulu.');
      return;
    }
    if (locationState !== 'ready') {
      setError('Lokasi harus berhasil didapat sebelum upload.');
      return;
    }
    setUploading(true);
    setError('');

    const form = new FormData();
    form.append('file', file);
    form.append('rsudId', rsudId);
    form.append('milestone', milestone);
    form.append('name', file.name);
    form.append('location', location);
    form.append('notes', notes);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Upload gagal');
      }
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const resetToForm = () => {
    setStep('form');
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const selectedRsud = rsudList.find((item) => item.id === rsudId);

  const sharedProps = {
    step,
    rsudList,
    rsudId,
    milestone,
    location,
    timestamp,
    notes,
    previewUrl,
    uploading,
    processing,
    error,
    locationReady: locationState === 'ready',
    locationState,
    selectedRsud,
    fileInputRef,
    cameraInputRef,
    onClose,
    onRsudChange: setRsudId,
    onMilestoneChange: setMilestone,
    onNotesChange: setNotes,
    onPickCamera: handleInputPick('camera'),
    onPickGallery: handleInputPick('gallery'),
    onRetryLocation: requestLocation,
    onCameraChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFileSelect(selected);
    },
    onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFileSelect(selected);
    },
    onBack: resetToForm,
    onSubmit: handleUpload,
  };

  return displayMode === 'mobile' ? (
    <MobileUploadModal {...sharedProps} />
  ) : (
    <DesktopUploadModal {...sharedProps} />
  );
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawPinIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const centerX = x + size / 2;
  const circleY = y + size * 0.35;
  const circleRadius = size * 0.26;

  ctx.beginPath();
  ctx.arc(centerX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.moveTo(centerX - circleRadius * 0.9, circleY + circleRadius * 0.5);
  ctx.quadraticCurveTo(centerX, y + size, centerX + circleRadius * 0.9, circleY + circleRadius * 0.5);
  ctx.closePath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, circleY, circleRadius * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}
