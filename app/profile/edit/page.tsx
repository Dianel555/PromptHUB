"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  Camera,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
  User,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

import { profileSchema, type Profile } from "@/lib/validations/profile"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Textarea } from "@/components/ui/textarea"
import { AvatarUpload } from "@/components/avatar-upload"

interface UserProfile {
  name: string
  email: string
  bio: string
  phone: string
  location: string
  website: string
  avatar: string
}

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  // 使用react-hook-form进行表单管理
  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: session?.user?.name || "",
      email: session?.user?.email || "",
      bio: "",
      phone: "",
      website: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const handleAvatarChange = (file: File | null, previewUrl: string) => {
    setAvatarPreview(previewUrl)

    // TODO: 这里可以实现实际的文件上传逻辑
    if (file) {
      console.log("上传文件:", file.name, file.size)
    }
  }

  const onSubmit = async (data: Profile) => {
    setIsLoading(true)
    try {
      // TODO: 实现保存逻辑
      console.log("保存用户资料:", data)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "保存成功",
        description: "您的个人资料已更新",
      })

      // 保存成功后返回个人中心
      router.push("/profile")
    } catch (error) {
      console.error("保存失败:", error)
      toast({
        title: "保存失败",
        description: "请检查网络连接后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl p-4 sm:py-6 lg:py-8">
        {/* 导航栏 */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                编辑资料
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                更新您的个人信息
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <Save className="mr-2 size-4" />
            )}
            保存
          </Button>
        </div>

        <div className="space-y-6">
          {/* 头像编辑区域 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="size-5" />
                头像设置
              </CardTitle>
              <CardDescription>
                上传您的头像图片，支持多种格式，建议尺寸 200x200 像素
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentAvatar={avatarPreview || ""}
                userName={watch("username") || "用户"}
                onAvatarChange={handleAvatarChange}
                size="lg"
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* 基本信息表单 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                基本信息
              </CardTitle>
              <CardDescription>填写您的基本个人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    placeholder="请输入用户名"
                    {...register("username")}
                    className="text-base"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">
                      {String(errors.username.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    {...register("email")}
                    disabled
                    className="text-base"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {String(errors.email.message)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    邮箱地址由认证提供商管理，无法修改
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="介绍一下您自己..."
                  {...register("bio")}
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {String(errors.bio.message)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 联系信息表单 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="size-5" />
                联系信息
              </CardTitle>
              <CardDescription>添加您的联系方式（可选）</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号码</Label>
                <Input
                  id="phone"
                  placeholder="请输入手机号码"
                  {...register("phone")}
                  className="text-base"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {String(errors.phone.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">个人网站</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-website.com"
                  {...register("website")}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">
                    {String(errors.website.message)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex flex-col justify-end gap-3 pt-6 sm:flex-row sm:gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="order-2 w-full sm:order-1 sm:w-auto"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="order-1 w-full sm:order-2 sm:w-auto"
            >
              {isLoading ? (
                <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Save className="mr-2 size-4" />
              )}
              保存更改
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}