"use client"

import { useRef, useState } from "react"
import { AlertCircle, Camera, Check, Loader2, Upload, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
  onAvatarChange?: (file: File | null, previewUrl: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

export function AvatarUpload({
  currentAvatar = "",
  userName = "用户",
  onAvatarChange,
  className,
  size = "md",
  disabled = false,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string>(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
  }

  const maxFileSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "请选择 JPG、PNG、WebP 或 GIF 格式的图片"
    }
    if (file.size > maxFileSize) {
      return "文件大小不能超过 2MB"
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onAvatarChange?.(file, result)
      setIsUploading(false)
    }
    reader.onerror = () => {
      setError("文件读取失败，请重试")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleReset = () => {
    setPreview(currentAvatar)
    setError("")
    onAvatarChange?.(null, currentAvatar)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 头像预览区域 */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            "group relative cursor-pointer transition-all duration-300",
            isDragOver && "scale-105",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Avatar
            className={cn(
              sizeClasses[size],
              "border-2 border-dashed border-transparent transition-colors group-hover:border-primary/50"
            )}
          >
            <AvatarImage
              src={preview}
              alt={`${userName}的头像`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-lg text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 上传覆盖层 */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              isDragOver && "bg-primary/20 opacity-100"
            )}
          >
            {isUploading ? (
              <Loader2 className="size-6 animate-spin text-white" />
            ) : (
              <Camera className="size-6 text-white" />
            )}
          </div>

          {/* 拖拽提示 */}
          {isDragOver && (
            <div className="absolute -inset-4 flex items-center justify-center rounded-full border-2 border-dashed border-primary bg-primary/10">
              <div className="text-sm font-medium text-primary">释放以上传</div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                更换头像
              </>
            )}
          </Button>

          {preview !== currentAvatar && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={disabled || isUploading}
            >
              <X className="mr-2 size-4" />
              重置
            </Button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center space-x-2 p-3">
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 上传提示 */}
      <div className="space-y-1 text-center">
        <p className="text-xs text-muted-foreground">
          支持 JPG、PNG、WebP、GIF 格式
        </p>
        <p className="text-xs text-muted-foreground">
          文件大小不超过 2MB，建议尺寸 200x200 像素
        </p>
        <p className="text-xs text-muted-foreground">
          点击头像或拖拽文件到此处上传
        </p>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
