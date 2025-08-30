"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    displayName: "",
    email: "",
    bio: "",
    website: "",
    location: "",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("获取设置失败:", error)
      toast.error("获取设置失败")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message || "设置已保存")
      } else {
        const error = await response.json()
        toast.error(error.error || "保存失败")
      }
    } catch (error) {
      console.error("保存设置失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
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
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="text-3xl font-bold">账户设置</h1>
        <p className="text-muted-foreground">
          管理您的账户信息和偏好设置
        </p>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              更新您的个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">显示名称</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => handleInputChange("displayName", e.target.value)}
                placeholder="输入您的显示名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="输入您的邮箱地址"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea
                id="bio"
                value={settings.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="介绍一下您自己..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">个人网站</Label>
              <Input
                id="website"
                type="url"
                value={settings.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">所在地</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="输入您的所在地"
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle>通知设置</CardTitle>
            <CardDescription>
              选择您希望接收的通知类型
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>邮件通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收重要更新和活动通知
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>推送通知</Label>
                <p className="text-sm text-muted-foreground">
                  接收浏览器推送通知
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>营销邮件</Label>
                <p className="text-sm text-muted-foreground">
                  接收产品更新和营销信息
                </p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}