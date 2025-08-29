"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Lock, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
    publicProfile: true,
    showEmail: false,
    allowMessages: true,
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* 页面头部 */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">账户设置</h1>
            <p className="text-muted-foreground">
              管理您的账户安全和通知偏好
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                通知设置
              </CardTitle>
              <CardDescription>
                控制您接收通知的方式和频率
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
                  onCheckedChange={(checked) => 
                    handleSettingChange("emailNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>推送通知</Label>
                  <p className="text-sm text-muted-foreground">
                    在浏览器中接收实时通知
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    handleSettingChange("pushNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5" />
                安全设置
              </CardTitle>
              <CardDescription>
                保护您的账户安全
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>双重认证</Label>
                  <p className="text-sm text-muted-foreground">
                    为您的账户添加额外的安全保护
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    handleSettingChange("twoFactorAuth", checked)
                  }
                />
              </div>
              <div className="pt-2">
                <Button variant="outline">
                  更改密码
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 隐私设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                隐私设置
              </CardTitle>
              <CardDescription>
                控制您的信息可见性
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>公开个人资料</Label>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户查看您的个人资料
                  </p>
                </div>
                <Switch
                  checked={settings.publicProfile}
                  onCheckedChange={(checked) => 
                    handleSettingChange("publicProfile", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>显示邮箱地址</Label>
                  <p className="text-sm text-muted-foreground">
                    在个人资料中显示您的邮箱
                  </p>
                </div>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => 
                    handleSettingChange("showEmail", checked)
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
                  checked={settings.allowMessages}
                  onCheckedChange={(checked) => 
                    handleSettingChange("allowMessages", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <Button>
              保存设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}