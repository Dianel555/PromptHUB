"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Shield } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function PrivacyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showActivity: true,
    allowMessages: true,
    dataCollection: false,
    analyticsTracking: true,
    thirdPartySharing: false,
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchPrivacySettings()
    }
  }, [session])

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch("/api/user/privacy")
      if (response.ok) {
        const data = await response.json()
        setPrivacySettings(data)
      }
    } catch (error) {
      console.error("获取隐私设置失败:", error)
      toast.error("获取隐私设置失败")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(privacySettings),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(result.message || "隐私设置已保存")
      } else {
        const error = await response.json()
        toast.error(error.error || "保存失败")
      }
    } catch (error) {
      console.error("保存隐私设置失败:", error)
      toast.error("保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingChange = (field: string, value: string | boolean) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        加载中...
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          返回
        </Button>
        <div className="flex items-center space-x-2">
          <Shield className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">隐私设置</h1>
            <p className="text-muted-foreground">控制您的隐私和数据使用偏好</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 个人资料隐私 */}
        <Card>
          <CardHeader>
            <CardTitle>个人资料隐私</CardTitle>
            <CardDescription>控制其他用户如何查看您的个人资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>个人资料可见性</Label>
              <Select
                value={privacySettings.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("profileVisibility", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">公开</SelectItem>
                  <SelectItem value="friends">仅好友</SelectItem>
                  <SelectItem value="private">私密</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示邮箱地址</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户查看您的邮箱地址
                </p>
              </div>
              <Switch
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) =>
                  handleSettingChange("showEmail", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>显示活动状态</Label>
                <p className="text-sm text-muted-foreground">
                  显示您的在线状态和最近活动
                </p>
              </div>
              <Switch
                checked={privacySettings.showActivity}
                onCheckedChange={(checked) =>
                  handleSettingChange("showActivity", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许私信</Label>
                <p className="text-sm text-muted-foreground">
                  允许其他用户向您发送私信
                </p>
              </div>
              <Switch
                checked={privacySettings.allowMessages}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowMessages", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 数据和分析 */}
        <Card>
          <CardHeader>
            <CardTitle>数据和分析</CardTitle>
            <CardDescription>管理我们如何收集和使用您的数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>数据收集</Label>
                <p className="text-sm text-muted-foreground">
                  允许收集使用数据以改善服务
                </p>
              </div>
              <Switch
                checked={privacySettings.dataCollection}
                onCheckedChange={(checked) =>
                  handleSettingChange("dataCollection", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>分析跟踪</Label>
                <p className="text-sm text-muted-foreground">
                  允许分析工具跟踪您的使用情况
                </p>
              </div>
              <Switch
                checked={privacySettings.analyticsTracking}
                onCheckedChange={(checked) =>
                  handleSettingChange("analyticsTracking", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>第三方数据共享</Label>
                <p className="text-sm text-muted-foreground">
                  允许与合作伙伴共享匿名数据
                </p>
              </div>
              <Switch
                checked={privacySettings.thirdPartySharing}
                onCheckedChange={(checked) =>
                  handleSettingChange("thirdPartySharing", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
