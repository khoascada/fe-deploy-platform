'use client';

import { Button } from '@components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

interface AvatarCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onCropComplete: (croppedImage: File) => void;
}

export const AvatarCropDialog = ({
  open,
  onOpenChange,
  imageFile,
  onCropComplete,
}: AvatarCropDialogProps) => {
  const editorRef = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1);

  const handleSave = useCallback(async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      // Export as JPEG with 0.9 quality for smaller file size
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = imageFile?.name?.replace(/\.[^/.]+$/, '.jpg') || 'avatar.jpg';
          const croppedFile = new File([blob], fileName, {
            type: 'image/jpeg',
          });
          onCropComplete(croppedFile);
          onOpenChange(false);
        }
      }, 'image/jpeg'); // Use JPEG with 90% quality
    }
  }, [imageFile, onCropComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crop Avatar</DialogTitle>
          <DialogDescription>
            Adjust the position, zoom, and rotation of your avatar image.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {imageFile && (
            <AvatarEditor
              ref={editorRef}
              image={imageFile}
              width={200}
              height={200}
              border={0}
              borderRadius={150}
              color={[0, 0, 0, 0.6]}
              scale={scale}
            />
          )}

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Zoom</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
