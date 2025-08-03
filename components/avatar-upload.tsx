"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Upload, 
  Camera, 
  X, 
  Loader2,
  AlertCircle,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  disabled = false
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string>(currentAvatar)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  }

  const maxFileSize = 2 * 1024 * 1024 // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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
            "relative group cursor-pointer transition-all duration-300",
            isDragOver && "scale-105",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <Avatar className={cn(sizeClasses[size], "border-2 border-dashed border-transparent group-hover:border-primary/50 transition-colors")}>
            <AvatarImage 
              src={preview} 
              alt={`${userName}的头像`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-lg">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 上传覆盖层 */}
          <div className={cn(
            "absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isDragOver && "opacity-100 bg-primary/20"
          )}>
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>

          {/* 拖拽提示 */}
          {isDragOver && (
            <div className="absolute -inset-4 border-2 border-dashed border-primary rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-primary text-sm font-medium">释放以上传</div>
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
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
              <X className="h-4 w-4 mr-2" />
              重置
            </Button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center space-x-2 p-3">
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 上传提示 */}
      <div className="text-center space-y-1">
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