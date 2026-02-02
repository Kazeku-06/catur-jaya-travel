<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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

        // Return full URL using asset helper (IDE friendly)
        return asset('storage/' . $path);
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
            // Extract path from URL (remove the base storage URL)
            $baseUrl = asset('storage/');
            $path = str_replace($baseUrl . '/', '', $url);

            return Storage::disk('public')->delete($path);
        } catch (\Exception $e) {
            Log::error('Failed to delete file: ' . $e->getMessage());
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

        // Use asset helper for public storage URL
        return asset('storage/' . $filePath);
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

    /**
     * Process image from multiple sources (Base64 or URL)
     * Useful for API calls where file upload is not possible/preferred
     *
     * @param array $data Contains 'image_base64', 'image_url', 'image_name'
     * @param string $directory Storage directory
     * @param string|null $oldFile Old file path to delete
     * @return string|null Path of saved image
     * @throws \Exception
     */
    public function processImageSource(array $data, string $directory, ?string $oldFile = null): ?string
    {
        $imagePath = null;

        if (!empty($data['image_base64'])) {
            $imageBase64 = $data['image_base64'];

            // Validate base64 format
            if (!preg_match('/^data:image\/(\w+);base64,/', $imageBase64, $matches)) {
                throw new \Exception('Invalid image format. Must be base64 with data:image prefix');
            }

            $imageType = strtolower($matches[1]);
            $allowedTypes = ['jpeg', 'jpg', 'png', 'webp'];
            if (!in_array($imageType, $allowedTypes)) {
                throw new \Exception('Invalid image type. Allowed: JPEG, JPG, PNG, WEBP');
            }

            // Decode data
            $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $imageBase64));
            if ($imageData === false) {
                throw new \Exception('Failed to decode base64 image');
            }

            // Validate size (5MB)
            if (strlen($imageData) > 5 * 1024 * 1024) {
                throw new \Exception('Image too large. Maximum size is 5MB');
            }

            // Delete old
            if ($oldFile) {
                $this->deleteImage($oldFile);
            }

            // Save
            $extension = $imageType === 'jpeg' ? 'jpg' : $imageType;
            $filename = Str::uuid() . '.' . $extension;
            $imagePath = $directory . '/' . $filename;
            Storage::disk('public')->put($imagePath, $imageData);

        } elseif (!empty($data['image_url'])) {
            try {
                $imageUrl = $data['image_url'];
                $imageContent = file_get_contents($imageUrl);

                if ($imageContent === false) {
                    throw new \Exception('Failed to download image from URL');
                }

                if (strlen($imageContent) > 5 * 1024 * 1024) {
                    throw new \Exception('Image from URL too large (Max 5MB)');
                }

                $imageInfo = getimagesizefromstring($imageContent);
                if ($imageInfo === false) {
                    throw new \Exception('URL does not point to a valid image');
                }

                $mimeToExt = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/jpg' => 'jpg'];
                $extension = $mimeToExt[$imageInfo['mime']] ?? null;
                if (!$extension) {
                    throw new \Exception('Unsupported image type from URL');
                }

                // Delete old
                if ($oldFile) {
                    $this->deleteImage($oldFile);
                }

                $filename = Str::uuid() . '.' . $extension;
                $imagePath = $directory . '/' . $filename;
                Storage::disk('public')->put($imagePath, $imageContent);

            } catch (\Exception $e) {
                throw new \Exception('Failed to process image URL: ' . $e->getMessage());
            }
        }

        return $imagePath;
    }
}
