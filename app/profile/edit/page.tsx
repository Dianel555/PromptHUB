"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2, Check, Clock } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  website: string | null
  location: string | null
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { user, isLoading, updateUser } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    image: "",
    bio: "",
    website: "",
    location: "",
  })

  // 检查认证状态
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // 同步用户数据到本地状态
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        name: user.name || "",
        email: user.email,
        image: user.image || "",
        bio: user.bio || "",
        website: user.website || "",
        location: user.location || "",
      })
    }
  }, [user])

  // 防抖自动保存功能
  const debouncedAutoSave = useCallback(async (profileData: UserProfile) => {
    if (!user) return

    setIsAutoSaving(true)
    try {
      await updateUser({
        name: profileData.name || undefined,
        bio: profileData.bio || undefined,
        website: profileData.website || undefined,
        location: profileData.location || undefined,
      })

      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      // 显示轻量级保存提示
      toast.success("已自动保存", {
        duration: 2000,
      })
    } catch (error) {
      console.error("自动保存失败:", error)
      // 自动保存失败时不显示错误提示，避免打扰用户
    } finally {
      setIsAutoSaving(false)
    }
  }, [user, updateUser])

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))

    setHasUnsavedChanges(true)

    // 清除之前的自动保存定时器
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // 设置新的自动保存定时器（3秒后自动保存）
    autoSaveTimeoutRef.current = setTimeout(() => {
      const updatedProfile = { ...profile, [field]: value }
      debouncedAutoSave(updatedProfile)
    }, 3000)
  }

  const handleSave = async () => {
    if (!user) return

    // 清除自动保存定时器
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    setIsSaving(true)
    try {
      await updateUser({
        name: profile.name || undefined,
        bio: profile.bio || undefined,
        website: profile.website || undefined,
        location: profile.location || undefined,
      })

      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      // 显示成功提示，不自动跳转
      toast.success("个人资料已保存", {
        description: "您的更改已成功保存",
        duration: 3000,
      })
    } catch (error) {
      // 处理具体错误信息
      const errorMessage = error instanceof Error ? error.message : "保存失败"
      toast.error("保存失败", {
        description: errorMessage,
        duration: 4000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])



  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 size-4" />
          返回
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">编辑个人资料</h1>
            <p className="text-muted-foreground mt-2">
              更新您的个人信息和偏好设置
            </p>
          </div>

          {/* 保存状态指示器 */}
          <div className="flex items-center space-x-2 text-sm">
            {isAutoSaving && (
              <div className="flex items-center text-blue-600">
                <Loader2 className="mr-1 size-4 animate-spin" />
                自动保存中...
              </div>
            )}
            {!isAutoSaving && hasUnsavedChanges && (
              <div className="flex items-center text-orange-600">
                <Clock className="mr-1 size-4" />
                有未保存的更改
              </div>
            )}
            {!isAutoSaving && !hasUnsavedChanges && lastSaved && (
              <div className="flex items-center text-green-600">
                <Check className="mr-1 size-4" />
                已保存 {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 头像和基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              您的公开个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="size-20">
                <AvatarImage src={profile.image || ""} alt={profile.name || "用户头像"} />
                <AvatarFallback className="text-lg">
                  {(profile.name && profile.name.charAt(0)?.toUpperCase()) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{profile.name || "未设置姓名"}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  placeholder="输入您的姓名"
                  value={profile.name ?? ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="简单介绍一下自己..."
                  value={profile.bio ?? ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  maxLength={500}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  {(profile.bio ?? "").length}/500 字符
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">个人网站</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={profile.website ?? ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">所在地</Label>
                <Input
                  id="location"
                  placeholder="城市, 国家"
                  value={profile.location ?? ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isAutoSaving || !hasUnsavedChanges}
            variant={hasUnsavedChanges ? "default" : "outline"}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                保存中...
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="mr-2 size-4" />
                保存更改
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                已保存
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}