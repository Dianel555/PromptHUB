"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2, Shield, Eye, EyeOff } from "lucide-react"
import { useUserPrivacy } from "@/hooks/use-user"

interface PrivacySettings {
  profileVisibility: string
  showEmail: boolean
  showStats: boolean
  allowMessages: boolean
}

export default function PrivacyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { privacy, isLoading, updatePrivacy } = useUserPrivacy()
  const [isSaving, setIsSaving] = useState(false)
  const [localSettings, setLocalSettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showStats: true,
    allowMessages: true,
  })

  // 检查认证状态
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  // 同步设置数据到本地状态
  useEffect(() => {
    if (privacy) {
      setLocalSettings(privacy)
    }
  }, [privacy])

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePrivacy(localSettings)
      // 成功提示已在hook中处理
    } catch (error) {
      // 错误已在hook中处理，这里可以添加额外的错误处理逻辑
      console.error('Privacy update failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!session) {
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
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="size-6 text-primary" />
          <h1 className="text-3xl font-bold">隐私设置</h1>
        </div>
        <p className="text-muted-foreground">
          控制您的个人信息和内容的可见性
        </p>
      </div>

      <div className="space-y-6">
        {/* 个人资料可见性 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="size-5" />
              <span>个人资料可见性</span>
            </CardTitle>
            <CardDescription>
              控制其他用户是否可以查看您的个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>个人资料可见性</Label>
                <p className="text-sm text-muted-foreground">
                  控制您的个人资料对其他用户的可见性
                </p>
              </div>
              <select
                value={localSettings.profileVisibility}
                onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                className="rounded border px-3 py-1"
              >
                <option value="public">公开</option>
                <option value="private">私密</option>
                <option value="friends">仅好友</option>
              </select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示邮箱地址</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示您的邮箱地址
                </p>
              </div>
              <Switch
                checked={localSettings.showEmail}
                onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 内容可见性 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <EyeOff className="size-5" />
              <span>内容可见性</span>
            </CardTitle>
            <CardDescription>
              控制您创建的内容对其他用户的可见性
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示统计数据</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示您的统计信息
                </p>
              </div>
              <Switch
                checked={localSettings.showStats}
                onCheckedChange={(checked) => handleSettingChange("showStats", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 交互设置 */}
        <Card>
          <CardHeader>
            <CardTitle>交互权限</CardTitle>
            <CardDescription>
              控制其他用户与您的交互方式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许私信</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户向您发送私人消息
                </p>
              </div>
              <Switch
                checked={localSettings.allowMessages}
                onCheckedChange={(checked) => handleSettingChange("allowMessages", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                保存设置
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}