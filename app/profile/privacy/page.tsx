"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Globe, Lock, Users } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export default function PrivacyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    promptsVisibility: "public",
    activityVisibility: "friends",
    searchable: true,
    showOnlineStatus: true,
    allowFollowers: true,
    requireApproval: false,
  })

  const handleSettingChange = (key: string, value: string | boolean) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 这里应该调用实际的API来保存隐私设置
      console.log("保存隐私设置:", privacySettings)

      toast.success("隐私设置已保存", {
        description: "您的隐私设置已成功更新。",
      })
    } catch (error) {
      toast.error("保存失败", {
        description: "保存隐私设置时出现错误，请重试。",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* 页面头部 */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">隐私设置</h1>
            <p className="text-muted-foreground">
              控制您的信息可见性和隐私偏好
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 个人资料可见性 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="size-5" />
                个人资料可见性
              </CardTitle>
              <CardDescription>控制谁可以查看您的个人资料信息</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={privacySettings.profileVisibility}
                onValueChange={(value: string) =>
                  handleSettingChange("profileVisibility", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="profile-public" />
                  <Label
                    htmlFor="profile-public"
                    className="flex items-center gap-2"
                  >
                    <Globe className="size-4" />
                    公开 - 所有人都可以查看
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="profile-friends" />
                  <Label
                    htmlFor="profile-friends"
                    className="flex items-center gap-2"
                  >
                    <Users className="size-4" />
                    好友 - 仅关注者可以查看
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="profile-private" />
                  <Label
                    htmlFor="profile-private"
                    className="flex items-center gap-2"
                  >
                    <Lock className="size-4" />
                    私密 - 仅自己可以查看
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 提示词可见性 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="size-5" />
                提示词可见性
              </CardTitle>
              <CardDescription>控制您创建的提示词的可见范围</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={privacySettings.promptsVisibility}
                onValueChange={(value: string) =>
                  handleSettingChange("promptsVisibility", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="prompts-public" />
                  <Label
                    htmlFor="prompts-public"
                    className="flex items-center gap-2"
                  >
                    <Globe className="size-4" />
                    公开 - 在社区中展示
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unlisted" id="prompts-unlisted" />
                  <Label
                    htmlFor="prompts-unlisted"
                    className="flex items-center gap-2"
                  >
                    <Eye className="size-4" />
                    不公开 - 仅通过链接访问
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="prompts-private" />
                  <Label
                    htmlFor="prompts-private"
                    className="flex items-center gap-2"
                  >
                    <Lock className="size-4" />
                    私密 - 仅自己可见
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 活动可见性 */}
          <Card>
            <CardHeader>
              <CardTitle>活动可见性</CardTitle>
              <CardDescription>控制您的活动记录的可见性</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={privacySettings.activityVisibility}
                onValueChange={(value: string) =>
                  handleSettingChange("activityVisibility", value)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="activity-public" />
                  <Label htmlFor="activity-public">公开显示活动</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="activity-friends" />
                  <Label htmlFor="activity-friends">仅关注者可见</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="activity-private" />
                  <Label htmlFor="activity-private">隐藏活动记录</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* 其他隐私选项 */}
          <Card>
            <CardHeader>
              <CardTitle>其他隐私选项</CardTitle>
              <CardDescription>更多隐私控制选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>允许搜索</Label>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户通过搜索找到您
                  </p>
                </div>
                <Switch
                  checked={privacySettings.searchable}
                  onCheckedChange={(checked) =>
                    handleSettingChange("searchable", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>显示在线状态</Label>
                  <p className="text-sm text-muted-foreground">
                    让其他用户知道您是否在线
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    handleSettingChange("showOnlineStatus", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>允许关注</Label>
                  <p className="text-sm text-muted-foreground">
                    允许其他用户关注您
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowFollowers}
                  onCheckedChange={(checked) =>
                    handleSettingChange("allowFollowers", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>关注需要批准</Label>
                  <p className="text-sm text-muted-foreground">
                    新的关注者需要您的批准
                  </p>
                </div>
                <Switch
                  checked={privacySettings.requireApproval}
                  onCheckedChange={(checked) =>
                    handleSettingChange("requireApproval", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* 保存按钮 */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "保存中..." : "保存隐私设置"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
