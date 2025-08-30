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
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface UserSettings {
  emailNotifications: boolean
  publicProfile: boolean
  showActivity: boolean
  allowComments: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    publicProfile: true,
    showActivity: true,
    allowComments: true,
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchUserSettings()
  }, [session, status, router])

  const fetchUserSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("获取设置失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success("设置保存成功")
      } else {
        const data = await response.json()
        toast.error(data.error || "保存失败")
      }
    } catch (error) {
      console.error("保存设置失败:", error)
      toast.error("保存失败，请重试")
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
        <h1 className="text-3xl font-bold">账户设置</h1>
        <p className="text-muted-foreground mt-2">
          管理您的账户偏好和通知设置
        </p>
      </div>

      <div className="space-y-6">
        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle>通知设置</CardTitle>
            <CardDescription>
              控制您接收通知的方式和频率
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>邮件通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收关于您的提示词的评论和点赞通知
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 隐私设置 */}
        <Card>
          <CardHeader>
            <CardTitle>隐私设置</CardTitle>
            <CardDescription>
              控制您的个人资料和活动的可见性
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>公开个人资料</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户查看您的个人资料页面
                </p>
              </div>
              <Switch
                checked={settings.publicProfile}
                onCheckedChange={(checked) => handleSettingChange("publicProfile", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示活动状态</Label>
                <p className="text-sm text-muted-foreground">
                  在个人资料中显示您的最近活动
                </p>
              </div>
              <Switch
                checked={settings.showActivity}
                onCheckedChange={(checked) => handleSettingChange("showActivity", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 交互设置 */}
        <Card>
          <CardHeader>
            <CardTitle>交互设置</CardTitle>
            <CardDescription>
              管理其他用户与您内容的交互方式
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许评论</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户对您的提示词进行评论
                </p>
              </div>
              <Switch
                checked={settings.allowComments}
                onCheckedChange={(checked) => handleSettingChange("allowComments", checked)}
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