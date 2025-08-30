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
import { usePrivacySettings } from "@/hooks/use-user"

interface PrivacySettings {
  profileVisibility: boolean
  promptsVisibility: boolean
  activityVisibility: boolean
  searchable: boolean
  allowDirectMessages: boolean
}

export default function PrivacyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { settings, isLoading, updatePrivacySettings } = usePrivacySettings()
  const [isSaving, setIsSaving] = useState(false)
  const [localSettings, setLocalSettings] = useState<PrivacySettings>({
    profileVisibility: true,
    promptsVisibility: true,
    activityVisibility: true,
    searchable: true,
    allowDirectMessages: true,
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
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePrivacySettings(localSettings)
    } catch (error) {
      // 错误已在hook中处理
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
                <Label>公开个人资料</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户查看您的基本个人资料信息
                </p>
              </div>
              <Switch
                checked={localSettings.profileVisibility}
                onCheckedChange={(checked) => handleSettingChange("profileVisibility", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>在搜索中显示</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户通过搜索找到您的个人资料
                </p>
              </div>
              <Switch
                checked={localSettings.searchable}
                onCheckedChange={(checked) => handleSettingChange("searchable", checked)}
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
                <Label>公开提示词</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户查看和使用您创建的提示词
                </p>
              </div>
              <Switch
                checked={localSettings.promptsVisibility}
                onCheckedChange={(checked) => handleSettingChange("promptsVisibility", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示活动记录</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示您的最近活动和互动记录
                </p>
              </div>
              <Switch
                checked={localSettings.activityVisibility}
                onCheckedChange={(checked) => handleSettingChange("activityVisibility", checked)}
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
                checked={localSettings.allowDirectMessages}
                onCheckedChange={(checked) => handleSettingChange("allowDirectMessages", checked)}
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