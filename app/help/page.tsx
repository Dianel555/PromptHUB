"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Book,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const faqItems = [
    {
      question: "如何创建一个新的提示词？",
      answer: "点击导航栏中的'创建'按钮，填写提示词的标题、描述和内容，选择合适的标签，然后点击发布即可。"
    },
    {
      question: "如何编辑我的个人资料？",
      answer: "进入个人中心页面，点击'编辑资料'按钮，您可以修改用户名、头像、个人简介等信息。"
    },
    {
      question: "如何设置隐私权限？",
      answer: "在个人中心的'隐私设置'中，您可以控制个人资料、提示词和活动的可见性，以及其他隐私选项。"
    },
    {
      question: "如何搜索和发现提示词？",
      answer: "使用顶部的搜索框输入关键词，或者浏览不同的标签分类来发现感兴趣的提示词。"
    },
    {
      question: "如何关注其他用户？",
      answer: "在用户的个人资料页面点击'关注'按钮，您将能够看到他们的最新动态和提示词。"
    },
    {
      question: "如何举报不当内容？",
      answer: "在任何提示词或用户页面，点击'举报'按钮，选择举报原因并提交，我们会及时处理。"
    }
  ]

  const contactOptions = [
    {
      icon: Mail,
      title: "邮件支持",
      description: "发送邮件获得详细帮助",
      action: "发送邮件",
      href: "mailto:support@prompthub.com"
    },
    {
      icon: MessageCircle,
      title: "在线客服",
      description: "实时聊天获得即时帮助",
      action: "开始聊天",
      href: "#"
    },
    {
      icon: Book,
      title: "用户手册",
      description: "查看详细的使用指南",
      action: "查看手册",
      href: "#"
    }
  ]

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold">帮助中心</h1>
            <p className="text-muted-foreground">
              获取使用帮助和技术支持
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 搜索框 */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索帮助内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* 常见问题 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="size-5" />
                常见问题
              </CardTitle>
              <CardDescription>
                查找常见问题的解答
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQ.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFAQ.length === 0 && searchQuery && (
                <div className="py-8 text-center text-muted-foreground">
                  没有找到相关的帮助内容
                </div>
              )}
            </CardContent>
          </Card>

          {/* 联系我们 */}
          <Card>
            <CardHeader>
              <CardTitle>联系我们</CardTitle>
              <CardDescription>
                如果您没有找到需要的帮助，请联系我们的支持团队
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {contactOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-3 rounded-lg border p-4 text-center"
                  >
                    <div className="rounded-full bg-primary/10 p-3">
                      <option.icon className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{option.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (option.href.startsWith('mailto:')) {
                          window.location.href = option.href
                        } else if (option.href !== '#') {
                          window.open(option.href, '_blank')
                        }
                      }}
                    >
                      {option.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 快速链接 */}
          <Card>
            <CardHeader>
              <CardTitle>快速链接</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push("/prompts")}
                >
                  浏览提示词
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push("/create")}
                >
                  创建提示词
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push("/profile")}
                >
                  个人中心
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push("/profile/settings")}
                >
                  账户设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}