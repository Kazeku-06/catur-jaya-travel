<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload payment proof image to cloud storage
     */
    public function uploadPaymentProof(UploadedFile $file): string
    {
        // Validate file
        $this->validatePaymentProofFile($file);

        // Generate unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Upload to cloud storage (public disk)
        $path = $file->storeAs('payment-proofs', $filename, 'public');
        
        // Return full URL
        return Storage::disk('public')->url($path);
    }

    /**
     * Upload image file
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string|null $oldFile
     * @return string
     */
    public function uploadImage(UploadedFile $file, string $directory, ?string $oldFile = null): string
    {
        // Delete old file if exists
        if ($oldFile && Storage::disk('public')->exists($oldFile)) {
            Storage::disk('public')->delete($oldFile);
        }

        // Generate unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store file
        $path = $file->storeAs($directory, $filename, 'public');
        
        return $path;
    }

    /**
     * Delete image file
     *
     * @param string|null $filePath
     * @return bool
     */
    public function deleteImage(?string $filePath): bool
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->delete($filePath);
        }
        
        return false;
    }

    /**
     * Delete file from cloud storage using URL
     */
    public function deleteFileByUrl(string $url): bool
    {
        try {
            // Extract path from URL
            $path = str_replace(Storage::disk('public')->url(''), '', $url);
            
            return Storage::disk('public')->delete($path);
        } catch (\Exception $e) {
            \Log::error('Failed to delete file: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get full URL for image
     *
     * @param string|null $filePath
     * @return string|null
     */
    public function getImageUrl(?string $filePath): ?string
    {
        if (!$filePath) {
            return null;
        }

        // Use Laravel's Storage facade to get proper URL
        return \Storage::disk('public')->url($filePath);
    }

    /**
     * Validate payment proof file
     */
    private function validatePaymentProofFile(UploadedFile $file): void
    {
        // Check file type
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedTypes)) {
            throw new \InvalidArgumentException('File harus berupa gambar (JPG, PNG, GIF, WEBP)');
        }

        // Check file size (max 5MB)
        $maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException('Ukuran file maksimal 5MB');
        }

        // Check if file is actually an image
        $imageInfo = getimagesize($file->getPathname());
        if (!$imageInfo) {
            throw new \InvalidArgumentException('File yang diupload bukan gambar yang valid');
        }
    }

    /**
     * Validate image file
     *
     * @param UploadedFile $file
     * @return array
     */
    public function validateImage(UploadedFile $file): array
    {
        $errors = [];

        // Check file size (max 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            $errors[] = 'File size must be less than 5MB';
        }

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedTypes)) {
            $errors[] = 'File must be an image (JPEG, PNG, JPG, WEBP)';
        }

        return $errors;
    }
}