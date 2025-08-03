import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SignInForm } from "@/components/signin-form"

export const metadata: Metadata = {
  title: "登录 | PromptHUB",
  description: "登录到 PromptHUB 管理您的提示词",
}

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              欢迎来到 PromptHUB
            </h1>
            <p className="text-muted-foreground">
              使用 GitHub 账号登录，开始管理您的提示词
            </p>
          </div>
          
          <SignInForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              登录即表示您同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
